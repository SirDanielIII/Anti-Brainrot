import React, {useEffect, useState} from "react";
import Timer from "./components/Timer";
import Templates from "./components/Templates";
import Settings from "./components/Settings";
import ToggleButton from "./components/ToggleButton.tsx";
import {TIMER} from "./enums/TIMER.ts";
import {TimerMessage} from "./types/TimerMessage.ts";

/** Default audio alert file — can be changed or removed as needed. */
const audioCompleteDefault = "/audio/four.mp3";

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

        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
            for (const [key, {newValue}] of Object.entries(changes)) {
                updatePersistentValue(key as keyof typeof stateSetters, newValue);
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);
        return () => chrome.storage.onChanged.removeListener(handleStorageChange);
    }, []);

    // Helper to convert seconds -> "MM:SS"
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const leftoverSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(leftoverSeconds).padStart(2, "0")}`;
    };

    // Debounced persistent storage updater
    const updatePersistentValue = (key, value) => {
        chrome.storage.sync.set({[key]: value});

        const stateSetters = {
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

        if (stateSetters[key]) {
            stateSetters[key](value);
        }
    }

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
        updatePersistentValue("timerRunning", true);
        sendMsgToBackground({
            action: TIMER.START,
            remainingTime,
            isWorkPhase,
        });
    };

    const pauseTimer = () => {
        console.log("Pressed pause button")
        if (!timerRunning) return;
        updatePersistentValue("timerRunning", false);
        sendMsgToBackground({
            action: TIMER.PAUSE,
            remainingTime,
            isWorkPhase,
        });
    };

    const resetTimer = () => {
        console.log("Pressed reset button")
        updatePersistentValue("timerRunning", false);
        updatePersistentValue("remainingTime", formatTime(workDuration));
        updatePersistentValue("isWorkPhase", true);
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
                    updatePersistentValue("workDuration", workTime * 60);
                    updatePersistentValue("breakDuration", breakTime * 60);
                }}
            />
            <ToggleButton
                label="Toggle Settings"
                onClick={() => {
                    updatePersistentValue("showSettings", !showSettings);
                }}
            />
            {showSettings && (
                <Settings
                    onSaveSettings={(workTime, breakTime) => {
                        updatePersistentValue("workDuration", workTime);
                        updatePersistentValue("breakDuration", breakTime);
                    }}
                    onAudioUpload={(audioFile) => {
                        updatePersistentValue("audioComplete", audioFile);
                    }}
                />
            )}
        </div>
    );
};

export default App;
