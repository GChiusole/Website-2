#!/usr/bin/env python3
"""Regenerate js/campus-map-data.js for the contact page's campus map.

Input   scripts/campus-map.osm.xml  (one-off OSM API extract, see FETCH below)
Output  js/campus-map-data.js       (window.CAMPUS_SVG = "<svg ...>")

FETCH the source extract with:
  curl "https://api.openstreetmap.org/api/0.6/map?bbox=11.6580,48.2570,11.6790,48.2700" \
    | gzip -9 > scripts/campus-map.osm.xml.gz

Buildings come from ways *and* multipolygon relations -- large courtyard
buildings (Maschinenwesen, Chemie, the Physik blocks) exist only as relations.
Inner rings are emitted as extra subpaths and filled with fill-rule="evenodd",
because OSM does not guarantee consistent ring winding.

Building-section numbers for the MI complex come from NavigaTUM (TUM Roomfinder).
Data: (c) OpenStreetMap contributors, ODbL.
"""
import gzip, json, math, os, re, sys
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC  = os.path.join(HERE, 'campus-map.osm.xml.gz')
OUT  = os.path.join(ROOT, 'js', 'campus-map-data.js')

# ---- map extent ------------------------------------------------------------
LAT0, LAT1, LON0, LON1 = 48.2588, 48.2694, 11.6600, 11.6772
W = 1000.0
_my = lambda lat: math.degrees(math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)))
_yS, _yN = _my(LAT0), _my(LAT1)
H = round(W * (_yN - _yS) / (LON1 - LON0), 1)

def prj(lat, lon):
    return ((lon - LON0) / (LON1 - LON0) * W, (_yN - _my(lat)) / (_yN - _yS) * H)

def visible(coords):
    return any(LAT0 <= la <= LAT1 and LON0 <= lo <= LON1 for la, lo in coords)

def path(coords, close):
    out, last = [], None
    for la, lo in coords:
        x, y = prj(la, lo)
        p = (round(x, 1), round(y, 1))
        if p != last:
            out.append(p); last = p
    if len(out) < 2:
        return None
    return 'M' + 'L'.join(f'{x} {y}' for x, y in out) + ('Z' if close else '')

def centroid(coords):
    pts = [prj(la, lo) for la, lo in coords]
    a = cx = cy = 0.0
    for i in range(len(pts) - 1):
        x0, y0 = pts[i]; x1, y1 = pts[i + 1]
        cr = x0 * y1 - x1 * y0
        a += cr; cx += (x0 + x1) * cr; cy += (y0 + y1) * cr
    if abs(a) < 1e-9:
        return (sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts))
    a *= 0.5
    return (cx / (6 * a), cy / (6 * a))

def area_m2(coords):
    R, K = 6378137.0, math.cos(math.radians(48.264))
    a = 0.0
    for i in range(len(coords) - 1):
        x0 = math.radians(coords[i][1]) * R * K;   y0 = math.radians(coords[i][0]) * R
        x1 = math.radians(coords[i + 1][1]) * R * K; y1 = math.radians(coords[i + 1][0]) * R
        a += x0 * y1 - x1 * y0
    return abs(a) / 2

# ---- parse -----------------------------------------------------------------
with gzip.open(SRC, 'rb') as fh:
    root = ET.parse(fh).getroot()
nodes = {n.get('id'): (float(n.get('lat')), float(n.get('lon'))) for n in root.findall('node')}
ways  = {w.get('id'): [nd.get('ref') for nd in w.findall('nd')] for w in root.findall('way')}
wtags = {w.get('id'): {t.get('k'): t.get('v') for t in w.findall('tag')} for w in root.findall('way')}

