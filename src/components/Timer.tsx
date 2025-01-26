import React from "react";
import Button from "./Button";

interface TimerProps {
    isWorkPhase: boolean;
    remainingTime: string;
    onStart: () => void;
    onPause: () => void;
    onStop: () => void;
    onSkip: () => void;
    onReset: () => void;
}

const Timer: React.FC<TimerProps> = ({
                                         isWorkPhase,
                                         remainingTime,
                                         onStart,
                                         onPause,
                                         onStop,
                                         onSkip,
                                         onReset,
                                     }) => {
    return (
        <div className="timer-container">
            <h1>{isWorkPhase ? "Work Phase" : "Break Phase"}</h1>
            <div id="timer-display" className="timer">
                {remainingTime}
            </div>
            <div className="controls">
                <Button label="Start" onClick={() => {
                    onStart();
                }}/>
                <Button label="Pause" onClick={() => {
                    onPause();
                }}/>
                <Button label="Stop" onClick={() => {
                    onStop();
                }}/>
                <Button label="Skip" onClick={() => {
                    onSkip();
                }}/>
                <Button label="Reset" onClick={() => {
                    onReset();
                }}/>
            </div>
        </div>
    );
};

export default Timer;
