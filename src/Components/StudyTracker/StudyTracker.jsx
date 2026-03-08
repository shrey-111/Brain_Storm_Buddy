import React, { useState, useEffect, useRef } from "react";
import "./StudyTracker.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { FaClock } from "react-icons/fa";
import { db, auth } from "../../firebaseConfig"; // correct path
import {
  collection, addDoc, getDocs, deleteDoc, doc, onSnapshot, query, where
} from "firebase/firestore";

const StudyTracker = () => {
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("");
  const [logs, setLogs] = useState([]);
  const [streak, setStreak] = useState(0);
  const [quote, setQuote] = useState("Loading motivation...");
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const formatTime = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const startTimer = () => {
    if (isRunning) return;
    setSecondsLeft(minutes * 60);
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => setIsPaused(true);
  const resumeTimer = () => setIsPaused(false);
  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setSecondsLeft(minutes * 60);
  };

  const increaseTime = () => {
    if (minutes < 180) {
      setMinutes((prev) => prev + 5);
      if (!isRunning) setSecondsLeft((prev) => prev + 5 * 60);
    }
  };

  const decreaseTime = () => {
    if (minutes > 5) {
      setMinutes((prev) => prev - 5);
      if (!isRunning) setSecondsLeft((prev) => prev - 5 * 60);
    }
  };

  const checkStreak = (entries) => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yestStr = yesterday.toDateString();

    const todayLogged = entries.some(log => new Date(log.date).toDateString() === today);
    const yesterdayLogged = entries.some(log => new Date(log.date).toDateString() === yestStr);

    if (todayLogged && yesterdayLogged) setStreak((prev) => prev + 1);
    else if (todayLogged) setStreak(1);
    else setStreak(0);
  };

  const fetchLogs = async () => {
    if (!auth.currentUser) return;

    const q = query(collection(db, "studyLogs"), where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    const fetchedLogs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => new Date(b.date) - new Date(a.date));

    setLogs(fetchedLogs);
    checkStreak(fetchedLogs);
  };

  useEffect(() => {
    if (!auth.currentUser) return;

    fetch("https://type.fit/api/quotes")
      .then((res) => res.json())
      .then((data) => {
        const random = data[Math.floor(Math.random() * data.length)];
        setQuote(random.text);
      })
      .catch(() => setQuote("Believe in yourself! You are unstoppable."));

    fetchLogs();
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);

            addReviewLog();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isPaused, minutes]);

  const addReviewLog = async () => {
    const reviewLog = {
      subject: "Review Session",
      hours: minutes / 60,
      date: new Date().toISOString(),
      uid: auth.currentUser.uid,
    };
    await addDoc(collection(db, "studyLogs"), reviewLog);
    fetchLogs();
  };

  const addLog = async () => {
    if (!subject || !hours || !auth.currentUser) return;

    const newLog = {
      subject,
      hours: parseFloat(hours),
      date: new Date().toISOString(),
      uid: auth.currentUser.uid,
    };

    await addDoc(collection(db, "studyLogs"), newLog);
    setSubject("");
    setHours("");
    fetchLogs();
  };

  const deleteLog = async (id) => {
    await deleteDoc(doc(db, "studyLogs", id));
    fetchLogs();
  };

  const todayHours = logs
    .filter(log => new Date(log.date).toDateString() === new Date().toDateString())
    .reduce((sum, log) => sum + log.hours, 0);

  const weekData = [...Array(7)].map((_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - i);
    const dayStr = day.toLocaleDateString("en-IN", { weekday: "short" });
    const total = logs
      .filter(log => new Date(log.date).toDateString() === day.toDateString())
      .reduce((sum, log) => sum + log.hours, 0);
    return { day: dayStr, hours: total, expectedHours: 4 }; // Static expected hours
  }).reverse();

  return (
    <div className="study-container">
      <h2 className="study-title">📘 Study Tracker</h2>
      <p className="quote">💬 {quote}</p>
      <p className="streak">🔥 Streak: {streak} day{streak !== 1 ? "s" : ""}</p>

      <div className="review-timer-box">
        <h3><FaClock /> Daily Review Timer</h3>
        {!isRunning && (
          <div className="timer-config">
            <button onClick={increaseTime}>➕</button>
            <span>{minutes} min</span>
            <button onClick={decreaseTime}>➖</button>
          </div>
        )}

        <div className="timer-display">{formatTime()}</div>

        {!isRunning && (
          <button className="start-btn" onClick={startTimer}>Start</button>
        )}

        {isRunning && (
          <div className="running-controls">
            {!isPaused ? (
              <button onClick={pauseTimer}>Pause</button>
            ) : (
              <button onClick={resumeTimer}>Resume</button>
            )}
            <button onClick={stopTimer}>Stop</button>
          </div>
        )}
      </div>

      <div className="study-form">
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
        <input value={hours} type="number" onChange={(e) => setHours(e.target.value)} placeholder="Hours" />
        <button onClick={addLog}>Add</button>
      </div>

      <div className="progress-bar">
        <p>Today's Total: {todayHours} hrs</p>
        <div className="bar-wrapper">
          <div className="bar-fill" style={{ width: `${(todayHours / 10) * 100}%` }}></div>
        </div>
      </div>

      <div className="chart-section">
        <h3>📊 Weekly Study Hours</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weekData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="expectedHours" fill="#94a3b8" radius={[6, 6, 0, 0]} name="Expected" />
            <Bar dataKey="hours" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="logs">
        <h3>📝 Study Logs</h3>
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              <strong>{log.subject}</strong> – {log.hours} hrs on {new Date(log.date).toLocaleDateString()}
              <button className="delete-btn" onClick={() => deleteLog(log.id)}>🗑️</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudyTracker;
