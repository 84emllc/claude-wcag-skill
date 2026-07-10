# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- CI `build-reference` job: shellchecks the setup script, installs pandoc,
  regenerates the reference from the live W3C source, and re-validates it, so
  the clone-to-setup path is exercised on every push and PR.
- Weekly scheduled CI run to surface upstream WCAG spec drift.

### Fixed

- Pin CI pandoc to 3.10 (static binary, sha256-verified) instead of floating
  distro apt (3.1.3). Distro pandoc converts the same HTML to cosmetically
  different Markdown, producing a false drift warning; pinning makes reference
  regeneration byte-reproducible so the drift check fires only on real spec
  changes.

## [0.1.0] - 2026-07-10

### Added

- Initial `wcag-2.2-aa` agent skill (`SKILL.md`): four-pass audit method, the six
  criteria new in WCAG 2.2, the 55-item Level A/AA checklist, and per-stack
  remediation notes for generic HTML/CSS, WordPress block themes, React/Tailwind,
  and Hugo.
- Verbatim WCAG 2.2 specification reference (`references/wcag-2.2-full.md`),
  converted from the W3C Recommendation dated 12 December 2024, under the W3C
  Document License.
- `scripts/build-reference.sh` to regenerate the reference from the live W3C
  source (curl + pandoc).
- `scripts/validate.mjs` to assert internal consistency (55 A/AA criteria, 86
  total, spec date present, 4.1.1 Parsing absent).
- CI workflow (markdownlint + validator), MIT license, W3C NOTICE, README, and
  contributor guide (AGENTS.md).

[Unreleased]: https://github.com/84emllc/claude-wcag-skill/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/84emllc/claude-wcag-skill/releases/tag/v0.1.0
