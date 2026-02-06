import { render, screen, type Screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import PayCard from "./PayCard";
import type { TPawnStatusEnum } from "@/hook/query/lib";

const mockData = {
  contractNumber: "000002",
  principal: 1000,
  dueDate: "2025-01-01",
  dateDiff: 8,
};

type TTestPawnStatus = {
  pawnStatus: TPawnStatusEnum;
  test: Array<(screen: Screen) => void>;
};

const testSuit: TTestPawnStatus[] = [
  {
    pawnStatus: "normal",
    test: [
      (screen) => expect(screen.getByRole("button")).toHaveClass("bg-gray"),
      (screen) =>
        expect(screen.getByTestId("button-label")).toHaveClass("text-gray-600"),
      (screen) =>
        expect(screen.getByText("ยังไม่ถึงกำหนด")).toBeInTheDocument(),
    ],
  },
  {
    pawnStatus: "due-soon",
    test: [
      (screen) => expect(screen.getByRole("button")).toHaveClass("bg-gold"),
      (screen) =>
        expect(screen.getByTestId("button-label")).toHaveClass("text-gold"),
      (screen) =>
        expect(
          screen.getByText(`${mockData.dateDiff} วันก่อนกำหนด`)
        ).toBeInTheDocument(),
    ],
  },
  {
    pawnStatus: "due",
    test: [
      (screen) =>
        expect(screen.getByRole("button")).toHaveClass("bg-brand-red"),
      (screen) =>
        expect(screen.getByTestId("button-label")).toHaveClass(
          "text-brand-red"
        ),
      (screen) => expect(screen.getByText("รอการชำระ")).toBeInTheDocument(),
    ],
  },
  {
    pawnStatus: "overdue",
    test: [
      (screen) => expect(screen.getByRole("button")).toHaveClass("bg-gray"),
      (screen) =>
        expect(screen.getByTestId("button-label")).toHaveClass(
          "text-brand-red"
        ),
      (screen) => expect(screen.getByText("เลยกำหนด")).toBeInTheDocument(),
    ],
  },
];

describe("test pay card", () => {
  describe("pay car component should render", () => {
    beforeEach(() => {
      render(
        <PayCard
          {...mockData}
          pawnStatus="normal"
          backgroundImage="test-background"
        />
      );
    });
    it("should render gold bag", () => {
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        "/money-bag-small.png"
      );
    });
    it("should render pawn numb", () => {
      expect(screen.getByText("เลขที่สัญญา")).toBeInTheDocument();
      expect(screen.getByText(mockData.contractNumber)).toBeInTheDocument();
    });

    it("should render principal amount", () => {
      expect(screen.getByText("จำนวนเงินต้น")).toBeInTheDocument();
      expect(
        screen.getByText(mockData.principal.toLocaleString("th-TH"))
      ).toBeInTheDocument();
    });

    it("should render due date", () => {
      expect(screen.getByText("วันครบกำหนด")).toBeInTheDocument();
      expect(screen.getByText("1/1/2568")).toBeInTheDocument();
    });

    it("should render correct background background", () => {
      expect(screen.getByTestId("card-background")).toHaveStyle({
        "background-image": 'url("test-background")',
      });
    });
  });

  describe("test correct status", () => {
    testSuit.forEach(({ pawnStatus, test }) => {
      it(`shoulder correct ${pawnStatus} status`, () => {
        render(<PayCard {...mockData} pawnStatus={pawnStatus} />);
        test.forEach((t) => {
          t(screen);
        });
      });
    });
  });
});
