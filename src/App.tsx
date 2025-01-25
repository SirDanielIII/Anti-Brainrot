import React, { useState } from "react";
import Timer from "./Timer";
import Templates from "./Templates";
import Settings from "./Settings";
const defaultAlert = "/four.mp3";

const App: React.FC = () => {
  const [workDuration, setWorkDuration] = useState(40 * 60); // Seconds
  const [breakDuration, setBreakDuration] = useState(10 * 60); // Seconds
  const [remainingTime, setRemainingTime] = useState(`${40}:00`); // MM:SS format
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [customAudio, setCustomAudio] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Helper to convert seconds to MM:SS format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  // Play audio alert
  const playAudioAlert = () => {
    const audio = new Audio(defaultAlert);
    audio.play().catch((error) => console.error("Error playing audio:", error));
  };

  // Start the timer
  const startTimer = () => {
    if (timer) return; // Prevent multiple timers

    const totalSeconds =
      parseInt(remainingTime.split(":")[0]) * 60 + parseInt(remainingTime.split(":")[1]);

    const newTimer = setInterval(() => {
      setRemainingTime((prevTime) => {
        const [minutes, seconds] = prevTime.split(":").map(Number);
        const currentSeconds = minutes * 60 + seconds;

        if (currentSeconds > 1) {
          return formatTime(currentSeconds - 1);
        }

        // Timer ends
        clearInterval(newTimer);
        setTimer(null);
        playAudioAlert();

        // Switch phase
        const nextDuration = isWorkPhase ? breakDuration : workDuration;
        setIsWorkPhase(!isWorkPhase);
        return formatTime(nextDuration);
      });
    }, 1000);

    setTimer(newTimer);
  };

  // Pause the timer
  const pauseTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  // Reset the timer
  const resetTimer = () => {
    if (timer) clearInterval(timer);
    setTimer(null);
    setIsWorkPhase(true);
    setRemainingTime(formatTime(workDuration));
  };

  // Save custom settings
  const saveSettings = (work: number, breakTime: number) => {
    setWorkDuration(work);
    setBreakDuration(breakTime);
    setRemainingTime(formatTime(work));
    resetTimer(); // Reset timer when settings are changed
  };

  // Handle template selection
  const selectTemplate = (work: number, breakTime: number) => {
    setWorkDuration(work * 60);
    setBreakDuration(breakTime * 60);
    setRemainingTime(formatTime(work * 60));
    resetTimer(); // Reset timer when template is selected
  };

  return (
    <div>
      <h1>Anti-Brainrot Pomodoro Timer</h1>

      {/* Timer Component */}
      <Timer
        isWorkPhase={isWorkPhase}
        remainingTime={remainingTime}
        onStart={startTimer}
        onPause={pauseTimer}
        onReset={resetTimer}
      />

      {/* Preset Templates */}
      <Templates onSelectTemplate={selectTemplate} />

      {/* Toggle Button for Settings */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        style={{ marginTop: "20px" }}
      >
        {showSettings ? "Hide Settings" : "Show Settings"}
      </button>

      {/* Conditionally Render Settings */}
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