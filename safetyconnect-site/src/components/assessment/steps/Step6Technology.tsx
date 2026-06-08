import RadioQuestion from "../RadioQuestion";

interface Props {
  data: Record<string, string>;
  onChange: (key: string, val: string) => void;
  showErrors: boolean;
}

const Step6Technology = ({ data, onChange, showErrors }: Props) => (
  <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
    <RadioQuestion
      label="Is AI currently used in any part of your safety process?"
      required
      options={["Yes, actively used", "Under pilot / testing", "Planned for future", "No"]}
      value={data.tech_ai_currently_used || ""}
      onChange={(v) => onChange("tech_ai_currently_used", v)}
      showError={showErrors}
    />
    <RadioQuestion
      label="Are daily vehicle inspections incorporated?"
      required
      options={["Yes, mandatory and documented", "Yes, but informal", "Only for selected vehicles", "Planned but not implemented", "No", "Not Applicable"]}
      value={data.tech_vehicle_inspections || ""}
      onChange={(v) => onChange("tech_vehicle_inspections", v)}
      showError={showErrors}
    />
  </div>
);

export default Step6Technology;

export const validateStep6 = (data: Record<string, string>) =>
  !!(data.tech_ai_currently_used && data.tech_vehicle_inspections);