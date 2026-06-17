# Agent Handoff — Publishing & Editing Blog Posts on Pokee

A self-contained guide for any agent (Claude or otherwise) that is asked to **create, update, or delete blog content** on the Pokee marketing site. Tells you what the system is, how the API works (including a Cloudflare gotcha that wastes the first attempt), what the post schema looks like, and how posts wire into the live website.

If something here contradicts the current code, **trust the code** — re-read the files this guide references before acting. Cited paths are relative to `/Users/puthavi/Code/Pokee` unless noted.

---

## 1. The system at a glance

Three pieces are involved:

| Piece | What it is | Where it lives |
| --- | --- | --- |
| **SonicCMS** | The CMS that stores blog posts (a Cloudflare Workers app, SonicJS under the hood) | `soniccms/` |
| **PokeeAIWebsite** | The Next.js marketing site that renders posts at `/blog/{slug}` and `/integrations` | `PokeeAIWebsite/` |
| **The website's fetch** | `PokeeAIWebsite` calls SonicCMS at build time / via ISR to populate the blog pages | `PokeeAIWebsite/src/utils/apiConfig.ts` + `src/app/[locale]/(unauth)/blog/page.tsx` + `src/app/[locale]/(unauth)/integrations/page.tsx` |

Two write hosts you will use:

- **Internal write API** (POST / PUT / DELETE): `https://sonicjs.pokee-ai-internal.workers.dev/api/v1`
- **Public read API** (GET — no auth, but works for everyone): `https://soniccms.pages.dev/api/v1`

You can use either host for GETs; use the internal host for writes.

**Auth header for writes**: `X-API-Key: <YOUR_API_KEY>`

---

## 2. ⚠️ The Cloudflare 1010 gotcha (read this first)

The internal write host is fronted by Cloudflare with browser-integrity checks enabled. **Default `urllib`/`requests` user agents return `HTTP 403` with `error code 1010`.** Always send a real browser UA:

```
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
```

`curl` works without setting one (its default UA is allowed). Python `urllib`/`requests` does **not**. Set the UA on every request.

---

## 3. Endpoints

| Action | Method | Path |
| --- | --- | --- |
| List published general posts | `GET` | `/generalPost?status=published` |
| Get one general post | `GET` | `/generalPost/{id}` |
| Create general post | `POST` | `/generalPost` |
| Update general post (full or partial) | `PUT` | `/generalPost/{id}` |
| Same for comparisons | — | replace `/generalPost` with `/comparisonPosts` |

**Request body shape:** always wrap in `data`:

```json
{ "data": { "seoTitle": "...", "content": "...", "status": "published" } }
```

For `PUT`, you can send **only the fields you want to change** — partial updates work.

---

## 4. `generalPost` field schema

These are every field stored on a post (from a live row):

```
id, seoTitle, slug, datePosted, status, author, summary, content,
metaDescription, tags, category, mediaUrls, mediaCaptions,
introduction, conclusion, createdOn, updatedOn, coverMediaUrl,
competitorName, integrationName, hook
```

Required-in-practice when **creating** a post:

| Field | Notes |
| --- | --- |
| `seoTitle` | Shown as the H1 and `<title>` |
| `slug` | URL-safe, used at `/blog/{slug}`. Must be unique. |
| `author` | Usually `"Pokee AI Team"` |
| `category` | See §6 — this drives which tab the post lands on |
| `tags` | Comma-separated string, e.g. `"pokee, slack, ai, automation"` |
| `metaDescription` | SEO meta tag |
| `hook` | One-liner shown on the blog card |
| `summary` | 2–4 sentences shown on the card / structured data |
| `introduction` | Rendered as markdown above the body |
| `content` | Full markdown body |
| `conclusion` | Optional, often `""` |
| `status` | Defaults to `"draft"`. Set `"published"` to make it live. |

Set explicitly to null if you have nothing to provide:
`coverMediaUrl: null`, `mediaUrls: null`, `mediaCaptions: null`.

For Integration posts (category `Integrations`), also set:
- `integrationName: "Slack"` — exact display name. This is what links the post to the `/integrations` page card (see §7).

For Comparison posts, set `competitorName` and use `/comparisonPosts` (different schema — `pokeeAiAnalysis`, `competitor1Analysis`, `faq1Question/Answer`, etc. — list one and inspect it before authoring).

---

## 5. Markdown rendering

`PokeeAIWebsite/src/components/BlogPage/GeneralPostPage.tsx` renders both `introduction` and `content` via `react-markdown` with `remark-gfm` + `rehype-raw` + `rehype-highlight`. So:

