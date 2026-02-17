# Migration Scripts

## 📦 Migrate Mock Data to Sanity

This folder contains scripts to migrate your existing mock data into Sanity CMS.

---

## 🚀 Running the Migration

### Step 1: Get Your Sanity API Token

1. Go to [Sanity Manage](https://sanity.io/manage)
2. Select your project: **atoms-and-bits-news**
3. Navigate to **API → Tokens**
4. Click **Add API Token**
5. Name it: `Migration Token`
6. Permissions: **Editor** (or **Admin**)
7. Copy the token (you won't see it again!)

---

### Step 2: Set Environment Variable

```bash
# Export the token in your terminal
export SANITY_API_TOKEN="your-token-here"
```

**Or create a `.env` file in the project root:**
```bash
SANITY_API_TOKEN=your-token-here
```

---

### Step 3: Install TypeScript Runner (if needed)

```bash
# Install tsx globally or as dev dependency
pnpm add -D tsx
```

---

### Step 4: Run the Migration

```bash
# From project root
npx tsx scripts/migrate-to-sanity.ts
```

**Expected output:**
```
🚀 Starting migration to Sanity...

📄 Migrating Articles...
✅ Created article: Exclusive: OpenAI announce their brand new...
✅ Created article: CRDB Sign a $500 million deal...
...
✅ Migrated 20 articles

🎙️  Migrating Podcasts...
✅ Created podcast: The Future of Mobile Money in Tanzania
...
✅ Migrated 5 podcasts

📅 Migrating Events...
✅ Created event: East Africa Tech Summit 2026
...
✅ Migrated 8 events

🚀 Migrating Startups...
✅ Created startup: Nala
✅ Created startup: Ramani
...
✅ Migrated 15 startups

🎉 Migration complete!
```

---

## ✅ After Migration

1. **Open Sanity Studio:**
   ```bash
   cd apps/atoms-and-bits-news
   pnpm dev
   ```

2. **Verify Content:**
   - Browse articles, podcasts, events, startups
   - Check that all fields populated correctly
   - **Note:** Images are not migrated (URLs only) - you'll need to upload them manually

3. **Update Next.js Pages:**
   - Replace mock data imports with Sanity queries
   - Test on `/latest` page first
   - Then gradually update other pages

---

## ⚠️ Important Notes

- **Images:** The script doesn't download/upload images. You have image URLs in mock data, but you'll need to manually upload images in Studio or extend the script.
- **Run Once:** This script creates new documents. Running it multiple times will create duplicates.
- **Cleanup:** If you need to delete all data and re-run, use Sanity Studio's Vision tool to delete documents.

---

## 🔧 Troubleshooting

### "SANITY_API_TOKEN not set"
Make sure you've exported the token in your current terminal session.

### "Permission denied"
Your token needs **Editor** or **Admin** permissions.

### "Duplicate slugs"
Some articles might have conflicting slugs. Check the error message and adjust manually in Studio.

---

## 📝 What Gets Migrated

| Content Type | Mock Data Source | Sanity Schema | Status |
|-------------|------------------|---------------|--------|
| Articles | `apps/web/app/data/articles.ts` | `article` | ✅ Full |
| Podcasts | `apps/web/app/data/content.ts` | `podcast` | ✅ Full |
| Events | `apps/web/app/data/content.ts` | `event` | ✅ Full |
| Startups | `apps/web/app/data/startups.ts` | `startup` | ✅ Full |

**Note:** Image URLs are preserved but files aren't uploaded. You can add images later in Studio.
