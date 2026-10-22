# OLQW Announcements (Unofficial)

An unofficial announcements site for Our Lady Queen of the World, built as plain HTML/CSS/JS for GitHub Pages. It is **not affiliated with or endorsed by the school.**

## Posting announcements (daily)

Edit **`announcements.js`**. That's the only file you need to touch. You can do it on GitHub: open the file, click the pencil icon, edit, then click **Commit changes**.

Add one line per announcement inside the brackets:

```js
const ANNOUNCEMENTS = [
  { date: "2026-10-22", title: "Your title", body: "Details. Use \n for a new line." },
];
```

- Today's entries appear on **Today**; older entries move to **Past** automatically.
- Entries dated in the future stay hidden until their day.
- If you write `"` inside text, escape it as `\"`. Put a comma after each `}`.
- Malformed entries are skipped (check the browser console for a warning).

The site usually updates within a minute or two after you commit.

## Hosting on GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under *Build and deployment*, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. The site will be available at `https://<username>.github.io/announcements/`.

## Intro page

First-time visitors see `intro.html` and must acknowledge the disclaimer once. This is remembered in `localStorage` under `olqw-ack-v1`. If you change the legal text substantially, bump the version in both `assets/gate.js` and `assets/intro.js` (e.g. to `olqw-ack-v2`) so everyone sees the intro again, and update the "Last updated" date in `legal.html`.

## Files

| File | Purpose |
|---|---|
| `announcements.js` | Announcement data (edit this) |
| `index.html` | Today's announcements |
| `past.html` | Archive with search |
| `intro.html` | One-time acknowledgement page |
| `legal.html` | Disclaimer, terms & privacy |
| `assets/` | Styles and scripts |

## License

Code is licensed under GPL-3.0. See `LICENSE`.
