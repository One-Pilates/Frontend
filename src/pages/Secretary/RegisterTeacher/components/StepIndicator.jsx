import { FaCheck } from 'react-icons/fa';
import './stepIndicator.scss';

export default function StepIndicator({ steps, currentStep, onStepClick }) {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isClickable = stepNumber <= currentStep;

        return (
          <div key={stepNumber} className="step-wrapper">
            <div className="step-item">
              <button
                type="button"
                className={`step-circle ${isActive ? 'active' : ''} ${
                  isCompleted ? 'completed' : ''
                } ${isClickable ? 'clickable' : ''}`}
                onClick={() => isClickable && onStepClick(stepNumber)}
                disabled={!isClickable}
              >
                {isCompleted ? <FaCheck size={16} /> : stepNumber}
              </button>
              <span className={`step-label ${isActive || isCompleted ? 'active' : ''}`}>
                {step.label}
              </span>
            </div>
            {stepNumber < steps.length && (
              <div className={`step-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
