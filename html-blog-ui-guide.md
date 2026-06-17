# Pokee Comparison Post Style Guide

This guide defines the exact structure and formatting for "Pokee vs [Competitor]" comparison blog posts published via the SonicJS General Post API. Follow this guide precisely to ensure consistent UI across all comparison articles.

---

## API Endpoint

```
POST https://sonicjs.pokee-ai-internal.workers.dev/api/v1/generalPost
Header: X-API-Key: <API_KEY>
Header: Content-Type: application/json
```

---

## Field Mapping

| Field | What goes here |
|---|---|
| `seoTitle` | "Pokee vs [Competitor]: [Pokee Category] vs [Competitor Category]" |
| `slug` | kebab-case, e.g. `pokee-vs-lovable-ai-agent-platform-vs-ai-app-builder` |
| `author` | Author name, e.g. "Pokee AI Team" |
| `category` | "Comparison" |
| `competitorName` | **Required for comparison posts.** The competitor name exactly as registered (e.g., "Lovable", "Make.com", "n8n"). This determines the competitor icon on the blog card. See Registered Competitors below. |
| `tags` | Comma-separated, e.g. "pokee, lovable, ai agents, comparison, app builder" |
| `summary` | The 1-2 sentence hook paragraph under the title. Should highlight the key differentiator. |
| `introduction` | Brief framing sentence for the comparison (1-2 sentences setting up why this comparison matters). |
| `content` | The full article body in markdown (see Content Structure below). |
| `conclusion` | The "Verdict" section text only (no heading — the renderer adds its own "Conclusion" heading). |
| `coverMediaUrl` | Optional. URL to a cover image if available. |
| `metaDescription` | SEO meta description, ~150 chars summarizing the comparison. |

### Registered Competitors

Use these exact `competitorName` values:

| Value | Display Name |
|---|---|
| `Lovable` | Lovable |
| `Make.com` | Make.com |
| `Microsoft Copilot` | Microsoft Copilot |
| `n8n` | n8n |
| `Notion AI` | Notion AI |
| `OpenAI Codex` | OpenAI Codex |
| `OpenAI Operator` | OpenAI Operator |
| `Perplexity AI` | Perplexity AI |
| `Poe` | Poe |
| `Relevance AI` | Relevance AI |

---

## Content Structure (Markdown)

The `content` field must follow this exact section order using markdown. The renderer supports GFM tables, HTML, headings (h2/h3), lists, and links natively.

```markdown
## What is Pokee AI?

[1 paragraph describing Pokee AI. Keep consistent across all posts — update only if product changes.]

## What is [Competitor]?

[1 paragraph describing the competitor objectively.]

## Feature-by-Feature Comparison

| Feature | Pokee AI | [Competitor] |
|---|---|---|
| [Feature 1] | [Pokee value] | [Competitor value] |
| [Feature 2] | [Pokee value] | [Competitor value] |
| ... | ... | ... |

[Include 8-12 feature rows. Keep the column order consistent: Feature, Pokee AI, Competitor.]

## Where Pokee Wins

### 1. [Advantage Title]

[1 paragraph explaining this advantage. Be specific and factual.]

### 2. [Advantage Title]

[1 paragraph.]

[Continue with 4-6 numbered advantages.]

## Where [Competitor] Wins

### 1. [Advantage Title]

[1 paragraph. Be fair and honest about competitor strengths.]

### 2. [Advantage Title]

[1 paragraph.]

[Continue with 3-5 numbered advantages.]

## Real-World Comparison

| Task | Pokee | [Competitor] |
|---|---|---|
| "[Task description]" | [What Pokee does] | [What competitor does] |
| ... | ... | ... |

[Include 4-6 real-world task rows. Use quoted task descriptions in the first column.]

## Pricing Comparison

| Tier | Pokee AI | [Competitor] |
|---|---|---|
| Free | [Pokee free tier] | [Competitor free tier] |
| [Tier name] | [Price and details] | [Price and details] |
| ... | ... | ... |

[Include all relevant pricing tiers. Add a brief note below the table if pricing models differ significantly.]

## Who Should Choose Pokee?

- [Audience/use case 1]
- [Audience/use case 2]
- [Audience/use case 3]
- [Audience/use case 4]
- [Audience/use case 5]

## Who Should Choose [Competitor]?

- [Audience/use case 1]
- [Audience/use case 2]
- [Audience/use case 3]
- [Audience/use case 4]

## Frequently Asked Questions

### [Question 1]?

[Answer — 2-3 sentences.]

### [Question 2]?

[Answer — 2-3 sentences.]

### [Question 3]?

[Answer — 2-3 sentences.]

### [Question 4]?

[Answer — 2-3 sentences.]

[Include 4-5 FAQs. Use natural question phrasing. Answers should reference both products.]
```

---

## Formatting Rules

1. **Headings**: Use `##` (h2) for major sections, `###` (h3) for subsections. Never use `#` (h1) — the renderer uses `seoTitle` as the page h1.
2. **Tables**: Use standard markdown GFM tables. The renderer auto-styles them with borders, hover effects, and responsive scrolling.
3. **Lists**: Use `- ` for unordered lists, `1. ` for ordered lists within advantage sections.
4. **Links**: Use `[text](url)` — they render as blue with hover underline.
5. **Bold**: Use `**text**` sparingly for emphasis within paragraphs.
6. **No inline CSS or HTML classes**: The renderer handles all styling. Raw HTML like `<br/>` or `<table>` is supported but standard markdown is preferred.
7. **No emojis**: Keep the tone professional.
8. **Paragraphs**: Separate paragraphs with a blank line. Do not use `<br/><br/>` — just use normal markdown paragraph breaks.

