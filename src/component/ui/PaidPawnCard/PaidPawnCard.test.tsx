import "@testing-library/jest-dom/vitest";
import type { TGetHistPaidByIdRes } from "@/api/endpoint/pawn";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import PaidPawnCard from "./PaidPawnCard";

const MOCK_PROPS: TGetHistPaidByIdRes = {
  pawnNumb: "test",
  paidNumb: "paid",
  paidOrder: 1,
  paidAmou: 100,
  paidDisc: 10,
  paidDate: "2025-01-01",
  dueDate: "2025-01-07",
  paidStat: "1",
  custName: "cust",
  branchName: "branch",
  typeDesc: "type",
  laiDesc: "lai",
  goldType: "96.5",
  emplName: "online",
  pawnPrice: 20000,
  goodWeight: 1.36,
};

describe("test paid pawn card", () => {
  describe("test all props rendering", () => {
    beforeEach(() => {
      render(<PaidPawnCard {...MOCK_PROPS} />);
    });

    it("should render pawn number", () => {
      const label = screen.getByText("เลขที่สัญญา");
      expect(label).toBeInTheDocument();
      expect(label.nextElementSibling?.innerHTML).toBe(MOCK_PROPS.pawnNumb);
    });

    it("should render due date", () => {
      const label = screen.getByText("ครบกำหนด");
      expect(label).toBeInTheDocument();
      expect(label.nextElementSibling?.innerHTML).toBe("7/1/2568");
    });

    it("should render paid date", () => {
      const label = screen.getByText("วันที่ชำระ");
      expect(label).toBeInTheDocument();
      expect(label.nextElementSibling?.innerHTML).toBe("1/1/2568");
    });

    it("should render paid amount", () => {
      const label = screen.getByText("ยอดชำระ");
      expect(label).toBeInTheDocument();
      expect(label.nextElementSibling?.innerHTML).toBe("100 บาท");
    });

    it("should render discount", () => {
      const label = screen.getByText("ส่วนลดสมาชิก");
      expect(label).toBeInTheDocument();
      expect(label.nextElementSibling?.innerHTML).toBe("10 บาท");
    });

    it("should render customer name", () => {
      const label = screen.getByText("ชื่อลูกค้า");
      expect(label).toBeInTheDocument();
      expect(label.nextElementSibling?.innerHTML).toBe(MOCK_PROPS.custName);
    });

    it("should render branch name", () => {
      const label = screen.getByText("สาขา");
      expect(label).toBeInTheDocument();
      expect(label.nextElementSibling?.innerHTML).toBe(MOCK_PROPS.branchName);
    });

    it("should render product type and gold type", () => {
      const label = screen.getByText("สินค้า");
      expect(label).toBeInTheDocument();
      expect(label.nextElementSibling?.textContent).toBe(
        `${MOCK_PROPS.typeDesc} ${MOCK_PROPS.laiDesc}`,
      );
    });

    it("should render weight", () => {
      const label = screen.getByText("น้ำหนัก");
      expect(label).toBeInTheDocument();
      expect(label.nextElementSibling?.innerHTML).toBe("1.36 กรัม");
    });

    it("should render pawn price", () => {
      const label = screen.getByText("เงินต้น");
      expect(label).toBeInTheDocument();
      expect(label.nextElementSibling?.innerHTML).toBe("20,000 บาท");
    });

    it("should render employee name", () => {
      const label = screen.getByText("ผู้ทำรายการ");
      expect(label).toBeInTheDocument();
      expect(label.nextElementSibling?.innerHTML).toBe(MOCK_PROPS.emplName);
    });
  });

  describe("test discount logic", () => {
    it("should show 0 discount when paidDisc is 0", () => {
      render(<PaidPawnCard {...MOCK_PROPS} paidDisc={0} />);
      const label = screen.getByText("ส่วนลดสมาชิก");
      expect(label.nextElementSibling?.innerHTML).toBe("0 บาท");
    });

    it("should show 0 discount when paidAmou is 20", () => {
      render(<PaidPawnCard {...MOCK_PROPS} paidAmou={20} paidDisc={10} />);
      const label = screen.getByText("ส่วนลดสมาชิก");
      expect(label.nextElementSibling?.innerHTML).toBe("0 บาท");
    });
  });
});
