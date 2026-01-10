import ForeignRegisterForm from "@/component/feature/RegisterForm/ForeignRegisterForm";
import { MultiStepFormContextProvider } from "@/context/MultistepFormContext/MultiStepFormContext";

function ForeignRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <MultiStepFormContextProvider totalPage={4}>
          <ForeignRegisterForm />
        </MultiStepFormContextProvider>
      </div>
    </div>
  );
}

export default ForeignRegisterPage;
