# Domain Docs

How engineering skills should consume this repo's domain documentation.

## Layout

This repo uses a single-context layout:

- `CONTEXT.md` at the repo root, if present
- `docs/adr/` at the repo root, if present

If these files do not exist, proceed silently. Do not suggest creating them upfront. Producer skills such as `/grill-with-docs` create them lazily when terms or decisions are resolved.

## Use the glossary's vocabulary

When output names a domain concept, use the term as defined in `CONTEXT.md`. If the concept is missing, note it as a possible gap for `/grill-with-docs`.

## Flag ADR conflicts

If output contradicts an existing ADR, surface the conflict explicitly instead of silently overriding it.
