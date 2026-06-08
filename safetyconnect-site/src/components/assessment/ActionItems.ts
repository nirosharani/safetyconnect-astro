import type { ScoringResult } from "./ScoringLogic";

export interface ActionItem {
  category: string;
  question: string;
  action: string;
  priority: "High" | "Medium" | "Low";
}

const CULTURE_QUESTIONS: { key: string; label: string; action: string }[] = [
  { key: "culture_safety_prioritized_by_leadership", label: "Safety is visibly prioritised by leadership", action: "Schedule a monthly safety briefing led by senior management. Add safety as a regular agenda item in leadership meetings." },
  { key: "culture_employees_report_near_misses", label: "Employees feel safe reporting near-misses", action: "Introduce an anonymous near-miss reporting system. Clearly communicate a no-blame culture to encourage reporting." },
  { key: "culture_incidents_investigated", label: "Incidents are investigated beyond surface causes", action: "Implement a root-cause analysis method such as 5-Whys or fishbone for all incidents and near-misses." },
  { key: "culture_learnings_shared", label: "Learnings from incidents are shared across teams", action: "Create a monthly “Safety Learnings” report and share it across all teams after incidents." },
  { key: "culture_procedures_followed_under_pressure", label: "Safety procedures are followed under operational pressure", action: "Introduce a “Stop Work Authority” policy allowing employees to pause unsafe work without fear." },
  { key: "culture_risks_assessed_before_tasks", label: "Risks are assessed before high-risk tasks", action: "Implement Job Hazard Analysis (JHA) or Task Risk Assessment (TRA) before starting non-routine work." },
  { key: "culture_safety_reviewed_with_data", label: "Safety performance is reviewed using data", action: "Create a basic safety KPI dashboard and review it monthly (track incidents, near-misses, etc.)." },
  { key: "culture_employees_identify_hazards", label: "Employees participate in identifying hazards", action: "Launch a hazard reporting system and encourage participation through recognition and feedback." },
];

function priorityFromPct(pct: number): "High" | "Medium" | "Low" {
  if (pct < 40) return "High";
  if (pct < 60) return "Medium";
  return "Low";
}

