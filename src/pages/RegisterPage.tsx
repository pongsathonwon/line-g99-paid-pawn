import { RegistrationContextProvider } from "@/context/RegistrationContext";
import { RegisterForm } from "@/component/ui/RegisterForm/RegisterForm";

function RegisterPage() {
  return (
    <RegistrationContextProvider userType="thai">
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Domestic User Registration
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Link your existing POS profile to LINE account
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </RegistrationContextProvider>
  );
}

export default RegisterPage;