def rings(wids):
    """chain member ways into closed rings"""
    segs = [list(ways[w]) for w in wids if len(ways.get(w, [])) > 1]
    out = []
    while segs:
        cur = segs.pop(0); changed = True
        while changed and cur[0] != cur[-1]:
            changed = False
            for i, s in enumerate(segs):
                if   s[0]  == cur[-1]: cur += s[1:];            segs.pop(i); changed = True; break
                elif s[-1] == cur[-1]: cur += s[::-1][1:];      segs.pop(i); changed = True; break
                elif s[-1] == cur[0]:  cur = s[:-1] + cur;      segs.pop(i); changed = True; break
                elif s[0]  == cur[0]:  cur = s[::-1][:-1] + cur; segs.pop(i); changed = True; break
        out.append(cur)
    return out

member_ways, multipolys = set(), []
for rel in root.findall('relation'):
    tags = {t.get('k'): t.get('v') for t in rel.findall('tag')}
    mem  = [(m.get('type'), m.get('ref'), m.get('role')) for m in rel.findall('member')]
    if tags.get('type') not in ('multipolygon', 'building'):
        continue
    outer = [r for t, r, ro in mem if t == 'way' and ro in ('outer', '')]
    inner = [r for t, r, ro in mem if t == 'way' and ro == 'inner']
    # only suppress standalone drawing of ways that are rings of THIS polygon --
    # a way belonging to some route/site relation must still be drawn itself
    member_ways.update(outer); member_ways.update(inner)
    multipolys.append((rel.get('id'), tags, rings(outer), rings(inner)))

# ---- classify --------------------------------------------------------------
L = {k: [] for k in ('grass','wood','pitch','water','stream','parking','bld',
                     'major','minor','service','foot','subway')}
MI = None
parks = []
GREEN = {'grass','meadow','village_green','recreation_ground','greenfield','farmland'}
ROAD  = {'secondary':'major','primary':'major','tertiary':'major','unclassified':'minor',
         'residential':'minor','living_street':'minor','service':'service'}

def classify(tags, paths, coords, ident):
    global MI
    if 'building' in tags:
        if ident == 'w27917482': MI = ' '.join(paths)
        else:                    L['bld'].append(' '.join(paths))
    elif tags.get('amenity') == 'parking':
        L['parking'].append(' '.join(paths))
        if coords: parks.append((area_m2(coords), tags, centroid(coords)))
    elif tags.get('natural') == 'water':                       L['water'].append(' '.join(paths))
    elif tags.get('natural') in ('wood','scrub') or tags.get('landuse') == 'forest':
                                                               L['wood'].append(' '.join(paths))
    elif tags.get('leisure') in ('pitch','sports_centre'):      L['pitch'].append(' '.join(paths))
    elif (tags.get('landuse') in GREEN or tags.get('natural') == 'grassland'
          or tags.get('leisure') in ('park','garden')):         L['grass'].append(' '.join(paths))

for rid, tags, outer, inner in multipolys:
    paths, big = [], None
    for ring in outer:
        c = [nodes[n] for n in ring if n in nodes]
        if not c or not visible(c): continue
        p = path(c, True)
        if p: paths.append(p)
        if big is None or area_m2(c) > area_m2(big): big = c
    if not paths: continue
    for ring in inner:
        c = [nodes[n] for n in ring if n in nodes]
        p = path(c, True) if c else None
        if p: paths.append(p)
    classify(tags, paths, big or [], 'r' + rid)

for wid, nds in ways.items():
    if wid in member_ways: continue
    t = wtags.get(wid) or {}
    if not t: continue
    c = [nodes[n] for n in nds if n in nodes]
    if not c or not visible(c): continue
    if t.get('waterway') in ('stream','river','ditch'):
        p = path(c, False); p and L['stream'].append(p); continue
    if t.get('highway') in ('corridor','elevator'): continue
    if t.get('highway') in ('footway','path','steps'):
        p = path(c, False); p and L['foot'].append(p); continue
    if t.get('highway') in ROAD:
        p = path(c, False); p and L[ROAD[t['highway']]].append(p); continue
    if t.get('railway') == 'subway':
        p = path(c, False); p and L['subway'].append(p); continue
    p = path(c, c[0] == c[-1])
    if p: classify(t, [p], c, 'w' + wid)

