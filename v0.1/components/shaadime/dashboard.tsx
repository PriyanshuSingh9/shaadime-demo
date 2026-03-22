"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { ReportData, EventReport, VendorSuggestion } from "@/lib/types/report";
import type { GenerateReportRequest } from "@/lib/types/report";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  report: ReportData;
  request: GenerateReportRequest;
  onBack?: () => void;
};

type ShortlistEntry = {
  vendor: VendorSuggestion;
  eventName: string;
  note: string;
};

type ShortlistMap = Record<string, ShortlistEntry>;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatRupees(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)}L`;
  if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(0)}K`;
  return `₹${amount}`;
}

function matchColor(score: number): string {
  if (score >= 85) return "#1D9E75";
  if (score >= 70) return "#C8762A";
  return "#888780";
}

function matchLabel(score: number): string {
  if (score >= 85) return "Strong match";
  if (score >= 70) return "Good match";
  return "Moderate match";
}

// ─────────────────────────────────────────────────────────────────────────────
// Match score ring
// ─────────────────────────────────────────────────────────────────────────────

function MatchRing({ score, size = 44 }: { score: number; size?: number }) {
  const r = size * 0.41;
  const cx = size / 2;
  const mc = matchColor(score);
  const circumference = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(181,148,58,0.12)" strokeWidth={size * 0.068} />
      <circle
        cx={cx} cy={cx} r={r}
        fill="none" stroke={mc}
        strokeWidth={size * 0.068}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - score / 100)}
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      <text
        x={cx} y={cx + size * 0.14}
        textAnchor="middle"
        fontSize={size * 0.25}
        fontWeight="500"
        fill={mc}
        fontFamily="'DM Sans', sans-serif"
      >
        {score}%
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Vendor card — clickable body opens drawer, separate shortlist button
// ─────────────────────────────────────────────────────────────────────────────

