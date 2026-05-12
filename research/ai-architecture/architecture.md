# Prompt Caching and Token Accounting Research

## Overview
Exploring the strategy for managing AI resources for MemeBro. Our goal is to ensure that the entire process is cost-efficient while maintaining high performance. In order to do this, we need to implement **Prompt Caching** and an in depth **Token Accounting** system.

## Possible Prompt Caching Method; OpenAI
Doing some research on how other specific models implement prompt caching. Out of all the other models, OpenAI methods stood out as it can reduce latency up to 80% and input tokens costs up to 90%. The following method is a Check & Save protocol that ensures we avoid redundant computation.

### The 1024/128 Rule
* **Minimum Threshold:** Caching only triggers for prompts exceeding **1,024 tokens**.
* **Increments:** Once the threshold is met, additional tokens are cached in **128-token blocks**.
* **Example (1600 Token Prompt):**
    * Tokens 0–1024: Cached (Base threshold).
    * Tokens 1025–1536: Cached (4 blocks of 128).
    * Tokens 1537–1600: **Not cached** (Leftover 64 tokens do not meet the 128-token boundary).

### Chain Caching & Prefix Integrity
Cache hits require a continuous, unbroken chain starting from the beginning of the prompt.
* **Rule:** If the first byte of the prompt changes, the entire cache is invalidated (0 token hit).
* **Strategy:** Place static, high-frequency data at the start and dynamic user data at the end.

#### OpenAI Prompt Caching Policy

- Prompt caching activates only when the prompt is at least 1,024 tokens long.
- After the 1,024-token threshold, caching expands in 128-token increments.
- Cache hits require an exact prefix match from the start of the prompt.
- If the beginning of the prompt changes, the cache is invalidated and the request behaves like a cold prompt.

Example:
- 1024 tokens: cached
- 1152 tokens: cached
- 1280 tokens: cached
- 1408 tokens: cached
- 1536 tokens: cached
- Remaining tokens below the next 128-token boundary are not cached

## Proposed Prompt Architecture
To maximize cache hits, the system will use a standardized prefix structure:

1.  **System Role:** Define the LLM as a meme generator (Tone/Voice).
2.  **Guardrails:** Safety rules and content restrictions (PG-13).
3.  **Template Library:** A large block (+50) of meme templates and styles to provide the AI with depth.
4.  **User Request:** The final, unique string containing the specific image/text request.

Here a quick example, that we can use for our models that has the role of generating the AI generated content.

### Prompt Prefix Architecture

[System Role]
You are MemeBro, a PG-13 meme generator. Your job is to produce short, funny, image-aware meme captions.

[Guardrails]
- Keep content safe, non-hateful, and PG-13.
- Avoid policy-sensitive or disallowed content.
- Prefer concise captions.
- Return structured output only.

[Template Library]
- Drake Hotline Bling
- Distracted Boyfriend
- Two Buttons
- Change My Mind
- Expanding Brain
- ... (50+ templates)

[User Request]


> **Risk Note:** "Prompt stuffing" with too many templates can lead to hallucinations. We will monitor the balance between template depth and AI output accuracy.

## Token Accounting & Storage Plan
In order to avoid burning through API limits, a usage ledger should be implemented by the backend.

### Storage Strategy
* **Tracking:** We will store usage data in a centralized database (e.g: Redis or PostgreSQL).
* **Schema:**
    * `user_id`: Unique identifier.
    * `daily_token_usage`: Sum of all tokens processed within 24 hours.# Prompt Caching and Token Accounting Research

## Overview
Exploring the strategy for managing AI resources for MemeBro. Our goal is to ensure that the entire process is cost-efficient while maintaining high performance. In order to do this, we need to implement **Prompt Caching** and an in depth **Token Accounting** system.

## Possible Prompt Caching Method; OpenAI
Doing some research on how other specific models implement prompt caching. Out of all the other models, OpenAI methods stood out as it can reduce latency up to 80% and input tokens costs up to 90%. The following method is a Check & Save protocol that ensures we avoid redundant computation.

### The 1024/128 Rule
* **Minimum Threshold:** Caching only triggers for prompts exceeding **1,024 tokens**.
* **Increments:** Once the threshold is met, additional tokens are cached in **128-token blocks**.
* **Example (1600 Token Prompt):**
    * Tokens 0–1024: Cached (Base threshold).
    * Tokens 1025–1536: Cached (4 blocks of 128).
    * Tokens 1537–1600: **Not cached** (Leftover 64 tokens do not meet the 128-token boundary).

