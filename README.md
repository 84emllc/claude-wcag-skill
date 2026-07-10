# WCAG 2.2 AA Accessibility Skill

[![CI](https://github.com/84emllc/claude-wcag-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/84emllc/claude-wcag-skill/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![WCAG 2.2 Level AA](https://img.shields.io/badge/WCAG-2.2%20AA-2ea44f.svg)](https://www.w3.org/TR/WCAG22/)
[![Criteria: 55 A%2FAA](https://img.shields.io/badge/criteria-55%20A%2FAA-informational.svg)](./SKILL.md)
[![Agent Skill](https://img.shields.io/badge/type-agent%20skill-8250df.svg)](https://agentskills.io/specification)

An agent skill for auditing, remediating, and building user-facing UI to **WCAG 2.2 Level A/AA**. It pairs a concise audit method and criteria checklist (`SKILL.md`) with the verbatim W3C specification text (`references/wcag-2.2-full.md`) so an agent can cite normative wording instead of paraphrasing it.

Built by [84EM](https://84em.com) for use with Claude Code and other agent harnesses that load [Agent Skills](https://agentskills.io/specification).

## What is in here

| Path | What it is | License |
|------|------------|---------|
| `SKILL.md` | The skill: audit method, the six criteria new in WCAG 2.2, the 55-item A/AA checklist, per-stack remediation notes (HTML/CSS, WordPress, React/Tailwind, Hugo) | MIT |
| `references/wcag-2.2-full.md` | Verbatim WCAG 2.2 spec, converted to Markdown | W3C Document License |
| `scripts/build-reference.sh` | Regenerates the reference from the live W3C source (curl + pandoc) | MIT |
| `scripts/validate.mjs` | Asserts the reference and skill are internally consistent (55 A/AA criteria, spec date, 4.1.1 absent) | MIT |

## Install

**Claude Code (personal skill):** clone and symlink into your skills directory.

```bash
git clone https://github.com/84emllc/claude-wcag-skill.git
ln -sfn "$(pwd)/claude-wcag-skill" ~/.claude/skills/wcag-2.2-aa
```

The skill is then discoverable by its `name` and `description` frontmatter. No build step is required; the reference ships in the repo.

## Usage

Ask the agent to audit or build to WCAG 2.2 AA. It should run the four-pass method in `SKILL.md`:

1. Automated scan (axe-core / Lighthouse / WAVE)
2. Keyboard-only pass
3. Contrast and zoom/reflow
4. Screen-reader and semantics pass

Findings are reported as `criterion + name -> failing element -> fix`, citing `references/wcag-2.2-full.md`. The skill enforces one hard rule: **no conformance claim without an automated scan plus a manual keyboard pass**, because automated tools catch only about a third of AA failures.

## Regenerating the reference

When the W3C publishes an update, regenerate the Markdown reference:

```bash
./scripts/build-reference.sh
node scripts/validate.mjs
```

The build script fetches `https://www.w3.org/TR/WCAG22/`, converts it with pandoc (stripping HTML wrappers, preserving all normative text), and re-applies the W3C attribution header.

## Licensing

This repository is dual-licensed. The skill, scripts, and documentation are **MIT** (see [LICENSE](./LICENSE)). The reproduced WCAG 2.2 specification text in `references/` remains **copyright W3C** and is used under the [W3C Document License](https://www.w3.org/copyright/document-license-2023/). See [NOTICE](./NOTICE) for full attribution. Preserve that attribution if you redistribute the reference.

WCAG is a trademark of the W3C. This project is not endorsed by or affiliated with the W3C.
