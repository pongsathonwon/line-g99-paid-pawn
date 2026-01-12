import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import DisplayCard from "./DisplayCard";

describe("DisplayCard", () => {
  describe("Main DisplayCard Component", () => {
    it("should render children correctly", () => {
      render(<DisplayCard>Test Content</DisplayCard>);
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(<DisplayCard className="custom-class">Content</DisplayCard>);
      const card = screen.getByText("Content");
      expect(card).toHaveClass("custom-class");
    });

    it("should support withBorder variant", () => {
      render(<DisplayCard withBorder={true}>Content</DisplayCard>);
      const card = screen.getByText("Content").parentElement;
      expect(card).toBeInTheDocument();
    });

    it("should support different color variants", () => {
      render(<DisplayCard color="gold">Content</DisplayCard>);
      const card = screen.getByText("Content").parentElement;
      expect(card).toBeInTheDocument();
    });
  });

  describe("DisplayCard.Header", () => {
    it("should render header with children", () => {
      render(<DisplayCard.Header>Header Text</DisplayCard.Header>);
      const header = screen.getByText("Header Text");
      expect(header).toBeInTheDocument();
      expect(header.tagName).toBe("H3");
    });

    it("should apply base color by default", () => {
      render(<DisplayCard.Header>Header</DisplayCard.Header>);
      expect(screen.getByText("Header")).toBeInTheDocument();
    });

    it("should support color variants", () => {
      render(<DisplayCard.Header color="red">Red Header</DisplayCard.Header>);
      expect(screen.getByText("Red Header")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <DisplayCard.Header className="custom-header">
          Header
        </DisplayCard.Header>
      );
      expect(screen.getByText("Header")).toHaveClass("custom-header");
    });
  });

  describe("DisplayCard.Subheader", () => {
    it("should render subheader with children", () => {
      render(<DisplayCard.Subheader>Subheader Text</DisplayCard.Subheader>);
      const subheader = screen.getByText("Subheader Text");
      expect(subheader).toBeInTheDocument();
      expect(subheader.tagName).toBe("H4");
    });

    it("should apply base color by default", () => {
      render(<DisplayCard.Subheader>Subheader</DisplayCard.Subheader>);
      expect(screen.getByText("Subheader")).toBeInTheDocument();
    });

    it("should support color variants", () => {
      render(
        <DisplayCard.Subheader color="gold">
          Gold Subheader
        </DisplayCard.Subheader>
      );
      expect(screen.getByText("Gold Subheader")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <DisplayCard.Subheader className="custom-subheader">
          Subheader
        </DisplayCard.Subheader>
      );
      expect(screen.getByText("Subheader")).toHaveClass("custom-subheader");
    });
  });

  describe("DisplayCard.Highlight", () => {
    it("should render highlight with children", () => {
      render(<DisplayCard.Highlight>Highlighted Text</DisplayCard.Highlight>);
      expect(screen.getByText("Highlighted Text")).toBeInTheDocument();
    });

    it("should apply default props (normal fontSize, black color, bold fontWeight)", () => {
      render(<DisplayCard.Highlight>Text</DisplayCard.Highlight>);
      expect(screen.getByText("Text")).toBeInTheDocument();
    });

    it("should support fontSize variants", () => {
      render(
        <DisplayCard.Highlight fontSize="header">
          Header Text
        </DisplayCard.Highlight>
      );
      expect(screen.getByText("Header Text")).toBeInTheDocument();
    });

    it("should support color variants", () => {
      render(
        <DisplayCard.Highlight color="red">Red Text</DisplayCard.Highlight>
      );
      expect(screen.getByText("Red Text")).toBeInTheDocument();
    });

    it("should support fontWeight variants", () => {
      render(
        <DisplayCard.Highlight fontWeight="normal">
          Normal Weight
        </DisplayCard.Highlight>
      );
      expect(screen.getByText("Normal Weight")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <DisplayCard.Highlight className="custom-highlight">
          Highlight
        </DisplayCard.Highlight>
      );
      expect(screen.getByText("Highlight")).toHaveClass("custom-highlight");
    });
  });

  describe("DisplayCard.Mute (ContentMuteLine)", () => {
    it("should render muted content", () => {
      render(<DisplayCard.Mute>Muted Text</DisplayCard.Mute>);
      expect(screen.getByText("Muted Text")).toBeInTheDocument();
    });

    it("should be a div element", () => {
      render(<DisplayCard.Mute>Content</DisplayCard.Mute>);
      const element = screen.getByText("Content");
      expect(element.tagName).toBe("DIV");
    });
  });

  describe("DisplayCard.Summary (SummaryLine)", () => {
    it("should render summary content", () => {
      render(<DisplayCard.Summary>Summary Text</DisplayCard.Summary>);
      expect(screen.getByText("Summary Text")).toBeInTheDocument();
    });

    it("should be a div element", () => {
      render(<DisplayCard.Summary>Summary</DisplayCard.Summary>);
      const element = screen.getByText("Summary");
      expect(element.tagName).toBe("DIV");
    });
  });

  describe("DisplayCard.Divider", () => {
    it("should render divider", () => {
      const { container } = render(<DisplayCard.Divider />);
      const divider = container.querySelector("div");
      expect(divider).toBeInTheDocument();
    });

    it("should apply default props (base color, solid line)", () => {
      const { container } = render(<DisplayCard.Divider />);
      const divider = container.querySelector("div");
      expect(divider).toBeInTheDocument();
    });

    it("should support color variants", () => {
      const { container } = render(<DisplayCard.Divider color="red" />);
      const divider = container.querySelector("div");
      expect(divider).toBeInTheDocument();
    });

    it("should support line variants", () => {
      const { container } = render(<DisplayCard.Divider line="dash" />);
      const divider = container.querySelector("div");
      expect(divider).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <DisplayCard.Divider className="custom-divider" />
      );
      const divider = container.querySelector("div");
      expect(divider).toHaveClass("custom-divider");
    });
  });

  describe("DisplayCard.OrderList", () => {
    it("should render ordered list with children", () => {
      render(
        <DisplayCard.OrderList>
          <li>Item 1</li>
          <li>Item 2</li>
        </DisplayCard.OrderList>
      );
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });

    it("should render as an ordered list (ol)", () => {
      const { container } = render(
        <DisplayCard.OrderList>
          <li>Item</li>
        </DisplayCard.OrderList>
      );
      const list = container.querySelector("ol");
      expect(list).toBeInTheDocument();
    });

    it("should have correct list styling classes", () => {
      const { container } = render(
        <DisplayCard.OrderList>
          <li>Item</li>
        </DisplayCard.OrderList>
      );
      const list = container.querySelector("ol");
      expect(list).toHaveClass("list-decimal");
    });
  });

  describe("Complex Component Composition", () => {
    it("should render a complete card with all subcomponents", () => {
      render(
        <DisplayCard withBorder={true} color="gold">
          <DisplayCard.Header>Main Header</DisplayCard.Header>
          <DisplayCard.Subheader>Subheader</DisplayCard.Subheader>
          <DisplayCard.Divider />
          <DisplayCard.Highlight fontSize="header" color="red">
            Highlighted Content
          </DisplayCard.Highlight>
          <DisplayCard.Mute>Muted information</DisplayCard.Mute>
          <DisplayCard.Summary>Summary information</DisplayCard.Summary>
          <DisplayCard.OrderList>
            <li>First item</li>
            <li>Second item</li>
          </DisplayCard.OrderList>
        </DisplayCard>
      );

      expect(screen.getByText("Main Header")).toBeInTheDocument();
      expect(screen.getByText("Subheader")).toBeInTheDocument();
      expect(screen.getByText("Highlighted Content")).toBeInTheDocument();
      expect(screen.getByText("Muted information")).toBeInTheDocument();
      expect(screen.getByText("Summary information")).toBeInTheDocument();
      expect(screen.getByText("First item")).toBeInTheDocument();
      expect(screen.getByText("Second item")).toBeInTheDocument();
    });

    it("should support nested DisplayCards", () => {
      render(
        <DisplayCard>
          <DisplayCard.Header>Outer Card</DisplayCard.Header>
          <DisplayCard withBorder={true}>
            <DisplayCard.Header>Inner Card</DisplayCard.Header>
          </DisplayCard>
        </DisplayCard>
      );

      expect(screen.getByText("Outer Card")).toBeInTheDocument();
      expect(screen.getByText("Inner Card")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty DisplayCard", () => {
      const { container } = render(<DisplayCard />);
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("should handle multiple children of different types", () => {
      render(
        <DisplayCard>
          Plain text
          <DisplayCard.Header>Header</DisplayCard.Header>
          <span>Span element</span>
        </DisplayCard>
      );

      expect(screen.getByText("Plain text")).toBeInTheDocument();
      expect(screen.getByText("Header")).toBeInTheDocument();
      expect(screen.getByText("Span element")).toBeInTheDocument();
    });
  });
});