---

## Pokee AI Standard Description

Use this as the base for the "What is Pokee AI?" section across all posts (adjust wording slightly per article to avoid duplicate content penalties):

> Pokee AI is an AI agent platform powered by proprietary reinforcement learning, trained on 10,000+ tools for 99% accuracy. Every user gets PokeeClaw -- an isolated cloud workspace with persistent memory, 90+ native integrations (Gmail, Slack, HubSpot, Jira, Shopify, etc.), full coding capabilities, and content generation. Backed by Point72, Qualcomm Ventures, and Samsung NEXT.

---

## Standard Feature Rows

Include these features in every comparison table where applicable (adjust values per competitor):

| Feature | Description |
|---|---|
| Primary use | What the platform is primarily used for |
| Business integrations | Number and type of integrations |
| Persistent memory | Whether context carries across sessions |
| Cloud workspace | Type of execution environment |
| Content generation | Types of content that can be generated |
| Enterprise security | SOC 2, on-premise, compliance features |
| Pricing | Starting price and free tier |

Add 3-5 competitor-specific feature rows that highlight the most relevant differences for that comparison.

---

## Standard Pokee Pricing Tiers

Use these current pricing tiers:

| Tier | Price |
|---|---|
| Free | 500 credits/mo, full platform |
| Lite | $19.99/mo |
| Pro | $49.99/mo |
| Ultra | $99.99/mo |
| Enterprise | $199.99+/mo (unlimited, on-premise) |

---

## Example API Request

```bash
curl -X POST "https://sonicjs.pokee-ai-internal.workers.dev/api/v1/generalPost" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: <API_KEY>" \
  -d '{
    "data": {
      "seoTitle": "Pokee vs Lovable: AI Agent Platform vs AI App Builder",
      "slug": "pokee-vs-lovable-ai-agent-platform-vs-ai-app-builder",
      "author": "Pokee AI Team",
      "category": "Comparison",
      "competitorName": "Lovable",
      "tags": "pokee, lovable, ai agents, comparison, app builder",
      "metaDescription": "Compare Pokee AI and Lovable side-by-side. Pokee is a full AI agent platform with 90+ integrations. Lovable is a visual AI app builder. See which is right for you.",
      "summary": "Lovable generates web applications from natural language prompts. Pokee AI builds applications AND automates your entire business with 90+ integrations, persistent memory, and enterprise security. One builds apps. The other builds your business.",
      "introduction": "Choosing between an AI agent platform and an AI app builder depends on whether you need just a web frontend or a full business automation solution.",
      "content": "## What is Pokee AI?\n\nPokee AI is an AI agent platform powered by proprietary reinforcement learning...\n\n## What is Lovable?\n\nLovable (formerly GPT Engineer) is an AI-powered web application builder...\n\n## Feature-by-Feature Comparison\n\n| Feature | Pokee AI | Lovable |\n|---|---|---|\n| Primary use | Full AI agent platform | AI web app builder |\n| ... | ... | ... |\n\n## Where Pokee Wins\n\n### 1. Goes Far Beyond App Building\n\nLovable builds web apps. Pokee builds web apps AND sends emails...\n\n## Where Lovable Wins\n\n### 1. Visual App Design\n\nLovable provides a visual interface where you see your app take shape...\n\n## Real-World Comparison\n\n| Task | Pokee | Lovable |\n|---|---|---|\n| ... | ... | ... |\n\n## Pricing Comparison\n\n| Tier | Pokee AI | Lovable |\n|---|---|---|\n| ... | ... | ... |\n\n## Who Should Choose Pokee?\n\n- Teams building apps that need real business tool integrations\n- ...\n\n## Who Should Choose Lovable?\n\n- Non-technical founders who want to visually build web apps\n- ...\n\n## Frequently Asked Questions\n\n### Is Pokee better than Lovable for building apps?\n\nFor applications that need business tool integrations, yes...",
      "conclusion": "Lovable is the best visual AI app builder for non-technical users who want polished web applications fast. Pokee AI is the platform for building applications that integrate with your business tools, automate your operations, and run scheduled workflows. If you only need a web app, Lovable delivers beautiful results. If you need an app plus everything else, choose Pokee."
    }
  }'
```

---

## Checklist Before Publishing

- [ ] `seoTitle` follows format: "Pokee vs [X]: [Category] vs [Category]"
- [ ] `slug` is unique and kebab-case
- [ ] `category` is set to "Comparison"
- [ ] `competitorName` is set to one of the registered competitor values
- [ ] `summary` is 1-2 sentences, not a paragraph
- [ ] `content` follows all sections in order
- [ ] Feature table has 8-12 rows
- [ ] "Where Pokee Wins" has 4-6 items
- [ ] "Where [Competitor] Wins" has 3-5 items (be fair)
- [ ] Pricing table uses current Pokee pricing
- [ ] FAQs have 4-5 questions
- [ ] No `#` (h1) headings in content
- [ ] No emojis
- [ ] Pokee AI description is consistent but not identical to other posts
