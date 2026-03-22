// ─────────────────────────────────────────────────────────────────────────────
// report.ts — shared types for the Gemini report pipeline
// ─────────────────────────────────────────────────────────────────────────────

export type VendorSuggestion = {
    id: string;                  // stable slug — used as React key + shortlist key
    category: string;            // "Mehendi Artist" | "Photographer" | "Decorator" etc.
    name: string;
    city: string;
    price_range: string;         // "₹8,000–15,000" — display only
    price_min: number;           // for budget calculations
    match_score: number;         // 0–100, derived by Gemini from profile fit
    specialisation: string;      // one-line expertise descriptor
    note: string;                // Gemini-generated insight for this vendor
    booking_lead_time: string;   // "Books 3 months in advance" — planning signal
    image_query: string;         // search term to use for a stock photo placeholder
};

export type EventReport = {
    type: string;                // matches CeremonyEvent.type slug
    name: string;                // display name — "Mehendi Night" / "Sangeet" etc.
    event_date_label: string;    // "2 days before wedding" — human readable
    guest_count_estimate: number;
    budget_allocated: number;    // in rupees
    budget_note: string;         // Gemini insight on this event's budget
    vendors: VendorSuggestion[];
    venue_suggestions: VendorSuggestion[];  // venues are separated — different card treatment
    planning_deadline: string;   // "Book by August 2026 — 6 weeks from now"
    key_consideration: string;   // single most important thing for this event
};

export type BudgetLine = {
    event_name: string;
    amount: number;
    percentage: number;
    note: string;
};

export type TimelineItem = {
    months_before: number;
    label: string;              // "6 months before wedding"
    tasks: string[];
};

export type ReportData = {
    profile_summary: string;          // 2–3 sentence Gemini narrative of who this couple is
    events: EventReport[];            // ordered chronologically
    budget_total: number;
    budget_breakdown: BudgetLine[];
    planning_timeline: TimelineItem[];
    key_insights: string[];           // 3–5 high-value observations specific to this profile
    generated_at: string;             // ISO timestamp
};

// ─── Request shape sent to the API route ─────────────────────────────────────

export type GenerateReportRequest = {
    p1name: string;
    p2name: string;
    community: string;
    city: string;
    weddingDate: string;        // ISO date string
    guests: string;             // guest count label from form
    budget: number;             // in lakhs (slider value)
    styles: string[];
    services: string[];         // priority services, in order
    events: {
        type: string;
        name: string;
        daysBefore: number;
        included: boolean;
    }[];
    notes: string;
};