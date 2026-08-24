# CV source

`../assets/cv-gideon-chiusole.pdf` is built from LaTeX. It replaces the old
Word → PDF workflow.

- **`cv-gideon-chiusole.tex`** — content only. This is the file to edit.
- **`cvstyle.sty`** — all layout (margins, fonts, rules, spacing). Rarely touched.

**The build writes directly into `../assets/`.** That is the file [cv.html](../cv.html)
links to and the one [deploy.yml](../.github/workflows/deploy.yml) copies to the
live site, so there is no separate publish step — build, then commit the PDF.

In VS Code: **Recipe: pdfLaTeX** (configured in [.vscode/settings.json](../.vscode/settings.json)).
From a terminal:

```sh
make          # build ../assets/cv-gideon-chiusole.pdf
make watch    # rebuild on every save
make clean    # remove auxiliary files
```

The source filename matches the published filename on purpose: pdfLaTeX names its
output after the input, so renaming `cv-gideon-chiusole.tex` would silently change
the CV's public URL. Auxiliary files are cleaned out of `assets/` after each build;
`.synctex.gz` is kept (it powers forward/inverse search) and is gitignored.

Engine: pdfLaTeX + `newtxtext` (a Times clone). No system fonts needed, so it
builds identically on macOS, Linux, and Overleaf.

## Editing conventions

Every entry uses one of five commands. Do not hand-format with `\hspace`,
`\vspace`, `\\`, or `tabular` — use these instead, and the layout stays consistent.

| Command | Use for |
| --- | --- |
| `\cvsection{Education}` | section heading + horizontal rule |
| `\cventry{Institution -- Degree}{10/2021 -- 01/2024}` | bold entry title, date flush right |
| `\cvrole{Teaching Assistant}` | italic job title under a `\cventry` |
| `\cvline{free text}{date}` | one-off line; **an empty second argument** `{}` gives a full-width line |
| `\cvpub{...}` | one publication |

Bullets go in `\begin{cvitems} ... \end{cvitems}` (one `\item` per bullet).

Links: `\cvlink{https://...}{arXiv}` renders as an underlined `[arXiv]`.

Typography: `--` is an en dash (date ranges, "Institution -- Degree"), `---` an
em dash. Quotes are `` ``like this'' ``. `%` and `&` must be escaped as `\%`, `\&`.

## Tuning the layout

Everything adjustable is at the top of `cvstyle.sty`: page margins in the
`geometry` line, `\cvdatewidth` (right-hand date column), `\cvrulewidth`
(section rules), the base size in `cv.tex`'s `\documentclass[a4paper,8pt]`,
and the list spacing in `\setlist[itemize]`.

To use the real Times New Roman instead of the clone, compile with XeLaTeX and
swap the `newtxtext`/`newtxmath` lines for
`\RequirePackage{fontspec}\setmainfont{Times New Roman}`.
