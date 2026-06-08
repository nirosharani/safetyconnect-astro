export interface CategoryScore {
  name: string;
  earned: number;
  max: number;
  percentage: number;
  status: string;
  color: string;
}

export interface ScoringResult {
  overall: number;
  maturityLevel: number;
  maturityLabel: string;
  maturityDescription: string;
  categories: CategoryScore[];
}

const TRAINING_FREQUENCY_POINTS: Record<string, number> = {
  "Weekly": 5, "Monthly": 5, "Quarterly": 4, "Half-yearly": 3,
  "Annually": 2, "Only during induction": 1, "No regular training": 0,
};

const TRAINING_EFFECTIVENESS_POINTS: Record<string, number> = {
  "Post-training quiz or test": 2, "Supervisor observation": 2,
  "Incident / behaviour trend review": 2, "Employee feedback": 1,
  "Not formally evaluated": 0,
};

const TRAINING_MICROLEARNING_POINTS: Record<string, number> = {
  "Regularly": 5, "Occasionally": 3, "Planned but not implemented": 1, "Not used": 0,
};

const TRAINING_WHO_REPORTS_POINTS: Record<string, number> = {
  "Only safety team": 1, "Mostly supervisors / managers": 2,
  "All employees": 5, "Employees and contractors": 5, "Mostly management": 2,
};

const INCIDENT_KPIS_POINTS: Record<string, number> = {
  "Incident rates": 1, "Near-miss reporting": 1, "Training completion": 1,
  "Corrective action closure": 1, "Vehicle inspection compliance": 1,
  "Driver behaviour metrics": 1, "None formally tracked": 0,
};

const TECH_AI_POINTS: Record<string, number> = {
  "Yes, actively used": 5, "Under pilot / testing": 3, "Planned for future": 1, "No": 0,
};

const TECH_VEHICLE_POINTS: Record<string, number> = {
  "Yes, mandatory and documented": 5, "Yes, but informal": 3,
  "Only for selected vehicles": 2, "Planned but not implemented": 1, "No": 0, "Not Applicable": 0,
};

function getCheckboxValues(data: Record<string, string>, key: string): string[] {
  return (data[key] || "").split("|||").filter(Boolean);
}

function getCategoryStatus(pct: number): { status: string; color: string } {
  if (pct >= 80) return { status: "Strong", color: "#16A34A" };
  if (pct >= 60) return { status: "Developing", color: "#0E8A7A" };
  if (pct >= 40) return { status: "Emerging", color: "#D97706" };
  return { status: "At Risk", color: "#DC2626" };
}

function getMaturity(score: number): { level: number; label: string; description: string } {
  if (score >= 85) return { level: 5, label: "Optimising", description: "Safety is deeply embedded in culture. Continuous improvement, data-driven, AI-enabled." };
  if (score >= 70) return { level: 4, label: "Proactive", description: "Safety is prioritised and measured. Leaders drive culture. Risks managed proactively." };
  if (score >= 55) return { level: 3, label: "Developing", description: "Safety systems are in place but not fully embedded. Culture is improving." };
  if (score >= 35) return { level: 2, label: "Reactive", description: "Safety actions happen after incidents. Some processes exist but are inconsistently applied." };
  return { level: 1, label: "Lagging", description: "Safety is informal or reactive. Minimal systems in place. High risk of incidents." };
}

export function calculateScoring(data: Record<string, string>): ScoringResult {

  // --- Safety Culture & Leadership (Steps 2 & 3): 8 Likert × 5 = 40 max ---
  const cultureKeys = [
    "culture_safety_prioritized_by_leadership",
    "culture_employees_report_near_misses",
    "culture_incidents_investigated",
    "culture_learnings_shared",
    "culture_procedures_followed_under_pressure",
    "culture_risks_assessed_before_tasks",
    "culture_safety_reviewed_with_data",
    "culture_employees_identify_hazards",
  ];
  const cultureEarned = cultureKeys.reduce((sum, key) => sum + parseInt(data[key] || "0", 10), 0);
  const cultureMax = 40;

  // --- Training & Competency (Step 4): 20 max ---
  const t_freq = TRAINING_FREQUENCY_POINTS[data.training_frequency] ?? 0;
  const t_eff_vals = getCheckboxValues(data, "training_effectiveness_methods");
  const t_eff = Math.min(t_eff_vals.reduce((sum, v) => sum + (TRAINING_EFFECTIVENESS_POINTS[v] ?? 0), 0), 5);
  const t_micro = TRAINING_MICROLEARNING_POINTS[data.training_microlearning_used] ?? 0;
  const t_who = TRAINING_WHO_REPORTS_POINTS[data.training_who_reports_observations] ?? 0;
  const trainingEarned = t_freq + t_eff + t_micro + t_who;
  const trainingMax = 20;

  // --- Incident Management (Step 5): 10 max ---
  const inc_types = getCheckboxValues(data, "incident_types_last_12_months");
  const inc_q0 = (inc_types.includes("No incidents") && inc_types.length === 1) ? 5 : 0;
  const inc_kpi_vals = getCheckboxValues(data, "incident_kpis_tracked");
  const inc_q1 = Math.min(inc_kpi_vals.reduce((sum, v) => sum + (INCIDENT_KPIS_POINTS[v] ?? 0), 0), 5);
  const incidentEarned = inc_q0 + inc_q1;
  const incidentMax = 10;

  // --- Technology & AI (Step 6): 10 max ---
  const tech_ai = TECH_AI_POINTS[data.tech_ai_currently_used] ?? 0;
  const tech_veh = TECH_VEHICLE_POINTS[data.tech_vehicle_inspections] ?? 0;
  const techEarned = tech_ai + tech_veh;
  const techMax = 10;

  // --- Overall ---
  const totalEarned = cultureEarned + trainingEarned + incidentEarned + techEarned;
  const overall = Math.round((totalEarned / 80) * 100);
  const maturity = getMaturity(overall);

  const buildCat = (name: string, earned: number, max: number): CategoryScore => {
    const pct = Math.round((earned / max) * 100);
    const { status, color } = getCategoryStatus(pct);
    return { name, earned, max, percentage: pct, status, color };
  };

  return {
    overall,
    maturityLevel: maturity.level,
    maturityLabel: maturity.label,
    maturityDescription: maturity.description,
    categories: [
      buildCat("Safety Culture & Leadership", cultureEarned, cultureMax),
      buildCat("Training & Competency", trainingEarned, trainingMax),
      buildCat("Incident Management", incidentEarned, incidentMax),
      buildCat("Technology & AI in Safety", techEarned, techMax),
    ],
  };
}