import ForeignCounterRegisterForm from "@/component/feature/RegisterForm/ForeignCounterRegisterForm";
import { MultiStepFormContextProvider } from "@/context/MultistepFormContext/MultiStepFormContext";

function ForeignCounterRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <MultiStepFormContextProvider totalPage={3}>
          <ForeignCounterRegisterForm />
        </MultiStepFormContextProvider>
      </div>
    </div>
  );
}

export default ForeignCounterRegisterPage;
