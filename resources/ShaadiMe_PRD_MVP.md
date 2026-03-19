**ShaadiMe**

Product Requirements Document

**MVP — Landing Page**

*Version 1.0 | March 2026 | Confidential*

# **1. About ShaadiMe**

ShaadiMe is India's premier end-to-end wedding planning platform, built to take the stress out of every shaadi and put the joy back in. From the moment a couple gets engaged to the last song at the reception, ShaadiMe curates, connects, and celebrates every step of their journey.

We bridge couples with the best vendors, venues, photographers, decorators, and shopping destinations across India — all in one place. With a deep understanding of Indian wedding culture and its beautiful diversity across regions, communities, and traditions, ShaadiMe is not just a marketplace. It is a trusted companion for one of life's most significant moments.

Our mission is simple: make every Indian wedding unforgettable, stress-free, and personal.

|                   |                                     |
| ----------------- | ----------------------------------- |
| **Product**       | ShaadiMe MVP Landing Page           |
| **Version**       | 1.0                                 |
| **Document Type** | Product Requirements Document (PRD) |
| **Status**        | In Review                           |
| **Date**          | March 2026                          |
| **Audience**      | Tech Team, Design Team, Founders    |

# **2. Purpose & Scope**

This document defines the full product requirements for the ShaadiMe MVP — a public-facing landing page that introduces ShaadiMe to prospective couples, captures planning leads, and showcases the brand's vision. The MVP is the first touchpoint for couples discovering ShaadiMe online.

This PRD is intended as a reference for all engineers, designers, and stakeholders working on the initial prototype and must be read in full before any development begins.

## **2.1 Goals**

* Establish ShaadiMe's brand presence online with a beautiful, trustworthy landing page.
* Drive user interest through engaging visuals — real wedding photos and videos featuring the ShaadiMe brand.
* Capture high-intent leads via a structured wedding planning intake form.
* Tease upcoming features (wedding shopping: sarees, jewellery) to build anticipation.
* Communicate ShaadiMe's unique value proposition to Indian couples.

## **2.2 Out of Scope (MVP)**

* User accounts or authentication.
* Payment or booking flows.
* Vendor or venue listings.
* Wedding shopping catalogue (listed as 'Launching Soon').
* Mobile app.

# **3. Page Structure & Sections**

The MVP consists of a single-page experience (SPA) with the following sections rendered in order, top to bottom:

|       |                      |                                                                                                                                   |
| ----- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **#** | **Section**          | **Description**                                                                                                                   |
| **1** | **Hero Section**     | Full-width banner with tagline, CTA button (Start Planning), and AI-enhanced wedding imagery with ShaadiMe logo/banners overlaid. |
| **2** | **Wedding Gallery**  | Photo and video grid showcasing real/curated weddings with ShaadiMe branding placed via AI.                                       |
| **3** | **Why ShaadiMe**     | Value proposition section — why ShaadiMe is India's best wedding planning partner for couples.                                    |
| **4** | **Wedding Shopping** | 'Launching Soon' teaser for sarees and jewellery shopping.                                                                        |

# **4. Feature Specifications**

## **4.1 Hero Section**

The Hero is the first thing a visitor sees. It must instantly communicate ShaadiMe's brand identity — warm, celebratory, and deeply Indian.

**Content & Layout**

