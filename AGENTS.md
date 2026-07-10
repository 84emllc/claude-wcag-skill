# AGENTS.md

Instructions for agents and human contributors working in this repository.

## What this repo is

A single agent skill (`SKILL.md`) plus the verbatim WCAG 2.2 specification it references (`references/wcag-2.2-full.md`). The skill teaches an accessibility audit method and carries the full normative text so an agent can quote criteria rather than paraphrase them.

## Hard rules

1. **Never alter the normative text in `references/wcag-2.2-full.md`.** It is a verbatim reproduction of the W3C Recommendation, used under the W3C Document License. Do not edit, summarize, reword, reorder, or delete criteria, levels, definitions, or notes. The only permitted edit is the attribution comment at the top of the file. To update the spec, run `scripts/build-reference.sh` against the live W3C source; do not hand-edit.

2. **Preserve the W3C attribution.** The source-attribution comment at the top of the reference and the `NOTICE` file must survive any change. Redistribution requires them.

3. **Keep the counts in sync.** The reference contains 55 Level A/AA criteria (31 A + 24 AA), 86 total, spec dated 12 December 2024. If those change (a new WCAG dot-release), update `SKILL.md` (Overview, checklist header, the "new in 2.2" table) and `scripts/validate.mjs` together, in the same commit.

4. **4.1.1 Parsing is removed in WCAG 2.2.** Never reintroduce it as a criterion or cite it in the skill.

5. **No emdashes** in authored files (`SKILL.md`, `README.md`, `AGENTS.md`, `CHANGELOG.md`). Use hyphens. The W3C reference text is exempt because it is verbatim.

6. **Validator must pass.** Run `node scripts/validate.mjs` before committing. CI runs it plus markdownlint on every push and PR.

## Conventions

- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`). Semantic Versioning. Keep a Changelog.
- GitHub Actions pinned to commit SHAs, not moving tags.
- Do not commit generated junk; `references/` is intentionally committed (the spec is part of the deliverable).

## Workflow to update the spec

Use **pandoc 3.10** to reproduce the committed reference byte-for-byte. Other
versions produce a large cosmetic no-op diff (still valid, but noisy). CI pins
3.10 via the static binary; match it locally.

```bash
./scripts/build-reference.sh     # fetch + convert + re-header (pandoc 3.10)
node scripts/validate.mjs        # confirm counts, date, 4.1.1 absent
# update SKILL.md if criteria changed, bump CHANGELOG + version
```
