import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useTimer from "./useTimer";

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initialization", () => {
    it("should initialize with the given value in milliseconds", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 5000, autoStart: false })
      );

      expect(result.current.time).toBe(5000);
      expect(result.current.timeMs).toBe(5000);
      expect(result.current.isRunning).toBe(false);
    });

    it("should initialize with value in seconds when unit is seconds", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 5, unit: "seconds", autoStart: false })
      );

      expect(result.current.time).toBe(5);
      expect(result.current.timeMs).toBe(5000);
    });

    it("should initialize with value in minutes when unit is minutes", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 2, unit: "minutes", autoStart: false })
      );

      expect(result.current.time).toBe(2);
      expect(result.current.timeMs).toBe(120000);
    });

    it("should auto-start by default", () => {
      const { result } = renderHook(() => useTimer({ initialValue: 5000 }));

      expect(result.current.isRunning).toBe(true);
    });

    it("should not auto-start when autoStart is false", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 5000, autoStart: false })
      );

      expect(result.current.isRunning).toBe(false);
    });
  });

  describe("countdown behavior", () => {
    it("should count down by step interval", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 5000, step: 1000 })
      );

      expect(result.current.timeMs).toBe(5000);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.timeMs).toBe(4000);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.timeMs).toBe(3000);
    });

    it("should stop at 0", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 2000, step: 1000 })
      );

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.timeMs).toBe(0);
      expect(result.current.isRunning).toBe(false);
    });

    it("should call onComplete when timer reaches 0", () => {
      const onComplete = vi.fn();
      renderHook(() =>
        useTimer({ initialValue: 2000, step: 1000, onComplete })
      );

      expect(onComplete).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("should use custom step value", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 5000, step: 500 })
      );

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.timeMs).toBe(4500);
    });
  });

  describe("start", () => {
    it("should start the timer", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 5000, autoStart: false })
      );

      expect(result.current.isRunning).toBe(false);

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);
    });

    it("should resume countdown after start", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 5000, step: 1000, autoStart: false })
      );

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.timeMs).toBe(4000);
    });
  });

  describe("pause", () => {
    it("should pause the timer", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 5000, step: 1000 })
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.timeMs).toBe(4000);

      act(() => {
        result.current.pause();
      });

      expect(result.current.isRunning).toBe(false);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.timeMs).toBe(4000);
    });
  });

  describe("reset", () => {
    it("should reset to initial value", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 5000, step: 1000 })
      );

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.timeMs).toBe(3000);

      act(() => {
        result.current.reset();
      });

      expect(result.current.timeMs).toBe(5000);
    });

    it("should reset to a new value when provided", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 5000, step: 1000 })
      );

      act(() => {
        result.current.reset(10000);
      });

      expect(result.current.timeMs).toBe(10000);
    });

    it("should reset with unit conversion when new value provided", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 5, unit: "seconds", step: 1000 })
      );

      act(() => {
        result.current.reset(10);
      });

      expect(result.current.time).toBe(10);
      expect(result.current.timeMs).toBe(10000);
    });

    it("should respect autoStart setting on reset", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 5000, autoStart: false })
      );

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.isRunning).toBe(false);
    });
  });

  describe("stop", () => {
    it("should stop the timer and reset to initial value", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 5000, step: 1000 })
      );

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.timeMs).toBe(3000);
      expect(result.current.isRunning).toBe(true);

      act(() => {
        result.current.stop();
      });

      expect(result.current.timeMs).toBe(5000);
      expect(result.current.isRunning).toBe(false);
    });
  });

  describe("unit conversions", () => {
    it("should return time in seconds when unit is seconds", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 10, unit: "seconds", step: 1000, autoStart: false })
      );

      expect(result.current.time).toBe(10);
      expect(result.current.timeMs).toBe(10000);
    });

    it("should return time in minutes when unit is minutes", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 5, unit: "minutes", autoStart: false })
      );

      expect(result.current.time).toBe(5);
      expect(result.current.timeMs).toBe(300000);
    });

    it("should decrement correctly with seconds unit", () => {
      const { result } = renderHook(() =>
        useTimer({ initialValue: 10, unit: "seconds", step: 1000 })
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.time).toBe(9);
      expect(result.current.timeMs).toBe(9000);
    });
  });

  describe("cleanup", () => {
    it("should clear interval on unmount", () => {
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");

      const { unmount } = renderHook(() =>
        useTimer({ initialValue: 5000, step: 1000 })
      );

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it("should clear interval when timer stops", () => {
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");

      const { result } = renderHook(() =>
        useTimer({ initialValue: 2000, step: 1000 })
      );

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.isRunning).toBe(false);
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });
});
