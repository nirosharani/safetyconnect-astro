interface RatingQuestionProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  showError?: boolean;
}

const RatingQuestion = ({ label, value, onChange, showError }: RatingQuestionProps) => (
  <div className="space-y-3">
    <p className="font-medium text-sm">
      {label} <span className="text-destructive">*</span>
    </p>
    <div className="flex items-center gap-4">
      {["1", "2", "3", "4", "5"].map((r) => (
        <label key={r} className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name={label}
            value={r}
            checked={value === r}
            onChange={() => onChange(r)}
            className="w-4 h-4"
          />
          <span className="text-sm">{r}</span>
        </label>
      ))}
    </div>
    {showError && !value && (
      <p className="text-destructive text-xs">This field is required</p>
    )}
  </div>
);

export default RatingQuestion;
