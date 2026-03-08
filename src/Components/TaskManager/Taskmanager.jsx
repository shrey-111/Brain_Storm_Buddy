// 📦 Required Imports
import React, { useState, useEffect } from "react";
import { FaPlus, FaCalendarCheck, FaCoins, FaTrash } from "react-icons/fa";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { db, auth } from "../../firebaseConfig"; // Make sure this is configured
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./TaskManager.css";

const categoryColors = {
  Work: "#f97316",
  Study: "#3b82f6",
  Personal: "#10b981",
  Other: "#8b5cf6",
};

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [coins, setCoins] = useState(0);
  const [category, setCategory] = useState("Work");
  const [deadline, setDeadline] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [streak, setStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load Data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;

      const userDocRef = doc(db, "taskData", auth.currentUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTasks(data.tasks || []);
        setCoins(data.coins || 0);
        setStreak(data.streak || 0);
        setLastCompletedDate(data.lastCompletedDate || null);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // ✅ Save Data to Firestore
  useEffect(() => {
    if (loading || !auth.currentUser) return;

    const saveData = async () => {
      const userDocRef = doc(db, "taskData", auth.currentUser.uid);
      await setDoc(userDocRef, {
        tasks,
        coins,
        streak,
        lastCompletedDate,
      });
    };

    saveData();
  }, [tasks, coins, streak, lastCompletedDate, loading]);

  const addTask = () => {
    if (taskInput.trim() === "") return;
    setTasks([
      ...tasks,
      { text: taskInput, completed: false, category, deadline },
    ]);
    setTaskInput("");
    setDeadline("");
    setCategory("Work");
  };

  const toggleTask = (index) => {
    const today = new Date().toISOString().split("T")[0];
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    const wasCompleted = tasks[index].completed;
    setTasks(updatedTasks);
    if (wasCompleted) {
      setCoins((prev) => prev - 10);
    } else {
      setCoins((prev) => prev + 10);
      if (lastCompletedDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split("T")[0];
        setStreak(lastCompletedDate === yStr ? streak + 1 : 1);
        setLastCompletedDate(today);
      }
    }
  };

  const deleteTask = (index) => {
    const refund = tasks[index].completed ? 10 : 0;
    const updated = [...tasks];
    updated.splice(index, 1);
    setTasks(updated);
    setCoins(coins - refund);
  };

  const resetMonthlyProgress = () => {
    alert(`Monthly Report:\nTasks Completed: ${tasks.filter(t => t.completed).length}\nCoins Earned: ${coins}`);
    setTasks([]);
    setCoins(0);
    setStreak(0);
    setLastCompletedDate(null);
  };

  const COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6"];
  const categoryData = ["Work", "Study", "Personal", "Other"].map(cat => ({
    name: cat,
    value: tasks.filter(t => t.category === cat).length,
  }));

  const getPast7DaysData = () => {
    const today = new Date();
    return [...Array(7)].map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      const completedCount = tasks.filter(t => t.completed && t.deadline === dateKey).length;
      return {
        day: date.toLocaleDateString("en-IN", { weekday: "short" }),
        tasks: completedCount,
      };
    }).reverse();
  };

  const dailyData = getPast7DaysData();

  return (
    <div className="task-container">
      <h2 className="task-title">🌟 Task Manager</h2>

      <div className="task-input-container">
        <input type="text" className="task-input" placeholder="What's your next goal?" value={taskInput} onChange={(e) => setTaskInput(e.target.value)} />
        <input type="date" className="task-date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        <select className="task-category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Work">Work</option>
          <option value="Study">Study</option>
          <option value="Personal">Personal</option>
          <option value="Other">Other</option>
        </select>
        <button onClick={addTask} className="task-add-btn"><FaPlus /></button>
      </div>

      <div className="task-filter">
        <label>Filter:</label>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="task-category">
          <option value="All">All</option>
          <option value="Work">Work</option>
          <option value="Study">Study</option>
          <option value="Personal">Personal</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="task-progress">
        <p className="progress-label">Progress: {tasks.length ? `${Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%` : "0%"}</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${tasks.length ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%` }} />
        </div>
      </div>

      <div className="task-streak">🔥 Streak: {streak} day{streak !== 1 ? "s" : ""}</div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks yet. Start adding your goals!</p>
        ) : (
          tasks.filter(task => filterCategory === "All" || task.category === filterCategory)
            .map((task, index) => (
              <div key={index} className="task-item">
                <div className="task-left">
                  <input type="checkbox" className="task-checkbox" checked={task.completed} onChange={() => toggleTask(index)} />
                  <div className={`task-text ${task.completed ? "completed" : ""}`}>
                    {task.text}
                    <span className="task-label" style={{ backgroundColor: categoryColors[task.category] }}>{task.category}</span>
                    {task.deadline && <span className="task-deadline">📅 {task.deadline}</span>}
                  </div>
                </div>
                <button className="delete-btn" onClick={() => deleteTask(index)}><FaTrash /></button>
              </div>
            ))
        )}
      </div>

      <div className="task-coins"><FaCoins /> Coins Earned: {coins}</div>

      <button onClick={resetMonthlyProgress} className="task-reset-btn">
        <FaCalendarCheck /> End Month & View Report
      </button>

      {/* Charts */}
      <div className="task-charts">
        <div className="chart-section">
          <h3>📊 Task Completion (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasks" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h3>🥧 Tasks by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
