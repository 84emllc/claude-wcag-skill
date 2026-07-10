#!/usr/bin/env bash
# Regenerate references/wcag-2.2-full.md from the live W3C source.
# Requires: curl, pandoc. Preserves all normative text; strips HTML wrappers;
# re-applies the W3C attribution header.
set -euo pipefail

SRC="https://www.w3.org/TR/WCAG22/"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/references/wcag-2.2-full.md"
TMP_HTML="$(mktemp)"
TMP_MD="$(mktemp)"
trap 'rm -f "$TMP_HTML" "$TMP_MD"' EXIT

command -v curl >/dev/null || { echo "curl not found" >&2; exit 1; }
command -v pandoc >/dev/null || { echo "pandoc not found" >&2; exit 1; }

echo "Fetching $SRC"
curl -sL -A "Mozilla/5.0" "$SRC" -o "$TMP_HTML"

echo "Converting with pandoc (stripping raw HTML)"
pandoc -f html -t gfm-raw_html --wrap=none "$TMP_HTML" -o "$TMP_MD"

echo "Applying W3C attribution header"
cat > "$OUT" <<'HEADER'
<!--
SOURCE ATTRIBUTION - DO NOT RELICENSE
This file reproduces "Web Content Accessibility Guidelines (WCAG) 2.2",
W3C Recommendation 12 December 2024.
Source: https://www.w3.org/TR/WCAG22/
Copyright © 2024 World Wide Web Consortium (W3C). All Rights Reserved.
Reproduced under the W3C Document License:
https://www.w3.org/copyright/document-license-2023/
This document is NOT covered by the repository's MIT license. It remains
W3C-copyrighted material. Converted to Markdown from the source HTML; no
normative text was altered. See NOTICE in the repository root.
-->

HEADER
cat "$TMP_MD" >> "$OUT"

echo "Wrote $OUT ($(wc -l < "$OUT") lines)"
echo "Now run: node scripts/validate.mjs"
