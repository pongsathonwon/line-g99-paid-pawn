import { useEffect, useState, useRef } from "react";

type TimeUnit = "milliseconds" | "seconds" | "minutes";

type TUseTimerProps = {
  initialValue: number;
  unit?: TimeUnit;
  step?: number;
  autoStart?: boolean;
  onComplete?: () => void;
};

const toMilliseconds = (value: number, unit: TimeUnit): number => {
  switch (unit) {
    case "seconds":
      return value * 1000;
    case "minutes":
      return value * 60 * 1000;
    case "milliseconds":
    default:
      return value;
  }
};

const fromMilliseconds = (ms: number, unit: TimeUnit): number => {
  switch (unit) {
    case "seconds":
      return ms / 1000;
    case "minutes":
      return ms / (60 * 1000);
    case "milliseconds":
    default:
      return ms;
  }
};

function useTimer({
  initialValue,
  unit = "milliseconds",
  step = 1000,
  autoStart = true,
  onComplete,
}: TUseTimerProps) {
  const initialMs = toMilliseconds(initialValue, unit);
  const [time, setTime] = useState(initialMs);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        const newTime = prev - step;

        // Stop at 0
        if (newTime <= 0) {
          setIsRunning(false);
          onComplete?.();
          return 0;
        }

        return newTime;
      });
    }, step);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, step, onComplete]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = (newTime?: number) => {
    const newMs =
      newTime === undefined ? initialMs : toMilliseconds(newTime, unit);
    setTime(newMs);
    setIsRunning(autoStart);
  };
  const stop = () => {
    setIsRunning(false);
    setTime(initialMs);
  };

  return {
    time: fromMilliseconds(time, unit),
    timeMs: time,
    isRunning,
    start,
    pause,
    reset,
    stop,
  };
}

export default useTimer;
