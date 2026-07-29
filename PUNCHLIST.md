# ARKON Website Punchlist

## Privacy, legal, and advertising readiness

- [ ] Confirm the exact legal entity operating ARKON Systems and the public mailing address to use for advertiser verification and legal notices.
- [x] Use `privacy@arkonsysai.com` as the public privacy and data-request contact.
- [x] Add dedicated Privacy & Cookies, Terms of Use, Data Security, and Contact pages.
- [x] Add a cookie-consent banner with Accept all, Reject nonessential, and Manage settings.
- [x] Add Google Consent Mode v2 with analytics and advertising storage denied by default.
- [x] Add permanent legal, privacy, Cookie settings, and Your privacy choices links in the footer.
- [x] Add explicit request-specific contact consent to the demo form and record the consent timestamp and policy version in the lead email.
- [ ] Complete Google Ads advertiser verification using the exact legal or registered business name supported by business documents.
- [ ] Configure any future Meta Pixel or Google Ads conversion tag to load only when the visitor grants advertising consent.

## SEO and launch cleanup

- [x] Canonicalize the site on `https://www.arkonsysai.com`.
- [x] Add unique route metadata, sitemap, robots.txt, redirects, and true noindex 404 handling.
- [x] Add breadcrumbs, internal links, and structured data.
- [x] Add social-sharing metadata and image.
- [x] Add the ARKON favicon.
- [x] Add GA4 page-view and demo-conversion tracking.
- [x] Verify the root-domain property in Google Search Console.
- [x] Submit `https://www.arkonsysai.com/sitemap.xml` in Search Console. Search Console reported `Success` on July 28, 2026, with all 12 public pages discovered.
- [x] Request indexing for all 12 public routes. The daily limit was reached after submitting `https://www.arkonsysai.com/gyms-fitness-studios`, the final route.
- [ ] Recheck the Search Console page-indexing report after Google finishes processing the initial data. Search Console requested a return visit in one or two days.
- [x] Add a complete site footer across all public pages. Completed in PR #16.
- [x] Remove the runtime DOM cleanup hooks from the production bundle, remove Porter from public homepage/how-it-works copy, and remove duplicate industry-page and client-SEO sources from the generated homepage bundle. Completed in PR #10, merge commit `019c8384c6a03dbd5e6930643c3ff26a14de4329`.
