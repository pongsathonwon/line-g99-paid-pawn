import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormControl from "./FormControl";

describe("FormControl", () => {
  describe("Basic Rendering", () => {
    it("should render FormControl with label and input", () => {
      render(
        <FormControl id="test-input">
          <FormControl.Label>Username</FormControl.Label>
          <FormControl.Input placeholder="Enter username" />
        </FormControl>
      );

      expect(screen.getByLabelText("Username")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
    });

    it("should generate automatic ID when not provided", () => {
      render(
        <FormControl>
          <FormControl.Label>Email</FormControl.Label>
          <FormControl.Input />
        </FormControl>
      );

      const input = screen.getByLabelText("Email");
      expect(input).toHaveAttribute("id");
      expect(input.id).toBeTruthy();
    });

    it("should link label to input via htmlFor", () => {
      render(
        <FormControl id="email-field">
          <FormControl.Label>Email Address</FormControl.Label>
          <FormControl.Input />
        </FormControl>
      );

      const label = screen.getByText("Email Address");
      const input = screen.getByLabelText("Email Address");

      expect(label).toHaveAttribute("for", "email-field");
      expect(input).toHaveAttribute("id", "email-field");
    });
  });

  describe("Helper Text", () => {
    it("should display helper text", () => {
      render(
        <FormControl id="password">
          <FormControl.Label>Password</FormControl.Label>
          <FormControl.Input type="password" />
          <FormControl.Helper>Must be at least 8 characters</FormControl.Helper>
        </FormControl>
      );

      expect(
        screen.getByText("Must be at least 8 characters")
      ).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("should display error message", () => {
      render(
        <FormControl id="username" state="error">
          <FormControl.Label>Username</FormControl.Label>
          <FormControl.Input />
          <FormControl.Error>Username is required</FormControl.Error>
        </FormControl>
      );

      const errorMessage = screen.getByText("Username is required");
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute("role", "alert");
    });

    it("should set aria-invalid when in error state", () => {
      render(
        <FormControl id="email" state="error">
          <FormControl.Label>Email</FormControl.Label>
          <FormControl.Input />
          <FormControl.Error>Invalid email</FormControl.Error>
        </FormControl>
      );

      const input = screen.getByLabelText("Email");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("should link error message via aria-describedby", () => {
      render(
        <FormControl id="email" state="error">
          <FormControl.Label>Email</FormControl.Label>
          <FormControl.Input />
          <FormControl.Error>Invalid email format</FormControl.Error>
        </FormControl>
      );

      const input = screen.getByLabelText("Email");
      const errorMessage = screen.getByText("Invalid email format");

      expect(input).toHaveAttribute("aria-describedby", "email-error");
      expect(errorMessage).toHaveAttribute("id", "email-error");
    });
  });

  describe("Size Variants", () => {
    it("should render with small size", () => {
      render(
        <FormControl size="small">
          <FormControl.Label>Small Input</FormControl.Label>
          <FormControl.Input data-testid="small-input" />
        </FormControl>
      );

      const input = screen.getByTestId("small-input");
      expect(input).toBeInTheDocument();
    });

    it("should render with medium size (default)", () => {
      render(
        <FormControl size="medium">
          <FormControl.Label>Medium Input</FormControl.Label>
          <FormControl.Input data-testid="medium-input" />
        </FormControl>
      );

      const input = screen.getByTestId("medium-input");
      expect(input).toBeInTheDocument();
    });

    it("should render with large size", () => {
      render(
        <FormControl size="large">
          <FormControl.Label>Large Input</FormControl.Label>
          <FormControl.Input data-testid="large-input" />
        </FormControl>
      );

      const input = screen.getByTestId("large-input");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Color Variants", () => {
    it("should render with base color (default)", () => {
      render(
        <FormControl color="base">
          <FormControl.Label>Base Color</FormControl.Label>
          <FormControl.Input data-testid="base-input" />
        </FormControl>
      );

      expect(screen.getByTestId("base-input")).toBeInTheDocument();
    });

    it("should render with gold color", () => {
      render(
        <FormControl color="gold">
          <FormControl.Label>Gold Color</FormControl.Label>
          <FormControl.Input data-testid="gold-input" />
        </FormControl>
      );

      expect(screen.getByTestId("gold-input")).toBeInTheDocument();
    });
  });

  describe("State Variants", () => {
    it("should render in default state", () => {
      render(
        <FormControl state="default">
          <FormControl.Label>Default State</FormControl.Label>
          <FormControl.Input />
        </FormControl>
      );

      const input = screen.getByLabelText("Default State");
      expect(input).toHaveAttribute("aria-invalid", undefined);
    });

    it("should render in success state", () => {
      render(
        <FormControl state="success">
          <FormControl.Label>Success State</FormControl.Label>
          <FormControl.Input />
        </FormControl>
      );

      expect(screen.getByLabelText("Success State")).toBeInTheDocument();
    });

    it("should render in warning state", () => {
      render(
        <FormControl state="warning">
          <FormControl.Label>Warning State</FormControl.Label>
          <FormControl.Input />
        </FormControl>
      );

      expect(screen.getByLabelText("Warning State")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should allow typing in input", async () => {
      // const user = userEvent.setup();

      render(
        <FormControl id="name">
          <FormControl.Label>Name</FormControl.Label>
          <FormControl.Input />
        </FormControl>
      );

      const input = screen.getByLabelText("Name");
      const user = userEvent.setup();
      await user.type(input, "John Doe");

      expect(input).toHaveValue("John Doe");
    });

    it("should trigger onChange handler", async () => {
      const user = userEvent.setup();
      let value = "";

      render(
        <FormControl id="email">
          <FormControl.Label>Email</FormControl.Label>
          <FormControl.Input
            onChange={(e) => {
              value = e.target.value;
            }}
          />
        </FormControl>
      );

      const input = screen.getByLabelText("Email");
      await user.type(input, "test@example.com");

      expect(value).toBe("test@example.com");
    });

    it("should handle focus and blur", async () => {
      const user = userEvent.setup();

      render(
        <FormControl id="username">
          <FormControl.Label>Username</FormControl.Label>
          <FormControl.Input />
        </FormControl>
      );

      const input = screen.getByLabelText("Username");

      await user.click(input);
      expect(input).toHaveFocus();

      await user.tab();
      expect(input).not.toHaveFocus();
    });
  });

  describe("Input Attributes", () => {
    it("should pass through input attributes", () => {
      render(
        <FormControl id="phone">
          <FormControl.Label>Phone</FormControl.Label>
          <FormControl.Input
            type="tel"
            placeholder="555-1234"
            maxLength={10}
            required
            disabled
          />
        </FormControl>
      );

      const input = screen.getByLabelText("Phone");
      expect(input).toHaveAttribute("type", "tel");
      expect(input).toHaveAttribute("placeholder", "555-1234");
      expect(input).toHaveAttribute("maxLength", "10");
      expect(input).toBeRequired();
      expect(input).toBeDisabled();
    });

    it("should support custom className on input", () => {
      render(
        <FormControl id="custom">
          <FormControl.Label>Custom</FormControl.Label>
          <FormControl.Input
            className="custom-class"
            data-testid="custom-input"
          />
        </FormControl>
      );

      const input = screen.getByTestId("custom-input");
      expect(input).toHaveClass("custom-class");
    });

    it("should support custom className on FormControl wrapper", () => {
      render(
        <FormControl className="custom-wrapper" data-testid="wrapper">
          <FormControl.Label>Test</FormControl.Label>
          <FormControl.Input />
        </FormControl>
      );

      // FormControl renders a div, so we find the parent of the label
      const label = screen.getByText("Test");
      const wrapper = label.parentElement;
      expect(wrapper).toHaveClass("custom-wrapper");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes for error state", () => {
      render(
        <FormControl id="password" state="error">
          <FormControl.Label>Password</FormControl.Label>
          <FormControl.Input />
          <FormControl.Error>Password too short</FormControl.Error>
        </FormControl>
      );

      const input = screen.getByLabelText("Password");
      const error = screen.getByRole("alert");

      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAttribute("aria-describedby", "password-error");
      expect(error).toHaveAttribute("id", "password-error");
    });

    it("should not have aria-describedby when no error", () => {
      render(
        <FormControl id="username">
          <FormControl.Label>Username</FormControl.Label>
          <FormControl.Input />
        </FormControl>
      );

      const input = screen.getByLabelText("Username");
      expect(input).not.toHaveAttribute("aria-describedby");
      expect(input).toHaveAttribute("aria-invalid", undefined);
    });
  });

  describe("Context Error Handling", () => {
    it("should throw error when FormControl.Input used outside FormControl", () => {
      // Suppress console.error for this test
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(<FormControl.Input />);
      }).toThrow("form control context provider is required");

      spy.mockRestore();
    });

    it("should throw error when FormControl.Label used outside FormControl", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(<FormControl.Label>Label</FormControl.Label>);
      }).toThrow("form control context provider is required");

      spy.mockRestore();
    });
  });

  describe("Complete Form Examples", () => {
    it("should render complete form field with all elements", () => {
      render(
        <FormControl id="complete-field">
          <FormControl.Label>Email Address</FormControl.Label>
          <FormControl.Input type="email" placeholder="you@example.com" />
          <FormControl.Helper>We'll never share your email</FormControl.Helper>
        </FormControl>
      );

      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("you@example.com")
      ).toBeInTheDocument();
      expect(
        screen.getByText("We'll never share your email")
      ).toBeInTheDocument();
    });

    it("should render error state with all elements", () => {
      render(
        <FormControl id="error-field" state="error">
          <FormControl.Label>Password</FormControl.Label>
          <FormControl.Input type="password" />
          <FormControl.Error>
            Password must be at least 8 characters
          </FormControl.Error>
        </FormControl>
      );

      const input = screen.getByLabelText("Password");
      const error = screen.getByRole("alert");

      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(error).toHaveTextContent("Password must be at least 8 characters");
    });
  });
});
