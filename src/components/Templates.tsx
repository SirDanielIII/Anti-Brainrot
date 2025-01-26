// Templates.tsx
import React from "react";
import Button from "./Button";

interface TemplatesProps {
    onSelectTemplate: (workTime: number, breakTime: number) => void;
}

const Templates: React.FC<TemplatesProps> = ({onSelectTemplate}) => {
    return (
        <div className="templates">
            <h2>Preset Templates</h2>
            <Button label="20 Work | 5 Break" onClick={() => onSelectTemplate(20, 5)}/>
            <Button label="40 Work | 10 Break" onClick={() => onSelectTemplate(40, 10)}/>
            <Button label="75 Work | 30 Break" onClick={() => onSelectTemplate(75, 30)}/>
        </div>
    );
};

export default Templates;