# ---- point detail ----------------------------------------------------------
trees, ents, bikes = [], [], []
station, subway_ents = None, []
for n in root.findall('node'):
    t = {x.get('k'): x.get('v') for x in n.findall('tag')}
    if not t: continue
    la, lo = nodes[n.get('id')]
    if not (LAT0 <= la <= LAT1 and LON0 <= lo <= LON1): continue
    x, y = prj(la, lo); p = (round(x, 1), round(y, 1))
    if   t.get('natural') == 'tree':                    trees.append(p)
    elif t.get('entrance') in ('main','yes','exit'):    ents.append((p, t['entrance']))
    elif t.get('amenity') == 'bicycle_parking':         bikes.append(p)
    elif t.get('railway') == 'subway_entrance':         subway_ents.append(p)
    elif t.get('railway') == 'station' and (t.get('name') or '').startswith('Garching-Forsch'):
                                                        station = p

barriers = []
for wid, nds in ways.items():
    t = wtags.get(wid) or {}
    if t.get('barrier') not in ('hedge','fence','wall','retaining_wall'): continue
    c = [nodes[n] for n in nds if n in nodes]
    if not c or not visible(c): continue
    p = path(c, False)
    if p: barriers.append((p, 'hedge' if t['barrier'] == 'hedge' else 'wall'))

# ---- labels ----------------------------------------------------------------
# Surrounding institutions, official English names (OSM name:en where present).
INSTITUTES = {
 'TUM School of Engineering and Design':      ('TUM School of','Engineering & Design'),
 'TUM Department Chemie':                     ('TUM Department','of Chemistry'),
 'Elektro- und Informationstechnik':          ('Electrical Engineering &','Information Technology'),
 'Mensa Garching':                            ('Mensa',),
 'Institute for Advanced Study':              ('TUM Institute for','Advanced Study'),
 'Leibniz-Rechenzentrum':                     ('Leibniz','Supercomputing','Centre (LRZ)'),
 'Galileo':                                   ('Galileo',),
 'Forschungs-Neutronenquelle Heinz Maier-Leibnitz': ('FRM II',),
 'TUM Physik I':                              ('TUM Physics',),
 'LMU Fakultät für Physik':                   ('LMU Physics',),
 'Max-Planck-Institut für Plasmaphysik':      ('MPI for Plasma Physics',),
 'Max-Planck-Institut für Astrophysik':       ('MPI for Astrophysics',),
 'Max-Planck-Institut für extraterrestrische Physik': ('MPI for','Extraterrestrial Physics'),
 'Max-Planck-Institut für Quantenoptik':      ('MPI for Quantum Optics',),
 'Max-Planck Institut für Physik':            ('MPI for Physics',),
 'Europäische Südsternwarte':                 ('ESO',),
 'ESO Supernova Planetarium':                 ('ESO Supernova',),
}
def element_coords(el):
    if el.tag == 'node': return [nodes[el.get('id')]]
    if el.tag == 'way':  return [nodes[n] for n in ways.get(el.get('id'), []) if n in nodes]
    c = []
    for m in el.findall('member'):
        if m.get('type') == 'way' and m.get('role') == 'outer':
            c += [nodes[n] for n in ways.get(m.get('ref'), []) if n in nodes]
    return c

ilabels, seen = [], set()
for el in list(root.findall('way')) + list(root.findall('relation')) + list(root.findall('node')):
    t = {x.get('k'): x.get('v') for x in el.findall('tag')}
    nm = t.get('name')
    if nm not in INSTITUTES or nm in seen: continue
    c = element_coords(el)
    if not c: continue
    la = sum(p[0] for p in c) / len(c); lo = sum(p[1] for p in c) / len(c)
    if not (LAT0 <= la <= LAT1 and LON0 <= lo <= LON1): continue
    seen.add(nm)
    x, y = prj(la, lo)
    ilabels.append((round(x, 1), round(y, 1), INSTITUTES[nm]))
