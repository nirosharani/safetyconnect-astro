interface RadioQuestionProps {
  label: string;
  required?: boolean;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  showError?: boolean;
}

const RadioQuestion = ({ label, required, options, value, onChange, showError }: RadioQuestionProps) => (
  <div className="space-y-3">
    <p className="font-medium text-sm">
      {label} {required && <span className="text-destructive">*</span>}
    </p>
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name={label}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="w-4 h-4"
          />
          <span className="text-sm">{opt}</span>
        </label>
      ))}
    </div>
    {showError && !value && (
      <p className="text-destructive text-xs">This field is required</p>
    )}
  </div>
);

export default RadioQuestion;
