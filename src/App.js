import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

ChartJS.register(BarElement, CategoryScale, LinearScale);

function App() {
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
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    try {
      localStorage.setItem("habits", JSON.stringify(habits));
    } catch (error) {
      console.error("Error saving habits:", error);
    }
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    const timeTo8PM = new Date();
    timeTo8PM.setHours(20, 0, 0, 0);

    const delay = timeTo8PM - now;
    if (delay > 0) {
      setTimeout(() => {
        const uncompleted = habits.filter(habit => !habit.completed);
        if (uncompleted.length > 0 && Notification.permission === "granted") {
          new Notification("⏰ Habit Reminder!", {
            body: `You have ${uncompleted.length} incomplete habits today!`,
          });
        }
      }, delay);
    }
  }, [habits]);

  const addHabit = () => {
    if (newHabit.trim() !== "") {
      setHabits([...habits, { text: newHabit, completed: false, streak: 0 }]);
      setNewHabit("");
    }
  };

  const toggleCompletion = (index) => {
    const updatedHabits = habits.map((habit, i) => {
      if (i === index) {
        return { 
          ...habit, 
          completed: !habit.completed,
          streak: habit.completed ? 0 : habit.streak + 1,
          completedDate: !habit.completed ? new Date().toISOString() : null
        };
      }
      return habit;
    });
    setHabits(updatedHabits);
  };

  const deleteHabit = (index) => {
    const updatedHabits = habits.filter((_, i) => i !== index);
    setHabits(updatedHabits);
  };

  const completedHabits = habits.filter(habit => habit.completed).length;
  const totalHabits = habits.length;
  const progressPercentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(habits));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "habits.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedHabits = JSON.parse(e.target.result);
        setHabits(importedHabits);
      } catch (error) {
        console.error("Invalid file format", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`container ${darkMode ? "dark-mode" : ""}`}>
      <h1 className="title">Habit Tracker</h1>

      <button onClick={() => setDarkMode(!darkMode)} className="dark-mode-btn">
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}>
          {Math.round(progressPercentage)}%
        </div>
      </div>

      {/* ✅ Calendar for Completed Habits */}
      <Calendar
        tileContent={({ date }) => {
          return habits.some(habit => habit.completed && 
            habit.completedDate &&
            new Date(habit.completedDate).toDateString() === date.toDateString()) 
            ? "✅" 
            : null;
        }}
      />

      <div className="input-container">
        <input
          type="text"
          placeholder="Add a new habit"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          className="input-box"
        />
        <button onClick={addHabit} className="add-btn">Add</button>
      </div>

      <ul className="habit-list">
        {habits.map((habit, index) => (
          <li key={index} className="habit-item">
            <input type="checkbox" checked={habit.completed} onChange={() => toggleCompletion(index)} className="checkbox" />
            <span className={habit.completed ? "completed" : ""}>{habit.text}</span>
            <span className="streak">🔥 {habit.streak} days</span>
            <button onClick={() => deleteHabit(index)} className="delete-btn">❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;