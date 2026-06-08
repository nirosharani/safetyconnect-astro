import RatingQuestion from "../RatingQuestion";

interface Props {
  data: Record<string, string>;
  onChange: (key: string, val: string) => void;
  showErrors: boolean;
}

const QUESTIONS = [
  { key: "culture_safety_prioritized_by_leadership", label: "Safety is visibly prioritized by leadership" },
  { key: "culture_employees_report_near_misses", label: "Employees feel safe reporting near-misses" },
  { key: "culture_incidents_investigated", label: "Incidents are investigated beyond surface causes" },
  { key: "culture_learnings_shared", label: "Learnings from incidents are shared across teams" },
];

const Step2Culture1 = ({ data, onChange, showErrors }: Props) => (
  <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
    <p className="text-sm text-muted-foreground mb-4">
      Rate each statement on a scale of 1 (Strongly Disagree) to 5 (Strongly Agree)
    </p>
    {QUESTIONS.map((q) => (
      <RatingQuestion
        key={q.key}
        label={q.label}
        value={data[q.key] || ""}
        onChange={(v) => onChange(q.key, v)}
        showError={showErrors}
      />
    ))}
  </div>
);

export default Step2Culture1;

export const validateStep2 = (data: Record<string, string>) =>
  QUESTIONS.every((q) => !!data[q.key]);