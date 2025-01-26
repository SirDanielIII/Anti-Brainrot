import React, { useRef, useEffect } from "react";
import useFaceMesh from "./useFaceMesh";

import VideoDisplay from "./VideoDisplay";
import AttentionModal from "./AttentionModal";

const FaceTracker = ({ sendMessageToChrome }) => {
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

  // Messaging logic
  useEffect(() => {
    if (isLookingAway) {
      sendMessageToChrome({ type: "USER_LOOKING_AWAY" });
    } else {
      sendMessageToChrome({ type: "USER_BACK" });
    }
  }, [isLookingAway, sendMessageToChrome]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
