# MemeBro User Personas

Three personas for our AI-powered meme generator. Research and requirements are based on the CSE 110 Project Topic.

Quick note on scoping: per the project guidelines, we are focusing on a PG-13 experience that is fun, not mean. We are prioritizing speed and mobile-friendliness.

---

## Alex, 20 — the rapid-fire reactor

CS student at UC San Diego. Always on their phone during gaps between lectures. Conversations happen in fast-moving Discord and Slack channels.

Alex doesn't have time for manual image editing. When a friend says something ridiculous in the group chat, Alex needs to respond with a personalized meme immediately. If it takes more than a few minutes, the moment is gone.

What they want is simple: upload a quick photo of a classmate (PG-13 only), pick a famous template, and let AI do the rest. They need a better version of ImgFlip that actually works on a mobile browser.

### What annoys them
- Slow AI generation times (anything near 5 minutes is a dealbreaker)
- Desktop-only layouts
- Complex prompt engineering requirements

### Design implications
- Speed is essential
- Mobile-first UI
- One-tap AI generation
- Instant sharing capabilities

---

## Marcus, 22 — the "OG" meme enthusiast

Senior student who remembers the "golden age" of memes. Plays around with AI tools like Gemini to see what they can do.

Marcus likes the lore of old memes but wants to revive them with modern tech. He isn't just looking for a simple face-swap; he wants the AI to preserve the specific style, lighting, and text of the original meme while injecting new, high-quality elements.

He wants to highlight AI features like prompt-caching or token accounting to show off his technical understanding during interviews.

### What annoys him
- Generic memes that look low-quality
- Tools that lose the vibe of the original template
- Lack of technical control over AI output

### Design implications
- Extensible domain modeling for image processing
- Advanced AI prompt engineering
- Preserve classic meme aesthetics while enhancing quality

---

## Taylor, 19 — the social connector

Loves using iMessage and Messenger for sharing GIFs and memes. Very high tech comfort but values the social layer over the underlying tech.

Taylor sees memes as the glue of their social circle. They will try any weird new extension or app if a friend sends a link, but they'll only keep using it if it makes them look funny or creative. They want a neat and direct way to organize and send memes, unlike the cluttered folders in their Photos app.

### What annoys them
- Friction during the sending process
- Mean-spirited content
- Apps that feel like a chore to use

### Design implications
- PG-13 only content
- Polished and intuitive UI
- Highly shareable meme workflows
- "Messenger GIF button" style experience

---

# Quick Comparison

| Need | Alex | Marcus | Taylor |
|---|---|---|---|
| Speed (Under 5 mins) | Critical | Important | Critical |
| Mobile-Friendly | Critical | Nice-to-have | Critical |
| AI Personalization | Critical | Important | Nice-to-have |
| PG-13 / Fun Demos | Important | Important | Critical |
| Technical "Juice" | Nice-to-have | Critical | Optional |
| Social Integration | Important | Nice-to-have | Critical |

---

## Shared Requirements

Things all three personas need:

- Mobile-responsive design
- Faster-than-ImgFlip performance
- A PG-13 environment