import CheckboxQuestion from "../CheckboxQuestion";

interface Props {
  data: Record<string, string>;
  onChange: (key: string, val: string) => void;
  showErrors: boolean;
}

const Step5Incident = ({ data, onChange, showErrors }: Props) => (
  <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
    <CheckboxQuestion
      label="Which types of incidents or accidents have been encountered in the last 12 months?"
      options={["Near misses", "First-aid injuries", "Medical treatment injuries", "Lost-time injuries", "Property damage", "Vehicle incidents", "Environmental incidents", "No incidents"]}
      values={(data.incident_types_last_12_months || "").split("|||").filter(Boolean)}
      onChange={(v) => onChange("incident_types_last_12_months", v.join("|||"))}
      showError={showErrors}
    />
    <CheckboxQuestion
      label="Which safety KPIs are currently tracked?"
      options={["Incident rates", "Near-miss reporting", "Training completion", "Corrective action closure", "Vehicle inspection compliance", "Driver behaviour metrics", "None formally tracked"]}
      values={(data.incident_kpis_tracked || "").split("|||").filter(Boolean)}
      onChange={(v) => onChange("incident_kpis_tracked", v.join("|||"))}
      showError={showErrors}
    />
  </div>
);

export default Step5Incident;

export const validateStep5 = (data: Record<string, string>) =>
  (data.incident_types_last_12_months || "").split("|||").filter(Boolean).length > 0 &&
  (data.incident_kpis_tracked || "").split("|||").filter(Boolean).length > 0;