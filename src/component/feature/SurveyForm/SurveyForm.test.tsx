import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SurveyForm from "./SurveyForm";
import { SURVEY_TEXT } from "./survey.locale";
import { mockSurveyForm } from "@/test/setup/survey-api-mock";
import type { TSurveyForm } from "@/api/endpoint/survey";

const RATING_QUESTIONS = mockSurveyForm.questionSet.questions.filter(
  (q) => q.kind === "RATING_1_5",
);

const renderForm = (form: TSurveyForm = mockSurveyForm, isPending = false) => {
  const onSubmit = vi.fn();
  render(<SurveyForm form={form} onSubmit={onSubmit} isPending={isPending} />);
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

const pickTxn = (label: string) =>
  fireEvent.click(screen.getByRole("radio", { name: label }));

describe("SurveyForm", () => {
  it("shows the branch preset from the QR, the transaction chips and 5 rating rows", () => {
    renderForm();
    expect(screen.getByLabelText(/สาขาที่ใช้บริการ/)).toHaveValue("6");
    expect(screen.getByRole("radiogroup", { name: SURVEY_TEXT.txnTypeLabel })).toBeInTheDocument();
    mockSurveyForm.txnTypes.forEach((txn) =>
      expect(screen.getByRole("radio", { name: txn.label })).toBeInTheDocument(),
    );
    RATING_QUESTIONS.forEach((q) =>
      expect(screen.getByRole("radiogroup", { name: q.textTh })).toBeInTheDocument(),
    );
    expect(screen.getByLabelText("ความเห็นเพิ่มเติม")).toBeInTheDocument();
  });

  it("starts with an empty branch when there is no preset", () => {
    renderForm({ ...mockSurveyForm, presetBranchCode: null });
    expect(screen.getByLabelText(/สาขาที่ใช้บริการ/)).toHaveValue("");
  });

  it("keeps submit disabled until every required rating is set", () => {
    renderForm();
    expect(submitButton()).toBeDisabled();
    RATING_QUESTIONS.slice(0, 4).forEach((q) => rate(q.textTh, 5));
    expect(submitButton()).toBeDisabled();
    rate(RATING_QUESTIONS[4].textTh, 1);
    expect(submitButton()).toBeEnabled();
  });

  it("submits entry 'qr' with the ratings and trimmed comment", async () => {
    const { onSubmit } = renderForm();
    pickTxn("จำนำ");
    rateAll(4);
    fireEvent.change(screen.getByLabelText("ความเห็นเพิ่มเติม"), {
      target: { value: "  พนักงานบริการดีมาก " },
    });
    fireEvent.click(submitButton());

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit).toHaveBeenCalledWith({
      setId: 1,
      branchCode: 6,
      txnType: "PAWN",
      entry: "qr",
      answers: [
        { questionId: 11, rating: 4 },
        { questionId: 12, rating: 4 },
        { questionId: 13, rating: 4 },
        { questionId: 14, rating: 4 },
        { questionId: 15, rating: 4 },
        { questionId: 16, text: "พนักงานบริการดีมาก" },
      ],
    });
  });

  it("submits entry 'manual' after the branch is changed", async () => {
    const { onSubmit } = renderForm();
    fireEvent.change(screen.getByLabelText(/สาขาที่ใช้บริการ/), {
      target: { value: "30" },
    });
    pickTxn("ซื้อทอง");
    rateAll();
    fireEvent.click(submitButton());

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      branchCode: 30,
      txnType: "BUY_GOLD",
      entry: "manual",
    });
    expect(onSubmit.mock.calls[0][0].answers).toHaveLength(5);
  });

  it("requires a branch and a transaction type", async () => {
    const { onSubmit } = renderForm({ ...mockSurveyForm, presetBranchCode: 6 });
    fireEvent.change(screen.getByLabelText(/สาขาที่ใช้บริการ/), {
      target: { value: "" },
    });
    rateAll();
    fireEvent.click(submitButton());

    expect(await screen.findByText(SURVEY_TEXT.errors.branch)).toBeInTheDocument();
    expect(screen.getByText(SURVEY_TEXT.errors.txnType)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
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

    pickTxn("จำนำ");
    rateAll();
    fireEvent.click(submitButton());
    expect(await screen.findByText(SURVEY_TEXT.errors.textTooLong)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows the pending state while submitting", () => {
    renderForm(mockSurveyForm, true);
    expect(screen.getByRole("button", { name: SURVEY_TEXT.submitting })).toBeDisabled();
  });

  it("marks a required comment and shows its error", async () => {
    const form: TSurveyForm = {
      ...mockSurveyForm,
      questionSet: {
        ...mockSurveyForm.questionSet,
        questions: mockSurveyForm.questionSet.questions.map((q) =>
          q.kind === "TEXT" ? { ...q, isRequired: true } : q,
        ),
      },
    };
    const { onSubmit } = renderForm(form);
    expect(screen.getByLabelText(/ความเห็นเพิ่มเติม/)).not.toHaveAttribute("placeholder");
    pickTxn("จำนำ");
    rateAll();
    fireEvent.click(submitButton());
    expect(await screen.findByText(SURVEY_TEXT.errors.textRequired)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
