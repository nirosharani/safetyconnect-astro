import RadioQuestion from "../RadioQuestion";
import CheckboxQuestion from "../CheckboxQuestion";

interface Props {
  data: Record<string, string>;
  onChange: (key: string, val: string) => void;
  showErrors: boolean;
}

const Step4Training = ({ data, onChange, showErrors }: Props) => (
  <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
    <RadioQuestion
      label="How often are safety trainings conducted for employees?"
      required
      options={["Weekly", "Monthly", "Quarterly", "Half-yearly", "Annually", "Only during induction", "No regular training"]}
      value={data.training_frequency || ""}
      onChange={(v) => onChange("training_frequency", v)}
      showError={showErrors}
    />
    <CheckboxQuestion
      label="How is training effectiveness evaluated?"
      options={["Post-training quiz or test", "Supervisor observation", "Incident / behaviour trend review", "Employee feedback", "Not formally evaluated"]}
      values={(data.training_effectiveness_methods || "").split("|||").filter(Boolean)}
      onChange={(v) => onChange("training_effectiveness_methods", v.join("|||"))}
      showError={showErrors}
    />
    <RadioQuestion
      label="Are microlearning sessions used for safety awareness?"
      required
      options={["Regularly", "Occasionally", "Planned but not implemented", "Not used"]}
      value={data.training_microlearning_used || ""}
      onChange={(v) => onChange("training_microlearning_used", v)}
      showError={showErrors}
    />
    <RadioQuestion
      label="Who usually reports safety observations?"
      required
      options={["Only safety team", "Mostly supervisors / managers", "All employees", "Employees and contractors", "Mostly management"]}
      value={data.training_who_reports_observations || ""}
      onChange={(v) => onChange("training_who_reports_observations", v)}
      showError={showErrors}
    />
  </div>
);

export default Step4Training;

export const validateStep4 = (data: Record<string, string>) =>
  !!(
    data.training_frequency &&
    (data.training_effectiveness_methods || "").split("|||").filter(Boolean).length > 0 &&
    data.training_microlearning_used &&
    data.training_who_reports_observations
  );