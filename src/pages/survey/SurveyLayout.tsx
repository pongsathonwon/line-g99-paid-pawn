import type { PropsWithChildren, ReactNode } from "react";
import { liff } from "@line/liff";
import { Button } from "@/component/Button";
import { SURVEY_TEXT } from "@/component/feature/SurveyForm/survey.locale";

type TSurveyLayoutProps = PropsWithChildren<{
  /** set in test mode: shows the fixed test banner */
  testUid?: string | null;
  isTestMode?: boolean;
}>;

function SurveyLayout({ children, isTestMode = false, testUid }: TSurveyLayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${isTestMode ? "pt-10" : ""}`}>
      {isTestMode && (
        <div
          role="status"
          data-testid="survey-test-banner"
          className="fixed top-0 inset-x-0 z-50 h-10 flex items-center justify-center bg-yellow-400 text-black text-sm font-bold shadow-md"
        >
          {SURVEY_TEXT.testMode.banner(testUid)}
        </div>
      )}
      <header className="flex justify-center h-16 border-b bg-white">
        <img src="/logo/logo.png" alt="Golden 99" className="h-15" />
      </header>
      <main className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
        {children}
      </main>
    </div>
  );
}

type TSurveyMessageProps = {
  title: string;
  tone?: "success" | "error" | "info";
  children?: ReactNode;
};

export function SurveyMessage({
  title,
  tone = "info",
  children,
}: TSurveyMessageProps) {
  const toneClass = {
    success: "bg-green-100 text-green-600",
    error: "bg-red-100 text-red-600",
    info: "bg-gold-100 text-gold-700",
  }[tone];
  return (
    <section className="flex flex-col items-center gap-4 text-center bg-white rounded-2xl shadow-sm border p-6">
      <div
        aria-hidden
        className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${toneClass}`}
      >
        {tone === "success" ? "✓" : tone === "error" ? "!" : "i"}
      </div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

export function ReloginButton() {
  return (
    <Button
      type="button"
      fullWidth
      onClick={() => liff.login({ redirectUri: window.location.href })}
    >
      {SURVEY_TEXT.relogin}
    </Button>
  );
}

export function TestKeyRefused({ onExit }: { onExit: () => void }) {
  return (
    <SurveyMessage title={SURVEY_TEXT.testMode.refusedTitle} tone="error">
      <p className="text-gray-600">{SURVEY_TEXT.testMode.refused}</p>
      <Button type="button" fullWidth styleType="outline" onClick={onExit}>
        {SURVEY_TEXT.testMode.exit}
      </Button>
    </SurveyMessage>
  );
}

export default SurveyLayout;
