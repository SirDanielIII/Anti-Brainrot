import React from "react";
import Button from "./Button";

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
                <Button label="Start" onClick={() => { console.log("Start clicked"); onStart(); }} />
                <Button label="Pause" onClick={() => { console.log("Pause clicked"); onPause(); }} />
                <Button label="Reset" onClick={() => { console.log("Reset clicked"); onReset(); }} />
            </div>
        </div>
    );
};

export default Timer;
