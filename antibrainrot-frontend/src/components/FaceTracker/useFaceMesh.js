// useFaceMesh.js
import { useState, useEffect, useCallback, useRef } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { handleResults } from "./onResultsUtils";

const AWAY_THRESHOLD_MS = 1400; // 10-second buffer (corrected to 10000 ms)

/**
 * A custom hook to encapsulate FaceMesh initialization,
 * plus a 10-second buffer for marking a user "actually away."
 */
const useFaceMesh = (webcamRef) => {
  const [currentlyAway, setCurrentlyAway] = useState(false);
  const [isLookingAway, setIsLookingAway] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [facesDetected, setFacesDetected] = useState(0);

  const awayStartRef = useRef(null);
  const cameraRef = useRef(null); // Ref to store the Camera instance

  // Callback for FaceMesh results
  const onResults = useCallback(
    (results) => {
      // handleResults will return { faceCount, userIsAway }
      const { faceCount, userIsAway } = handleResults(results);
      setFacesDetected(faceCount);
      setCurrentlyAway(userIsAway);
    },
    [] // Dependencies can be adjusted based on handleResults implementation
  );

  // Initialize FaceMesh and Camera
  useEffect(() => {
    if (!webcamRef.current || !webcamRef.current.video) {
      console.warn("Webcam reference is not available.");
      return;
    }

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    // Initialize Camera
    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () => {
        if (
          webcamRef.current &&
          webcamRef.current.video &&
          webcamRef.current.video.readyState === 4
        ) {
          try {
            await faceMesh.send({ image: webcamRef.current.video });
          } catch (error) {
            console.error("Error sending frame to FaceMesh:", error);
          }
        } else {
          console.warn("Webcam video not ready.");
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();
    cameraRef.current = camera; // Store the camera instance for cleanup

    // Cleanup on unmount
    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
      faceMesh.close();
    };
  }, [onResults, webcamRef]);

  // Handle "looking away" logic
  useEffect(() => {
    let intervalId;

    if (currentlyAway) {
      if (!awayStartRef.current) {
        awayStartRef.current = Date.now();
      }

      intervalId = setInterval(() => {
        const elapsed = Date.now() - awayStartRef.current;
        if (elapsed >= AWAY_THRESHOLD_MS) {
          setIsLookingAway(true);
          console.log(`User has been away for ${elapsed} ms.`);
          clearInterval(intervalId);
        }
      }, 1000); // Check every second
    } else {
      // Reset
      awayStartRef.current = null;
      setIsLookingAway(false);
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentlyAway]);

  // Toggle modal when user is truly "looking away"
  useEffect(() => {
    setIsModalOpen(isLookingAway);
  }, [isLookingAway]);

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsLookingAway(false);
    awayStartRef.current = null;
  };

  // Helper function to set the canvas size
  const setCanvasSize = (canvas, width, height) => {
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
  };

  return {
    // Expose relevant states
    currentlyAway,
    isLookingAway,
    facesDetected,
    isModalOpen,
    // Expose actions
    closeModal,
    onResults,
    setCanvasSize,
  };
};

export default useFaceMesh;
