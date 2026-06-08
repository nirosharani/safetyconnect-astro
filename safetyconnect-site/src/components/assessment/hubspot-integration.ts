// ─────────────────────────────────────────────
// HubSpot Integration for Safety Intelligence
// Portal ID : 2356689
// Form ID   : 60fa2f5e-9604-4428-a913-5ca3857189af
// ─────────────────────────────────────────────

const HUBSPOT_PORTAL_ID = "2356689";
const HUBSPOT_FORM_ID = "60fa2f5e-9604-4428-a913-5ca3857189af";

// ── Map YOUR industry values → HubSpot industry values ──────────────────────
const mapIndustry = (industry: string): string => {
  const map: Record<string, string> = {
    "Manufacturing":        "MANUFACTURING",
    "Construction":         "CONSTRUCTION",
    "Logistics/Transport":  "TRANSPORTATION",
    "Oil and Gas":          "OIL_AND_ENERGY",
    "Utilities":            "UTILITIES",
    "Warehousing":          "WAREHOUSING",
    "Facility Management":  "FACILITIES_SERVICES",
    "Other":                "OTHER",
  };
  return map[industry] || "OTHER";
};

// ── Map YOUR employee range values → HubSpot numemployees values ─────────────
const mapEmployees = (employees: string): string => {
  const map: Record<string, string> = {
    "Less than 100": "1-100",
    "100 - 500":     "101-500",
    "500 - 1000":    "501-1000",
    "1000 - 5000":   "1001-5000",
    "More than 5000":"5001-10000",
  };
  return map[employees] || "";
};

// ── Main submit function ─────────────────────────────────────────────────────
export const submitToHubSpot = async (
  name: string,
  email: string,
  phone: string,
  companyName: string,
  industry: string,
  employees: string,
  overallScore: number,
  maturityLabel: string
) => {
  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`;

  const payload = {
    fields: [
      { name: "firstname",    value: name.split(" ")[0] || name },
      { name: "lastname",     value: name.split(" ").slice(1).join(" ") || "" },
      { name: "email",        value: email },
      { name: "phone",        value: phone || "" },
      { name: "company",      value: companyName || "" },
      { name: "industry",     value: mapIndustry(industry) },
      { name: "numberofemployees", value: mapEmployees(employees) },
    ],
    context: {
      pageUri: window.location.href,
      pageName: "Safety Intelligence Assessment",
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("HubSpot submission failed:", errorText);
    throw new Error(`HubSpot error: ${response.status}`);
  }

  return response.json();
};