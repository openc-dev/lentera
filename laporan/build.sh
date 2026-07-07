#!/usr/bin/env bash
set -e

DIR="$(dirname "$0")"
OUTDIR="$DIR"
REPORT="$OUTDIR/laporan-lentera.pdf"

# Temp directory
TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

# Copy all resources into TMPDIR so pdflatex can find everything
cp "$OUTDIR/cover.md" "$TMPDIR/"
cp "$OUTDIR/template.latex" "$TMPDIR/"
cp "$OUTDIR/logo-boash.jpg" "$TMPDIR/"
cp -r "$OUTDIR/gambar" "$TMPDIR/"
# Strip alpha channel from PNGs (pdflatex can't handle RGBA)
for f in "$TMPDIR/gambar/"*.png; do
  convert "$f" -alpha off "$f"
done
# Copy missing encoding file for nimbus 15 fonts
cp /tmp/fontools_ts1.enc "$TMPDIR/"

# Create a patched t1jtm.fd that maps bold (b) to bx (which uses existing jtm fonts)
# instead of ptm fonts which are missing on this system
cat > "$TMPDIR/t1jtm.fd" << 'FDEOF'
\ProvidesFile{t1jtm.fd}
   [2010/11/10 Fontinst v1.927 font definitions for T1/jtm (patched).]

\expandafter\ifx\csname Jtms@scale\endcsname\relax
 \let\Jtms@@scale\@empty
\else
 \edef\Jtms@@scale{s*[\csname Jtms@scale\endcsname]}%
\fi%

\DeclareFontFamily{T1}{jtm}{}

\DeclareFontShape{T1}{jtm}{c}{n}{
    <->\Jtms@@scale jtmr8tc
}{}

\DeclareFontShape{T1}{jtm}{m}{n}{
    <->\Jtms@@scale jtmr8te
}{}

\DeclareFontShape{T1}{jtm}{m}{it}{
    <->\Jtms@@scale jtmri8te
}{}

\DeclareFontShape{T1}{jtm}{m}{sl}{
    <->\Jtms@@scale jtmro8te
}{}

\DeclareFontShape{T1}{jtm}{m}{sc}{
    <->\Jtms@@scale jtmrc8te
}{}

% --- Patched: bold (b) uses jtm bx fonts instead of missing ptmb8t ---
\DeclareFontShape{T1}{jtm}{b}{n}{
    <-> ssub * jtm/bx/n
}{}
\DeclareFontShape{T1}{jtm}{b}{it}{
    <-> ssub * jtm/bx/it
}{}
\DeclareFontShape{T1}{jtm}{b}{sl}{
    <-> ssub * jtm/bx/sl
}{}
\DeclareFontShape{T1}{jtm}{b}{sc}{
    <-> ssub * jtm/bx/sc
}{}

\DeclareFontShape{T1}{jtm}{x}{n}{
    <->\Jtms@@scale jtmr8tw
}{}
\DeclareFontShape{T1}{jtm}{x}{it}{
    <->\Jtms@@scale jtmri8tw
}{}
\DeclareFontShape{T1}{jtm}{x}{sl}{
    <->\Jtms@@scale jtmro8tw
}{}
\DeclareFontShape{T1}{jtm}{x}{sc}{
    <->\Jtms@@scale jtmrc8tw
}{}

\DeclareFontShape{T1}{jtm}{bx}{n}{
    <->\Jtms@@scale jtmb8tv
}{}
\DeclareFontShape{T1}{jtm}{bx}{it}{
    <->\Jtms@@scale jtmbi8tv
}{}
\DeclareFontShape{T1}{jtm}{bx}{sl}{
    <->\Jtms@@scale jtmbo8tv
}{}
\DeclareFontShape{T1}{jtm}{bx}{sc}{
    <->\Jtms@@scale jtmbc8tv
}{}

\endinput
FDEOF

# ---- Build the combined Markdown file ----
COMBINED="$TMPDIR/report.md"

# Write the document
{
  # Remove YAML front matter from chapter files and normalize headings
  strip_yaml() {
    sed '/^---$/,/^---$/d' "$1"
  }
  strip_hash() {
    grep -v '^#\+ BAB'
  }

  echo '# PENDAHULUAN'
  echo ''
  strip_yaml "$OUTDIR/01-pendahuluan.md" | strip_hash

  echo ''
  echo '# LANDASAN TEORI'
  echo ''
  strip_yaml "$OUTDIR/02-landasan-teori.md" | strip_hash

  echo ''
  echo '# ANALISIS DAN PERANCANGAN'
  echo ''
  strip_yaml "$OUTDIR/03-analisis-perancangan.md" | strip_hash

  echo ''
  echo '# IMPLEMENTASI'
  echo ''
  strip_yaml "$OUTDIR/04-implementasi.md" | strip_hash

  echo ''
  echo '# HASIL DAN PEMBAHASAN'
  echo ''
  strip_yaml "$OUTDIR/05-hasil-pengujian.md" | strip_hash

  echo ''
  echo '# PENUTUP'
  echo ''
  strip_yaml "$OUTDIR/06-penutup.md" | strip_hash

  echo ''
  cat "$OUTDIR/daftar-pustaka.md"
} > "$COMBINED"

echo "=== Combined report preview ==="
wc -l "$COMBINED"
head -50 "$COMBINED"

echo ""
echo "=== Building PDF ==="
echo ""

# Run pandoc from TMPDIR so (pdf)latex can find logo-boash.jpg
cd "$TMPDIR"
pandoc \
  "$COMBINED" \
  --template="$TMPDIR/template.latex" \
  --include-before-body="$TMPDIR/cover.md" \
  --top-level-division=chapter \
  --pdf-engine=pdflatex \
  -o "$REPORT" 2>&1

echo ""
echo "=== PDF generated ==="
ls -lh "$REPORT"
