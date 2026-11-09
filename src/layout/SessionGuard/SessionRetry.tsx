import { Button } from "@/component/Button";
import { useSession } from "@/context/SessionContext/SessionContext";
import { SESSION_TEXT } from "./session.locale";

const t = SESSION_TEXT;

/**
 * Shown for status "error". A LIFF failure is retried with a LINE login; a
 * g99-online or network failure with refresh(). Never sends to /register.
 */
function SessionRetry() {
  const { errorKind, isRefreshing, login, refresh } = useSession();
  const isLineError = errorKind === "line";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <section
        role="alert"
        className="w-full max-w-md flex flex-col items-center gap-4 text-center bg-white rounded-2xl shadow-sm border p-6"
      >
        <img src="/logo/logo.png" alt="Golden 99" className="h-15" />
        <h1 className="text-xl font-bold text-gray-900">
          {isLineError ? t.lineErrorTitle : t.apiErrorTitle}
        </h1>
        <p className="text-gray-600">
          {isLineError ? t.lineErrorMessage : t.apiErrorMessage}
        </p>
        {isLineError ? (
          <Button type="button" fullWidth onClick={() => login()}>
            {t.lineLogin}
          </Button>
        ) : (
          <Button
            type="button"
            fullWidth
            disabled={isRefreshing}
            onClick={() => void refresh()}
          >
            {isRefreshing ? t.retrying : t.retry}
          </Button>
        )}
      </section>
    </div>
  );
}

export default SessionRetry;
