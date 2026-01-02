import { RegistrationContextProvider } from "@/context/RegistrationContext";
import { RegisterForm } from "@/component/ui/RegisterForm/RegisterForm";

function ForeignRegisterPage() {
  return (
    <RegistrationContextProvider userType="foreign">
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Foreign User Registration
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Link your existing POS profile to LINE account
            </p>
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Foreign user registrations require approval from our staff.
                You will be notified via LINE once your account is approved.
              </p>
            </div>
          </div>

          <RegisterForm />
        </div>
      </div>
    </RegistrationContextProvider>
  );
}

export default ForeignRegisterPage;
