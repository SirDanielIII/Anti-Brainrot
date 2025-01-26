// FaceStatusOverlay.jsx
import React from "react";

const FaceStatusOverlay = ({ facesDetected, isLookingAway }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        left: "10px",
        zIndex: 2,
        backgroundColor: "rgba(0,0,0,0.5)",
        color: "white",
        padding: "5px",
        borderRadius: "5px",
      }}
    >
      <div>Face detected: {facesDetected}</div>
      <div>Looking at camera: {isLookingAway ? "No" : "Yes"}</div>
      <div style={{ color: isLookingAway ? "red" : "green" }}>
        {isLookingAway ? "You're looking away!" : "Great, you're focused!"}
      </div>
    </div>
  );
};

export default FaceStatusOverlay;
