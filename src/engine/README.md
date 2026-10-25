# PROMISE deterministic reading engine (foundation)

`systems.ts` is the single registry for the requested 14 systems. Three random systems do not require birth data; eleven systems use birth data. This is a taxonomy, not an assertion that their calculation engines already exist.

`reading.ts` provides a seeded PRNG, a five-slot typed paragraph schema, and a renderer supporting `{name}` and `{pronoun}`. Supply authored corpus via `Corpus` per category (`work`, `love`, `wealth`, `self`) and retain provenance/review metadata with corpus records. Same seed and same ordered corpus produce same block. The renderer limits name use to once per paragraph and replaces the specified overused connector phrase. `birth_gender`, `current_gender`, orientation, relationship status, and LGBTQ+ role are supported context fields for future reviewed corpus variants; they are not automatically inferred or exposed.

Next: add reviewed corpus datasets with source/licensing metadata; define versioned calculation schemas per system, timezone/calendar policies, validation fixtures, and independent domain review before enabling production readings.
