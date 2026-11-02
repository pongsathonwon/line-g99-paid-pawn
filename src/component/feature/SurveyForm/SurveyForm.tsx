import { useMemo } from "react";
import {
  Controller,
  useForm,
  useWatch,
  type Control,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Button } from "@/component/Button";
import FormControl from "@/component/FormControl/FormControl";
import { formControlInputVariants } from "@/component/FormControl/formControl.variants";
import StarRating from "@/component/ui/StarRating/StarRating";
import type {
  TSurveyForm,
  TSurveyQuestion,
  TSurveyResponseReq,
} from "@/api/endpoint/survey";
import { SURVEY_TEXT } from "./survey.locale";
import {
  SURVEY_TEXT_MAX_LENGTH,
  answerKey,
  createDefaultValues,
  createSurveySchema,
  getRequiredRatingKeys,
  isValidRating,
  toSurveyRequest,
  type TSurveyFormOutput,
  type TSurveyFormValues,
} from "./survey.schema";

const t = SURVEY_TEXT;

type TSurveyFormProps = {
  form: TSurveyForm;
  onSubmit: (req: TSurveyResponseReq) => void;
  isPending?: boolean;
};

function SurveyForm({ form, onSubmit, isPending = false }: TSurveyFormProps) {
  const { questions } = form.questionSet;
  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => a.seq - b.seq),
    [questions],
  );
  const requiredRatingKeys = useMemo(
    () => getRequiredRatingKeys(questions),
    [questions],
  );
  const resolver = useMemo(
    () =>
      zodResolver(createSurveySchema(questions)) as unknown as Resolver<
        TSurveyFormValues,
        unknown,
        TSurveyFormOutput
      >,
    [questions],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TSurveyFormValues, unknown, TSurveyFormOutput>({
    defaultValues: createDefaultValues(form),
    resolver,
  });

  const ratings = useWatch({ control, name: "ratings" });
  const allRequiredRated = requiredRatingKeys.every((key) =>
    isValidRating(ratings?.[key]),
  );

  const submit = (values: TSurveyFormOutput) =>
    onSubmit(toSurveyRequest(values, form));

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-col gap-6"
      noValidate
    >
      <Controller
        name="branchCode"
        control={control}
        render={({ field }) => (
          <FormControl id="survey-branch" state={errors.branchCode ? "error" : "default"}>
            <FormControl.Label>
              {t.branchLabel}
              <span className="text-red-500 ml-1">*</span>
            </FormControl.Label>
            <select
              id="survey-branch"
              ref={field.ref}
              name={field.name}
              value={field.value ?? ""}
              onBlur={field.onBlur}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              className={formControlInputVariants({
                state: errors.branchCode ? "error" : "default",
              })}
            >
              <option value="">{t.branchPlaceholder}</option>
              {form.branches.map((branch) => (
                <option key={branch.branchCode} value={branch.branchCode}>
                  {branch.branchShortName}
                  {branch.branchName ? ` ${branch.branchName}` : ""}
                </option>
              ))}
            </select>
            {errors.branchCode && (
              <FormControl.Error>{errors.branchCode.message}</FormControl.Error>
            )}
          </FormControl>
        )}
      />

      <Controller
        name="txnType"
        control={control}
        render={({ field }) => (
          <fieldset className="flex flex-col gap-2">
            <legend className="font-medium text-gray-700 mb-2">
              {t.txnTypeLabel}
              <span className="text-red-500 ml-1">*</span>
            </legend>
            <div
              role="radiogroup"
              aria-label={t.txnTypeLabel}
              className="flex flex-wrap gap-2"
            >
              {form.txnTypes.map((txn) => {
                const isActive = field.value === txn.code;
                return (
                  <button
                    key={txn.code}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => field.onChange(txn.code)}
                    className={clsx(
                      "rounded-full border px-4 py-2 text-sm font-medium transition",
                      isActive
                        ? "border-brand-red bg-brand-red text-white"
                        : "border-gray-300 bg-white text-gray-800 hover:border-gray-400",
                    )}
                  >
                    {txn.label}
                  </button>
                );
              })}
            </div>
            {errors.txnType && (
              <span role="alert" className="text-sm text-red-600">
                {errors.txnType.message}
              </span>
            )}
          </fieldset>
        )}
      />

      <p className="text-sm text-gray-500">{t.ratingHint}</p>

      {sortedQuestions.map((q) =>
        q.kind === "RATING_1_5" ? (
          <RatingQuestion
            key={q.questionId}
            question={q}
            control={control}
            error={errors.ratings?.[answerKey(q.questionId)]?.message}
          />
        ) : q.kind === "TEXT" ? (
          <TextQuestion
            key={q.questionId}
            question={q}
            control={control}
            error={errors.texts?.[answerKey(q.questionId)]?.message}
          />
        ) : null,
      )}

      <Button
        type="submit"
        fullWidth
        size="lg"
        disabled={!allRequiredRated || isPending}
      >
        {isPending ? t.submitting : t.submit}
      </Button>
    </form>
  );
}

type TQuestionProps = {
  question: TSurveyQuestion;
  control: Control<TSurveyFormValues, unknown, TSurveyFormOutput>;
  error?: string;
};

function RatingQuestion({ question, control, error }: TQuestionProps) {
  return (
    <Controller
      name={`ratings.${answerKey(question.questionId)}`}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium text-gray-800">
            {question.textTh}
            {question.isRequired && <span className="text-red-500 ml-1">*</span>}
          </p>
          <StarRating
            label={question.textTh}
            value={field.value}
            onChange={field.onChange}
            starLabel={t.star}
            invalid={Boolean(error)}
          />
          {error && (
            <span role="alert" className="text-sm text-red-600">
              {error}
            </span>
          )}
        </div>
      )}
    />
  );
}

function TextQuestion({ question, control, error }: TQuestionProps) {
  const id = `survey-text-${question.questionId}`;
  return (
    <Controller
      name={`texts.${answerKey(question.questionId)}`}
      control={control}
      render={({ field }) => {
        const length = field.value?.length ?? 0;
        const isOver = length > SURVEY_TEXT_MAX_LENGTH;
        return (
          <FormControl id={id} state={error ? "error" : "default"}>
            <FormControl.Label>
              {question.textTh}
              {question.isRequired && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </FormControl.Label>
            <textarea
              {...field}
              id={id}
              rows={4}
              placeholder={question.isRequired ? undefined : t.textPlaceholder}
              aria-invalid={Boolean(error)}
              className={formControlInputVariants({
                state: error ? "error" : "default",
              })}
            />
            <div className="flex justify-between gap-2 text-sm">
              <span role={error ? "alert" : undefined} className="text-red-600">
                {error}
              </span>
              <span
                data-testid={`${id}-counter`}
                className={isOver ? "text-red-600" : "text-gray-500"}
              >
                {t.textCounter(length, SURVEY_TEXT_MAX_LENGTH)}
              </span>
            </div>
          </FormControl>
        );
      }}
    />
  );
}

export default SurveyForm;
