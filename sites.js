// Site / legal-entity definitions for the invoice VAT stamper.
//
// Add a new site by copying an existing block and filling in real values.
// `lines` is exactly what gets printed onto the invoice, top to bottom.
//
// Position/font are shared defaults tuned against the real invoice template
// (see README "How the position was measured"). Override per-site only if a
// site's invoices come from a different template/layout.

const DEFAULT_STAMP = {
  x: 173.46,        // pt from left edge of the page
  firstLineY: 785.0, // pt from bottom edge of the page (baseline of line 1)
  lineHeight: 14,    // pt between line baselines
  fontSize: 12,
  font: "TimesRoman", // must be a pdf-lib StandardFonts name
  color: { r: 1, g: 1, b: 1 }, // white, matches the template's header banner
  applyToAllPages: false, // stamp page 1 only by default
};

const SITES = [
  // --- LRG Online Ltd (UK) — confirmed from a real stamped invoice. Used
  // for the UK-facing site only; EU-facing sibling sites use Cherry Core
  // Ltd below (confirmed 2026-09-22: "Cherry Core is our EU entity for
  // VAT etc purposes"). ---
  {
    id: "secretsales-com",
    label: "secretsales.com",
    lines: [
      "Secret Sales Group (Company Number 06264879)",
      "167-169 Great Portland Street, 5th Floor, London, W1W 5PF.",
      "VAT Reference 343746881",
    ],
  },

  // --- Cherry Core Ltd (Ireland) — the EU entity for Secret Sales' EU-
  // facing sites (confirmed 2026-09-22). Business No. and VAT Reference
  // below are as given; trading name changes per site, entity details
  // don't. ---
  {
    id: "secretsales-nl",
    label: "secretsales.nl",
    lines: [
      "Secret Sales Group (Business No. 763684)",
      "Suite 7 The Courtyard, Carmanhall Road, Sandyford, Dublin 18, D18 NW62, Ireland.",
      "VAT Reference 343746881",
    ],
  },
  {
    id: "afound-com",
    label: "afound.com",
    lines: [
      "Afound is owned and operated by Secret Sales Group (Business No. 763684)",
      "Suite 7 The Courtyard, Carmanhall Road, Sandyford, Dublin 18, D18 NW62, Ireland.",
      "VAT Reference 343746881",
    ],
  },
  {
    id: "dreivip-com",
    label: "dreivip.com",
    lines: [
      "DreiVIP (Business No. 763684)",
      "Suite 7 The Courtyard, Carmanhall Road, Sandyford, Dublin 18, D18 NW62, Ireland.",
      "VAT Reference 343746881",
    ],
  },

  // Generic Cherry Core entry — handy if another EU site is added later
  // and just needs the entity's own details rather than a trading name.
  {
    id: "cherry-core-ltd",
    label: "Cherry Core Ltd (generic EU entity)",
    lines: [
      "Cherry Core Ltd (Business No. 763684)",
      "Suite 7 The Courtyard, Carmanhall Road, Sandyford, Dublin 18, D18 NW62, Ireland.",
      "VAT Reference 343746881",
    ],
  },

  // --- To Be Dressed.nl B.V. — trades as V&D and TBD. Address confirmed
  // 2026-09-22; still need the KvK (Chamber of Commerce) number and the
  // Dutch BTW/VAT number. NOT YET CONFIRMED whether these two should use
  // Cherry Core Ltd instead, like the sites above — check before using. ---
  {
    id: "vd-nl",
    label: "vd.nl",
    lines: [
      "To Be Dressed.nl B.V.",
      "Amstelplein 54, 26th floor, 1096BC Amsterdam.",
      "VAT Reference 343746881",
    ],
  },
  {
    id: "to-be-dressed-nl",
    label: "to-be-dressed.nl",
    lines: [
      "To Be Dressed.nl B.V.",
      "Amstelplein 54, 26th floor, 1096BC Amsterdam.",
      "VAT Reference 343746881",
    ],
  },

  // --- Dress-For-Less GmbH — address confirmed 2026-09-22; still need the
  // German commercial register (HRB) number and the USt-IdNr (VAT ID).
  // NOT YET CONFIRMED whether this should use Cherry Core Ltd instead,
  // like the sites above — check before using. ---
  {
    id: "dress-for-less-de",
    label: "dress-for-less.de",
    lines: [
      "Dress-For-Less GmbH",
      "Dress-For-Less GmbH, im Besitz der Secret Sale Group LTD (Firmennr. 06264879)",
      "Geschäftsanschrift: Regus Technologiepark Bremen, Karl-Ferdinand-Braun-Straße 5, 28359 Bremen",
      "Betrieben von Cherry Core Limited (Firmennr. 763684)",
    ],
    // 4 lines instead of the usual 3 (2026-09-22: overran the header banner
    // and ran past the page's right edge at the default size). Nudged up
    // and shrunk to fit — re-check if this site's lines change again.
    stamp: { firstLineY: 787.5, lineHeight: 10.5, fontSize: 9.5 },
  },

  // Freeform fallback: type the block in by hand for a one-off / new site
  // that isn't configured above yet.
  {
    id: "custom",
    label: "Custom (type it in)",
    custom: true,
    lines: ["", "", ""],
  },
];
