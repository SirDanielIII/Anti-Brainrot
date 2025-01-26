import React, {useState} from "react";
import Button from "./Button";
import '../styles/App.css'; // Adjust the path if needed

interface SettingsProps {
    onSaveSettings: (work: number, breakTime: number, loopsCount: number) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSaveSettings }) => {
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

    return (
        <div className="settings">
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
            {error && <p className="error-message">{error}</p>} {/* Display error message */}
            <Button label="Save" onClick={handleSave} />
        </div>

    );
};

export default Settings;
