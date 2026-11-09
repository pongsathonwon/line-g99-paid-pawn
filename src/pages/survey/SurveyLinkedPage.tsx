import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SURVEY_API } from "@/api/endpoint/survey";
import { Button } from "@/component/Button";
import QueryLoading from "@/component/ui/QueryLoading";
import { SURVEY_TEXT } from "@/component/feature/SurveyForm/survey.locale";
import {
  getHttpStatus,
  isTestKeyRefused,
  retryOnServiceUnavailable,
} from "@/component/feature/SurveyForm/lib";
import {
  clearSurveyTestMode,
  getSurveyTestMode,
} from "@/lib/survey-test-mode";
import { useSession } from "@/context/SessionContext/SessionContext";
import SurveyLayout, {
  ReloginButton,
  SurveyMessage,
  TestKeyRefused,
} from "./SurveyLayout";

const t = SURVEY_TEXT;

/** Reached from the register flow (?redirect=/survey/linked) once it succeeds. */
function SurveyLinkedPage() {
  const { refresh, isRefreshing } = useSession();
  const navigate = useNavigate();
  // test mode set on /survey before the register flow; the headers come
  // from sessionStorage, the banner uses the stored uid
  const [testMode, setTestMode] = useState(getSurveyTestMode);

  const linkQuery = useQuery({
    queryKey: ["survey-link", testMode?.test, testMode?.uid],
    queryFn: SURVEY_API.link,
    retry: retryOnServiceUnavailable,
    staleTime: Infinity,
  });

  // the g99-online session still says "guest" from before registering:
  // log in again first so /home opens the pawn list
  const goHome = async () => {
    await refresh();
    navigate("/home");
  };

  const renderContent = () => {
    if (linkQuery.isPending) return <QueryLoading />;
    if (linkQuery.isError) {
      if (isTestKeyRefused(linkQuery.error)) {
        return (
          <TestKeyRefused
            onExit={() => {
              clearSurveyTestMode();
              setTestMode(null);
            }}
          />
        );
      }
      return getHttpStatus(linkQuery.error) === 401 ? (
        <SurveyMessage title={t.errors.unauthorized} tone="error">
          <ReloginButton />
        </SurveyMessage>
      ) : (
        <SurveyMessage title={t.linked.error} tone="error">
          <Button type="button" fullWidth onClick={() => linkQuery.refetch()}>
            {t.retry}
          </Button>
        </SurveyMessage>
      );
    }
    const { isMember, linked } = linkQuery.data;
    if (!isMember) {
      return (
        <SurveyMessage title={t.linked.notFoundTitle} tone="info">
          <p className="text-gray-600">{t.linked.notFound}</p>
          <Button
            type="button"
            fullWidth
            disabled={linkQuery.isFetching}
            onClick={() => linkQuery.refetch()}
          >
            {t.retry}
          </Button>
        </SurveyMessage>
      );
    }
    return (
      <SurveyMessage title={t.linked.title} tone="success">
        {linked > 0 && (
          <p className="text-gray-600">{t.linked.linkedResponses(linked)}</p>
        )}
        <Button
          type="button"
          fullWidth
          disabled={isRefreshing}
          onClick={goHome}
        >
          {t.home}
        </Button>
      </SurveyMessage>
    );
  };

  return (
    <SurveyLayout isTestMode={Boolean(testMode)} testUid={testMode?.uid}>
      {renderContent()}
    </SurveyLayout>
  );
}

export default SurveyLinkedPage;
