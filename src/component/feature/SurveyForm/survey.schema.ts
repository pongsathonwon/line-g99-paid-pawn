import { z } from "zod";
import type { TSurveyAnswer, TSurveyQuestion } from "@/api/endpoint/survey";
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

// Branch and type are not on the form in v2: they come from the transaction.
export type TSurveyFormValues = {
  ratings: Record<string, number | undefined>;
  texts: Record<string, string>;
};

export type TSurveyFormOutput = {
  ratings: Record<string, number | undefined>;
  texts: Record<string, string>;
};

export const createDefaultValues = (
  questions: TSurveyQuestion[],
): TSurveyFormValues => ({
  ratings: {},
  texts: Object.fromEntries(
    questions
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

/** The `answers` of POST /responses, in question order. */
export const toSurveyAnswers = (
  values: TSurveyFormOutput,
  questions: TSurveyQuestion[],
): TSurveyAnswer[] =>
  questions.flatMap((q): TSurveyAnswer[] => {
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
  });
