// app/api/generate-report/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// POST /api/generate-report
//
// Receives the wedding profile from the onboarding form, constructs a
// structured prompt, calls Gemini, validates the response, and returns
// typed ReportData JSON.
//
// Dependencies:
//   npm install @google/generative-ai
//
// Env:
//   GEMINI_API_KEY — set in .env.local, never exposed to the client
// ─────────────────────────────────────────────────────────────────────────────

import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import type { GenerateReportRequest, ReportData } from "@/lib/types/report";

// ── Groq client (server-only) ─────────────────────────────────────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

// ── Budget helpers ────────────────────────────────────────────────────────────

function budgetInRupees(lakhs: number): number {
  return lakhs * 100_000;
}

function formatRupees(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(1)} Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

// ── Community → typical event budget fractions ────────────────────────────────
// Based on community_event_templates.typical_budget_fraction defaults.
// These inform the prompt so Gemini distributes budget realistically.

const BUDGET_FRACTIONS: Record<string, Record<string, number>> = {
  Punjabi: { roka: 0.02, engagement: 0.04, mehendi: 0.06, haldi: 0.03, sangeet: 0.18, wedding: 0.45, reception: 0.22 },
  Telugu: { engagement: 0.05, mehendi: 0.05, haldi: 0.04, nalangu: 0.03, wedding: 0.55, reception: 0.28 },
  Tamil: { engagement: 0.05, naandi: 0.04, wedding: 0.58, reception: 0.33 },
  Kannada: { engagement: 0.05, mehendi: 0.05, haldi: 0.04, sangeet: 0.15, wedding: 0.48, reception: 0.23 },
  Malayali: { engagement: 0.05, mehendi: 0.05, wedding: 0.58, reception: 0.32 },
  Marathi: { engagement: 0.04, mehendi: 0.05, haldi: 0.04, sangeet: 0.16, wedding: 0.48, reception: 0.23 },
  Gujarati: { engagement: 0.04, garba: 0.12, mehendi: 0.05, haldi: 0.04, wedding: 0.48, reception: 0.27 },
  Bengali: { engagement: 0.04, aiburobhat: 0.03, haldi: 0.05, wedding: 0.55, reception: 0.33 },
  Rajasthani: { engagement: 0.04, mehendi: 0.06, haldi: 0.04, sangeet: 0.17, wedding: 0.46, reception: 0.23 },
  Marwari: { engagement: 0.04, mehendi: 0.06, haldi: 0.04, sangeet: 0.17, wedding: 0.46, reception: 0.23 },
  Muslim: { mehendi: 0.08, haldi: 0.05, nikah: 0.55, walima: 0.32 },
  Christian: { engagement: 0.05, bridal: 0.04, rehearsal: 0.04, wedding: 0.52, reception: 0.35 },
  Other: { wedding: 0.65, reception: 0.35 },
};

// ── Prompt builder ────────────────────────────────────────────────────────────

function buildPrompt(req: GenerateReportRequest): string {
  const totalRupees = budgetInRupees(req.budget);
  const fractions = BUDGET_FRACTIONS[req.community] ?? BUDGET_FRACTIONS["Other"];
  const includedEvents = req.events.filter((e) => e.included);

  // Only include events — skip tiny pre-events like roka/naandi for vendor matching
  const vendorEvents = includedEvents.filter(
    (e) => !["roka", "naandi", "rehearsal", "aiburobhat"].includes(e.type)
  );

  return `
You are ShaadiMe's AI wedding planning assistant. Generate a compact wedding planning report as valid JSON.

PROFILE: ${req.p1name} & ${req.p2name}, ${req.community} wedding in ${req.city}.
Date: ${req.weddingDate || "TBD"}. Guests: ${req.guests}. Budget: ${formatRupees(totalRupees)}.
Styles: ${req.styles.join(", ") || "not specified"}.
Top priorities: ${req.services.slice(0, 4).join(", ") || "not specified"}.

EVENTS & BUDGETS:
${vendorEvents.map((e) => {
    const frac = fractions[e.type] ?? (1 / vendorEvents.length);
    const amt = Math.round(totalRupees * frac);
    return `${e.name}: ${formatRupees(amt)}`;
  }).join(", ")}

RULES — read carefully:
- Return ONLY raw JSON. No markdown, no backticks, no explanation.
- For each event: exactly 1 venue_suggestion and exactly 2 vendors (different categories).
- All string fields: maximum 12 words. No exceptions.
- note field: max 10 words, one specific insight.
- Vendors must be realistic for ${req.city} and priced for ${formatRupees(totalRupees)} total budget.
- match_score: integer 60-98 reflecting fit with this couple.
- id: lowercase slug e.g. "regal-gardens-hyderabad".

SCHEMA:
{
  "profile_summary": "max 25 words",
  "key_insights": ["max 12 words each — exactly 3 items"],
  "budget_total": ${totalRupees},
  "budget_breakdown": [
    {"event_name": "string", "amount": number, "percentage": number}
  ],
  "events": [
    {
      "type": "slug",
      "name": "display name",
      "event_date_label": "e.g. 2 days before wedding",
      "guest_count_estimate": number,
      "budget_allocated": number,
      "budget_note": "max 10 words",
      "key_consideration": "max 12 words",
      "planning_deadline": "max 8 words",
      "venue_suggestions": [
        {
          "id": "slug",
          "category": "Venue",
          "name": "string",
          "city": "${req.city}",
          "price_range": "e.g. ₹2L–4L",
          "price_min": number,
          "match_score": number,
          "specialisation": "max 6 words",
          "note": "max 10 words",
          "booking_lead_time": "max 6 words"
        }
      ],
      "vendors": [
        {
          "id": "slug",
          "category": "e.g. Photographer",
          "name": "string",
          "city": "${req.city}",
          "price_range": "e.g. ₹50K–80K",
          "price_min": number,
          "match_score": number,
          "specialisation": "max 6 words",
          "note": "max 10 words",
          "booking_lead_time": "max 6 words"
        }
      ]
    }
  ]
}

Generate for these events only: ${vendorEvents.map(e => e.name).join(", ")}.
`.trim();
}

// ── API route handler ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body: GenerateReportRequest = await req.json();

    if (!body.community || !body.city) {
      return NextResponse.json(
        { error: "Missing required fields: community and city" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(body);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 8192,
      response_format: { type: "json_object" },  // enforces JSON output
    });

    const raw = completion.choices[0].message.content ?? "";

    // ── Parse and validate ────────────────────────────────────────────────────
    let report: ReportData;
    try {
      report = JSON.parse(raw);
    } catch {
      // Log first/last 300 chars to diagnose truncation or formatting issues
      console.error("[generate-report] parse failed. raw start:", raw.slice(0, 300));
      console.error("[generate-report] raw end:", raw.slice(-300));
      // Strip markdown fences if Gemini ignored responseMimeType
      const stripped = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      report = JSON.parse(stripped);
    }

    // Stamp with generation time
    report.generated_at = new Date().toISOString();

    return NextResponse.json(report);

  } catch (error) {
    console.error("[generate-report]", error);
    return NextResponse.json(
      { error: "Report generation failed. Please try again." },
      { status: 500 }
    );
  }
}