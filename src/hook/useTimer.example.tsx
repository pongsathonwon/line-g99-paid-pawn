/**
 * Example usage of useTimer hook
 */

import { useState } from "react";
import useTimer from "./useTimer";

// Example 1: Basic countdown timer (60 seconds) - NEW API
export function ExampleBasicCountdown() {
  const { time, isRunning, start, pause, reset } = useTimer({
    initialValue: 60,
    unit: "seconds", // 🎉 Much more readable!
  });

  return (
    <div>
      <h3>Countdown: {Math.floor(time)}s</h3>
      <p>Status: {isRunning ? "Running" : "Paused"}</p>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={() => reset()}>Reset</button>
    </div>
  );
}

// Example 2: OTP resend timer (with auto-start)
export function ExampleOTPResend() {
  const { time, reset } = useTimer({
    initialValue: 60,
    unit: "seconds",
    autoStart: true,
    onComplete: () => console.log("Can resend OTP now!"),
  });

  const handleResend = () => {
    console.log("Resending OTP...");
    reset(60); // Reset to 60 seconds and restart
  };

  return (
    <div>
      {time > 0 ? (
        <p>Resend OTP in {Math.floor(time)}s</p>
      ) : (
        <button onClick={handleResend}>Resend OTP</button>
      )}
    </div>
  );
}

// Example 3: Manual start (no auto-start)
export function ExampleManualStart() {
  const { time, isRunning, start, stop } = useTimer({
    initialValue: 30,
    unit: "seconds",
    autoStart: false,
  });

  return (
    <div>
      <h3>Timer: {Math.floor(time)}s</h3>
      {!isRunning && time === 30 && (
        <button onClick={start}>Start Timer</button>
      )}
      {isRunning && <button onClick={stop}>Stop & Reset</button>}
    </div>
  );
}

// Example 4: Minutes timer (quiz timer)
export function ExampleQuizTimer() {
  const [quizEnded, setQuizEnded] = useState(false);

  const { time, timeMs, isRunning, pause } = useTimer({
    initialValue: 5,
    unit: "minutes",
    onComplete: () => {
      setQuizEnded(true);
      alert("Time's up!");
    },
  });

  // Use timeMs for precise formatting
  const minutes = Math.floor(timeMs / 60000);
  const seconds = Math.floor((timeMs % 60000) / 1000);

  return (
    <div>
      <h3>
        Quiz Timer: {minutes}:{seconds.toString().padStart(2, "0")}
      </h3>
      <p>Time remaining: {time.toFixed(2)} minutes</p>
      {!quizEnded && <button onClick={pause}>Pause Quiz</button>}
      {quizEnded && <p>Quiz has ended!</p>}
    </div>
  );
}

// Example 5: Milliseconds for smooth animation
export function ExampleSmoothTimer() {
  const { time, start, pause, reset } = useTimer({
    initialValue: 10000,
    unit: "milliseconds",
    step: 100, // Update every 100ms
  });

  const seconds = (time / 1000).toFixed(1);

  return (
    <div>
      <h3>Smooth Timer: {seconds}s</h3>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={() => reset()}>Reset</button>
    </div>
  );
}

// Example 6: Multiple timers with different units
export function ExampleMultipleTimers() {
  const timer1 = useTimer({ initialValue: 30, unit: "seconds" });
  const timer2 = useTimer({ initialValue: 2, unit: "minutes", autoStart: false });

  return (
    <div>
      <div>
        <h4>Timer 1: {Math.floor(timer1.time)} seconds</h4>
        <button onClick={timer1.pause}>Pause</button>
        <button onClick={timer1.start}>Start</button>
      </div>
      <div>
        <h4>Timer 2: {timer2.time.toFixed(2)} minutes</h4>
        <button onClick={timer2.start}>Start</button>
        <button onClick={() => timer2.reset()}>Reset</button>
      </div>
    </div>
  );
}
