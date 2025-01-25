import React, { useState } from "react";

interface SettingsProps {
  onSaveSettings: (work: number, breakTime: number) => void;
  onAudioUpload: (audioFile: string | null) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSaveSettings, onAudioUpload }) => {
  const [workInput, setWorkInput] = useState(40);
  const [breakInput, setBreakInput] = useState(10);

  const handleSave = () => {
    onSaveSettings(workInput * 60, breakInput * 60);
  };

  const handleAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
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
      <button onClick={handleSave}>Save Settings</button>
      <br />
      <label>
        Upload Custom Audio:
        <input type="file" onChange={handleAudioChange} accept="audio/*" />
      </label>
    </div>
  );
};

export default Settings;