missing = [k for k in INSTITUTES if k not in seen]

# MI building sections (Gebaeudeteile), from NavigaTUM / TUM Roomfinder
GT = {'5601': (48.262531, 11.668220, 'Magistrale / Foyer'), '5602': (48.262445, 11.669123, 'Hörsaal 1'),
      '5603': (48.262536, 11.666860, 'Bibliothek'), '5604': (48.262066, 11.669031, '04'),
      '5605': (48.262829, 11.668622, '05'), '5606': (48.262147, 11.668633, '06'),
      '5607': (48.262873, 11.668164, '07'), '5608': (48.262208, 11.668209, '08'),
      '5609': (48.262926, 11.667706, '09'), '5610': (48.262287, 11.667804, '10'),
      '5611': (48.262978, 11.667248, '11'), '5612': (48.262367, 11.667386, '12'),
      '5613': (48.263031, 11.666803, '13')}
OFFICE = (48.2623, 11.6688)          # room 03.06.020, rounded to ~5 m accuracy

# the two genuinely public car parks (OSM access tags are unreliable here)
def pick(pred):
    for a, t, c in sorted(parks, reverse=True):
        if pred(a, t): return c
    return None
p_paid = pick(lambda a, t: (t.get('name') or '').startswith('P+R Garching'))
p_free = pick(lambda a, t: a > 25000)

# ---- emit ------------------------------------------------------------------
def grp(cls, paths, extra=''):
    return f'<g class="{cls}"{extra}>' + ''.join(f'<path d="{d}"/>' for d in paths) + '</g>\n' if paths else ''
def marker(cls, x, y, inner):
    return f'<g class="mk {cls}" transform="translate({x} {y})">{inner}</g>'

trees_s = ''.join(f'<circle cx="{x}" cy="{y}" r="1.6"/>' for x, y in trees)
bikes_s = ''.join(f'<circle cx="{x}" cy="{y}" r="1.4"/>' for x, y in bikes)
hedge_s = ''.join(f'<path d="{d}"/>' for d, k in barriers if k == 'hedge')
wall_s  = ''.join(f'<path d="{d}"/>' for d, k in barriers if k == 'wall')
entm_s  = ''.join(f'<circle cx="{p[0]}" cy="{p[1]}" r="2.2"/>' for p, k in ents if k == 'main')
ento_s  = ''.join(f'<circle cx="{p[0]}" cy="{p[1]}" r="1.5"/>' for p, k in ents if k != 'main')
subs_s  = ''.join(marker('ent-u', x, y, '<circle r="4.5"/>') for x, y in subway_ents)
gt_s    = ''.join(marker('gtl ' + ('gtnum' if nm.isdigit() else 'gtnamed'),
                         round(prj(la, lo)[0], 1), round(prj(la, lo)[1], 1),
                         f'<text y="3.5">{nm}</text>')
                  for la, lo, nm in GT.values())
il_s    = ''.join(marker('ilabel', x, y, ''.join(f'<text y="{i*11}">{t}</text>' for i, t in enumerate(lines)))
                  for x, y, lines in ilabels)
ox, oy  = (round(v, 1) for v in prj(*OFFICE))
mi_ys   = [float(v) for v in re.findall(r'[ML][\d.]+ ([\d.]+)', MI)]
mi_xs   = [float(v) for v in re.findall(r'[ML]([\d.]+) ', MI)]
bx, by  = round((min(mi_xs) + max(mi_xs)) / 2, 1), round(min(mi_ys) - 30, 1)

assert MI, 'MI building way 27917482 not found in the extract'

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H}" id="campusSvg"
 role="img" aria-label="Map of the TUM Garching research campus">
