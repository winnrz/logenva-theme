# Longeva Pharmacy — Shopify Prototype

A working Shopify prototype for **Longeva Pharmacy**, a pharmacy-led aesthetics and healthcare business supplying prescription-only medicines and practitioner products to registered UK clinicians.

Built on **Shopify Dawn v15.4.1** with brand layering, custom homepage sections, three-state customer gating, and per-line VAT logic for mixed prescription / clinic-stock baskets.

This is a prototype, not a production build. The goal is to demonstrate sensible thinking, working functionality across the brief's key flows, and sound commercial and UX judgement in a regulated-supply context.

## Brief coverage

The prototype implements all nine functional areas from the build brief:

| # | Area | Implementation |
|---|---|---|
| 1 | Homepage | Brand hero, trust strip, category cards, how-it-works, pillars, FAQ |
| 2 | Collection page | Conditional pricing, POM hidden from non-approved users |
| 3 | Product pages | Per-state gating, VAT note, Request Access CTA |
| 4 | Practitioner registration | Themed split-panel application form at `/pages/practitioner-application` |
| 5 | Gated product access | Public / pending / approved states driven by customer tags |
| 6 | Approval workflow | Manual via Shopify admin (documented workaround for NCA limitation) |
| 7 | Basket & checkout | Cart blocked for non-approved; Rx vs clinic-stock pathway via variants |
| 8 | VAT logic | Per-line, four required scenarios verified end-to-end |
| 9 | Mobile responsiveness | Full mobile pass across nav, application, PDP, cart, gated states |

## Stack

- **Shopify Dawn** v15.4.1 (`config/settings_schema.json` → `theme_info`)
- **Shopify CLI** for local development and theme push
- **No build step** — assets in `assets/` are served as-is
- **Shopify New Customer Accounts** (passwordless) for storefront authentication

## Local development

```sh
shopify theme dev               # local server, hot reload against the linked dev store
shopify theme push --unpublished  # push as a hidden theme
shopify theme pull              # pull settings/assets after merchant edits
shopify theme check             # Liquid/theme linter
```

## Theme structure

Standard Shopify Dawn layout. Brand-specific additions:

- **`sections/longeva-*.liquid`** — homepage modules (hero, trust strip, category cards, how-it-works, pillars, FAQ, footer)
- **`sections/practitioner-application.liquid`** — themed application form (split-panel layout with brand hero)
- **`snippets/gated-cta.liquid`** — price + buy-button replacement for non-approved viewers
- **`snippets/pending-banner.liquid`** — site-wide banner shown to pending applicants
- **`assets/longeva-tokens.css`** — design tokens (colour, spacing, type ramp)
- **`assets/longeva-vat.js`** — client-side VAT display helpers
- **`assets/OwnersXWide-*.woff2`** — self-hosted heading typeface

State assignment for the whole theme happens once in `layout/theme.liquid`:

```liquid
{%- if customer.tags contains 'approved' -%}
  {%- assign longeva_state = 'approved' -%}
{%- elsif customer -%}
  {%- assign longeva_state = 'pending' -%}
{%- else -%}
  {%- assign longeva_state = 'public' -%}
{%- endif -%}
```

All gating reads off this value.

## Implementation highlights

**Gating.** Three states (`public`, `pending`, `approved`) driven by `customer.tags`. POM products (Botox 50u) are hidden from collection grids, predictive search, and add `noindex` to their PDPs for non-approved viewers. Practitioner products remain visible but swap price + buy buttons for an "Apply for access" CTA.

**Approval.** Manual: applicant submits the application form, Shopify emails the application to the store owner, admin reviews credentials against the public professional register (GMC / NMC / GDC / GPhC) and manually creates the customer with the `pending` tag, then updates to `approved` once verified. Shopify admin is the admin portal — no themed mock UI.

**VAT.** Per-line, driven by product variant. Practitioner products carry two variants (`Prescription` / `Clinic stock`); the cart reads `item.variant.title` to render the correct VAT note alongside each line. Native variant-level tax overrides in Shopify admin enforce the actual rate (0% Rx, 20% clinic). POM is zero-rated at the variant level.

## Documented simplifications

- **Credentials are a text field**, not a file upload. Shopify's contact-form notification emails do not reliably render uploaded files, and Shopify Forms would require a third-party file-handling integration. Applicants enter their registration number (e.g. `GMC 1234567`) or a public credentials URL; the reviewer looks it up against the public register.
- **Customer creation is manual.** Shopify's passwordless New Customer Accounts blocks `{% form 'create_customer' %}` and the Storefront API `customerCreate` mutation. The brief explicitly permits documented workarounds — manual admin creation after reviewing the application email is the cleanest answer.
- **No themed rejected-state page.** Rejected applicants are emailed manually with the reason; no customer record is created.
- **Demo customer accounts** (one `pending`, one `approved`) are pre-seeded so reviewers can sign in to each state without admin work.

## Reference

Two Face Aesthetics UK is used as a functional reference for ecommerce structure and practitioner gating UX. The prototype aims to improve on it with a cleaner, more clinical, pharmacy-led feel.
