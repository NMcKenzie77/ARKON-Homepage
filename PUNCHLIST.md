# ARKON Website Punchlist

## Deferred privacy and consent work

- [ ] Confirm the exact legal entity operating ARKON Systems.
- [ ] Use `privacy@arkonsysai.com` as the public privacy and data-request contact.
- [ ] Add a Privacy & Cookies page.
- [ ] Add a cookie-consent banner with Accept, Reject nonessential, and Manage settings.
- [ ] Add Google Consent Mode v2 and keep analytics storage denied until consent where required.
- [ ] Add permanent Privacy & Cookies and Cookie settings links in the footer.

## SEO and launch cleanup

- [x] Canonicalize the site on `https://www.arkonsysai.com`.
- [x] Add unique route metadata, sitemap, robots.txt, redirects, and true noindex 404 handling.
- [x] Add breadcrumbs, internal links, and structured data.
- [x] Add social-sharing metadata and image.
- [x] Add the ARKON favicon.
- [x] Add GA4 page-view and demo-conversion tracking.
- [x] Verify the root-domain property in Google Search Console.
- [x] Submit `https://www.arkonsysai.com/sitemap.xml` in Search Console. The XML is publicly accessible; Search Console initially reported `Couldn't fetch` and should be rechecked after Google retries.
- [x] Request indexing for all 12 public routes. The daily limit was reached after submitting `https://www.arkonsysai.com/gyms-fitness-studios`, the final route.
- [ ] Recheck Search Console sitemap and indexing status after Google has had time to process the requests.
- [ ] Add a complete site footer across all public pages.
- [x] Remove the runtime DOM cleanup hooks from the production bundle, remove Porter from public homepage/how-it-works copy, and remove duplicate industry-page and client-SEO sources from the generated homepage bundle. Completed in PR #10, merge commit `019c8384c6a03dbd5e6930643c3ff26a14de4329`.