* Full-width background featuring a high-quality wedding photograph or a cinematic loop video of a wedding ceremony.
* ShaadiMe logo prominently placed top-left or top-center.
* Tagline text centered on the hero — example: 'Your Dream Wedding, Beautifully Planned.'
* Primary CTA button: 'Start Planning' — coral red (#ff5757) with white text, rounded corners, hover animation.
* The hero image/video must include ShaadiMe logo banners placed into wedding scenes using AI (e.g. on mandap backdrops, entrance arches, or floral displays).

**AI Banner Integration**

* Use AI image editing/generation to composite the ShaadiMe logo or branded banners naturally into wedding photos.
* Banners should appear in realistic positions: mandap backdrop, venue entrance, photo wall.
* Result should feel organic — not like a watermark.

**'Start Planning' CTA — User Flow**

When a user clicks 'Start Planning', a multi-step intake form is presented. This form is the lead capture mechanism for the MVP. The steps are:

|          |                         |                                                                                                                     |
| -------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Step** | **Field**               | **Details**                                                                                                         |
| **1**    | **Names**               | Bride's name and Groom's name (two separate text fields). Required.                                                 |
| **2**    | **Phone Number**        | 10-digit Indian mobile number. Required. Used for team follow-up.                                                   |
| **3**    | **Wedding Date**        | Date picker. Required. Allows approximate date or 'Not decided yet'.                                                |
| **4**    | **Location**            | City/venue preference. Free text or dropdown of major cities. Required.                                             |
| **5**    | **Food Preference**     | Toggle/radio: Veg / Non-Veg. Required.                                                                              |
| **6**    | **Budget**              | Dropdown ranges, e.g. Under ₹5L / ₹5L–₹15L / ₹15L–₹30L / ₹30L+. Required.                                           |
| **7**    | **Confirmation Screen** | Full-page confirmation: 'The ShaadiMe team will get in touch with you soon 💍'. Already exists in current prototype. |

Note: The confirmation screen ('The ShaadiMe team will get in touch with you soon') is already present in the current prototype. This screen must remain as-is and should not be redesigned for the MVP.

## **4.2 Wedding Gallery Section**

Placed directly below the Hero section, the Gallery brings the magic of real weddings to life and reinforces the ShaadiMe brand visually.

**Content**

* A mixed grid of high-quality wedding photographs and short wedding highlight videos.
* All media must have ShaadiMe branding elements (banners, logo overlays) placed naturally using AI — consistent with the hero section treatment.
* Minimum 6 photos and 2 videos for the MVP.
* Media should reflect diversity: different regions, traditions, and wedding styles across India.

**Layout**

* Masonry or Pinterest-style grid layout recommended.
* Videos autoplay muted on hover; click to unmute.
* Subtle hover effect on photos (slight zoom + shadow).
* Section heading: 'Weddings We've Loved' or similar warm, brand-aligned copy.

**AI Banner Placement Guidelines**

* ShaadiMe banners should appear on: mandap backdrops, venue entrance arches, floral walls, and signage boards.
* Use consistent branding: ShaadiMe wordmark in textured plum (#4b1248) or coral red (#ff5757) on pink champagne (#fad6d6) backgrounds.
* Avoid placing banners on faces, floral arrangements, or in ways that obscure the couple.

## **4.3 Why ShaadiMe — Value Proposition Section**

This section communicates why ShaadiMe is the best wedding planning partner in India. It must feel authoritative, warm, and relatable — not generic.

**Suggested Content Pillars**

* End-to-End Planning — From engagement to reception, we handle every detail.
* Trusted Vendors — Curated network of verified vendors across India.
* Personalised Experience — Every wedding is unique; your plan should be too.
* Made for Indian Weddings — Deep understanding of regional traditions and customs.
* Budget-Friendly Options — Beautiful weddings at every budget.

**Layout**

* Card-based or icon+text layout with 4–6 cards.
* Each card: icon, short heading (2–4 words), and 1–2 sentence description.
* Warm colour palette: textured plum (#4b1248) background, pink champagne (#fad6d6) and coral red (#ff5757) accents.

## **4.4 Wedding Shopping — Launching Soon Section**

This section teases ShaadiMe's upcoming wedding shopping catalogue to build anticipation and email/interest capture from early visitors.

**Categories to Feature**

* Bridal Sarees — Curated bridal sarees from across India.
* Jewellery — Bridal jewellery sets, maang tikka, bangles, and more.

**Design & Copy**

* Large, beautiful product-style imagery (placeholder/stock for MVP).
* Bold 'Launching Soon' badge on each category card.
* Optional: 'Notify Me' button or email capture field for early access.
* Copy should be aspirational: 'Your bridal look, curated for you.'

# **5. Design Guidelines**

## **5.1 Brand Identity**

| **Primary Colour**   | Textured Plum — #4B1248                       |
| **Secondary Colour** | Pink Champagne — #FAD6D6                      |
| **Accent Colour**    | Coral Red — #FF5757                           |
| **Tone**             | Deep, celebratory, premium, and festive       |

## **5.2 Responsive Design**

* Desktop-first design, with full mobile responsiveness required.
* All CTAs must be tappable on mobile (min 44px height).
* Videos must be optimised for mobile bandwidth.

## **5.3 Performance**

* Page load target: under 3 seconds on 4G.
* Images must be served in WebP format and lazy-loaded below the fold.
* Videos must use compressed MP4 and only autoplay muted.

# **6. Current Prototype — Reference Notes**

A working prototype already exists. The following elements from the prototype must be preserved as-is in the MVP build:

* 'Start Planning' CTA button on the Hero section — label, position, and behaviour.
* Multi-step form flow capturing couple details, phone number, wedding date, location, food preference, and budget.
* Confirmation screen: 'The ShaadiMe team will get in touch with you soon 💍' — this screen is final and should not be modified.

All new sections (Gallery, Why ShaadiMe, Wedding Shopping) are net-new additions to be built alongside the existing prototype elements.

# **7. Acceptance Criteria**

The MVP is considered complete and ready for review when all of the following conditions are met:

|                  |                                                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------- |
| **Hero Section** | Full-width hero with ShaadiMe logo, tagline, and 'Start Planning' CTA rendered correctly on desktop and mobile. |

|                |                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| **AI Banners** | At least 3 wedding images with ShaadiMe logo/banner placed naturally using AI, visible in hero and gallery. |

|                   |                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------- |
| **Planning Form** | All 6 form fields (names, phone, date, location, food, budget) functional and validated. |

|                         |                                                                        |
| ----------------------- | ---------------------------------------------------------------------- |
| **Confirmation Screen** | Displays correctly after form submission with existing prototype copy. |

|             |                                                                                |
| ----------- | ------------------------------------------------------------------------------ |
| **Gallery** | Minimum 6 photos and 2 videos with ShaadiMe branding displayed in grid layout. |

|                  |                                                                    |
| ---------------- | ------------------------------------------------------------------ |
| **Why ShaadiMe** | Section with minimum 4 value proposition cards rendered correctly. |

|                      |                                                                               |
| -------------------- | ----------------------------------------------------------------------------- |
| **Shopping Section** | 'Launching Soon' cards for Sarees and Jewellery visible with correct badging. |

|                |                                                                       |
| -------------- | --------------------------------------------------------------------- |
| **Responsive** | All sections render correctly on mobile (375px) and desktop (1440px). |

|                 |                                                |
| --------------- | ---------------------------------------------- |
| **Performance** | Lighthouse performance score >= 80 on desktop. |

# **8. Open Questions & Decisions Pending**

* Will the wedding gallery use real ShaadiMe client weddings or stock photography for the MVP?
* Who owns the AI banner/logo compositing workflow — design team or a third-party tool?
* Should the 'Notify Me' button on the shopping section capture emails to a waitlist?
* Is a CMS required for the gallery, or will images be hardcoded for MVP?
* What analytics tool will be used to track form completions and CTA clicks?

# **9. Suggested MVP Timeline**

|              |                                      |                                                  |
| ------------ | ------------------------------------ | ------------------------------------------------ |
| **Phase**    | **Task**                             | **Notes**                                        |
| **Week 1**   | **Design — Wireframes & Mockups**    | Hero, Gallery, Why ShaadiMe, Shopping sections   |
| **Week 1–2** | **AI Banner Creation**               | Composite ShaadiMe branding into wedding imagery |
| **Week 2–3** | **Development — Hero + Form**        | Build hero section and full planning form flow   |
| **Week 3**   | **Development — Remaining Sections** | Gallery, Why ShaadiMe, Shopping Teaser           |
| **Week 4**   | **QA & Responsive Testing**          | Test on mobile, tablet, desktop. Fix bugs.       |
| **Week 4**   | **Launch**                           | Deploy MVP for review and stakeholder sign-off   |

*ShaadiMe — Confidential | MVP PRD v1.0 | March 2026*

*This document is intended for internal use only. Do not distribute outside the ShaadiMe team.*