<title>TUM Garching campus</title>
<desc>The U-Bahn station Garching-Forschungszentrum, the public car parks, the surrounding
institutes, and the TUM School of Computation, Information and Technology building at
Boltzmannstrasse 3 with its numbered building sections.</desc>
<rect class="bg" x="-3000" y="-3000" width="9000" height="9000"/>
<g id="vectorLayer">
{grp("grass",L["grass"])}{grp("wood",L["wood"])}{grp("pitch",L["pitch"])}
{grp("water",L["water"])}{grp("stream",L["stream"])}
{grp("parking",L["parking"])}
<g class="buildings">{"".join(f'<path d="{d}"/>' for d in L["bld"])}</g>
{grp("road-case",L["minor"]+L["major"])}
{grp("service",L["service"])}
{grp("road",L["minor"])}
{grp("major",L["major"])}
<g class="hedge">{hedge_s}</g>
<g class="wall">{wall_s}</g>
{grp("foot",L["foot"])}
{grp("subway",L["subway"])}
<g class="trees">{trees_s}</g>
<g class="bikes">{bikes_s}</g>
</g>
<image id="aerialLayer" x="0" y="0" width="{W:.0f}" height="{H}" preserveAspectRatio="none" href="" style="display:none"/>
<g class="mi" id="miOutline"><path d="{MI}"/></g>
<g class="entrances"><g class="main">{entm_s}</g><g class="other">{ento_s}</g></g>
<g id="campusOverlay">
<g id="instituteLabels">{il_s}</g>
{subs_s}
{marker("station", station[0], station[1],
        '<circle class="halo" r="17"/><circle class="dot" r="10"/><text class="uname" y="5">U</text>'
        '<text class="slabel" y="30">Garching-</text><text class="slabel" y="43">Forschungszentrum</text>')}
{marker("plab free", round(p_free[0],1), round(p_free[1],1),
        '<circle r="10"/><text class="pmark" y="4">P</text><text class="pname" y="24">Free parking</text>')}
{marker("plab paid", round(p_paid[0],1), round(p_paid[1],1),
        '<circle r="10"/><text class="pmark" y="4">P</text><text class="pname" y="24">Paid parking</text>')}
{marker("blabel", bx, by,
        '<text y="0">TUM School of CIT</text><text y="13">Computer Science &amp; Mathematics</text>')}
{gt_s}
{marker("office", ox, oy,
        '<circle class="ohalo" r="21"/><path class="opin" d="M0 0 l-8.5 -19 a8.5 8.5 0 1 1 17 0 Z"/>'
        '<circle class="odot" cy="-19" r="3.6"/><text class="olabel" y="-34">Office 03.06.020</text>')}
</g>
</svg>
'''
header = ('/* GENERATED by scripts/build_campus_map.py -- do not edit by hand.\n'
          '   Vector data:     (c) OpenStreetMap contributors, ODbL.\n'
          '   Aerial imagery:  Datenquelle Bayerische Vermessungsverwaltung, CC BY 4.0.\n'
          '   Section numbers: nav.tum.de (TUM Roomfinder).\n\n'
          '   Shipped as a script, not a .svg fetched at runtime, so the page also\n'
          '   works when opened from disk over file:// (fetch is blocked there). */\n')
with open(OUT, 'w', encoding='utf8') as f:
    f.write(header + 'window.CAMPUS_SVG = ' + json.dumps(svg) + ';\n')

print(f'viewBox 0 0 {W:.0f} {H}   aspect 1000:{H:.0f}')
print(f'  buildings {len(L["bld"])}  trees {len(trees)}  entrances {len(ents)}  barriers {len(barriers)}')
print(f'  institute labels {len(ilabels)}' + (f'  MISSING: {missing}' if missing else ''))
print(f'  office svg({ox},{oy})  building label svg({bx},{by})')
print(f'  wrote {OUT}  ({os.path.getsize(OUT)/1024:.0f} KB)')
