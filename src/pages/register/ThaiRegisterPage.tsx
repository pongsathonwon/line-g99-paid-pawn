import ThaiRegisterForm from "@/component/feature/RegisterForm/ThaiRegisterForm";
import { MultiStepFormContextProvider } from "@/context/MultistepFormContext/MultiStepFormContext";

function ThaiRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <MultiStepFormContextProvider totalPage={4}>
          <ThaiRegisterForm />
        </MultiStepFormContextProvider>
      </div>
    </div>
  );
}

export default ThaiRegisterPage;