- Headings: `## H2`, `### H3` (don't use H1 in body — `seoTitle` is the H1)
- Lists, tables (GFM), code blocks, blockquotes, fenced code with language all work
- Bold inside list items works: `- **Lead:** rest of bullet.`
- Links open in a new tab and are styled purple + underlined
- Bold inside a link: `[**text**](https://...)` — both styles apply

Special quirk: paragraphs use `whitespace-pre-wrap`, so single newlines inside a paragraph render as visible line breaks. Want a real paragraph break? Use a blank line.

---

## 6. How `category` maps to the `/blog` tabs

`PokeeAIWebsite/src/app/[locale]/(unauth)/blog/page.tsx` splits posts into 4 visible tabs (`BlogCategorySwitcher`): **All / Integrations / Comparisons / Use Cases / Insights**.

Routing rules:

| Category / signal | Tab |
| --- | --- |
| `category === "Integrations"` | Integrations tab (uses `IntegrationCard`, needs `integrationName`) |
| `category === "Use Cases"` | Use Cases tab |
| Post has non-null `competitorName` | Comparisons tab — **regardless** of `category` |
| Anything else (e.g. `Announcement`, `AI & Automation`, `Comparison` *without* competitorName) | Insights tab (catch-all) |

So if you want a post to appear under "Insights" (announcements, thought leadership, etc.), pick any descriptive category string other than `Integrations` / `Use Cases`, and leave `competitorName` null.

---

## 7. How Integration posts wire to the `/integrations` marketing page

The marketing `/integrations` page is **not** auto-generated from blog posts — it has its own catalog. Blog posts attach a "Guide" badge to existing catalog cards.

The link works through this matching rule:

> `integrationsCatalog[].slug` must equal `post.integrationName.toLowerCase().replace(/\s+/g, '_')`

Examples:
- catalog `{ slug: 'telegram', ... }` ↔ post `integrationName: "Telegram"`
- catalog `{ slug: 'google_calendar', ... }` ↔ post `integrationName: "Google Calendar"`

ISR: `next: { revalidate: 3600 }` on the integrations-page fetch — up to **1 hour** between a SonicCMS write and the Guide badge appearing live.

### Adding a brand-new integration to `/integrations` (3 files, 3 places)

1. **`PokeeAIWebsite/src/components/shared/platformIcons/platformRegistry.ts`** — three edits in the same file:
   - Import the icon (e.g. `SiDiscord` from `react-icons/si`)
   - Add a registry entry with literal Tailwind color classes (Tailwind's content scanner won't pick up dynamically built classes):
     ```ts
     discord: { name: 'Discord', icon: SiDiscord, colorHex: '#5865F2', colorHexDark: '#8B95FF',
                colorClass: 'text-[#5865F2] dark:text-[#8B95FF]',
                colorClassLightOnly: 'text-[#5865F2]' },
     ```
   - Add to the `aliasMap` at the bottom: `'Discord': 'discord'`

2. **`PokeeAIWebsite/src/app/[locale]/(unauth)/integrations/integrationsCatalog.ts`** — add a `CatalogEntry`:
   ```ts
   { slug: 'discord', name: 'Discord', category: 'communication',
     description: '…' },
   ```
   Categories are `'communication' | 'productivity' | 'engineering' | 'marketing' | 'finance' | 'files-docs'`. Add `featured: true` to put it in the hero grid.

3. **SonicCMS post** — create a `generalPost` with `category: "Integrations"` and matching `integrationName`. Without the post the card shows but has no "Guide" link.

After the edits: `cd PokeeAIWebsite && npm run check-types` to confirm nothing typed.

---

## 8. Cache & timing

- `/integrations` listing: ISR every 3600s
- `/blog` listing and `/blog/{slug}` pages: also ISR
- Cloudflare CDN may hold stale HTML on top of ISR

After a write, the API is immediate but the live page may take up to **~1 hour** to reflect changes. If the user wants it instantly, redeploy the website or purge the relevant Cloudflare cache path — do not edit unrelated files just to bust cache.

---

## 9. Style conventions on existing posts

Patterns established across the existing Integrations guides — match them for consistency:

- **6 H2 sections** for an Integrations guide: *What You Can Do* / *Getting Started* / *Example Commands* / *Combining with X* / *Tips for Best Results* / *FAQ*
- **Bold the lead phrase** in list items: `- **Team updates:** Generate and post summaries.`
- Use `> "..."` blockquotes for example commands
- Use markdown tables for "Combining with X" workflow matrices
- Sign-offs/CTA: `Try Pokee today at [pokee.ai](https://pokee.ai).`
- Author is almost always `Pokee AI Team`
- `tags` is a comma-space-separated **string**, not a JSON array

---

## 10. Worked examples

### Python skeleton (handles the UA gotcha)

```python
import json, urllib.request, urllib.error

API_BASE = "https://sonicjs.pokee-ai-internal.workers.dev/api/v1"
HEADERS = {
    "Content-Type": "application/json",
    "X-API-Key": "<YOUR_API_KEY>",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}

def request(method, url, payload=None):
    data = json.dumps(payload).encode() if payload else None
    req = urllib.request.Request(url, data=data, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, resp.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()
```

### Create a post

```python
payload = {"data": {
    "seoTitle": "How to Use Foo with Pokee AI",
    "slug": "how-to-use-foo-with-pokee-ai",
    "author": "Pokee AI Team",
    "category": "Integrations",
    "integrationName": "Foo",
    "tags": "pokee, foo, ai, automation, integration",
    "metaDescription": "...",
    "hook": "...",
    "summary": "...",
    "introduction": "...",
    "content": "## What You Can Do…\n\n- **X:** Y\n",
    "conclusion": "",
    "coverMediaUrl": None, "mediaUrls": None, "mediaCaptions": None,
    "status": "published",
}}
print(request("POST", f"{API_BASE}/generalPost", payload))
# Expect HTTP 201
```

### Partial update (preferred when changing one field)

```python
print(request("PUT", f"{API_BASE}/generalPost/{POST_ID}",
              {"data": {"content": new_markdown}}))
# Expect HTTP 200
```

### Find a post id by slug

```bash
curl -sH "User-Agent: Mozilla/5.0" \
  "https://soniccms.pages.dev/api/v1/generalPost?status=published" \
  | python3 -c "
import json,sys
posts=json.load(sys.stdin).get('data',[])
for p in posts:
    if p['slug'] == 'TARGET-SLUG':
        print(p['id'])"
```

### Verify a write before declaring victory

After writing, GET the row back and check the field you changed actually changed. Don't assume HTTP 200 means the content is right — `PUT` returns 200 even if the payload was ignored as no-op.

---

## 11. Common operations cookbook

| Task | How |
| --- | --- |
| Publish a new Integrations guide | (a) create the SonicCMS post with `category: "Integrations"`, `integrationName: "Foo"`, `status: "published"`. (b) If "Foo" isn't already in `integrationsCatalog.ts` / `platformRegistry.ts`, add it (§7). |
| Publish an announcement (lands in Insights) | Create with `category: "Announcement"` (or anything not Integrations/Use Cases), no `integrationName`, no `competitorName`. |
| Update the body of an existing post | GET by slug → grab `id` → `PUT /generalPost/{id}` with `{"data": {"content": "..."}}`. |
| Hyperlink a phrase | Replace plain text with `[phrase](https://url)` in the field; `[**phrase**](url)` to keep bold. |
| Remove a mention everywhere | GET the post → run replacements on every text field (`summary`, `introduction`, `content`, `hook`, `metaDescription`) → PUT only the fields that changed → sanity check no occurrences remain. |
| Unpublish | `PUT` with `{"data": {"status": "draft"}}`. |
| Delete | Don't — set `status: "draft"` instead, unless the user explicitly asks for hard delete. |

---

## 12. Things future agents have got wrong (real failure modes from session history)

1. **Forgetting the User-Agent header.** First write fails with Cloudflare 1010. Always set the browser UA on writes.
2. **Editing only `content` and missing the same phrase in `introduction` / `summary` / `hook`.** When the user says "remove all mentions of X", check every text field on the post.
3. **Assuming `category: "Integrations"` is enough to attach the post to `/integrations`.** It is not — the post must also have `integrationName`, and the matching `slug` must exist in `integrationsCatalog.ts`.
4. **Trying to `Edit` `integrationsCatalog.ts` without re-reading it first.** It changes often (multiple devs add integrations). Re-read before editing, especially after a `git pull`.
5. **Declaring success after HTTP 201/200 without re-fetching.** Always GET back and verify the field actually changed — and remind the user the live page is cached (~1h).
6. **Inventing endpoints.** There is no `/api/v1/posts` or `/api/v1/blog`. The collections are `generalPost` and `comparisonPosts`. Singular, camelCase.
7. **Sending unwrapped bodies.** `{ "seoTitle": "..." }` is rejected. Always `{ "data": { "seoTitle": "..." } }`.

---

## 13. When to ask the user

- Posting anything that affects a public live page (final confirmation before `status: "published"`)
- Changing a slug on an already-published post (breaks inbound links)
- Hard-deleting a row
- Editing pricing, claims about features, security/compliance statements, customer names, or fundraising/investor language
- Anything that smells like marketing or legal — match the user's existing phrasing, don't invent

Otherwise: it's a markdown blog post. Make the edit, verify the GET, report the cache-refresh window, and move on.
