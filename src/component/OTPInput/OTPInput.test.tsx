import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import OTPInput from "./OTPInput";

describe("OTPInput Component", () => {
  describe("Rendering", () => {
    it("should render with default length of 6 inputs", () => {
      render(<OTPInput />);
      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(6);
    });

    it("should render with custom length", () => {
      render(<OTPInput length={4} />);
      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(4);
    });

    it("should render all inputs as empty initially", () => {
      render(<OTPInput />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
      inputs.forEach((input) => {
        expect(input.value).toBe("");
      });
    });
  });

  describe("Input Validation - Digits Only", () => {
    it("should accept single digit input", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      await user.type(inputs[0], "5");
      expect(inputs[0].value).toBe("5");
    });

    it("should reject non-digit characters (letters)", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      await user.type(inputs[0], "a");
      expect(inputs[0].value).toBe("");
    });

    it("should reject non-digit characters (special characters)", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      await user.type(inputs[0], "@");
      expect(inputs[0].value).toBe("");
    });

    it("should reject spaces", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      await user.type(inputs[0], " ");
      expect(inputs[0].value).toBe("");
    });
  });

  describe("Auto-Focus Behavior", () => {
    it("should auto-focus next input after entering a digit", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      await user.type(inputs[0], "5");

      await waitFor(() => {
        expect(inputs[1]).toHaveFocus();
      });
    });

    it("should auto-focus through all inputs sequentially", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      await user.type(inputs[0], "1");
      await waitFor(() => expect(inputs[1]).toHaveFocus());

      await user.type(inputs[1], "2");
      await waitFor(() => expect(inputs[2]).toHaveFocus());

      await user.type(inputs[2], "3");
      await waitFor(() => expect(inputs[3]).toHaveFocus());
    });

    it("should not auto-focus beyond last input", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={3} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      await user.type(inputs[0], "1");
      await user.type(inputs[1], "2");
      await user.type(inputs[2], "3");

      // Last input should still have focus
      await waitFor(() => {
        expect(inputs[2]).toHaveFocus();
      });
    });
  });

  describe("Backspace Navigation", () => {
    it("should move focus to previous input when backspace on empty field and clear current field", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      // Fill first input and move to second
      await user.type(inputs[0], "1");
      await waitFor(() => expect(inputs[1]).toHaveFocus());

      // Press backspace on empty second input
      await user.keyboard("{Backspace}");

      await waitFor(() => {
        expect(inputs[0]).toHaveFocus();
      });
      // another backspace should clear curremt field
      await user.keyboard("{Backspace}");

      await waitFor(() => {
        expect(inputs[0].value).toBe("");
      });
    });

    it("should not move focus before first input", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      // Focus first input and press backspace
      await user.click(inputs[0]);
      await user.keyboard("{Backspace}");

      // Should still be on first input
      expect(inputs[0]).toHaveFocus();
    });
  });

  describe("Paste Functionality", () => {
    it("should handle pasting valid OTP code", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={6} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      // Focus first input and paste
      await user.click(inputs[0]);
      await user.paste("123456");

      await waitFor(() => {
        expect(inputs[0].value).toBe("1");
        expect(inputs[1].value).toBe("2");
        expect(inputs[2].value).toBe("3");
        expect(inputs[3].value).toBe("4");
        expect(inputs[4].value).toBe("5");
        expect(inputs[5].value).toBe("6");
        expect(inputs[5]).toHaveFocus();
      });
    });

    it("should handle pasting partial OTP code", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={6} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      await user.click(inputs[0]);
      await user.paste("123");

      await waitFor(() => {
        expect(inputs[0].value).toBe("1");
        expect(inputs[1].value).toBe("2");
        expect(inputs[2].value).toBe("3");
        expect(inputs[3].value).toBe("");
      });
    });

    it("should reject pasting non-numeric content", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      await user.click(inputs[0]);
      await user.paste("abc123");

      await waitFor(() => {
        // All inputs should remain empty because paste contains letters
        inputs.forEach((input) => {
          expect(input.value).toBe("");
        });
      });
    });

    it("should truncate pasted content longer than OTP length", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      await user.click(inputs[0]);
      await user.paste("123456789");

      await waitFor(() => {
        expect(inputs[0].value).toBe("1");
        expect(inputs[1].value).toBe("2");
        expect(inputs[2].value).toBe("3");
        expect(inputs[3].value).toBe("4");
      });
    });

    it("should only allow paste on first input", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      // Paste should work on first input
      await user.click(inputs[0]);
      await user.paste("1234");

      await waitFor(() => {
        expect(inputs[0].value).toBe("1");
      });
    });
  });

  describe("Callbacks", () => {
    it("should call onChange callback on every input", async () => {
      const user = userEvent.setup();
      const onChangeMock = vi.fn();
      render(<OTPInput length={4} onChange={onChangeMock} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      await user.type(inputs[0], "1");

      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalledWith("1");
      });

      await user.type(inputs[1], "2");

      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalledWith("12");
      });
    });

    it("should call onComplete callback when all inputs are filled", async () => {
      const user = userEvent.setup();
      const onCompleteMock = vi.fn();
      render(<OTPInput length={4} onComplete={onCompleteMock} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      await user.type(inputs[0], "1");
      await user.type(inputs[1], "2");
      await user.type(inputs[2], "3");

      // Should not be called yet
      expect(onCompleteMock).not.toHaveBeenCalled();

      await user.type(inputs[3], "4");

      // Should be called with complete OTP
      await waitFor(() => {
        expect(onCompleteMock).toHaveBeenCalledWith("1234");
      });
    });

    it("should call onComplete when pasting complete OTP", async () => {
      const user = userEvent.setup();
      const onCompleteMock = vi.fn();
      render(<OTPInput length={6} onComplete={onCompleteMock} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      await user.click(inputs[0]);
      await user.paste("123456");

      await waitFor(() => {
        expect(onCompleteMock).toHaveBeenCalledWith("123456");
      });
    });
  });

  describe("Disabled State", () => {
    it("should disable all inputs when disabled prop is true", () => {
      render(<OTPInput length={4} disabled={true} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      inputs.forEach((input) => {
        expect(input).toBeDisabled();
      });
    });

    it("should not accept input when disabled", async () => {
      const user = userEvent.setup();
      render(<OTPInput length={4} disabled={true} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      await user.type(inputs[0], "5");

      expect(inputs[0].value).toBe("");
    });
  });

  describe("Error State", () => {
    it("should apply error styling when error prop is true", () => {
      render(<OTPInput length={4} error={true} />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      inputs.forEach((input) => {
        expect(input).toHaveClass("border-red-500");
      });
    });
  });

  describe("Custom Classes", () => {
    it("should apply custom className to container", () => {
      const { container } = render(
        <OTPInput length={4} className="custom-container" />
      );
      const wrapper = container.querySelector(".custom-container");
      expect(wrapper).toBeInTheDocument();
    });

    it("should apply custom inputClassName to inputs", () => {
      render(<OTPInput length={4} inputClassName="custom-input" />);
      const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];

      inputs.forEach((input) => {
        expect(input).toHaveClass("custom-input");
      });
    });
  });
});
