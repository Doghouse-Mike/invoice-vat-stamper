# Invoice VAT Stamper

A tiny static web app: upload order-confirmation PDFs, pick which site they
were sold on, get back the same PDFs with that site's VAT number / legal
entity / registered address stamped into the header — replacing the
copy-paste-in-Xournal++ workflow.

Everything runs client-side in the browser (via [pdf-lib](https://pdf-lib.js.org/)
and [JSZip](https://stuk.github.io/jszip/)). No server, no upload — the PDFs
never leave your machine. That matters here since these invoices carry
customer names and addresses.

## Using it

Open `index.html` directly in a browser, or host the folder as a static site
(e.g. GitHub Pages — see below). Then:

1. Pick the site from the dropdown.
2. Drop in one or more PDFs (or click to choose).
3. Click **Stamp & download**. One file downloads as a PDF; multiple files
   download as a zip.

## Adding / editing sites

Edit `sites.js`. Each entry looks like:

```js
{
  id: "secret-sales-group",
  label: "Secret Sales Group",
  lines: [
    "Secret Sales Group (Company Number 06264879)",
    "167-169 Great Portland Street, 5th Floor, London, W1W 5PF.",
    "VAT Reference 343746881",
  ],
},
```

`lines` is printed exactly as given, one per line. Two placeholder sites
(`site-b`, `site-c`) are already stubbed in — fill in the real legal name,
company number, address and VAT reference for each of your other sites and
rename the `id`/`label`. There's also a **Custom** option in the dropdown for
typing a one-off block in by hand without touching the code.

Position, font, size and color are shared defaults (`DEFAULT_STAMP` in
`sites.js`) tuned against the standard invoice template. Override any of them
per-site with a `stamp: { ... }` field if a particular site's invoices use a
different layout, e.g.:

```js
{
  id: "site-with-different-template",
  label: "Site With A Different Template",
  lines: [ /* ... */ ],
  stamp: { x: 200, firstLineY: 700, applyToAllPages: true },
},
```

## How the position was measured

The invoice template already has an empty grey banner to the right of the
`Invoice #` / `Order #` / `Order Date` block — that's where the legal text
belongs. Measured from a hand-annotated sample with `pdftotext -bbox-layout`:
Times-Roman, 12pt, white, left edge at x=173.46pt, first baseline at
y=785pt (from bottom), 14pt between lines. If a site's invoices come from a
different generator, re-measure and override via `stamp` as above.

## Hosting on GitHub Pages

1. Push this folder to a GitHub repo.
2. Repo Settings → Pages → Deploy from branch → pick `main` / root.
3. Share the resulting `https://<user>.github.io/<repo>/` URL.

No build step, no server, no secrets involved — it's just static files.

## Limitations

- Tuned for a single-page A4 invoice template. A differently laid-out PDF may
  get the stamp in the wrong place — check the output before sending it
  anywhere.
- By default only page 1 is stamped (`applyToAllPages: false`); flip that
  per-site if a site's invoices span multiple pages and need the block on
  each one.
