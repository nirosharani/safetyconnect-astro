interface CheckboxQuestionProps {
  label: string;
  options: string[];
  values: string[];
  onChange: (vals: string[]) => void;
  showError?: boolean;
}

const CheckboxQuestion = ({ label, options, values, onChange, showError }: CheckboxQuestionProps) => (
  <div className="space-y-3">
    <p className="font-medium text-sm">
      {label} <span className="text-destructive">*</span>
    </p>
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={values.includes(opt)}
            onChange={() => {
              if (values.includes(opt)) {
                onChange(values.filter((v) => v !== opt));
              } else {
                onChange([...values, opt]);
              }
            }}
            className="w-4 h-4"
          />
          <span className="text-sm">{opt}</span>
        </label>
      ))}
    </div>
    {showError && values.length === 0 && (
      <p className="text-destructive text-xs">Please select at least one option</p>
    )}
  </div>
);

export default CheckboxQuestion;
