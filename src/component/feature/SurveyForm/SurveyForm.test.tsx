import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SurveyForm from "./SurveyForm";
import { SURVEY_TEXT } from "./survey.locale";
import { mockSurveyForm } from "@/test/setup/survey-api-mock";
import type { TSurveyQuestionSet } from "@/api/endpoint/survey";

const RATING_QUESTIONS = mockSurveyForm.questionSet.questions.filter(
  (q) => q.kind === "RATING_1_5",
);

const renderForm = (
  questionSet: TSurveyQuestionSet = mockSurveyForm.questionSet,
  isPending = false,
) => {
  const onSubmit = vi.fn();
  render(
    <SurveyForm questionSet={questionSet} onSubmit={onSubmit} isPending={isPending} />,
  );
  return { onSubmit };
};

const submitButton = () => screen.getByRole("button", { name: SURVEY_TEXT.submit });

const rate = (questionText: string, stars: number) => {
  const group = screen.getByRole("radiogroup", { name: questionText });
  const star = Array.from(group.querySelectorAll('[role="radio"]'))[stars - 1];
  fireEvent.click(star);
};

const rateAll = (stars = 4) =>
  RATING_QUESTIONS.forEach((q) => rate(q.textTh, stars));

describe("SurveyForm", () => {
  it("shows 5 rating rows and the comment, no branch or type pickers", () => {
    renderForm();
    RATING_QUESTIONS.forEach((q) =>
      expect(screen.getByRole("radiogroup", { name: q.textTh })).toBeInTheDocument(),
    );
    expect(screen.getByLabelText("ความเห็นเพิ่มเติม")).toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("keeps submit disabled until every required rating is set", () => {
    renderForm();
    expect(submitButton()).toBeDisabled();
    RATING_QUESTIONS.slice(0, 4).forEach((q) => rate(q.textTh, 5));
    expect(submitButton()).toBeDisabled();
    rate(RATING_QUESTIONS[4].textTh, 1);
    expect(submitButton()).toBeEnabled();
  });

  it("submits the ratings and the trimmed comment", async () => {
    const { onSubmit } = renderForm();
    rateAll(4);
    fireEvent.change(screen.getByLabelText("ความเห็นเพิ่มเติม"), {
      target: { value: "  พนักงานบริการดีมาก " },
    });
    fireEvent.click(submitButton());

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit).toHaveBeenCalledWith([
      { questionId: 11, rating: 4 },
      { questionId: 12, rating: 4 },
      { questionId: 13, rating: 4 },
      { questionId: 14, rating: 4 },
      { questionId: 15, rating: 4 },
      { questionId: 16, text: "พนักงานบริการดีมาก" },
    ]);
  });

  it("counts comment characters and refuses more than 1,000", async () => {
    const { onSubmit } = renderForm();
    const counter = screen.getByTestId("survey-text-16-counter");
    expect(counter).toHaveTextContent("0/1,000");

    fireEvent.change(screen.getByLabelText("ความเห็นเพิ่มเติม"), {
      target: { value: "ก".repeat(1001) },
    });
    expect(counter).toHaveTextContent("1,001/1,000");
    expect(counter).toHaveClass("text-red-600");

    rateAll();
    fireEvent.click(submitButton());
    expect(await screen.findByText(SURVEY_TEXT.errors.textTooLong)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows the pending state while submitting", () => {
    renderForm(mockSurveyForm.questionSet, true);
    expect(screen.getByRole("button", { name: SURVEY_TEXT.submitting })).toBeDisabled();
  });

  it("marks a required comment and shows its error", async () => {
    const questionSet: TSurveyQuestionSet = {
      ...mockSurveyForm.questionSet,
      questions: mockSurveyForm.questionSet.questions.map((q) =>
        q.kind === "TEXT" ? { ...q, isRequired: true } : q,
      ),
    };
    const { onSubmit } = renderForm(questionSet);
    expect(screen.getByLabelText(/ความเห็นเพิ่มเติม/)).not.toHaveAttribute("placeholder");
    rateAll();
    fireEvent.click(submitButton());
    expect(await screen.findByText(SURVEY_TEXT.errors.textRequired)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
