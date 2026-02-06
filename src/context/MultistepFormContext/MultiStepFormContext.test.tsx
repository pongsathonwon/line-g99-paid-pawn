import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMultistepForm } from "./MultiStepFormContext";
import { multistepFormWrapperFactory } from "@/test/setup/wrapper-factory";

describe("test multi step form context and hhok", () => {
  describe("test context required", () => {
    it("should throw error", () => {
      expect(() => renderHook(() => useMultistepForm())).toThrowError();
    });
  });

  describe("test functionality", () => {
    it("should navigate correctly", () => {
      const wrapper = multistepFormWrapperFactory(3);
      const { result } = renderHook(useMultistepForm, { wrapper });
      expect(result.current.activePage).toBe(1);
      act(() => {
        result.current.back();
      });
      expect(result.current.activePage).toBe(1);
      act(() => {
        result.current.next();
        result.current.next();
      });
      expect(result.current.activePage).toBe(3);
      act(() => {
        result.current.next();
      });
      expect(result.current.activePage).toBe(3);
    });
  });
});
