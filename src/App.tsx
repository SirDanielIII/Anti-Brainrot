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
        console.log("Fetching values from chrome.storage.sync");
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
        const messageListener = (message: { action: string; newRemainingTime?: number, isWorkPhase?: boolean }) => {
            if (message.action === "UPDATE_REMAINING_TIME") {
                console.log("Received new remaining time:", message.newRemainingTime);
                setRemainingTime(message.newRemainingTime);
                setIsWorkPhase(message.isWorkPhase);
            }
        };

        chrome.runtime.onMessage.addListener(messageListener);

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    }, []);


    useEffect(() => { // Runs everytime values are updated
        const messageListener = (message: { action: string; remainingTime, isWorkPhase, timerRunning, workDuration, breakDuration }) => {
            if (message.action === "UPDATE_VALUES") {

            }
        };

        // Add the listener for messages from the background script
        chrome.runtime.onMessage.addListener(messageListener);

        // Clean up the listener when the component is unmounted
        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
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
        console.log("Start timer");
        updatePersistentValues({timerRunning: true});
        sendMsgToBackground({action: TIMER.START, remainingTime, isWorkPhase});
    };

    const pauseTimer = () => {
        if (!timerRunning) return;
        console.log("Pause timer");
        updatePersistentValues({timerRunning: false});
        sendMsgToBackground({action: TIMER.PAUSE, remainingTime, isWorkPhase});
    };

    const resetSettings = () => {
        console.log("Reset timer");
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
