import React, {useEffect, useState} from "react";
import Timer from "./components/Timer";
import Templates from "./components/Templates";
import Settings from "./components/Settings";
import ToggleButton from "./components/ToggleButton.tsx";
import {TIMER} from "./enums/TIMER.ts";
import {TimerMessage} from "./types/TimerMessage.ts";

/** Default audio alert file — can be changed or removed as needed. */
const AUDIO_COMPLETE_DEFAULT = "/audio/four.mp3";

const DEFAULT_WORK_DURATION = 40 * 60; // 40 minutes
const DEFAULT_BREAK_DURATION = 10 * 60; // 10 minutes

const App: React.FC = () => {
    const [workDuration, setWorkDuration] = useState(DEFAULT_WORK_DURATION);
    const [breakDuration, setBreakDuration] = useState(DEFAULT_BREAK_DURATION);
    const [remainingTime, setRemainingTime] = useState(DEFAULT_WORK_DURATION);
    const [isWorkPhase, setIsWorkPhase] = useState(true);
    const [timerRunning, setTimerRunning] = useState(false);
    const [audioComplete, setAudioComplete] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);

    // Fetch initial values from chrome.storage.sync
    useEffect(() => {
        chrome.storage.sync.get(
            [
                "workDuration",
                "breakDuration",
                "remainingTime",
                "isWorkPhase",
                "timerRunning",
                "audioComplete",
                "showSettings",
            ],
            ({
                 workDuration,
                 breakDuration,
                 remainingTime,
                 isWorkPhase,
                 timerRunning,
                 audioComplete,
                 showSettings,
             }) => {
                if (typeof workDuration === "number") setWorkDuration(workDuration);
                if (typeof breakDuration === "number") setBreakDuration(breakDuration);
                if (typeof remainingTime === "number") setRemainingTime(remainingTime);
                if (typeof isWorkPhase === "boolean") setIsWorkPhase(isWorkPhase);
                if (typeof timerRunning === "boolean") setTimerRunning(timerRunning);
                if (typeof audioComplete === "string") setAudioComplete(audioComplete);
                if (typeof showSettings === "boolean") setShowSettings(showSettings);
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
                        case "audioComplete":
                            if (typeof newValue === "string") setAudioComplete(newValue);
                            break;
                        case "showSettings":
                            if (typeof newValue === "boolean") setShowSettings(newValue);
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
                case "audioComplete":
                    setAudioComplete(value);
                    break;
                case "showSettings":
                    setShowSettings(value);
                    break;
                default:
                    console.warn(`Unrecognized key: ${key}`);
            }
        });

        // Update chrome storage (asynchronously)
        chrome.storage.sync.set(updates);
    };

    // Play audio alert (if set, otherwise default)
    const playAudioAlert = () => {
        const audioSrc = audioComplete ?? AUDIO_COMPLETE_DEFAULT;
        const audio = new Audio(audioSrc);
        audio.play().catch((error) => {
            console.error("Error playing audio:", error);
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
        if (!timerRunning) return;
        updatePersistentValues({timerRunning: false});
        sendMsgToBackground({action: TIMER.STOP, remainingTime, isWorkPhase});
    };

    const skipTimer = () => {
        if (!timerRunning) return;
        sendMsgToBackground({action: TIMER.SKIP, remainingTime, isWorkPhase});
    };

    const resetSettings = () => {
        updatePersistentValues({
            workDuration: DEFAULT_WORK_DURATION,
            breakDuration: DEFAULT_BREAK_DURATION,
            remainingTime: DEFAULT_WORK_DURATION,
            isWorkPhase: true,
            timerRunning: false,
            audioComplete: undefined, // if you still need to clear this in storage
        });
        sendMsgToBackground({action: TIMER.RESET, DEFAULT_WORK_DURATION, isWorkPhase});
    };

    return (
        <div className="container">
            <h1>Pomodoro Timer</h1>
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

            <ToggleButton
                label="Toggle Settings"
                onClick={() => updatePersistentValues({showSettings: !showSettings})}
            />

            {showSettings && (
                <Settings
                    onSaveSettings={(workTime, breakTime) => {

                        if (!timerRunning) {
                            updatePersistentValues({
                                workDuration: workTime,
                                breakDuration: breakTime,
                                remainingTime: workTime,
                            });
                        }
                    }}
                    onAudioUpload={(audioFile) => {
                        if (!timerRunning) {
                            updatePersistentValues({audioComplete: audioFile});
                        }
                    }}
                />
            )}
        </div>
    );
};

export default App;
