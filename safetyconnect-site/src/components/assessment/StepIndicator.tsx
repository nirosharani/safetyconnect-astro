interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

const StepIndicator = ({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) => (
  <div className="flex flex-col items-center gap-2 my-4 md:my-6">
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center justify-center gap-0 min-w-max mx-auto px-4">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium shrink-0 ${
                i + 1 <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`w-5 sm:w-7 md:w-10 h-0.5 ${
                  i + 1 < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
    <div className="text-center">
      <p className="font-medium text-sm md:text-base">{stepLabels[currentStep - 1]}</p>
      <p className="text-xs sm:text-sm text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  </div>
);

export default StepIndicator;
