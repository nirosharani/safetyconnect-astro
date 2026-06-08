import { useState } from "react";
import Header from "./assessment/Header";
import Footer from "./assessment/Footer";
import StepIndicator from "./assessment/StepIndicator";
import ScoreResult from "./assessment/ScoreResult";
import ContactGate, { type ContactDetails } from "./assessment/ContactGate";
import { SECTION_LABELS, INITIAL_ORG_PROFILE, type OrgProfile } from "./assessment/AssessmentData";
import { calculateScoring } from "./assessment/ScoringLogic";
import { generateActionItems } from "./assessment/ActionItems";
import { buildReportPdf, getPdfBase64, buildEmailBody, EMAIL_SUBJECT, REPORT_API_URL } from "./assessment/pdfReport";
import Step2Culture1, { validateStep2 } from "./assessment/steps/Step2Culture1";
import Step3Culture2, { validateStep3 } from "./assessment/steps/Step3Culture2";
import Step4Training, { validateStep4 } from "./assessment/steps/Step4Training";
import Step5Incident, { validateStep5 } from "./assessment/steps/Step5Incident";
import Step6Technology, { validateStep6 } from "./assessment/steps/Step6Technology";
import Step7OpenInputs, { validateStep7 } from "./assessment/steps/Step7OpenInputs";
import Step8Summary from "./assessment/steps/Step8Summary";
import { submitToHubSpot } from "./assessment/hubspot-integration";

const TOTAL_STEPS = 7;

