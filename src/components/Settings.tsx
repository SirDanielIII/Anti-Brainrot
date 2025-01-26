// Settings.tsx
import React, {useState} from "react";
import Button from "./Button";

interface SettingsProps {
    onSaveSettings: (work: number, breakTime: number) => void;
    onAudioUpload: (audioFile: string | null) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSaveSettings, onAudioUpload }) => {
    const [workInput, setWorkInput] = useState(40);
    const [breakInput, setBreakInput] = useState(10);

    const handleSave = () => {
        console.log("Saving settings:", { workInput, breakInput });
        onSaveSettings(workInput * 60, breakInput * 60);
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
            <h3>Custom Settings</h3>
            <label>
                Work Duration (minutes):
                <input
                    type="number"
                    value={workInput}
                    onChange={(e) => setWorkInput(Number(e.target.value))}
                />
            </label>
            <br />
            <label>
                Break Duration (minutes):
                <input
                    type="number"
                    value={breakInput}
                    onChange={(e) => setBreakInput(Number(e.target.value))}
                />
            </label>
            <br />
            <Button label="Save Settings" onClick={handleSave} />
            <br />
            <label>
                Upload Custom Audio:
                <input type="file" onChange={handleAudioChange} accept="audio/*" />
            </label>
        </div>
    );
};

export default Settings;
