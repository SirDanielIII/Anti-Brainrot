import React from "react";

interface TemplatesProps {
  onSelectTemplate: (work: number, breakTime: number) => void;
}

const Templates: React.FC<TemplatesProps> = ({ onSelectTemplate }) => {
  return (
    <div className="templates">
      <h2>Preset Templates</h2>
      <button onClick={() => onSelectTemplate(20, 5)}>20 Work / 5 Break</button>
      <button onClick={() => onSelectTemplate(40, 10)}>40 Work / 10 Break</button>
      <button onClick={() => onSelectTemplate(75, 30)}>75 Work / 30 Break</button>
    </div>
  );
};

export default Templates;