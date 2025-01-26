import React, {useEffect, useState} from "react";
import {DEFAULT_VALUES} from "./config.ts";
import Timer from "./components/Timer";
import Templates from "./components/Templates";
import Settings from "./components/Settings";
import ToggleButton from "./components/ToggleButton.tsx";
import {TIMER} from "./enums/TIMER.ts";
import {TimerMessage} from "./types/TimerMessage.ts";
import './styles/App.css'; // Adjust the path if needed


const App: React.FC = () => {
    const [workDuration, setWorkDuration] = useState(DEFAULT_VALUES.workDuration);
    const [breakDuration, setBreakDuration] = useState(DEFAULT_VALUES.breakDuration);
    const [remainingTime, setRemainingTime] = useState(DEFAULT_VALUES.remainingTime);
    const [isWorkPhase, setIsWorkPhase] = useState(DEFAULT_VALUES.isWorkPhase);
    const [timerRunning, setTimerRunning] = useState(DEFAULT_VALUES.timerRunning);
    const [showSettings, setShowSettings] = useState(DEFAULT_VALUES.showSettings);
    const [loops, setLoops] = useState(DEFAULT_VALUES.loops);
    const [loopsCurrent, setLoopsCurrent] = useState(DEFAULT_VALUES.loopsCurrent);

    // Fetch initial values from chrome.storage.sync
    useEffect(() => {
        chrome.storage.sync.get(
            [
                "workDuration",
                "breakDuration",
                "remainingTime",
                "isWorkPhase",
                "timerRunning",
                "showSettings",
                "loops",
                "loopsCurrent",
            ],
            (data) => {
                // Mapping keys to their respective state setters
                const stateSetters: Record<string, (value: any) => void> = {
                    workDuration: setWorkDuration,
                    breakDuration: setBreakDuration,
                    remainingTime: setRemainingTime,
                    isWorkPhase: setIsWorkPhase,
                    timerRunning: setTimerRunning,
                    showSettings: setShowSettings,
                    loops: setLoops,
                    loopsCurrent: setLoopsCurrent,
                };

                // Dynamically update state for valid data
                Object.entries(data).forEach(([key, value]) => {
                    if (key in stateSetters && value !== undefined) {
                        stateSetters[key](value);
                    }
                });
            }
        );
    }, []);

    useEffect(() => {
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
            if (areaName === "sync") {
                Object.entries(changes).forEach(([key, {newValue}]) => {
                    switch (key) {
                        case "workDuration":
                            if (typeof newValue === "number") setWorkDuration(newValue);
                            break;
                        case "breakDuration":
                            if (typeof newValue === "number") setBreakDuration(newValue);
                            break;
                        case "remainingTime":
                            if (typeof newValue === "number") setRemainingTime(newValue);
                            break;
                        case "isWorkPhase":
                            if (typeof newValue === "boolean") setIsWorkPhase(newValue);
                            break;
                        case "timerRunning":
                            if (typeof newValue === "boolean") setTimerRunning(newValue);
                            break;
                        case "showSettings":
                            if (typeof newValue === "boolean") setShowSettings(newValue);
                            break;
                        case "loops":
                            if (typeof newValue === "number") setLoops(newValue);
                            break;
                        case "loopsCurrent":
                            if (typeof newValue === "number") setLoopsCurrent(newValue);
                            break;
                        default:
                            console.warn(`Unhandled storage key change: ${key}`);
                    }
                });
            }
        };

        // Add the listener for storage changes
        chrome.storage.onChanged.addListener(handleStorageChange);

        // Clean up the listener on component unmount
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, []);
    /**
     * Converts seconds into HH:MM:SS format.
     * @param {number} seconds - The total number of seconds.
     * @returns {string} - The formatted time as HH:MM:SS.
     */
    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return [
            String(hours).padStart(2, '0'),
            String(minutes).padStart(2, '0'),
            String(secs).padStart(2, '0'),
        ].join(':');
    };

    /**
     * Updates React state + chrome storage together
     * @param {Object} updates - e.g. { workDuration: 25, breakDuration: 5 }
     */
    const updatePersistentValues = (updates: Record<string, any>) => {
        // Update local state
        Object.entries(updates).forEach(([key, value]) => {
            switch (key) {
                case "workDuration":
                    setWorkDuration(value);
                    break;
                case "breakDuration":
                    setBreakDuration(value);
                    break;
                case "remainingTime":
                    setRemainingTime(value);
                    break;
                case "isWorkPhase":
                    setIsWorkPhase(value);
                    break;
                case "timerRunning":
                    setTimerRunning(value);
                    break;
                case "showSettings":
                    setShowSettings(value);
                    break;
                case "loops":
                    setLoops(value);
                    break;
                case "loopsCurrent":
                    setLoopsCurrent(value);
                    break;
                default:
                    console.warn(`Unrecognized key: ${key}`);
            }
        });
        // Update chrome storage (asynchronously)
        chrome.storage.sync.set(updates, () => {
            console.log("Updated chrome.storage.sync with:", updates);
        });
    };

    // Send a message to the background script
    const sendMsgToBackground = (message: TimerMessage) => {
        chrome.runtime.sendMessage(message, (response) => {
            console.log("Response from background:", response);
        });
    };

    // Timer handlers
    const startTimer = () => {
        if (timerRunning) return;
        updatePersistentValues({timerRunning: true});
        sendMsgToBackground({action: TIMER.START, remainingTime, isWorkPhase});
    };

    const pauseTimer = () => {
        if (!timerRunning) return;
        updatePersistentValues({timerRunning: false});
        sendMsgToBackground({action: TIMER.PAUSE, remainingTime, isWorkPhase});
    };

    const stopTimer = () => {
        updatePersistentValues({timerRunning: false});
        sendMsgToBackground({action: TIMER.STOP, remainingTime, isWorkPhase});
    };

    const skipTimer = () => {
        if (!timerRunning) return;
        sendMsgToBackground({action: TIMER.SKIP, remainingTime, isWorkPhase});
    };

    const resetSettings = () => {
        sendMsgToBackground({action: TIMER.RESET, workDuration, isWorkPhase});
    };
    return (
        <div className="container">
            <h1>Pomodoro Timer ({loopsCurrent}/{loops})</h1>
            <Timer
                isWorkPhase={isWorkPhase}
                remainingTime={formatTime(remainingTime)}
                onStart={startTimer}
                onPause={pauseTimer}
                onStop={stopTimer}
                onSkip={skipTimer}
                onReset={resetSettings}
            />

            <Templates
                onSelectTemplate={(workTime, breakTime) => {
                    if (!timerRunning) {
                        updatePersistentValues({
                            workDuration: workTime * 60,
                            breakDuration: breakTime * 60,
                            remainingTime: workTime * 60,
                        });
                    }
                }}
            />

            {/*<ToggleButton*/}
            {/*    label="Show Settings"*/}
            {/*    onClick={() => updatePersistentValues({showSettings: !showSettings})}*/}
            {/*/>*/}

            {showSettings && (
                <Settings
                    onSaveSettings={(workTime, breakTime, loopsCount) => {
                        if (!timerRunning) {
                            updatePersistentValues({
                                workDuration: workTime,
                                breakDuration: breakTime,
                                remainingTime: workTime,
                                loops: loopsCount,
                            });
                        }
                    }}
                />
            )}
        </div>
    );
};

export default App;
