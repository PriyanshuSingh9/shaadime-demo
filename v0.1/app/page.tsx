"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { LandingPage } from "@/components/shaadime/landing-page";
import { GeneratingScreen } from "@/components/shaadime/generating-screen";
import { Dashboard } from "@/components/shaadime/dashboard";
import type { GenerateReportRequest, ReportData } from "@/lib/types/report";

type Stage = "landing" | "generating" | "dashboard";

export default function Page() {
  const [stage, setStage] = useState<Stage>("landing");
  const [genRequest, setGenRequest] = useState<GenerateReportRequest | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);

  const handleFormSubmit = useCallback((form: any) => {
    // Save all form fields to the database (fire-and-forget)
    const inquiryPayload = {
      p1name: form.p1name,
      p2name: form.p2name,
      email: form.email ?? "",
      phone: form.phone ?? "",
      community: form.community,
      city: form.city,
      weddingDate: form.weddingDate,
      guests: form.guests,
      venueType: form.venueType ?? "",
      budget: form.budget,
      styles: [...(form.styles as Set<string>)],
      services: [...(form.services as Set<string>)],
      events: (form.events ?? []).map(({ type, name, daysBefore, included }: any) => ({
        type, name, daysBefore, included,
      })),
      notes: form.notes ?? "",
      referral: form.referral ?? "",
    };

    fetch("/api/save-inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiryPayload),
    }).catch((err) => console.error("[save-inquiry]", err));

    // Build report request (subset of form data) and proceed
    const req: GenerateReportRequest = {
      p1name: form.p1name,
      p2name: form.p2name,
      community: form.community,
      city: form.city,
      weddingDate: form.weddingDate,
      guests: form.guests,
      budget: form.budget,
      styles: [...(form.styles as Set<string>)],
      services: [...(form.services as Set<string>)],
      events: (form.events ?? [])
        .filter((e: any) => e.included)
        .map(({ type, name, daysBefore, included }: any) => ({
          type, name, daysBefore, included,
        })),
      notes: form.notes ?? "",
    };
    setGenRequest(req);
    setStage("generating");
  }, []);

  return (
    <>
      {/* Landing page — always mounted so it never loses scroll position */}
      <div style={{ display: stage === "landing" ? "block" : "none" }}>
        <LandingPage onFormSubmit={handleFormSubmit} />
      </div>

      <AnimatePresence>
        {stage === "generating" && genRequest && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GeneratingScreen
              request={genRequest}
              onComplete={(r) => { setReport(r); setStage("dashboard"); }}
              onError={(msg) => { console.error("[report]", msg); setStage("landing"); }}
            />
          </motion.div>
        )}

        {stage === "dashboard" && report && genRequest && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Dashboard
              report={report}
              request={genRequest}
              onBack={() => setStage("landing")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}