### Chain Caching & Prefix Integrity
Cache hits require a continuous, unbroken chain starting from the beginning of the prompt.
* **Rule:** If the first byte of the prompt changes, the entire cache is invalidated (0 token hit).
* **Strategy:** Place static, high-frequency data at the start and dynamic user data at the end.

#### OpenAI Prompt Caching Policy

- Prompt caching activates only when the prompt is at least 1,024 tokens long.
- After the 1,024-token threshold, caching expands in 128-token increments.
- Cache hits require an exact prefix match from the start of the prompt.
- If the beginning of the prompt changes, the cache is invalidated and the request behaves like a cold prompt.

Example:
- 1024 tokens: cached
- 1152 tokens: cached
- 1280 tokens: cached
- 1408 tokens: cached
- 1536 tokens: cached
- Remaining tokens below the next 128-token boundary are not cached

## Proposed Prompt Architecture
To maximize cache hits, the system will use a standardized prefix structure:

1.  **System Role:** Define the LLM as a meme generator (Tone/Voice).
2.  **Guardrails:** Safety rules and content restrictions (PG-13).
3.  **Template Library:** A large block (+50) of meme templates and styles to provide the AI with depth.
4.  **User Request:** The final, unique string containing the specific image/text request.

Here a quick example, that we can use for our models that has the role of generating the AI generated content.

### Prompt Prefix Architecture

[System Role]
You are MemeBro, a PG-13 meme generator. Your job is to produce short, funny, image-aware meme captions.

[Guardrails]
- Keep content safe, non-hateful, and PG-13.
- Avoid policy-sensitive or disallowed content.
- Prefer concise captions.
- Return structured output only.

[Template Library]
- Drake Hotline Bling
- Distracted Boyfriend
- Two Buttons
- Change My Mind
- Expanding Brain
- ... (50+ templates)

[User Request]


> **Risk Note:** "Prompt stuffing" with too many templates can lead to hallucinations. We will monitor the balance between template depth and AI output accuracy.

## Token Accounting & Storage Plan
In order to avoid burning through API limits, a usage ledger should be implemented by the backend.

### Storage Strategy
* **Tracking:** We will store usage data in a centralized database (e.g: Redis or PostgreSQL).
* **Schema:**
    * `user_id`: Unique identifier.
    * `daily_token_usage`: Sum of all tokens processed within 24 hours.
    * `last_request_timestamp`: For rate-limiting.

### Accounting Logic
Every API response includes a `usage` object. We will track two specific metrics:
* **`cached_prompt_tokens`:** Billed at a significantly lower rate.
* **`total_tokens`:** Used to track overall burn against our API quota.

Quick Object Example:
{
  "usage": {
    "total_tokens": 2306,
    "prompt_tokens": 2006,
    "completion_tokens": 300,
    "prompt_tokens_details": {
      "cached_tokens": 1920,
      "audio_tokens": 0
    },
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "audio_tokens": 0
    }
  }
}

### Management Rules
* **Stale Cache Cleanup:** Monitor usage patterns. Prompts or prefixes that are no longer consistently used will be phased out of the active cache strategy.
* **Hard Limits:** Implement a "Hard Cap" per user session to ensure resource availability for the entire team.

## Benefits
* **Cost Reduction:** Leveraging cached tokens reduces overhead for repetitive system prompts.
* **Latency:** Reusing pre-computed states results in faster response times for the end-user.
* **Consistency:** Fixed prefixes ensure the AI adheres to the same brand voice and safety standards across all generations.
    * `last_request_timestamp`: For rate-limiting.

### Accounting Logic
Every API response includes a `usage` object. We will track two specific metrics:
* **`cached_prompt_tokens`:** Billed at a significantly lower rate.
* **`total_tokens`:** Used to track overall burn against our API quota.

Quick Object Example:
{
  "usage": {
    "total_tokens": 2306,
    "prompt_tokens": 2006,
    "completion_tokens": 300,
    "prompt_tokens_details": {
      "cached_tokens": 1920,
      "audio_tokens": 0
    },
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "audio_tokens": 0
    }
  }
}

### Management Rules
* **Stale Cache Cleanup:** Monitor usage patterns. Prompts or prefixes that are no longer consistently used will be phased out of the active cache strategy.
* **Hard Limits:** Implement a "Hard Cap" per user session to ensure resource availability for the entire team.
