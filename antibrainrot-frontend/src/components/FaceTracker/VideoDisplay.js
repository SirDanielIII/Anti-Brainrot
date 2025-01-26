// VideoDisplay.jsx
import React from "react";
import Webcam from "react-webcam";
import FaceStatusOverlay from "./FaceStatusOverlay";

const VideoDisplay = ({
  webcamRef,
  canvasRef,
  facesDetected,
  isLookingAway,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: "640px",
        height: "480px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          zIndex: 1, // stays behind the modal
          width: "100%",
          height: "100%",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          zIndex: 2, // behind the modal as well
          width: "100%",
          height: "100%",
        }}
      />
      <FaceStatusOverlay
        facesDetected={facesDetected}
        isLookingAway={isLookingAway}
      />
    </div>
  );
};

export default VideoDisplay;
