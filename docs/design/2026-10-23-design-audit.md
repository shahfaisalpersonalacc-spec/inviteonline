# InviteOnline design audit and QA (2026-10-23)

## 1. Research
The full notes are in the cross-project research cache (`digital-invitation-landing-patterns.md`). All pages were fetched as text, so layout is inferred from markup, not seen.

| Reference | Status | What we adopted |
|---|---|---|
| Paperless Post | inspected | Occasion-first entry (our event-type grid). Product visuals instead of stock photos. Trust from product facts, no invented ratings. |
| Joy (withjoy) | inspected | One dominant CTA with a weaker secondary. A consistent feature pattern (icon, name, one-line benefit). The page ends by repeating the promise and CTA. |
| Zola | inspected | Benefit-led copy beside product mockups. **Skip-to-content link** and visible accessibility hygiene. |
| Evite | inspected | Product designs as the hero (our live phone and entrance gallery). "Free" and "no app for guests" stated early. FAQ at the end. |
| Awwwards (wedding) | inspected | Names and awards only, no design detail. Mostly photography and venue sites, so little that applies. |
| SiteInspire | inspected | The listing loaded, but with no per-site detail. |
| Land-book, Lapa Ninja, Greenvelope, Minted, Behance, Dribbble | **blocked (403 or empty)** | Not reviewed. |
| Pinterest, Mobbin | not attempted | Both need a login, so they can't be reviewed with automated tools. |

## 2. Inventory
**Pages:**
- `/` landing
- `/login`, `/register`, `/forgot-password`, `/reset-password/[token]`
- `/dashboard`, `/dashboard/new`, `/dashboard/profile`, `/dashboard/[id]/guests`, `/dashboard/edit/[id]`
- `/i/[slug]` public invitation (8 entrances, 21 section types, light and dark)
- invitation 404, site 404

**Shared components:**
- Navbar, Footer, AuthShell, Logo
- Modal, Toast, PasswordInput
- ShareSheet
- InvitationRenderer and its sections, PageChrome (top nav, tab bar, footer)
- EntryScreen (envelopes, gatefold, doors)
- The editor panels

## 3. Design direction
The brand comes from the InviteOnline logo:
- **Colours:** ink `#1C1A3D`, coral `#E8544A`, gold `#F5C451`, cream `#FFF8F1`.
- **Type:** Plus Jakarta Sans for the UI, Cormorant Garamond for editorial accents, Great Vibes for script.
- **Invitations:** each one is themed separately (12 presets × light/dark).
- **Tokens:** in `frontend/src/app/globals.css` (`@theme`). Invitation tokens are the `--inv-*` CSS variables.

## 4. Issues found and fixed in this pass
| Issue | Viewports | Fix |
|---|---|---|
| Unknown URLs showed the unstyled Next.js 404 | all | Branded `app/not-found.js` |
| Floating "+" covered content on Profile and Guests (the password "Show" button) | phones | Floating button shown on `/dashboard` only |
| Duplicate "New invitation" buttons on the dashboard | ≥640px | The page-level button was removed. The header (≥640px) or the floating button (phones) remains. |
| Dashboard card actions wrapped ("Delete" alone on a line) | 320px | A single row of 4 actions, icon above label below 380px |
| "Wishes (1)" tab label wrapped | 768px | `whitespace-nowrap` |
| 12 tall feature cards made the phone homepage very long (~3,300px) | phones | Compact icon-beside-text rows below 640px (about half the height) |
| Entrance colour dots wrapped (8th dot alone) | 320px | Smaller dots and gaps below 640px |
| No visible keyboard focus | all | Global `:focus-visible` ring |
| No skip link | all | "Skip to content" link targeting `#main` on each layout |
| Dialogs didn't take, trap or restore focus | all | Modal now focuses inside, traps Tab, closes on Esc, and restores focus |
| Mobile menu didn't close on Esc; no `aria-controls` | phones | Added both |
| Small coral text was 3.4:1 on cream (fails AA) | all | `brand-600` darkened to `#C93A31` (4.83:1 on cream) and used for all small coral text |
| Motion ignored reduced-motion preferences site-wide | all | A global `prefers-reduced-motion` rule. Entrances already open instantly in that mode. |

## 5. QA evidence (Playwright, real dev server, Atlas database)
- **Coverage:** 16 pages × 7 viewports (320×568, 375×812, 430×932, 768×1024, 1024×768, 1440×900, 1920×1080) = **112 combinations**, run before and after the fixes.
- **Horizontal overflow:** 0px on all 112.
- **Console and network:** the only errors are the intended 404 responses, and a prefetch cancelled by the logged-in redirect on login/register.
- **Keyboard (8/8 pass):**
  - The skip link appears and jumps to `#main`.
  - The focus ring is visible.
  - The mobile menu opens and Esc closes it.
  - The share dialog takes focus, traps Tab (25 presses), and Esc closes it and returns focus.
- **Earlier passes this week:**
  - Tab-bar scroll-spy checked for flicker (0 back-and-forth on the public page and editor preview).
  - Door and envelope entrances, scratch card and RSVP form checked at phone and desktop sizes.
- **Builds:** `next build` passes. Backend tests: 12/12.

## 6. Known limitations
- **Fade-in sections in full-page screenshots:** they appear blank only when the page is jumped through programmatically. With real scrolling they are visible, which was verified.
- **No legal pages:** the project has no Terms or Privacy pages, so the footer doesn't link to any. Add them before a public launch.
- **No testimonials, ratings or customer logos:** these were deliberately left out because no verified ones exist.
- **Doors are illustrated:** they're drawn in SVG/CSS, not photographed. A photo-based door needs licensed assets.
- **Remaining lint warnings:** `react-hooks/set-state-in-effect` warnings remain for hydration-safe reads of localStorage/sessionStorage on mount. They are intentional.
