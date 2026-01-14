import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import HistoryCard from "./HistoryCard";

const MOCK_PROPS = {
  pawnNumb: "test",
  paidAmou: 100,
  paidDisc: 10,
  paidDate: "2025-01-01",
  dueDate: "2025-01-07",
  paidStat: "1",
};

describe("test History Card component", () => {
  describe("test all props rendering", () => {
    beforeEach(() => {
      render(<HistoryCard {...MOCK_PROPS} />);
    });

    it("should render pawn number", () => {
      const pawnNumbLabel = screen.getByText("เลขที่สัญญา");
      expect(pawnNumbLabel).toBeInTheDocument();
      expect(pawnNumbLabel.nextElementSibling?.innerHTML).toBe(
        MOCK_PROPS.pawnNumb
      );
    });

    it("should render due date", () => {
      const pawnNumbLabel = screen.getByText("วันครบกำหนด");
      expect(pawnNumbLabel).toBeInTheDocument();
      expect(pawnNumbLabel.nextElementSibling?.innerHTML).toBe("7/1/2568");
    });

    it("should render paid date", () => {
      const pawnNumbLabel = screen.getByText("วันชำระ");
      expect(pawnNumbLabel).toBeInTheDocument();
      expect(pawnNumbLabel.nextElementSibling?.innerHTML).toBe("1/1/2568");
    });

    it("should render paid amount", () => {
      const pawnNumbLabel = screen.getByText("ยอดชำระ");
      expect(pawnNumbLabel).toBeInTheDocument();
      expect(pawnNumbLabel.nextElementSibling?.innerHTML).toBe("100 บาท");
    });
  });

  describe("test conditional render of on-time benefit", () => {
    it("should render discount", () => {
      render(<HistoryCard {...MOCK_PROPS} />);
      const pawnNumbLabel = screen.getByText("ประหยัดไป");
      expect(pawnNumbLabel).toHaveClass("text-green-300");
      expect(pawnNumbLabel.nextElementSibling?.innerHTML).toBe("10 บาท");
      expect(pawnNumbLabel.nextElementSibling).toHaveClass("text-green-300");
    });

    it("should not render discount", () => {
      render(<HistoryCard {...MOCK_PROPS} paidAmou={20} />);
      const pawnNumbLabel = screen.findByText("ประหยัดไป");
      waitFor(() => {
        expect(pawnNumbLabel).not.toBeInTheDocument();
      });
    });
  });
});
