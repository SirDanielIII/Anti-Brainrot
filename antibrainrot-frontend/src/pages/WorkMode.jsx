/*global chrome*/
import React, { useState, useEffect } from "react";
import FaceTracking from "../components/FaceTracker/FaceTracker";
import GoalsList from "../components/GoalsList";

const WorkMode = () => {
  const [workDuration, setWorkDuration] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    const messageListener = (event) => {
      if (event.data.type === "TIMER_UPDATE") {
        setRemainingTime(event.data.time);
      }
    };

    window.addEventListener("message", messageListener);

    return () => {
      window.removeEventListener("message", messageListener);
    };
  }, []);

  const handleDurationChange = (e) => {
    setWorkDuration(e.target.value);
  };

  const startWorkSession = (e) => {
    e.preventDefault();
    setIsWorking(true);
    setRemainingTime(`${workDuration}:00`);
  };

  // Function to send messages to Chrome runtime
  const sendMessageToChrome = (message) => {
    if (chrome && chrome.runtime) {
      const editorExtensionId = 'lpknkabkcapedcdneapbkfabjgbbemeh';
      console.log('Checking if extension is installed...');
      let isLookingAway = message.type === "USER_LOOKING_AWAY";
      console.log(isLookingAway);
      console.log(message);
      chrome.runtime.sendMessage(
        editorExtensionId,
        {
          message: 'ping',
          isLookingAway: isLookingAway,
        },
        (response) => {
          if (response) {
            console.log('Extension is installed!');
            console.log(response?.message);
          } else {
            console.log('Extension is not installed!');
          }
        }
      );
    };
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-5 bg-gray-100 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Your Goals</h2>
        <GoalsList />
      </div>

      <div className="w-2/3 p-5 bg-white overflow-y-auto">
        <h1 className="text-3xl font-bold mb-5">Work Mode</h1>
        <p className="mb-10">Set your work duration and stay focused!</p>

        {!isWorking ? (
          <div className="bg-gray-100 p-5 rounded-lg mb-10">
            <h2 className="text-2xl font-semibold mb-4">Set Work Duration</h2>
            <form onSubmit={startWorkSession}>
              <div className="form-group mb-4">
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Work Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  value={workDuration}
                  onChange={handleDurationChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                  min="1"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Start Work Session
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-gray-100 p-5 rounded-lg mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              Work Session in Progress
            </h2>
            <p className="mb-4">
              Time remaining: {remainingTime || `${workDuration}:00`}
            </p>
            <FaceTracking sendMessageToChrome={sendMessageToChrome} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkMode;
