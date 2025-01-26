import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FaceTracking from "../components/FaceTracker/FaceTracker";
import GoalsList from "../components/GoalsList";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [isWorking, setIsWorking] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [adhd, setAdhd] = useState(0);

  useEffect(() => {
    // Simulating ADHD level changes
    const interval = setInterval(() => {
      setAdhd(Math.floor(Math.random() * 100));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStartSession = () => {
    setIsWorking(true);
  };

  const handleEndSession = () => {
    setIsWorking(false);
  };

  return (
    <div className="container mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-5">Anti Brain Rot Dashboard</h1>
      <p className="mb-10">Stay focused and track your ADHD levels.</p>

      <div className="bg-white p-5 shadow-lg rounded-lg mb-10">
        <h2 className="text-2xl font-semibold mb-4">Work Session</h2>
        {!isWorking ? (
          <div>
            <input
              type="number"
              value={workDuration}
              onChange={(e) => setWorkDuration(e.target.value)}
              className="mb-4 p-2 border rounded"
              placeholder="Work duration (minutes)"
            />
            <button
              onClick={handleStartSession}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Start Session
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-4">Time remaining: {workDuration} minutes</p>
            <button
              onClick={handleEndSession}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              End Session
            </button>
          </div>
        )}
      </div>

      {isWorking && (
        <div className="bg-white p-5 shadow-lg rounded-lg mb-10">
          <h2 className="text-2xl font-semibold mb-4">Focus Tracking</h2>
          <FaceTracking />
          <p className="mt-4">Current ADHD Level: {adhd}%</p>
        </div>
      )}

      <div className="bg-white p-5 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Your Goals</h2>
        <GoalsList />
      </div>
    </div>
  );
};

export default Dashboard;
