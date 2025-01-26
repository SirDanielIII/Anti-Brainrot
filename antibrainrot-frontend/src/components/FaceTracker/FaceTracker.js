import React, { useRef, useEffect } from "react";
import useFaceMesh from "./useFaceMesh";

import VideoDisplay from "./VideoDisplay";
import AttentionModal from "./AttentionModal";

const FaceTracker = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const {
    isLookingAway,
    facesDetected,
    isModalOpen,
    closeModal,
    onResults,
    setCanvasSize,
  } = useFaceMesh(webcamRef);

  useEffect(() => {
    setCanvasSize(canvasRef.current, 640, 480);
  }, [setCanvasSize]);

  // In FaceTracking.jsx
  useEffect(() => {
    if (isLookingAway) {
      window.postMessage({ type: "USER_LOOKING_AWAY" }, "*");
    } else {
      window.postMessage({ type: "USER_BACK" }, "*");
    }
  }, [isLookingAway]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // No explicit width/height here
        margin: 0,
        padding: 0,
        backgroundColor: "#f0f0f0",
      }}
    >
      <AttentionModal isOpen={isModalOpen} closeModal={closeModal} />

      <VideoDisplay
        webcamRef={webcamRef}
        canvasRef={canvasRef}
        facesDetected={facesDetected}
        isLookingAway={isLookingAway}
        onResults={onResults}
      />
    </div>
  );
};

export default FaceTracker;
