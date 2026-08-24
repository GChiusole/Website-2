# Builds directly into ../assets/, which is what the website serves and what
# .github/workflows/deploy.yml copies. There is no separate "install" step.
#
#   make        -- build ../assets/cv-gideon-chiusole.pdf
#   make watch  -- rebuild on every save
#   make clean  -- remove auxiliary files

NAME   := cv-gideon-chiusole
OUTDIR := ../assets
PDF    := $(OUTDIR)/$(NAME).pdf
AUX    := aux fls log out fdb_latexmk toc

.PHONY: all watch clean

all: $(PDF)

$(PDF): $(NAME).tex cvstyle.sty
	latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=$(OUTDIR) $(NAME).tex
	@$(foreach e,$(AUX),rm -f $(OUTDIR)/$(NAME).$(e);)
	@echo "Built $(PDF) -- commit it to publish."

watch:
	latexmk -pdf -pvc -interaction=nonstopmode -outdir=$(OUTDIR) $(NAME).tex

clean:
	@$(foreach e,$(AUX),rm -f $(OUTDIR)/$(NAME).$(e);)
	rm -f $(NAME).pdf
