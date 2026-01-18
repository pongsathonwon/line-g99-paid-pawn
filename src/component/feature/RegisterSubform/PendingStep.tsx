import { Button } from "@/component/Button";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

export function PendingStep() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/home");
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
          <Clock className="w-12 h-12 text-yellow-600" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Registration Pending
        </h2>
        <p className="text-gray-600 text-sm">
          Your registration is not completed yet
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          Please visit our branch to complete your registration with a staff
          member.
        </p>
      </div>

      <Button type="button" onClick={handleBack} color="primary" fullWidth>
        Back to Home
      </Button>
    </div>
  );
}