export function generateActionItems(
  data: Record<string, string>,
  result: ScoringResult
): ActionItem[] {
  const items: ActionItem[] = [];
  const catByName = Object.fromEntries(result.categories.map(c => [c.name, c]));

  // A. Safety Culture & Leadership
  const culturePct = catByName["Safety Culture & Leadership"]?.percentage ?? 100;
  if (culturePct < 80) {
    const cp = priorityFromPct(culturePct);
    for (const q of CULTURE_QUESTIONS) {
      const score = parseInt(data[q.key] || "0", 10);
      if (score >= 1 && score <= 2) {
        items.push({ category: "Safety Culture & Leadership", question: q.label, action: q.action, priority: cp });
      }
    }
  }

  // B. Training & Competency
  const trainPct = catByName["Training & Competency"]?.percentage ?? 100;
  if (trainPct < 80) {
    const tp = priorityFromPct(trainPct);
    const lowFreq = ["Annually", "Only during induction", "No regular training"];
    if (lowFreq.includes(data.training_frequency)) {
      items.push({ category: "Training & Competency", question: "Training frequency", action: "Move to at least a quarterly safety training schedule. Create a 12-month training plan based on key risk areas. Include short monthly toolbox talks to maintain awareness.", priority: tp });
    }
    const effVals = (data.training_effectiveness_methods || "").split("|||").filter(Boolean);
    if (effVals.includes("Not formally evaluated") || effVals.length === 0) {
      items.push({ category: "Training & Competency", question: "Training evaluation", action: "Introduce post-training assessments or quizzes. Track results and identify areas that need improvement. Conduct supervisor observation checks within 2 weeks of training.", priority: tp });
    }
    if (["Planned but not implemented", "Not used"].includes(data.training_microlearning_used)) {
      items.push({ category: "Training & Competency", question: "Microlearning usage", action: "Start microlearning sessions using short 3–5 minute videos or slides on key safety topics. Share via email, WhatsApp, or internal platforms and track completion.", priority: tp });
    }
    if (["Only safety team", "Mostly supervisors / managers", "Mostly management"].includes(data.training_who_reports_observations)) {
      items.push({ category: "Training & Competency", question: "Safety observation reporting", action: "Launch an “Everyone Reports” initiative. Encourage all employees and contractors to report safety observations using a simple, mobile-friendly system.", priority: tp });
    }
  }

  // C. Incident Management
  const incPct = catByName["Incident Management"]?.percentage ?? 100;
  if (incPct < 80) {
    const ip = priorityFromPct(incPct);
    const incTypes = (data.incident_types_last_12_months || "").split("|||").filter(Boolean);
    if (incTypes.some(t => ["Near misses", "First-aid injuries"].includes(t))) {
      items.push({ category: "Incident Management", question: "Near misses / First-aid injuries", action: "Conduct a trend analysis of near-miss data from the last 12 months. Identify top 3 recurring causes and create corrective action plans.", priority: ip });
    }
    if (incTypes.some(t => ["Medical treatment injuries", "Lost-time injuries"].includes(t))) {
      items.push({ category: "Incident Management", question: "Medical treatment / Lost-time injuries", action: "Review incident investigation process. Ensure root-cause analysis is completed within 48 hours and actions are tracked to closure.", priority: ip });
    }
    if (incTypes.includes("Vehicle incidents")) {
      items.push({ category: "Incident Management", question: "Vehicle incidents", action: "Implement daily vehicle inspection checklists and a driver behaviour monitoring system. Review fatigue and trip planning policies.", priority: ip });
    }
    const kpis = (data.incident_kpis_tracked || "").split("|||").filter(Boolean).filter(k => k !== "None formally tracked");
    if (kpis.length < 3) {
      items.push({ category: "Incident Management", question: "Safety KPIs tracked", action: "Start tracking at least 3 key safety KPIs such as Incident Rate, Near-Miss Reporting Rate, and Training Completion Rate.", priority: ip });
    }
  }

  // D. Technology & AI
  const techPct = catByName["Technology & AI in Safety"]?.percentage ?? 100;
  if (techPct < 80) {
    const xp = priorityFromPct(techPct);
    if (["Planned for future", "No"].includes(data.tech_ai_currently_used)) {
      items.push({ category: "Technology & AI in Safety", question: "AI usage in safety", action: "Begin exploring AI use cases such as near-miss pattern detection or predictive risk alerts. Consider booking a demo to understand implementation.", priority: xp });
    } else if (data.tech_ai_currently_used === "Under pilot / testing") {
      items.push({ category: "Technology & AI in Safety", question: "AI usage in safety", action: "Define clear success metrics for the pilot. Set measurable goals and evaluate results within a 90-day period.", priority: xp });
    }
    if (["Yes, but informal", "Only for selected vehicles", "Planned but not implemented"].includes(data.tech_vehicle_inspections)) {
      items.push({ category: "Technology & AI in Safety", question: "Vehicle inspections", action: "Introduce a standardized daily vehicle inspection checklist for all vehicles. Ensure inspections are recorded digitally for tracking.", priority: xp });
    } else if (data.tech_vehicle_inspections === "No") {
      items.push({ category: "Technology & AI in Safety", question: "Vehicle inspections", action: "High priority: Implement mandatory daily vehicle inspections immediately. Start with manual tracking if needed and transition to a digital system within 90 days.", priority: "High" });
    }
  }

  // Sort by priority then keep first 10
  const order = { High: 0, Medium: 1, Low: 2 };
  items.sort((a, b) => order[a.priority] - order[b.priority]);
  return items.slice(0, 10);
}
