import RatingQuestion from "../RatingQuestion";

interface Props {
  data: Record<string, string>;
  onChange: (key: string, val: string) => void;
  showErrors: boolean;
}

const QUESTIONS = [
  { key: "culture_procedures_followed_under_pressure", label: "Safety procedures are followed even under operational pressure" },
  { key: "culture_risks_assessed_before_tasks", label: "Risks are assessed before non-routine or high-risk tasks" },
  { key: "culture_safety_reviewed_with_data", label: "Safety performance is reviewed regularly using data" },
  { key: "culture_employees_identify_hazards", label: "Employees actively participate in identifying hazards and unsafe conditions" },
];

const Step3Culture2 = ({ data, onChange, showErrors }: Props) => (
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

export default Step3Culture2;

export const validateStep3 = (data: Record<string, string>) =>
  QUESTIONS.every((q) => !!data[q.key]);