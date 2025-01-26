import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableGoalItem({
  goal,
  editingId,
  setEditingId,
  updateGoal,
  deleteGoal,
  toggleComplete,
}) {
  // 1) useSortable from @dnd-kit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: goal.id });

  // 2) Local state for editing text
  const [editingText, setEditingText] = useState(goal.text);

  // 3) Convert transform to a CSS style
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  // Save changes when the user stops editing (onBlur)
  const handleBlur = () => {
    updateGoal(goal.id, editingText);
    setEditingId(null);
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center bg-white p-3 rounded-md shadow-sm"
    >
      {/* Checkbox for completion */}
      <input
        type="checkbox"
        checked={goal.completed}
        onChange={() => toggleComplete(goal.id)}
        className="mr-2"
      />

      {/* Inline editing vs. display text */}
      {editingId === goal.id ? (
        <input
          type="text"
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="flex-grow p-1 border border-gray-300 rounded-md"
        />
      ) : (
        <span
          className={`flex-grow ${
            goal.completed ? "line-through text-gray-500" : ""
          }`}
          onClick={() => setEditingId(goal.id)}
        >
          {goal.text}
        </span>
      )}

      {/* Delete Button */}
      <button
        onClick={() => deleteGoal(goal.id)}
        className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors"
      >
        Delete
      </button>

      {/* Dedicated drag button */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="ml-2 bg-gray-300 text-gray-800 px-2 py-1 rounded-md hover:bg-gray-400 transition-colors cursor-move"
        onClick={(e) => e.stopPropagation()}
      >
        Drag
      </button>
    </li>
  );
}

export default SortableGoalItem;