function VendorCard({
  vendor,
  shortlisted,
  onToggle,
  onClick,
}: {
  vendor: VendorSuggestion;
  shortlisted: boolean;
  onToggle: (v: VendorSuggestion) => void;
  onClick: (v: VendorSuggestion) => void;
}) {
  return (
    <motion.div
      className={`vc-card${shortlisted ? " vc-card--sl" : ""}`}
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button type="button" className="vc-body-btn" onClick={() => onClick(vendor)}>
        <div className="vc-header">
          <span className="vc-cat">{vendor.category}</span>
          <MatchRing score={vendor.match_score} size={38} />
        </div>
        <p className="vc-name">{vendor.name}</p>
        <p className="vc-city">{vendor.city}</p>
        <p className="vc-spec">{vendor.specialisation}</p>
        <p className="vc-note">{vendor.note}</p>
        <div className="vc-price-row">
          <span className="vc-price">{vendor.price_range}</span>
          <span className="vc-lead">{vendor.booking_lead_time}</span>
        </div>
        <p className="vc-view-hint">Tap to view details →</p>
      </button>
      <button
        type="button"
        className={`vc-sl-btn${shortlisted ? " active" : ""}`}
        onClick={(e) => { e.stopPropagation(); onToggle(vendor); }}
      >
        {shortlisted ? "✓ Shortlisted" : "+ Shortlist"}
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Vendor detail drawer — slides up from bottom
// ─────────────────────────────────────────────────────────────────────────────

function VendorDrawer({
  vendor,
  eventName,
  shortlisted,
  note,
  onToggle,
  onNoteChange,
  onClose,
}: {
  vendor: VendorSuggestion;
  eventName: string;
  shortlisted: boolean;
  note: string;
  onToggle: (v: VendorSuggestion) => void;
  onNoteChange: (id: string, note: string) => void;
  onClose: () => void;
}) {
  const mc = matchColor(vendor.match_score);
  return (
    <>
      <motion.div
        className="drw-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="drw-sheet"
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 300 }}
      >
        <div className="drw-handle" />
        <button type="button" className="drw-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Top */}
        <div className="drw-top">
          <div className="drw-badges">
            <span className="drw-cat">{vendor.category}</span>
            <span className="drw-event-pill">for {eventName}</span>
          </div>
          <h2 className="drw-name">{vendor.name}</h2>
          <p className="drw-city">{vendor.city}</p>
        </div>

        {/* Score + price */}
        <div className="drw-score-row">
          <div className="drw-score-cell">
            <MatchRing score={vendor.match_score} size={52} />
            <div>
              <p className="drw-match-label" style={{ color: mc }}>{matchLabel(vendor.match_score)}</p>
              <p className="drw-match-sub">for your wedding profile</p>
            </div>
          </div>
          <div className="drw-price-cell">
            <p className="drw-price">{vendor.price_range}</p>
            <p className="drw-lead">{vendor.booking_lead_time}</p>
          </div>
        </div>

        {/* Spec */}
        <div className="drw-section">
          <p className="drw-sec-lbl">Specialisation</p>
          <p className="drw-sec-body">{vendor.specialisation}</p>
        </div>

        {/* AI insight */}
        <div className="drw-section drw-insight">
          <span className="drw-orn">✦</span>
          <p className="drw-sec-body drw-insight-text">{vendor.note}</p>
        </div>

        {/* Notes */}
        <div className="drw-section">
          <p className="drw-sec-lbl">Your notes</p>
          <textarea
            className="drw-notes"
            rows={3}
            placeholder="Add a note — budget discussed, follow-up needed, questions to ask…"
            value={note}
            onChange={(e) => onNoteChange(vendor.id, e.target.value)}
          />
        </div>

        {/* CTA */}
        <button
          type="button"
          className={`drw-cta${shortlisted ? " active" : ""}`}
          onClick={() => onToggle(vendor)}
        >
          {shortlisted ? "✓ Remove from shortlist" : "+ Add to shortlist"}
        </button>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shortlist review panel — slides in from right
// ─────────────────────────────────────────────────────────────────────────────

function ShortlistPanel({
  entries,
  onRemove,
  onNoteChange,
  onClose,
}: {
  entries: ShortlistEntry[];
  onRemove: (id: string) => void;
  onNoteChange: (id: string, note: string) => void;
  onClose: () => void;
}) {
  const grouped = useMemo(() => {
    const map: Record<string, ShortlistEntry[]> = {};
    entries.forEach((e) => {
      if (!map[e.vendor.category]) map[e.vendor.category] = [];
      map[e.vendor.category].push(e);
    });
    return map;
  }, [entries]);

  return (
    <>
      <motion.div
        className="sp-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="sp-panel"
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 280 }}
      >
        <div className="sp-header">
          <div>
            <h2 className="sp-title">Your shortlist</h2>
            <p className="sp-sub">{entries.length} vendor{entries.length !== 1 ? "s" : ""} selected</p>
          </div>
          <button type="button" className="sp-close" onClick={onClose}>✕</button>
        </div>

        {entries.length === 0 ? (
          <div className="sp-empty">
            <p className="sp-empty-orn">✦</p>
            <p className="sp-empty-title">No vendors shortlisted yet</p>
            <p className="sp-empty-sub">Browse events and tap "+ Shortlist" on vendors you like.</p>
          </div>
        ) : (
          <div className="sp-body">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="sp-group">
                <p className="sp-group-lbl">{category}</p>
                {items.map(({ vendor, eventName, note }) => (
                  <div key={vendor.id} className="sp-item">
                    <div className="sp-item-row">
                      <div className="sp-item-info">
                        <p className="sp-item-name">{vendor.name}</p>
                        <p className="sp-item-meta">{vendor.city} · {eventName}</p>
                        <p className="sp-item-price">{vendor.price_range}</p>
                      </div>
                      <div className="sp-item-right">
                        <MatchRing score={vendor.match_score} size={34} />
                        <button type="button" className="sp-remove" onClick={() => onRemove(vendor.id)}>✕</button>
                      </div>
                    </div>
                    <textarea
                      className="sp-note"
                      rows={2}
                      placeholder="Add a note…"
                      value={note}
                      onChange={(e) => onNoteChange(vendor.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            ))}

            <div className="sp-cta-card">
              <p className="sp-cta-title">Ready to move forward?</p>
              <p className="sp-cta-sub">Share your shortlist with your ShaadiMe planner and they'll arrange vendor meetings.</p>
              <button type="button" className="sp-cta-btn">Send to my planner →</button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Browse all — every vendor across events, filterable by category
// ─────────────────────────────────────────────────────────────────────────────

function BrowseAllTab({
  report,
  shortlist,
  onToggle,
  onView,
}: {
  report: ReportData;
  shortlist: ShortlistMap;
  onToggle: (v: VendorSuggestion, eventName: string) => void;
  onView: (v: VendorSuggestion, eventName: string) => void;
}) {
  const [cat, setCat] = useState("All");

  const all = useMemo(() => {
    const list: { vendor: VendorSuggestion; eventName: string }[] = [];
    (report.events ?? []).forEach((ev) => {
      (ev.venue_suggestions ?? []).forEach((v) => list.push({ vendor: v, eventName: ev.name }));
      (ev.vendors ?? []).forEach((v) => list.push({ vendor: v, eventName: ev.name }));
    });
    return list;
  }, [report]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(all.map((v) => v.vendor.category)))], [all]);
  const filtered = (cat === "All" ? all : all.filter((v) => v.vendor.category === cat))
    .sort((a, b) => b.vendor.match_score - a.vendor.match_score);

  return (
    <div className="ba-root">
      <div className="ba-filters">
        {categories.map((c) => (
          <button key={c} type="button" className={`ba-pill${cat === c ? " active" : ""}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <p className="ba-count">{filtered.length} vendor{filtered.length !== 1 ? "s" : ""}{cat !== "All" ? ` · ${cat}` : " across all events"} · sorted by match</p>
      <div className="ba-grid">
        {filtered.map(({ vendor, eventName }) => (
          <VendorCard
            key={`${vendor.id}-${eventName}`}
            vendor={vendor}
            shortlisted={!!shortlist[vendor.id]}
            onToggle={(v) => onToggle(v, eventName)}
            onClick={(v) => onView(v, eventName)}
          />
        ))}
      </div>
      {filtered.length === 0 && <p className="ba-empty">No vendors in this category.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Event panel
// ─────────────────────────────────────────────────────────────────────────────

function EventPanel({
  event,
  shortlist,
  onToggle,
  onView,
}: {
  event: EventReport;
  shortlist: ShortlistMap;
  onToggle: (v: VendorSuggestion, eventName: string) => void;
  onView: (v: VendorSuggestion, eventName: string) => void;
}) {
  return (
    <div className="ep-root">
      <div className="ep-header">
        <div>
          <h2 className="ep-name">{event.name}</h2>
          <p className="ep-meta">
            <span>{event.event_date_label}</span>
            <span className="ep-dot">·</span>
            <span>~{(event.guest_count_estimate ?? 0).toLocaleString("en-IN")} guests</span>
            <span className="ep-dot">·</span>
            <span className="ep-budget">{formatRupees(event.budget_allocated ?? 0)}</span>
          </p>
        </div>
        {event.planning_deadline && (
          <div className="ep-deadline">
            <span className="ep-dl-lbl">Book by</span>
            <span className="ep-dl-val">{event.planning_deadline}</span>
          </div>
        )}
      </div>

      {event.key_consideration && (
        <div className="ep-insight">
          <span className="ep-insight-orn">✦</span>
          <p className="ep-insight-text">{event.key_consideration}</p>
        </div>
      )}
      {event.budget_note && <p className="ep-budget-note">{event.budget_note}</p>}

      {(event.venue_suggestions?.length ?? 0) > 0 && (
        <div className="ep-section">
          <h3 className="ep-sec-title">Venues</h3>
          <div className="ep-grid">
            {event.venue_suggestions!.map((v) => (
              <VendorCard key={v.id} vendor={v}
                shortlisted={!!shortlist[v.id]}
                onToggle={(ven) => onToggle(ven, event.name)}
                onClick={(ven) => onView(ven, event.name)}
              />
            ))}
          </div>
        </div>
      )}
      {(event.vendors?.length ?? 0) > 0 && (
        <div className="ep-section">
          <h3 className="ep-sec-title">Vendors</h3>
          <div className="ep-grid">
            {event.vendors!.map((v) => (
              <VendorCard key={v.id} vendor={v}
                shortlisted={!!shortlist[v.id]}
                onToggle={(ven) => onToggle(ven, event.name)}
                onClick={(ven) => onView(ven, event.name)}
              />
            ))}
          </div>
        </div>
      )}
      {!event.venue_suggestions?.length && !event.vendors?.length && (
        <p className="ep-empty">Vendor suggestions for this event are being prepared.</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Budget + Timeline tabs (unchanged logic, safe null checks)
// ─────────────────────────────────────────────────────────────────────────────

function BudgetTab({ report }: { report: ReportData }) {
  return (
    <div className="bt-root">
      <div className="bt-total">
        <span className="bt-lbl">Total wedding budget</span>
        <span className="bt-val">{formatRupees(report.budget_total)}</span>
      </div>
      {(report.budget_breakdown ?? []).map((line) => (
        <div key={line.event_name} className="bt-line">
          <div className="bt-lh">
            <span className="bt-event">{line.event_name}</span>
            <span className="bt-amount">{formatRupees(line.amount)}</span>
            <span className="bt-pct">{line.percentage}%</span>
          </div>
          <div className="bt-track">
            <motion.div className="bt-fill"
              initial={{ width: 0 }}
              animate={{ width: `${line.percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineTab({ report }: { report: ReportData }) {
  const sorted = [...(report.planning_timeline ?? [])].sort((a, b) => b.months_before - a.months_before);
  if (!sorted.length) return (
    <div className="tl-root">
      <p style={{ fontSize: 13, color: "#888780", fontStyle: "italic" }}>
        Your planning timeline will appear after your planner reviews your profile.
      </p>
    </div>
  );
  return (
    <div className="tl-root">
      {sorted.map((item, i) => (
        <div key={i} className="tl-item">
          <div className="tl-dot-col">
            <div className="tl-dot" />
            {i < sorted.length - 1 && <div className="tl-line" />}
          </div>
          <div className="tl-content">
            <p className="tl-lbl">{item.label}</p>
            <ul className="tl-tasks">
              {(item.tasks ?? []).map((t, ti) => <li key={ti}>{t}</li>)}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export function Dashboard({ report, request, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<string>(report.events[0]?.type ?? "browse");
  const [shortlist, setShortlist] = useState<ShortlistMap>({});
  const [drawer, setDrawer] = useState<{ vendor: VendorSuggestion; eventName: string } | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const toggleShortlist = useCallback((vendor: VendorSuggestion, eventName: string) => {
    setShortlist((prev) => {
      if (prev[vendor.id]) { const n = { ...prev }; delete n[vendor.id]; return n; }
      return { ...prev, [vendor.id]: { vendor, eventName, note: "" } };
    });
  }, []);

  const updateNote = useCallback((id: string, note: string) => {
    setShortlist((prev) => prev[id] ? { ...prev, [id]: { ...prev[id], note } } : prev);
  }, []);

  const removeFromShortlist = useCallback((id: string) => {
    setShortlist((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }, []);

  const openDrawer = useCallback((vendor: VendorSuggestion, eventName: string) => {
    setDrawer({ vendor, eventName });
  }, []);

  const entries = useMemo(() => Object.values(shortlist), [shortlist]);
  const count   = entries.length;

  const drawerShortlisted = drawer ? !!shortlist[drawer.vendor.id] : false;
  const drawerNote        = drawer ? (shortlist[drawer.vendor.id]?.note ?? "") : "";

  const tabs = [
    ...report.events.map((e) => ({ key: e.type, label: e.name })),
    { key: "browse",   label: "Browse all" },
    { key: "budget",   label: "Budget" },
    { key: "timeline", label: "Timeline" },
  ];

  const activeEvent = report.events.find((e) => e.type === activeTab);

  return (
    <div className="db-root">
      {/* Top bar */}
      <div className="db-topbar">
        <div className="db-topbar-left">
            <div className="db-topbar-brand">
                <Image
                    src="/ShaadiMe_Logo.png"
                    alt="ShaadiMe"
                    width={110}
                    height={34}
                    priority
                    style={{ objectFit: 'contain' }}
                />
            </div>
        </div>
        
        <div className="db-topbar-center">
            <p className="db-couple">{request.p1name} &amp; {request.p2name}</p>
            <p className="db-meta">{request.community} wedding · {request.city}</p>
        </div>

        <div className="db-topbar-right">
            {onBack && (
                <button type="button" onClick={onBack} className="db-back-btn" style={{ marginLeft: "auto", marginRight: "16px" }}>
                    Back →
                </button>
            )}
            <button
            type="button"
            className={`db-sl-pill${count > 0 ? " active" : ""}`}
            onClick={() => setPanelOpen(true)}
            disabled={count === 0}
            >
            {count > 0 ? `${count} shortlisted` : "Shortlist"}
            </button>
        </div>
      </div>

      {/* Summary */}
      <div className="db-summary-wrap">
        {report.profile_summary && <p className="db-summary">{report.profile_summary}</p>}
        {(report.key_insights?.length ?? 0) > 0 && (
          <div className="db-chips">
            {(report.key_insights ?? []).map((ins, i) => (
              <div key={i} className="db-chip"><span className="db-chip-orn">✦</span><span>{ins}</span></div>
            ))}
          </div>
        )}
      </div>

      {/* Tab nav */}
      <div className="db-tabnav-wrap">
        <div className="db-tabnav">
          {tabs.map((t) => (
            <button key={t.key} type="button"
              className={`db-tab${activeTab === t.key ? " active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="db-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeEvent ? (
              <EventPanel event={activeEvent} shortlist={shortlist} onToggle={toggleShortlist} onView={openDrawer} />
            ) : activeTab === "browse" ? (
              <BrowseAllTab report={report} shortlist={shortlist} onToggle={toggleShortlist} onView={openDrawer} />
            ) : activeTab === "budget" ? (
              <BudgetTab report={report} />
            ) : (
              <TimelineTab report={report} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating shortlist pill */}
      <AnimatePresence>
        {count > 0 && (
          <motion.div className="db-float"
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.34, 1.36, 0.64, 1] }}
          >
            <p className="db-float-text"><strong>{count}</strong> vendor{count !== 1 ? "s" : ""} shortlisted</p>
            <button type="button" className="db-float-btn" onClick={() => setPanelOpen(true)}>Review shortlist →</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vendor detail drawer */}
      <AnimatePresence>
        {drawer && (
          <VendorDrawer
            vendor={drawer.vendor}
            eventName={drawer.eventName}
            shortlisted={drawerShortlisted}
            note={drawerNote}
            onToggle={(v) => toggleShortlist(v, drawer.eventName)}
            onNoteChange={updateNote}
            onClose={() => setDrawer(null)}
          />
        )}
      </AnimatePresence>

      {/* Shortlist panel */}
      <AnimatePresence>
        {panelOpen && (
          <ShortlistPanel
            entries={entries}
            onRemove={removeFromShortlist}
            onNoteChange={updateNote}
            onClose={() => setPanelOpen(false)}
          />
        )}
      </AnimatePresence>
      
      <style>{`
        
        .db-root{min-height:100vh;background:var(--background, #fdfaf9);font-family:inherit;padding-bottom:100px}
        .db-topbar{position:sticky;top:0;z-index:50;background:var(--purple-dark, #300b2e);backdrop-filter:blur(8px);border-bottom:1px solid rgba(229, 152, 155, 0.15);display:flex;align-items:center;justify-content:space-between;padding:12px 20px;gap:12px}
        .db-brand{display:flex;align-items:center;gap:6px;flex-shrink:0}
        .db-orn{color:var(--blush, #e5989b);font-size:11px}
        .db-brandname{font-family:inherit;font-size:15px;font-weight:400;letter-spacing:0.1em;color:var(--blush, #e5989b)}
        .db-center{text-align:center;flex:1;min-width:0}
        .db-couple{font-family:inherit;font-size:14px;color:var(--background, #fdfaf9);margin:0;font-style:italic;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .db-meta{font-size:10px;color:var(--text-muted, #7a5a78);margin:1px 0 0;letter-spacing:0.04em}
        .db-sl-pill{font-size:11px;font-weight:500;padding:5px 12px;border-radius:20px;background:rgba(255, 107, 107, 0.1);border:1px solid rgba(255, 107, 107, 0.25);color:var(--coral, #ff6b6b);cursor:pointer;white-space:nowrap;flex-shrink:0;transition:background .18s}
        .db-sl-pill.active{background:rgba(255, 107, 107, 0.18);border-color:rgba(255, 107, 107, 0.45)}
        .db-sl-pill:disabled{opacity:0.35;cursor:default}
        .db-summary-wrap{padding:18px 20px 0;max-width:720px;margin:0 auto}
        .db-summary{font-family:inherit;font-size:16px;color:var(--text-muted, #7a5a78);line-height:1.65;font-style:italic;margin:0 0 12px}
        .db-chips{display:flex;flex-wrap:wrap;gap:7px}
        .db-chip{display:flex;align-items:flex-start;gap:6px;font-size:11px;color:var(--text-muted, #7a5a78);background:var(--background, #fdfaf9);border:1px solid rgba(229, 152, 155, 0.2);border-radius:4px;padding:5px 9px;line-height:1.4}
        .db-chip-orn{color:var(--blush, #e5989b);flex-shrink:0;font-size:9px;margin-top:1px}
        .db-tabnav-wrap{position:sticky;top:53px;z-index:40;background:var(--background, #fdfaf9);border-bottom:1px solid rgba(229, 152, 155, 0.15);padding:0 20px;overflow-x:auto;scrollbar-width:none}
        .db-tabnav-wrap::-webkit-scrollbar{display:none}
        .db-tabnav{display:flex;max-width:720px;margin:0 auto}
        .db-tab{padding:13px 15px;font-size:11px;color:var(--text-muted, #7a5a78);background:transparent;border:none;border-bottom:2px solid transparent;cursor:pointer;white-space:nowrap;transition:color .2s,border-color .2s}
        .db-tab:hover{color:var(--text-muted, #7a5a78)}
        .db-tab.active{color:var(--purple-dark, #300b2e);font-weight:500;border-bottom-color:var(--coral, #ff6b6b)}
        .db-content{padding:20px;max-width:720px;margin:0 auto}
        /* Event panel */
        .ep-root{display:flex;flex-direction:column;gap:18px}
        .ep-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}
        .ep-name{font-family:inherit;font-size:24px;font-weight:400;color:var(--purple-dark, #300b2e);margin:0 0 4px}
        .ep-meta{font-size:11px;color:var(--text-muted, #7a5a78);margin:0;display:flex;align-items:center;gap:5px;flex-wrap:wrap}
        .ep-dot{opacity:0.35}
        .ep-budget{color:var(--coral, #ff6b6b);font-weight:500}
        .ep-deadline{text-align:right;flex-shrink:0}
        .ep-dl-lbl{display:block;font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted, #7a5a78);margin-bottom:2px}
        .ep-dl-val{display:block;font-size:11px;font-weight:500;color:var(--purple-dark, #300b2e)}
        .ep-insight{display:flex;gap:9px;align-items:flex-start;background:var(--purple-dark, #300b2e);border-radius:4px;padding:11px 13px}
        .ep-insight-orn{color:var(--blush, #e5989b);font-size:11px;flex-shrink:0;margin-top:1px}
        .ep-insight-text{font-size:12px;color:var(--blush, #e5989b);line-height:1.55;margin:0}
        .ep-budget-note{font-size:11px;color:var(--text-muted, #7a5a78);font-style:italic;margin:0}
        .ep-section{display:flex;flex-direction:column;gap:12px}
        .ep-sec-title{font-size:9px;font-weight:500;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted, #7a5a78);margin:0;padding-bottom:7px;border-bottom:1px solid rgba(229, 152, 155, 0.12)}
        .ep-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
        .ep-empty{font-size:12px;color:var(--text-muted, #7a5a78);font-style:italic}
        /* Vendor card */
        .vc-card{background:var(--background, #fdfaf9);border:1px solid rgba(229, 152, 155, 0.18);border-radius:8px;overflow:hidden;display:flex;flex-direction:column;transition:border-color .2s,box-shadow .2s}
        .vc-card:hover{border-color:rgba(255, 107, 107, 0.32);box-shadow:0 2px 14px rgba(255, 107, 107, 0.07)}
        .vc-card--sl{border-color:rgba(255, 107, 107, 0.45);background:var(--background, #fdfaf9)}
        .vc-body-btn{all:unset;cursor:pointer;padding:12px 12px 0;display:flex;flex-direction:column;gap:3px;width:100%;box-sizing:border-box}
        .vc-header{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}
        .vc-cat{font-size:9px;font-weight:500;text-transform:uppercase;letter-spacing:0.1em;color:var(--coral, #ff6b6b);padding-top:2px}
        .vc-name{font-family:inherit;font-size:15px;font-weight:400;color:var(--purple-dark, #300b2e);margin:2px 0 0;line-height:1.2}
        .vc-city{font-size:10px;color:var(--text-muted, #7a5a78);margin:0}
        .vc-spec{font-size:11px;color:var(--text-muted, #7a5a78);margin:0;font-weight:500}
        .vc-note{font-size:10px;color:var(--text-muted, #7a5a78);margin:0;line-height:1.45}
        .vc-price-row{display:flex;align-items:baseline;gap:6px;margin-top:4px}
        .vc-price{font-size:12px;font-weight:500;color:var(--purple-dark, #300b2e)}
        .vc-lead{font-size:9px;color:var(--text-muted, #7a5a78)}
        .vc-view-hint{font-size:9px;color:rgba(229, 152, 155, 0.6);margin:5px 0 0;letter-spacing:0.04em}
        .vc-sl-btn{margin:8px 12px 12px;padding:7px 0;border-radius:4px;border:1px solid rgba(255, 107, 107, 0.28);background:transparent;color:var(--coral, #ff6b6b);font-size:11px;font-weight:500;cursor:pointer;transition:background .18s,color .18s;text-align:center}
        .vc-sl-btn:hover{background:rgba(255, 107, 107, 0.07)}
        .vc-sl-btn.active{background:var(--purple-dark, #300b2e);border-color:var(--purple-dark, #300b2e);color:var(--blush, #e5989b)}
        /* Browse all */
        .ba-root{display:flex;flex-direction:column;gap:14px}
        .ba-filters{display:flex;gap:6px;flex-wrap:wrap}
        .ba-pill{font-size:11px;padding:5px 12px;border-radius:20px;border:1px solid rgba(229, 152, 155, 0.22);background:transparent;color:var(--text-muted, #7a5a78);cursor:pointer;transition:all .18s}
        .ba-pill:hover{background:var(--background, #fdfaf9);color:var(--text-muted, #7a5a78)}
        .ba-pill.active{background:var(--purple-dark, #300b2e);border-color:var(--purple-dark, #300b2e);color:var(--blush, #e5989b)}
        .ba-count{font-size:11px;color:var(--text-muted, #7a5a78);margin:0}
        .ba-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}
        .ba-empty{font-size:12px;color:var(--text-muted, #7a5a78);font-style:italic}
        /* Budget */
        .bt-root{display:flex;flex-direction:column;gap:14px}
        .bt-total{display:flex;align-items:baseline;gap:10px;padding-bottom:14px;border-bottom:1px solid rgba(229, 152, 155, 0.13)}
        .bt-lbl{font-size:11px;color:var(--text-muted, #7a5a78)}
        .bt-val{font-family:inherit;font-size:26px;color:var(--purple-dark, #300b2e)}
        .bt-line{display:flex;flex-direction:column;gap:5px}
        .bt-lh{display:flex;align-items:baseline;gap:8px}
        .bt-event{font-size:12px;font-weight:500;color:var(--purple-dark, #300b2e);flex:1}
        .bt-amount{font-size:12px;color:var(--coral, #ff6b6b);font-weight:500}
        .bt-pct{font-size:10px;color:var(--text-muted, #7a5a78)}
        .bt-track{height:4px;background:rgba(229, 152, 155, 0.1);border-radius:2px;overflow:hidden}
        .bt-fill{height:100%;background:linear-gradient(90deg,var(--coral, #ff6b6b),var(--blush, #e5989b));border-radius:2px}
        /* Timeline */
        .tl-root{display:flex;flex-direction:column}
        .tl-item{display:flex;gap:14px;padding-bottom:20px}
        .tl-dot-col{display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:18px}
        .tl-dot{width:9px;height:9px;border-radius:50%;background:var(--coral, #ff6b6b);border:2px solid var(--background, #fdfaf9);box-shadow:0 0 0 1.5px rgba(255, 107, 107, 0.3);flex-shrink:0}
        .tl-line{width:1px;flex:1;background:rgba(229, 152, 155, 0.18);margin-top:4px}
        .tl-content{flex:1;padding-top:1px}
        .tl-lbl{font-size:12px;font-weight:500;color:var(--purple-dark, #300b2e);margin:0 0 5px}
        .tl-tasks{margin:0;padding-left:14px;display:flex;flex-direction:column;gap:2px}
        .tl-tasks li{font-size:11px;color:var(--text-muted, #7a5a78);line-height:1.5}
        /* Float pill */
        .db-float{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--purple-dark, #300b2e);border:1px solid rgba(229, 152, 155, 0.22);border-radius:40px;padding:11px 18px;display:flex;align-items:center;gap:14px;box-shadow:0 8px 32px rgba(0,0,0,0.3);z-index:70;white-space:nowrap}
        .db-float-text{font-size:12px;color:var(--blush, #e5989b);margin:0}
        .db-float-text strong{color:var(--blush, #e5989b)}
        .db-float-btn{font-size:11px;font-weight:500;padding:6px 14px;border-radius:20px;background:var(--coral, #ff6b6b);border:none;color:var(--background, #fdfaf9);cursor:pointer;transition:background .18s}
        .db-float-btn:hover{background:var(--blush, #e5989b);color:var(--purple-dark, #300b2e)}
        /* Drawer */
        .drw-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:90}
        .drw-sheet{position:fixed;bottom:0;left:0;right:0;background:var(--background, #fdfaf9);border-radius:16px 16px 0 0;z-index:91;max-height:88vh;overflow-y:auto;padding:0 20px 36px}
        .drw-handle{width:36px;height:4px;background:rgba(229, 152, 155, 0.25);border-radius:2px;margin:10px auto 0}
        .drw-close{position:absolute;top:14px;right:16px;background:rgba(229, 152, 155, 0.1);border:none;border-radius:50%;width:28px;height:28px;font-size:11px;color:var(--text-muted, #7a5a78);cursor:pointer;display:flex;align-items:center;justify-content:center}
        .drw-top{padding-top:16px;padding-bottom:14px;border-bottom:1px solid rgba(229, 152, 155, 0.13)}
        .drw-badges{display:flex;gap:7px;align-items:center;margin-bottom:6px}
        .drw-cat{font-size:9px;font-weight:500;text-transform:uppercase;letter-spacing:0.1em;color:var(--coral, #ff6b6b)}
        .drw-event-pill{font-size:9px;color:var(--text-muted, #7a5a78);background:var(--background, #fdfaf9);border-radius:3px;padding:2px 6px}
        .drw-name{font-family:inherit;font-size:24px;font-weight:400;color:var(--purple-dark, #300b2e);margin:0 0 3px}
        .drw-city{font-size:11px;color:var(--text-muted, #7a5a78);margin:0}
        .drw-score-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(229, 152, 155, 0.12)}
        .drw-score-cell{display:flex;align-items:center;gap:10px}
        .drw-match-label{font-size:12px;font-weight:500;margin:0}
        .drw-match-sub{font-size:10px;color:var(--text-muted, #7a5a78);margin:2px 0 0}
        .drw-price-cell{text-align:right}
        .drw-price{font-size:16px;font-weight:500;color:var(--purple-dark, #300b2e);margin:0}
        .drw-lead{font-size:10px;color:var(--text-muted, #7a5a78);margin:2px 0 0}
        .drw-section{padding:12px 0;border-bottom:1px solid rgba(229, 152, 155, 0.1)}
        .drw-sec-lbl{font-size:9px;font-weight:500;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted, #7a5a78);margin:0 0 5px}
        .drw-sec-body{font-size:12px;color:var(--text-muted, #7a5a78);margin:0;line-height:1.55}
        .drw-insight{display:flex;gap:9px;align-items:flex-start;background:var(--purple-dark, #300b2e);border-radius:6px;padding:11px 13px;border:none;margin-top:2px}
        .drw-orn{color:var(--blush, #e5989b);font-size:10px;flex-shrink:0;margin-top:2px}
        .drw-insight-text{color:var(--blush, #e5989b) !important}
        .drw-notes{width:100%;font-family:inherit;font-size:12px;color:var(--purple-dark, #300b2e);background:var(--background, #fdfaf9);border:1px solid rgba(229, 152, 155, 0.22);border-radius:4px;padding:9px 11px;resize:none;outline:none;box-sizing:border-box}
        .drw-notes:focus{border-color:rgba(255, 107, 107, 0.4)}
        .drw-cta{width:100%;margin-top:16px;padding:13px;border-radius:6px;border:1.5px solid rgba(255, 107, 107, 0.38);background:transparent;color:var(--coral, #ff6b6b);font-size:13px;font-weight:500;cursor:pointer;transition:all .2s}
        .drw-cta:hover{background:rgba(255, 107, 107, 0.07)}
        .drw-cta.active{background:var(--purple-dark, #300b2e);border-color:var(--purple-dark, #300b2e);color:var(--blush, #e5989b)}
        /* Shortlist panel */
        .sp-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:90}
        .sp-panel{position:fixed;top:0;right:0;bottom:0;width:min(400px,100vw);background:var(--background, #fdfaf9);z-index:91;display:flex;flex-direction:column;box-shadow:-8px 0 40px rgba(0,0,0,0.18)}
        .sp-header{display:flex;align-items:flex-start;justify-content:space-between;padding:18px 20px 14px;border-bottom:1px solid rgba(229, 152, 155, 0.15);flex-shrink:0}
        .sp-title{font-family:inherit;font-size:22px;font-weight:400;color:var(--purple-dark, #300b2e);margin:0 0 2px}
        .sp-sub{font-size:11px;color:var(--text-muted, #7a5a78);margin:0}
        .sp-close{background:rgba(229, 152, 155, 0.1);border:none;border-radius:50%;width:30px;height:30px;font-size:11px;color:var(--text-muted, #7a5a78);cursor:pointer;display:flex;align-items:center;justify-content:center}
        .sp-body{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column}
        .sp-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;text-align:center;gap:8px}
        .sp-empty-orn{font-size:28px;color:rgba(229, 152, 155, 0.3);margin:0}
        .sp-empty-title{font-family:inherit;font-size:18px;color:var(--text-muted, #7a5a78);margin:0}
        .sp-empty-sub{font-size:12px;color:var(--text-muted, #7a5a78);margin:0;line-height:1.5}
        .sp-group{margin-bottom:20px}
        .sp-group-lbl{font-size:9px;font-weight:500;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted, #7a5a78);margin:0 0 8px;padding-bottom:6px;border-bottom:1px solid rgba(229, 152, 155, 0.12)}
        .sp-item{background:var(--background, #fdfaf9);border:1px solid rgba(229, 152, 155, 0.18);border-radius:6px;padding:11px 12px;margin-bottom:8px}
        .sp-item-row{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px}
        .sp-item-info{flex:1;min-width:0}
        .sp-item-name{font-size:13px;font-weight:500;color:var(--purple-dark, #300b2e);margin:0 0 2px}
        .sp-item-meta{font-size:10px;color:var(--text-muted, #7a5a78);margin:0 0 3px}
        .sp-item-price{font-size:11px;color:var(--coral, #ff6b6b);font-weight:500;margin:0}
        .sp-item-right{display:flex;flex-direction:column;align-items:center;gap:6px;flex-shrink:0}
        .sp-remove{background:none;border:none;color:var(--text-muted, #7a5a78);font-size:11px;cursor:pointer;padding:2px 4px;border-radius:3px;transition:color .15s}
        .sp-remove:hover{color:var(--coral, #ff6b6b)}
        .sp-note{width:100%;font-family:inherit;font-size:11px;color:var(--purple-dark, #300b2e);background:var(--background, #fdfaf9);border:1px solid rgba(229, 152, 155, 0.18);border-radius:4px;padding:7px 9px;resize:none;outline:none;box-sizing:border-box}
        .sp-note:focus{border-color:rgba(255, 107, 107, 0.32)}
        .sp-cta-card{margin-top:auto;background:var(--purple-dark, #300b2e);border-radius:8px;padding:16px;text-align:center}
        .sp-cta-title{font-family:inherit;font-size:16px;color:var(--background, #fdfaf9);margin:0 0 4px}
        .sp-cta-sub{font-size:11px;color:var(--text-muted, #7a5a78);margin:0 0 12px;line-height:1.5}
        .sp-cta-btn{padding:10px 22px;background:var(--coral, #ff6b6b);border:none;border-radius:4px;color:var(--background, #fdfaf9);font-size:12px;font-weight:500;cursor:pointer;transition:background .18s}
        .sp-cta-btn:hover{background:var(--blush, #e5989b);color:var(--purple-dark, #300b2e)}
        @media(max-width:480px){
          .db-topbar,.db-content,.db-summary-wrap{padding-left:16px;padding-right:16px}
          .ep-grid,.ba-grid{grid-template-columns:1fr}
          .db-tabnav-wrap{top:49px;padding:0 16px}
        }

      `}</style>
    </div>
  );
}
