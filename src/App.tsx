import React, {useEffect, useState} from "react";
import Timer from "./components/Timer";
import Templates from "./components/Templates";
import Settings from "./components/Settings";
import ToggleButton from "./components/ToggleButton.tsx";
import {TIMER} from "./enums/TIMER.ts";
import {TimerMessage} from "./types/TimerMessage.ts";

/** Default audio alert file — can be changed or removed as needed. */
const audioCompleteDefault = "/audio/four.mp3";
let stateSetters: {
    workDuration: React.Dispatch<React.SetStateAction<number>>;
    breakDuration: React.Dispatch<React.SetStateAction<number>>;
    remainingTime: React.Dispatch<React.SetStateAction<string>>;
    isWorkPhase: React.Dispatch<React.SetStateAction<boolean>>;
    timerRunning: React.Dispatch<React.SetStateAction<boolean>>;
    audioComplete: React.Dispatch<React.SetStateAction<string | null>>;
    audioDistracted: React.Dispatch<React.SetStateAction<string | null>>;
    audioDistractedPrompt: React.Dispatch<React.SetStateAction<string | null>>;
    showSettings: React.Dispatch<React.SetStateAction<boolean>>;
} | null = null;

const App: React.FC = () => {
    const [workDuration, setWorkDuration] = useState(40 * 60); // 40 minutes
    const [breakDuration, setBreakDuration] = useState(10 * 60); // 10 minutes
    const [remainingTime, setRemainingTime] = useState("40:00"); // 40 minutes
    const [isWorkPhase, setIsWorkPhase] = useState(true); // true (work phase)
    const [timerRunning, setTimerRunning] = useState(false); // false (timer is not running)
    const [audioComplete, setAudioComplete] = useState<string | null>(null); // path to sound file
    const [audioDistracted, setAudioDistracted] = useState<string | null>(null); // path to sound file
    const [audioDistractedPrompt, setAudioDistractedPrompt] = useState<string | null>(null); // path to sound file
    const [showSettings, setShowSettings] = useState(false); // false (hide settings menu by default)

    // Fetch initial values from chrome.storage.sync
    useEffect(() => {
        console.log("Fetching values from chrome.storage.sync to React variables");
        chrome.storage.sync.get(
            [
                "workDuration",
                "breakDuration",
                "remainingTime",
                "isWorkPhase",
                "timerRunning",
                "audioComplete",
                "audioDistracted",
                "audioDistractedPrompt",
                "showSettings",
            ],
            (values) => {
                if (values.workDuration) setWorkDuration(values.workDuration);
                if (values.breakDuration) setBreakDuration(values.breakDuration);
                if (values.remainingTime) setRemainingTime(values.remainingTime);
                if (values.isWorkPhase !== undefined) setIsWorkPhase(values.isWorkPhase);
                if (values.timerRunning) setTimerRunning(values.timerRunning);
                if (values.audioComplete) setAudioComplete(values.audioComplete);
                if (values.audioDistracted) setAudioDistracted(values.audioDistracted);
                if (values.audioDistractedPrompt) setAudioDistractedPrompt(values.audioDistractedPrompt);
                if (values.showSettings) setShowSettings(values.showSettings);
            }
        );

        // Assuming you still need access to these setters somewhere in your component:
        stateSetters = {
            workDuration: setWorkDuration,
            breakDuration: setBreakDuration,
            remainingTime: setRemainingTime,
            isWorkPhase: setIsWorkPhase,
            timerRunning: setTimerRunning,
            audioComplete: setAudioComplete,
            audioDistracted: setAudioDistracted,
            audioDistractedPrompt: setAudioDistractedPrompt,
            showSettings: setShowSettings,
        };
        return;
    }, []);

    // Helper to convert seconds -> "MM:SS"
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const leftoverSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(leftoverSeconds).padStart(2, "0")}`;
    };

    /**
     * Update multiple persistent values at once.
     *
     * @param {Object} updates - An object containing key-value pairs to update.
     *   For example: { workDuration: 25, breakDuration: 5 }
     */
    const updatePersistentValues = (updates: ArrayLike<unknown> | Partial<{ [key: string]: any; }>) => {
        // 1) Update React state first
        Object.entries(updates).forEach(([key, value]) => {
            if (stateSetters[key]) {
                stateSetters[key](value);
            }
        });

        // 2) Update chrome storage (asynchronously)
        chrome.storage.sync.set(updates);
    };

    // Audio alert
    const playAudioAlert = () => {
        const audioSrc = audioComplete ?? audioCompleteDefault; // Use default audio if audioComplete is null/undefined
        const audio = new Audio(audioSrc);
        audio.play().catch((error: unknown) => {
            console.error("Error playing audio:", error);
        });
    };

    // Send a message to the background script
    const sendMsgToBackground = (message: TimerMessage) => {
        chrome.runtime.sendMessage(message, (response) => {
            console.log("Response from background:", response);
        });
    };

    // Timer functions (start, pause, reset)
    const startTimer = () => {
        console.log("Pressed start button")

        if (timerRunning) return;
        updatePersistentValues({timerRunning: true});
        sendMsgToBackground({
            action: TIMER.START,
            remainingTime,
            isWorkPhase,
        });
    };

    const pauseTimer = () => {
        console.log("Pressed pause button")
        if (!timerRunning) return;
        updatePersistentValues({timerRunning: false});
        sendMsgToBackground({
            action: TIMER.PAUSE,
            remainingTime,
            isWorkPhase,
        });
    };

    const resetTimer = () => {
        console.log("Pressed reset button")
        // Define the default values
        updatePersistentValues({
            workDuration: 40 * 60,
            breakDuration: 10 * 60,
            remainingTime: "40:00",
            isWorkPhase: true,
            timerRunning: true,
            alarmFinished: undefined,
            alarmDistraction: undefined,
            alarmDistractionPrompt: undefined,
            showSettings: false
        });
        sendMsgToBackground({
            action: TIMER.RESET,
            remainingTime,
            isWorkPhase,
        });
    };

    return (
        <div className="container">
            <h1>Pomodoro Timer</h1>
            <Timer
                isWorkPhase={isWorkPhase}
                remainingTime={remainingTime}
                onStart={startTimer}
                onPause={pauseTimer}
                onReset={resetTimer}
            />
            <Templates
                onSelectTemplate={(workTime, breakTime) => {
                    updatePersistentValues({workDuration: workTime * 60, breakDuration: breakTime * 60, remainingTime: formatTime(workTime * 60)});
                }}
            />
            <ToggleButton
                label="Toggle Settings"
                onClick={() => {
                    updatePersistentValues({showSettings: !showSettings});
                }}
            />
            {showSettings && (
                <Settings
                    onSaveSettings={(workTime, breakTime) => {
                        updatePersistentValues({workDuration: workTime, breakDuration: breakTime, remainingTime: formatTime(workTime)});
                    }}
                    onAudioUpload={(audioFile) => {
                        updatePersistentValues({audioComplete: audioFile});
                    }}
                />
            )}
        </div>
    );
};

export default App;
