import React from "react";

interface TimerProps {
  isWorkPhase: boolean;
  remainingTime: string;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const Timer: React.FC<TimerProps> = ({
  isWorkPhase,
  remainingTime,
  onStart,
  onPause,
  onReset,
}) => {
  return (
    <div className="timer-container">
      <h1>{isWorkPhase ? "Work Phase" : "Break Phase"}</h1>
      <div id="timer-display" className="timer">
        {remainingTime}
      </div>
      <div className="controls">
        <button onClick={onStart}>Start</button>
        <button onClick={onPause}>Pause</button>
        <button onClick={onReset}>Reset</button>
      </div>
    </div>
  );
};

export default Timer;