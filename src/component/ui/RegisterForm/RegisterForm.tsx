import { useRegistrationContext } from "@/context/RegistrationContext";
import { SearchUserStep } from "./SearchUserStep";
import { OTPVerificationStep } from "./OTPVerificationStep";
import { SuccessStep } from "./SuccessStep";
import { PendingApprovalStep } from "./PendingApprovalStep";

export function RegisterForm() {
  const { currentStep, formData } = useRegistrationContext();

  // Step indicator
  const getStepNumber = () => {
    switch (currentStep) {
      case 'search':
        return 1;
      case 'otp':
        return 2;
      case 'success':
      case 'pending':
        return 3;
      default:
        return 1;
    }
  };

  const totalSteps = 3;
  const currentStepNumber = getStepNumber();

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step Indicator - Only show if not on success/pending step */}
      {currentStep !== 'success' && currentStep !== 'pending' && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[...Array(totalSteps)].map((_, index) => {
              const stepNum = index + 1;
              const isActive = stepNum === currentStepNumber;
              const isCompleted = stepNum < currentStepNumber;

              return (
                <div key={index} className="flex items-center flex-1">
                  {/* Step Circle */}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                      ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-brand-red text-white'
                          : 'bg-gray-200 text-gray-600'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      stepNum
                    )}
                  </div>

                  {/* Connecting Line */}
                  {index < totalSteps - 1 && (
                    <div
                      className={`
                        flex-1 h-1 mx-2
                        ${isCompleted || (isActive && stepNum < currentStepNumber) ? 'bg-green-500' : 'bg-gray-200'}
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Labels */}
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span className={currentStepNumber >= 1 ? 'font-medium' : ''}>
              Search Profile
            </span>
            <span className={currentStepNumber >= 2 ? 'font-medium' : ''}>
              Verify OTP
            </span>
            <span className={currentStepNumber >= 3 ? 'font-medium' : ''}>
              Complete
            </span>
          </div>
        </div>
      )}

      {/* Registration Type Badge */}
      <div className="mb-6">
        <span
          className={`
            inline-block px-4 py-2 rounded-full text-sm font-medium
            ${
              formData.userType === 'thai'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
            }
          `}
        >
          {formData.userType === 'thai' ? 'Domestic User' : 'Foreign User'}
        </span>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {currentStep === 'search' && <SearchUserStep />}
        {currentStep === 'otp' && <OTPVerificationStep />}
        {currentStep === 'success' && <SuccessStep />}
        {currentStep === 'pending' && <PendingApprovalStep />}
      </div>
    </div>
  );
}

export default RegisterForm;