const AssessmentApp = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [orgData, setOrgData] = useState<OrgProfile>(INITIAL_ORG_PROFILE);
  const [stepData, setStepData] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [view, setView] = useState<"basic" | "contact" | "detailed">("basic");
  const [contact, setContact] = useState<ContactDetails | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const scoringResult = calculateScoring(stepData);
  const actionItems = generateActionItems(stepData, scoringResult);

  const validateCurrentStep = (): boolean => {
    switch (step) {
      case 1: return validateStep2(stepData);
      case 2: return validateStep3(stepData);
      case 3: return validateStep4(stepData);
      case 4: return validateStep5(stepData);
      case 5: return validateStep6(stepData);
      case 6: return validateStep7(stepData);
      case 7: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const handlePrev = () => {
    setShowErrors(false);
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => setSubmitted(true);

  const handleStepDataChange = (key: string, val: string) => {
    setStepData((prev) => ({ ...prev, [key]: val }));
  };

  const handleContactSubmit = async (d: ContactDetails) => {
    setOrgData(d.org);
    setContact(d);
    setView("detailed");

    try {
      const pdf = buildReportPdf({ result: scoringResult, companyName: d.org.companyName, contactName: d.name, contactEmail: d.email, detailed: true, actionItems });
      const pdfBase64 = getPdfBase64(pdf);
      const firstName = d.name.split(" ")[0];

      const authHeaders: Record<string, string> = { "Content-Type": "application/json" };
      const apiKey = import.meta.env.VITE_API_KEY;
    if (apiKey) authHeaders["Authorization"] = `Bearer ${apiKey}`;
 
    //  HubSpot Submission (NEW) 
    // This runs in parallel with your existing API call
    submitToHubSpot(
      d.name,
      d.email,
      d.phone,
      d.org.companyName,
      d.org.industry,
      d.org.employees,
      scoringResult.overall,
      scoringResult.maturityLabel
    )
      .then(() => console.log("✅ HubSpot: Contact saved successfully"))
      .catch((err) => console.error("⚠️ HubSpot submission error (non-blocking):", err));
    //  End HubSpot Submission 

      const res = await fetch(REPORT_API_URL, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          section1_org_profile: { companyName: d.org.companyName, industry: d.org.industry, employees: d.org.employees, sites: d.org.sites, designation: d.org.designation, vehicles: d.org.vehicles, name: d.name, email: d.email, phone: d.phone },
          section2_3_culture_leadership: {
            safety_prioritized_by_leadership: stepData.culture_safety_prioritized_by_leadership,
            employees_report_near_misses: stepData.culture_employees_report_near_misses,
            incidents_investigated: stepData.culture_incidents_investigated,
            learnings_shared: stepData.culture_learnings_shared,
            procedures_followed_under_pressure: stepData.culture_procedures_followed_under_pressure,
            risks_assessed_before_tasks: stepData.culture_risks_assessed_before_tasks,
            safety_reviewed_with_data: stepData.culture_safety_reviewed_with_data,
            employees_identify_hazards: stepData.culture_employees_identify_hazards,
          },
          section4_training_competency: { frequency: stepData.training_frequency, effectiveness_methods: (stepData.training_effectiveness_methods || "").split("|||").filter(Boolean), microlearning_used: stepData.training_microlearning_used, who_reports_observations: stepData.training_who_reports_observations },
          section5_incident_management: { types_last_12_months: (stepData.incident_types_last_12_months || "").split("|||").filter(Boolean), kpis_tracked: (stepData.incident_kpis_tracked || "").split("|||").filter(Boolean) },
          section6_technology_ai: { ai_currently_used: stepData.tech_ai_currently_used, vehicle_inspections: stepData.tech_vehicle_inspections },
          section7_open_inputs: { top_safety_challenges: stepData.open_top_safety_challenges, safety_improvement_priority: (stepData.open_safety_improvement_priority || "").split("|||").filter(Boolean) },
          scoring_results: { overall_score: scoringResult.overall, maturity_level: scoringResult.maturityLevel, maturity_label: scoringResult.maturityLabel, categories: scoringResult.categories },
          result: { overall_score: scoringResult.overall, maturity_level: scoringResult.maturityLevel, maturity_label: scoringResult.maturityLabel },
          report_email: { to: d.email, name: d.name, subject: EMAIL_SUBJECT, body: buildEmailBody(firstName), attachment_base64: pdfBase64, attachment_filename: `Safety-Intelligence-Report${d.org.companyName ? "-" + d.org.companyName.replace(/\s+/g, "_") : ""}.pdf` },
        }),
      });

      if (res.ok) {
        showToast(`Details submitted & report sent to ${d.email}`, "success");
      } else {
        showToast(`Submission failed (status ${res.status}).`, "error");
      }
    } catch (err) {
      showToast("Could not reach the server. Please try again.", "error");
      console.error("Failed to submit:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 md:mb-3">
            Safety Intelligence Framework
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            This assessment is intended to understand the current maturity of your organization's safety culture, systems, training practices, incident management, and safety intelligence capabilities. Your responses will help identify strengths, gaps, and improvement opportunities.
          </p>
          <p className="text-destructive text-xs sm:text-sm mt-2 md:mt-3">
            * Indicates required question
          </p>
        </div>

        <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} stepLabels={SECTION_LABELS} />

        {step >= 1 && step <= 6 && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-primary text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-sm sm:text-base">
              {SECTION_LABELS[step - 1]}
            </div>
            {step === 1 && <Step2Culture1 data={stepData} onChange={handleStepDataChange} showErrors={showErrors} />}
            {step === 2 && <Step3Culture2 data={stepData} onChange={handleStepDataChange} showErrors={showErrors} />}
            {step === 3 && <Step4Training data={stepData} onChange={handleStepDataChange} showErrors={showErrors} />}
            {step === 4 && <Step5Incident data={stepData} onChange={handleStepDataChange} showErrors={showErrors} />}
            {step === 5 && <Step6Technology data={stepData} onChange={handleStepDataChange} showErrors={showErrors} />}
            {step === 6 && <Step7OpenInputs data={stepData} onChange={handleStepDataChange} showErrors={showErrors} />}
          </div>
        )}

        {step === TOTAL_STEPS && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-primary text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-sm sm:text-base">
              {SECTION_LABELS[TOTAL_STEPS - 1]}
            </div>
            <Step8Summary />
          </div>
        )}

        <div className="flex justify-between mt-4 sm:mt-6">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="px-4 sm:px-6 py-2 rounded font-medium text-xs sm:text-sm border border-input hover:bg-muted"
            >
              Previous
            </button>
          ) : (
            <div />
          )}
          {step < TOTAL_STEPS ? (
            <button
              onClick={handleNext}
              className="px-4 sm:px-6 py-2 rounded font-medium text-xs sm:text-sm bg-next-btn text-accent-foreground hover:opacity-90"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 sm:px-6 py-2 rounded font-medium text-xs sm:text-sm bg-next-btn text-accent-foreground hover:opacity-90"
            >
              Submit
            </button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssessmentApp;