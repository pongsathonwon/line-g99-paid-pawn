import { z } from "zod";
import type {
  TSurveyAnswer,
  TSurveyForm,
  TSurveyQuestion,
  TSurveyResponseReq,
} from "@/api/endpoint/survey";
import { SURVEY_TEXT } from "./survey.locale";

export const SURVEY_TEXT_MAX_LENGTH = 1000;

// react-hook-form reads a numeric path segment as an array index, so answers
// are keyed "q{questionId}" instead of by the bare id.
export const answerKey = (questionId: number) => `q${questionId}`;

const t = SURVEY_TEXT.errors;

export const ratingSchema = z
  .number({ error: t.rating })
  .int(t.rating)
  .min(1, t.rating)
  .max(5, t.rating);

const textSchema = z.string().trim().max(SURVEY_TEXT_MAX_LENGTH, t.textTooLong);

const isRating = (q: TSurveyQuestion) => q.kind === "RATING_1_5";
const isText = (q: TSurveyQuestion) => q.kind === "TEXT";

/** Built from the question set, so a new set version needs no code change. */
export const createSurveySchema = (questions: TSurveyQuestion[]) =>
  z.object({
    branchCode: z.number({ error: t.branch }).int(t.branch),
    txnType: z.string({ error: t.txnType }).min(1, t.txnType),
    ratings: z.object(
      Object.fromEntries(
        questions
          .filter(isRating)
          .map((q) => [
            answerKey(q.questionId),
            q.isRequired ? ratingSchema : ratingSchema.optional(),
          ]),
      ),
    ),
    texts: z.object(
      Object.fromEntries(
        questions
          .filter(isText)
          .map((q) => [
            answerKey(q.questionId),
            q.isRequired ? textSchema.min(1, t.textRequired) : textSchema,
          ]),
      ),
    ),
  });

export type TSurveyFormValues = {
  branchCode: number | null;
  txnType: string;
  ratings: Record<string, number | undefined>;
  texts: Record<string, string>;
};

export type TSurveyFormOutput = {
  branchCode: number;
  txnType: string;
  ratings: Record<string, number | undefined>;
  texts: Record<string, string>;
};

export const createDefaultValues = (form: TSurveyForm): TSurveyFormValues => ({
  branchCode: form.presetBranchCode,
  txnType: "",
  ratings: {},
  texts: Object.fromEntries(
    form.questionSet.questions
      .filter(isText)
      .map((q) => [answerKey(q.questionId), ""]),
  ),
});

export const getRequiredRatingKeys = (questions: TSurveyQuestion[]) =>
  questions
    .filter((q) => isRating(q) && q.isRequired)
    .map((q) => answerKey(q.questionId));

export const isValidRating = (value: unknown) =>
  ratingSchema.safeParse(value).success;

export const toSurveyRequest = (
  values: TSurveyFormOutput,
  form: TSurveyForm,
): TSurveyResponseReq => ({
  setId: form.questionSet.setId,
  branchCode: values.branchCode,
  txnType: values.txnType,
  // "qr" only while the branch is still the one preset from the QR's ?b=.
  // Also in test mode: GoldenApi accepts only qr/manual and records "test"
  // itself.
  entry:
    form.presetBranchCode !== null &&
    values.branchCode === form.presetBranchCode
      ? "qr"
      : "manual",
  answers: form.questionSet.questions.flatMap((q): TSurveyAnswer[] => {
    const key = answerKey(q.questionId);
    if (isRating(q)) {
      const rating = values.ratings[key];
      return rating === undefined ? [] : [{ questionId: q.questionId, rating }];
    }
    if (isText(q)) {
      const text = values.texts[key]?.trim();
      return text ? [{ questionId: q.questionId, text }] : [];
    }
    return [];
  }),
});
