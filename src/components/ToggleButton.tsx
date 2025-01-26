import React from "react";

interface ButtonProps {
    label: string;
    onClick: () => void;
    style?: React.CSSProperties;
}

const ToggleButton: React.FC<ButtonProps> = ({ label, onClick, style }) => {
    return (
        <button onClick={onClick} style={style} className="toggle-button">
            <span>{label}</span>
            <div className="square"></div>
        </button>
    );
};

export default ToggleButton;
