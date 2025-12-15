import { useNavigate } from "react-router-dom";
import { Button } from "@/component/Button";

export function PendingApprovalStep() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/home');
  };

  return (
    <div className="space-y-6 text-center">
      {/* Pending Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      {/* Pending Message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Waiting for Approval
        </h2>
        <p className="text-gray-600">
          Your registration has been submitted successfully.
        </p>
      </div>

      {/* Information Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 space-y-3">
        <p className="text-sm text-yellow-900">
          <strong>Foreign User Registration</strong>
        </p>
        <p className="text-sm text-yellow-800">
          Your account is currently under review by our staff. This process typically
          takes 1-2 business days.
        </p>
        <p className="text-sm text-yellow-800">
          You will receive a notification via LINE when your account is approved.
        </p>
      </div>

      {/* What's Next Section */}
      <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          What happens next?
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Our staff will verify your information</li>
          <li>You'll receive a LINE notification once approved</li>
          <li>After approval, you can access all services</li>
        </ul>
      </div>

      {/* Action Button */}
      <Button
        type="button"
        onClick={handleGoHome}
        color="primary"
        size="lg"
        fullWidth
      >
        Back to Home
      </Button>

      {/* Contact Support */}
      <div className="text-sm text-gray-600">
        <p>
          Have questions?{' '}
          <a
            href="#"
            className="text-brand-red hover:underline font-medium"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
