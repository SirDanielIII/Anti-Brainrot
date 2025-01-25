import React, { useState } from "react";
import Timer from "./components/Timer";
import Templates from "./components/Templates";
import Settings from "./components/Settings";

/** Default audio alert file — can be changed or removed as needed. */
const defaultAlert = "/four.mp3";

const App: React.FC = () => {
  const [workDuration, setWorkDuration] = useState(40 * 60); // in seconds
  const [breakDuration, setBreakDuration] = useState(10 * 60);
  const [remainingTime, setRemainingTime] = useState("40:00"); // MM:SS format
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [customAudio, setCustomAudio] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Helper to convert seconds -> "MM:SS"
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const leftoverSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(leftoverSeconds).padStart(2, "0")}`;
  };

  // Audio alert
  const playAudioAlert = () => {
    const audioSrc = customAudio || defaultAlert;
    const audio = new Audio(audioSrc);
    audio.play().catch((error) => console.error("Error playing audio:", error));
  };

  // Start timer
  const startTimer = () => {
    if (timer) return; // don't start if already running

    const newTimer = setInterval(() => {
      setRemainingTime((prevTime) => {
        const [min, sec] = prevTime.split(":").map(Number);
        const currentSec = min * 60 + sec;
        // If more than 1 second left, just decrement
        if (currentSec > 1) return formatTime(currentSec - 1);

        // Timer hits 0 — stop and switch phase
        clearInterval(newTimer);
        setTimer(null);
        playAudioAlert();
        const nextDuration = isWorkPhase ? breakDuration : workDuration;
        setIsWorkPhase(!isWorkPhase);
        return formatTime(nextDuration);
      });
    }, 1000);

    setTimer(newTimer);
  };

  // Pause timer
  const pauseTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  // Reset timer
  const resetTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setIsWorkPhase(true);
    setRemainingTime(formatTime(workDuration));
  };

  // Save settings (called from <Settings />)
  const saveSettings = (work: number, breakTime: number) => {
    setWorkDuration(work);
    setBreakDuration(breakTime);
    setRemainingTime(formatTime(work));
    resetTimer(); // also reset
  };

  // Handle template selection (called from <Templates />)
  const selectTemplate = (work: number, breakTime: number) => {
    setWorkDuration(work * 60);
    setBreakDuration(breakTime * 60);
    setRemainingTime(formatTime(work * 60));
    resetTimer();
  };

  return (
      <div className="container">
        {/* Merged in the "container" class and main heading from HTML */}
        <h1>Pomodoro Timer</h1>

        {/* Timer display & controls (handled by Timer component) */}
        <Timer
            isWorkPhase={isWorkPhase}
            remainingTime={remainingTime}
            onStart={startTimer}
            onPause={pauseTimer}
            onReset={resetTimer}
        />

        {/* Preset Templates section (handled by Templates component) */}
        <Templates onSelectTemplate={selectTemplate} />

        {/* Toggle Settings button */}
        <div id="settings-toggle" className="controls" style={{ marginTop: "20px" }}>
          <button onClick={() => setShowSettings(!showSettings)}>
            {showSettings ? "Hide Settings" : "Show Settings"}
          </button>
        </div>

        {/* Settings section (handled by Settings component) */}
        {showSettings && (
            <Settings
                onSaveSettings={saveSettings}
                onAudioUpload={setCustomAudio}
            />
        )}
      </div>
  );
};

export default App;
