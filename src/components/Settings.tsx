import React, { useState } from "react";
import Button from "./Button";

interface SettingsProps {
    onSaveSettings: (work: number, breakTime: number, loopsCount: number) => void;
    onAudioUpload: (audioFile: string | null) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSaveSettings, onAudioUpload }) => {
    const [workInput, setWorkInput] = useState<string>(""); // Start as an empty string
    const [breakInput, setBreakInput] = useState<string>(""); // Start as an empty string
    const [loopsInput, setLoopsInput] = useState<string>(""); // Start as an empty string
    const [error, setError] = useState<string | null>(null); // To track validation errors

    const validateInputs = (): boolean => {
        const workDuration = parseInt(workInput, 10);
        const breakDuration = parseInt(breakInput, 10);
        const loopsCount = parseInt(loopsInput, 10);

        // Check for invalid inputs or values less than 1
        if (
            isNaN(workDuration) || workDuration < 1 ||
            isNaN(breakDuration) || breakDuration < 1 ||
            isNaN(loopsCount) || loopsCount < 1
        ) {
            setError("All fields must be whole numbers and at least 1.");
            return false;
        }

        // Clear error if inputs are valid
        setError(null);
        return true;
    };

    const handleSave = () => {
        if (!validateInputs()) return;

        const workDuration = parseInt(workInput, 10);
        const breakDuration = parseInt(breakInput, 10);
        const loopsCount = parseInt(loopsInput, 10);

        console.log("Saving settings:", { workDuration, breakDuration, loopsCount });
        onSaveSettings(workDuration * 60, breakDuration * 60, loopsCount);
    };

    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const audioUrl = URL.createObjectURL(file);
            console.log("Uploading audio:", audioUrl);
            onAudioUpload(audioUrl);
        }
    };

    return (
        <div>
            <h2>Settings</h2>
            <label>
                Work Duration (minutes):
                <input
                    type="number"
                    value={workInput}
                    onChange={(e) => setWorkInput(e.target.value)}
                    placeholder="Enter work duration"
                />
            </label>
            <br />
            <label>
                Break Duration (minutes):
                <input
                    type="number"
                    value={breakInput}
                    onChange={(e) => setBreakInput(e.target.value)}
                    placeholder="Enter break duration"
                />
            </label>
            <br />
            <label>
                Pomodoro Cycles:
                <input
                    type="number"
                    value={loopsInput}
                    onChange={(e) => setLoopsInput(e.target.value)}
                    placeholder="Enter cycles"
                />
            </label>
            <br />
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}
            <Button label="Save" onClick={handleSave} />
            <br />
            <label>
                Upload Custom Audio:
                <input type="file" onChange={handleAudioChange} accept="audio/*" />
            </label>
        </div>
    );
};

export default Settings;
