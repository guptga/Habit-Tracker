import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
import "react-calendar/dist/Calendar.css";
import "./index.css";

ChartJS.register(BarElement, CategoryScale, LinearScale);

function App() {
  // ✅ Load habits from Local Storage
  const [habits, setHabits] = useState(() => {
    try {
      const savedHabits = localStorage.getItem("habits");
      return savedHabits ? JSON.parse(savedHabits) : [];
    } catch (error) {
      console.error("Error loading habits:", error);
      return [];
    }
  });

  const [newHabit, setNewHabit] = useState("");

  // ✅ Save habits to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem("habits", JSON.stringify(habits));
    } catch (error) {
      console.error("Error saving habits:", error);
    }
  }, [habits]);

  // ✅ Add Habit
  const addHabit = () => {
    if (newHabit.trim() !== "") {
      setHabits([...habits, { text: newHabit, completed: false, streak: 0, completedDate: null }]);
      setNewHabit("");
    }
  };

  // ✅ Toggle Completion
  const toggleCompletion = (index) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit, i) =>
        i === index
          ? {
              ...habit,
              completed: !habit.completed,
              streak: habit.completed ? 0 : habit.streak + 1,
              completedDate: habit.completed ? null : new Date(),
            }
          : habit
      )
    );
  };

  // ✅ Delete Habit
  const deleteHabit = (index) => {
    setHabits(habits.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <h1 className="title">Habit Tracker</h1>

      {/* ✅ Progress Chart */}
      <h2>🔥 Habit Streaks</h2>
      <Bar
        data={{
          labels: habits.map(habit => habit.text),
          datasets: [
            {
              label: "🔥 Streak Days",
              data: habits.map(habit => habit.streak),
              backgroundColor: "orange",
            },
          ],
        }}
        options={{ responsive: true }}
      />

      {/* ✅ Habit List */}
      <ul className="habit-list">
        {habits.map((habit, index) => (
          <li key={index} className="habit-item">
            <input
              type="checkbox"
              checked={habit.completed}
              onChange={() => toggleCompletion(index)}
            />
            <span className={habit.completed ? "completed" : ""}>{habit.text}</span>
            <span className="streak">🔥 {habit.streak} days</span>
            <button onClick={() => deleteHabit(index)}>❌</button>
          </li>
        ))}
      </ul>

      {/* ✅ Calendar */}
      <Calendar
        tileContent={({ date }) => {
          return habits.some(habit => habit.completedDate && new Date(habit.completedDate).toDateString() === date.toDateString())
            ? "✅"
            : null;
        }}
      />

      {/* ✅ Habit Input */}
      <input
        type="text"
        placeholder="Add a new habit"
        value={newHabit}
        onChange={(e) => setNewHabit(e.target.value)}
      />
      <button onClick={addHabit}>Add</button>
    </div>
  );
}

export default App;
