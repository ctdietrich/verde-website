# Verde build status — September 21, 2026

179 review pages are built: ten core pages, thirteen service pages and 156 city/service pages. Preview indexing remains disabled. The Squarespace site and DNS have not been changed.

## Gallery and editorial review

All four case-study galleries and the commercial gallery use uniform 4:3 image frames with proportional cropping. Each image links to the full, uncropped source in a new tab. Project cards also use a consistent 4:3 frame. Case-study hero images retain their native proportions. Portrait crop positions were reviewed on a contact sheet, with individual adjustments for people, entrances, trees and the pool courtyard.

Corrected the commercial turf photo caption, which had called a visible recreation surface a dog park. Simplified selected case-study wording. General service pages now name the service and Central Texas in their title and H1, with editorial taglines separate. City pages introduce the specific service rather than a generic construction sentence. Descriptions are shorter and relevant service pages link to genuine project examples.

Shared layout refinements include consistent caption spacing, more restrained case-study subheads, mobile contact navigation, current-section navigation markers, appropriate heading levels on portfolio cards, and full-width image sizing hints for case-study heroes. Preferred timeline remains aligned with Project type, without the optional label.

## Verification and limits

Build checks pass for all 179 pages and 65 referenced image files: local links, unique metadata and local paragraphs, JSON-LD, image integrity and preview noindex configuration. These are build checks, not a measured Core Web Vitals score. Crop contact-sheet review is complete; browser verification of this new deployed build is not yet complete. Browser access to the deployment diagnostic was blocked during this pass.

GitHub main is the Hostinger source. Publication to the temporary preview depends on Hostinger deploying the latest commit; confirm its build-info.json release is 2026-09-21-gallery-editorial-review. Do not claim the public deployment is current until verified.

Remaining launch gates: contact form activation and delivery verification; final rendered desktop/mobile review; measured performance; current local-source/regulatory verification before indexing; old-site redirect mapping; explicit production launch approval. Contact form setup is documented in planning/contact-form-setup.md.

## Click-to-call and mobile review

Added a high-contrast call strip above the shared header on all 179 pages, using tel:+17373009848. Below 800px it stays at the top while scrolling and has a 48px touch target. Simplified the contact sidebar to Start a conversation followed by a prominent phone number. Navigation links have 44px mobile targets; form pairs stack below 600px.

The deployed contact page was inspected at 1363px: no horizontal overflow, input/select heights 50px, input fonts 16px. This environment does not expose viewport/device emulation, and the keyboard attempt did not open it, so a true mobile rendered check remains unverified. Responsive source rules were reviewed; do not describe this as a completed phone-device or performance audit. The preview inspected before pushing still showed the earlier contact text. Latest release marker: 2026-09-21-click-to-call.
