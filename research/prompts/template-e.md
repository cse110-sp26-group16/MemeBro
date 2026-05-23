# Template E — Safety Classifier (pre-flight)

**When to use:** runs _before_ Templates A–D on every request. Not a meme-generation template — a lightweight classifier that gates whether the heavier templates should run.

**Output contract:** JSON only, a single verdict.

## Prompt

```
SYSTEM:
Classify the following meme concept. Return JSON only.

Categories:
- "ok": PG-13, not targeting a private individual's protected
  characteristics, not sexual, not glorifying violence.
- "borderline": ambiguous; defaulting to allow but the downstream prompt
  should add an extra caution.
- "block": clearly violates PG-13, targets a private individual maliciously,
  is sexual, or glorifies violence/self-harm.

USER:
Concept: {user_concept}
Uploader-described relationship to anyone named: {relationship_field}

Return: {"verdict": "ok" | "borderline" | "block", "reason": "..."}
```

## Variables

- `{user_concept}` — user's joke or situation
- `{relationship_field}` — UI-collected context about anyone named in the concept (e.g. "my roommate", "myself", "a public politician"). Empty if no person is named.

## Why a separate classifier

Putting this logic inline in every generation template works but bloats every prompt. A small fast classifier (cheap model, ~200ms) is a better architectural fit and gives us a single place to tune guardrail strictness as we get user feedback.

## Architectural implication

Running this classifier requires the upload flow to ask "who is this person to you?" when the concept contains a name. That's a real product decision, not just a prompt detail — flag for design review.
