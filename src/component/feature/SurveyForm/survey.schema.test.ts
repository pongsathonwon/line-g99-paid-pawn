import { describe, expect, it } from "vitest";
import { mockSurveyForm } from "@/test/setup/survey-api-mock";
import type { TSurveyQuestion } from "@/api/endpoint/survey";
import {
  SURVEY_TEXT_MAX_LENGTH,
  answerKey,
  createDefaultValues,
  createSurveySchema,
  getRequiredRatingKeys,
  isValidRating,
  toSurveyRequest,
} from "./survey.schema";
import { SURVEY_TEXT } from "./survey.locale";

const questions = mockSurveyForm.questionSet.questions;
const schema = createSurveySchema(questions);

const allFive = { q11: 5, q12: 5, q13: 5, q14: 5, q15: 5 };
const validValues = {
  branchCode: 6,
  txnType: "PAWN",
  ratings: allFive,
  texts: { q16: "" },
};

const issuesAt = (values: unknown, path: string) => {
  const result = schema.safeParse(values);
  if (result.success) return [];
  return result.error.issues.filter((i) => i.path.join(".") === path);
};

describe("createSurveySchema", () => {
  it("accepts a complete answer with an empty comment", () => {
    expect(schema.safeParse(validValues).success).toBe(true);
  });

  it.each([0, 6, 2.5, -1])("refuses rating %s", (rating) => {
    const issues = issuesAt(
      { ...validValues, ratings: { ...allFive, q12: rating } },
      "ratings.q12",
    );
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(SURVEY_TEXT.errors.rating);
  });

  it("refuses a missing required rating", () => {
    const { q13: _omit, ...ratings } = allFive;
    void _omit;
    const issues = issuesAt({ ...validValues, ratings }, "ratings.q13");
    expect(issues[0].message).toBe(SURVEY_TEXT.errors.rating);
  });

  it("refuses a null rating", () => {
    expect(
      issuesAt({ ...validValues, ratings: { ...allFive, q11: null } }, "ratings.q11"),
    ).toHaveLength(1);
  });

  it("lets an optional rating question stay empty", () => {
    const withOptional: TSurveyQuestion[] = [
      ...questions,
      { questionId: 20, seq: 7, questionKey: "extra", kind: "RATING_1_5", isRequired: false, textTh: "extra" },
    ];
    const result = createSurveySchema(withOptional).safeParse(validValues);
    expect(result.success).toBe(true);
  });

  it(`accepts a comment of ${SURVEY_TEXT_MAX_LENGTH} characters`, () => {
    const comment = "ก".repeat(SURVEY_TEXT_MAX_LENGTH);
    expect(
      schema.safeParse({ ...validValues, texts: { q16: comment } }).success,
    ).toBe(true);
  });

  it(`refuses a comment over ${SURVEY_TEXT_MAX_LENGTH} characters`, () => {
    const comment = "ก".repeat(SURVEY_TEXT_MAX_LENGTH + 1);
    const issues = issuesAt({ ...validValues, texts: { q16: comment } }, "texts.q16");
    expect(issues[0].message).toBe(SURVEY_TEXT.errors.textTooLong);
  });

  it("counts the comment length after trimming", () => {
    const comment = ` ${"ก".repeat(SURVEY_TEXT_MAX_LENGTH)} `;
    expect(
      schema.safeParse({ ...validValues, texts: { q16: comment } }).success,
    ).toBe(true);
  });

  it("requires text on a required TEXT question", () => {
    const requiredText = questions.map((q) =>
      q.kind === "TEXT" ? { ...q, isRequired: true } : q,
    );
    const result = createSurveySchema(requiredText).safeParse({
      ...validValues,
      texts: { q16: "   " },
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(SURVEY_TEXT.errors.textRequired);
  });

  it("requires a branch", () => {
    expect(issuesAt({ ...validValues, branchCode: null }, "branchCode")[0].message).toBe(
      SURVEY_TEXT.errors.branch,
    );
  });

  it("requires a transaction type", () => {
    expect(issuesAt({ ...validValues, txnType: "" }, "txnType")[0].message).toBe(
      SURVEY_TEXT.errors.txnType,
    );
  });
});

describe("survey form helpers", () => {
  it("keys answers by question id with a prefix", () => {
    expect(answerKey(12)).toBe("q12");
  });

  it("lists the required rating questions only", () => {
    expect(getRequiredRatingKeys(questions)).toEqual(["q11", "q12", "q13", "q14", "q15"]);
  });

  it.each([
    [1, true],
    [5, true],
    [0, false],
    [6, false],
    [undefined, false],
  ])("isValidRating(%s) = %s", (value, expected) => {
    expect(isValidRating(value)).toBe(expected);
  });

  it("presets the branch from the form and starts with no ratings", () => {
    expect(createDefaultValues(mockSurveyForm)).toEqual({
      branchCode: 6,
      txnType: "",
      ratings: {},
      texts: { q16: "" },
    });
  });
});

describe("toSurveyRequest", () => {
  it("sends entry 'qr' when the preset branch was kept", () => {
    const req = toSurveyRequest(
      { ...validValues, texts: { q16: "  บริการดีมาก  " } },
      mockSurveyForm,
    );
    expect(req).toEqual({
      setId: 1,
      branchCode: 6,
      txnType: "PAWN",
      entry: "qr",
      answers: [
        { questionId: 11, rating: 5 },
        { questionId: 12, rating: 5 },
        { questionId: 13, rating: 5 },
        { questionId: 14, rating: 5 },
        { questionId: 15, rating: 5 },
        { questionId: 16, text: "บริการดีมาก" },
      ],
    });
  });

  it("sends entry 'manual' when the branch was changed", () => {
    const req = toSurveyRequest({ ...validValues, branchCode: 30 }, mockSurveyForm);
    expect(req.entry).toBe("manual");
  });

  it("sends entry 'manual' when there was no preset branch", () => {
    const req = toSurveyRequest(validValues, {
      ...mockSurveyForm,
      presetBranchCode: null,
    });
    expect(req.entry).toBe("manual");
  });

  it("leaves out an empty comment and unanswered optional ratings", () => {
    const form = {
      ...mockSurveyForm,
      questionSet: {
        ...mockSurveyForm.questionSet,
        questions: [
          ...questions,
          { questionId: 20, seq: 7, questionKey: "extra", kind: "RATING_1_5" as const, isRequired: false, textTh: "extra" },
          { questionId: 21, seq: 8, questionKey: "future", kind: "CHOICE" as never, isRequired: false, textTh: "future" },
        ],
      },
    };
    const req = toSurveyRequest({ ...validValues, texts: { q16: "   " } }, form);
    expect(req.answers.map((a) => a.questionId)).toEqual([11, 12, 13, 14, 15]);
  });
});
