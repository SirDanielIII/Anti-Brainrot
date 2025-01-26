import React from "react";

interface TemplatesProps {
    onSelectTemplate: (workTime: number, breakTime: number) => void;
    timerRunning: boolean;
}

const Templates: React.FC<TemplatesProps> = ({ onSelectTemplate, timerRunning }) => {
    return (
        <div className="templates">
            <h2>Presets</h2>
            <div className="template-buttons">
                <button
                    className="template-button"
                    onClick={() => onSelectTemplate(20, 5)}
                    disabled={timerRunning} // Disable the button if the timer is running
                >
                    20 Work / 5 Break
                </button>
                <button
                    className="template-button"
                    onClick={() => onSelectTemplate(40, 10)}
                    disabled={timerRunning}
                >
                    40 Work / 10 Break
                </button>
                <button
                    className="template-button"
                    onClick={() => onSelectTemplate(75, 30)}
                    disabled={timerRunning}
                >
                    75 Work / 30 Break
                </button>
            </div>
        </div>
    );
};

export default Templates;
