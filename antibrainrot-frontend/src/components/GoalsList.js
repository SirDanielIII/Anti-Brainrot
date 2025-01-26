import React, { useState } from "react";
// import { get_subtasks_from_goal } from "../api/geminiAI";
import {
  get_subtasks_from_goal,
  get_next_goal_from_subtasks,
} from "../api/geminiAI";
// @dnd-kit/core and @dnd-kit/sortable
import {
  DndContext,
  closestCenter, // collision detection algorithm
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableGoalItem from "./SortableGoalItem"; // <-- Import child component

const GoalsList = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ----------------------------------------
  // Example API call to get recommended tasks
  // ----------------------------------------
  const getGoalRecommendations = async () => {
    setIsLoading(true);
    try {
      const recs = await get_subtasks_from_goal(newGoal || "");
      setRecommendations(recs);
      setChatOpen(true);
      setCurrentRecommendation(0);
    } catch (error) {
      console.error("Error generating goal recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendation = (accept) => {
    if (accept) {
      setGoals((prevGoals) => [
        ...prevGoals,
        {
          id: Date.now(),
          text: recommendations[currentRecommendation],
          completed: false,
        },
      ]);
    }
    if (currentRecommendation < recommendations.length - 1) {
      setCurrentRecommendation(currentRecommendation + 1);
    } else {
      setChatOpen(false);
    }
  };

  // const getGoalRecommendations = async () => {
  //   try {
  //     alert(`Generating AI response... `);
  //     const recommendations = await get_subtasks_from_goal(newGoal);
  //     setGoals(get_goal_list_from_reccomendations(recommendations));
  //   } catch (error) {
  //     console.error("Error generating goal recommendations:", error);
  //   }
  // };
  const LoadingIndicator = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-lg font-semibold">Loading...</p>
        <p className="mt-2">Please wait while the AI generates a response.</p>
      </div>
    </div>
  );
  const addGoalWithAI = async () => {
    // if (!goals.length) return;
    setIsLoading(true);
    try {
      const aiGoal = await get_next_goal_from_subtasks(
        goals.map((goal) => goal.text)
      );
      setGoals([
        ...goals,
        { id: goals.length, text: aiGoal, completed: false },
      ]);
    } catch (error) {
      console.error("Error generating goal with AI:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------
  // Adding / updating / deleting goals
  // ----------------------------------------
  const addGoal = (e) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    setGoals((prevGoals) => [
      ...prevGoals,
      { id: Date.now(), text: newGoal, completed: false },
    ]);
    setNewGoal("");
  };

  const updateGoal = (id, newText) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id ? { ...goal, text: newText } : goal
      )
    );
  };

  const deleteGoal = (id) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
  };

  const toggleComplete = (id) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  // ----------------------------------------
  // Drag & Drop: reorder array on drag end
  // ----------------------------------------
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return; // If dropped outside the list, do nothing

    if (active.id !== over.id) {
      const oldIndex = goals.findIndex((goal) => goal.id === active.id);
      const newIndex = goals.findIndex((goal) => goal.id === over.id);

      setGoals((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="goals-list bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Goals List</h2>

      {/* Form to add goals */}
      <form onSubmit={addGoal} className="mb-4">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Add a new goal"
          className="w-full p-2 border border-gray-300 rounded-md mr-2"
        />
        <div className="flex mt-2">
          <button
            type="submit"
            disabled={!newGoal.trim()}
            className={`px-4 py-2 rounded-md mr-2 transition-colors ${
              newGoal.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Add Goal
          </button>
          <button
            disabled={!goals.length || !newGoal.trim()}
            className={`px-4 py-2 rounded-md mr-2 transition-colors ${
              goals.length && newGoal.trim()
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={addGoalWithAI}
          >
            Generate Next Sequential Task
          </button>

          <button
            disabled={!newGoal.trim()}
            className={`px-4 py-2 rounded-md transition-colors ${
              newGoal.trim()
                ? "bg-purple-500 text-white hover:bg-purple-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={getGoalRecommendations}
          >
            Break Down into Subtasks
          </button>
        </div>
      </form>

      {/* DnD context for sorting */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={goals.map((g) => g.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2">
            {goals.map((goal) => (
              <SortableGoalItem
                key={goal.id}
                goal={goal}
                editingId={editingId}
                setEditingId={setEditingId}
                updateGoal={updateGoal}
                deleteGoal={deleteGoal}
                toggleComplete={toggleComplete}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {/* AI Chat Popup, if needed */}
      {chatOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          style={{
            zIndex: 9999, // Keep this on top of everything
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Goal Recommendation</h3>
            <p className="mb-4">{recommendations[currentRecommendation]}</p>
            <div className="flex justify-end space-x-2">
              {isLoading && <LoadingIndicator />}

              <button
                onClick={() => handleRecommendation(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => handleRecommendation(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsList;
