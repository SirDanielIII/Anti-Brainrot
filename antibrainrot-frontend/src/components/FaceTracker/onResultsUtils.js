// onResultsUtils.js

/**
 * Draw face landmarks on the canvas context.
 */
function drawFaceLandmarks(canvasCtx, landmarks, width, height) {
    landmarks.forEach((lm) => {
      const x = lm.x * width;
      const y = lm.y * height;
      canvasCtx.beginPath();
      canvasCtx.arc(x, y, 1, 0, 2 * Math.PI);
      canvasCtx.fillStyle = "aqua";
      canvasCtx.fill();
    });
  }
  
  /**
   * Determine if the user is currently away based on the nose position.
   * (No buffer logic here; that is handled in the custom hook.)
   */
  function checkIfAwayFromCamera(landmarks) {
    if (!landmarks || landmarks.length === 0) return true;
    // Nose is index 1 in Mediapipe FaceMesh
    const nose = landmarks[1];
    if (!nose) return true;
  
    // If the nose is too far from the center, user is "currently away"
    const horizontalDeviation = Math.abs(nose.x - 0.5);
    const verticalDeviation = Math.abs(nose.y - 0.5);
    return horizontalDeviation > 0.15 || verticalDeviation > 0.15;
  }
  
  /**
   * Main function to handle Mediapipe results.
   * Returns an object { faceCount, userIsAway }.
   */
  export function handleResults(results) {
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      return { faceCount: 0, userIsAway: true };
    }
  
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) {
      return { faceCount: 0, userIsAway: true };
    }
  
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw the image from the results
    if (results.image) {
      canvasCtx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    }
  
    // Face detection logic
    const { multiFaceLandmarks } = results;
    if (multiFaceLandmarks && multiFaceLandmarks.length > 0) {
      const landmarks = multiFaceLandmarks[0];
      drawFaceLandmarks(canvasCtx, landmarks, canvas.width, canvas.height);
  
      canvasCtx.restore();
      return {
        faceCount: multiFaceLandmarks.length,
        userIsAway: checkIfAwayFromCamera(landmarks),
      };
    } else {
      // No faces => user is currently away
      canvasCtx.restore();
      return { faceCount: 0, userIsAway: true };
    }
  }
  