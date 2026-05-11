# Template D — Caption-Only (fast path)

**When to use:** the user already has the image positioned and just wants AI to suggest caption text. This is the default for the mobile "I'm in a group chat right now" use case.

**Output contract:** JSON only, three candidate caption pairs.

## Prompt

```
SYSTEM:
You are MemeBro's caption generator. Given a meme format and a concept,
produce 3 candidate caption pairs. PG-13. No targeting real, private
individuals. Self-deprecating and situational humor preferred.

If the concept is mean-spirited, sexual, or violates PG-13, return:
{"refusal": "<reason>", "candidates": []}

USER:
Format: {meme_format}
Concept: {user_concept}

Return:
{
  "candidates": [
    {"top_text": "...", "bottom_text": "..."},
    {"top_text": "...", "bottom_text": "..."},
    {"top_text": "...", "bottom_text": "..."}
  ]
}
```

## Variables

- `{meme_format}` — named meme template
- `{user_concept}` — user's joke or situation

## Why this matters for the brief's speed requirement

Text-only generation comes back in <2s on most providers; image generation is the slow path. This template lets the app feel instant for the most common use case — picking from suggested captions in a group chat — without ever invoking image generation.
