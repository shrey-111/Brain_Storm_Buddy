import React, { useState, useEffect } from "react";
import "./Study.css";
import { FaBook } from "react-icons/fa";
import { db, auth } from "../../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

const StudyPlanner = () => {
  const [syllabus, setSyllabus] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [studyPlan, setStudyPlan] = useState("");
  const [endDate, setEndDate] = useState("");
  const [progress, setProgress] = useState(0);
  const [quote, setQuote] = useState("");
  const [topics, setTopics] = useState([]);
  const [checkedTopics, setCheckedTopics] = useState([]);

  // Fetch motivational quote
  useEffect(() => {
    fetch("https://api.quotable.io/random?tags=motivational|education")
      .then((res) => res.json())
      .then((data) => setQuote(data.content))
      .catch(() => setQuote("Keep pushing forward, one topic at a time!"));
  }, []);

  // Load existing study plan from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userId = user.uid;
      const docRef = doc(db, "studyPlans", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSyllabus(data.syllabus || "");
        setHoursPerDay(data.hoursPerDay || "");
        setStudyPlan(data.studyPlan || "");
        setEndDate(data.endDate || "");
        setTopics(data.topics || []);
        setCheckedTopics(data.checkedTopics || []);
      }
    };

    fetchData();
  }, []);

  // Generate new study plan and save to Firestore
  const generatePlan = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userId = user.uid;

    if (!syllabus || !hoursPerDay) {
      setStudyPlan("Please fill in both fields.");
      return;
    }

    const topicsArray = syllabus
      .split(",")
      .map((topic) => topic.trim())
      .filter(Boolean);

    setTopics(topicsArray);
    setCheckedTopics([]);
    setProgress(0);

    const totalHours = topicsArray.length * 2;
    const daysRequired = Math.ceil(totalHours / Number(hoursPerDay));
    const today = new Date();
    const completionDate = new Date(today.setDate(today.getDate() + daysRequired));
    const formattedDate = completionDate.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const newPlan = {
      syllabus,
      hoursPerDay,
      studyPlan: `You can complete your syllabus in ${daysRequired} days.`,
      endDate: formattedDate,
      topics: topicsArray,
      checkedTopics: [],
    };

    await setDoc(doc(db, "studyPlans", userId), newPlan);

    setStudyPlan(newPlan.studyPlan);
    setEndDate(newPlan.endDate);
  };

  // Toggle topic completion and update Firestore
  const toggleTopic = async (topic) => {
    const user = auth.currentUser;
    if (!user) return;

    const userId = user.uid;

    const updatedChecked = checkedTopics.includes(topic)
      ? checkedTopics.filter((t) => t !== topic)
      : [...checkedTopics, topic];

    setCheckedTopics(updatedChecked);

    await setDoc(
      doc(db, "studyPlans", userId),
      { checkedTopics: updatedChecked },
      { merge: true }
    );
  };

  // Update progress bar
  useEffect(() => {
    if (topics.length > 0) {
      const completed = checkedTopics.length;
      const total = topics.length;
      const percentage = Math.round((completed / total) * 100);
      setProgress(percentage);
    }
  }, [checkedTopics, topics]);

  const getBadge = () => {
    if (progress === 100) return "💎 Diamond";
    if (progress >= 75) return "🥇 Gold";
    if (progress >= 50) return "🥈 Silver";
    if (progress >= 25) return "🥉 Bronze";
    return "🔰 Newbie";
  };

  return (
    <div className="study-container">
      <h2 className="study-title">
        <FaBook /> Study Planner
      </h2>

      <textarea
        className="study-input"
        placeholder="📘 Enter syllabus (comma-separated)"
        value={syllabus}
        onChange={(e) => setSyllabus(e.target.value)}
      />
      <input
        type="number"
        className="study-input"
        placeholder="⏰ Hours per day"
        value={hoursPerDay}
        onChange={(e) => setHoursPerDay(e.target.value)}
      />

      <button className="study-button" onClick={generatePlan}>
        Generate Plan
      </button>

      {studyPlan && (
        <div className="study-plan-box">
          📌 {studyPlan}
          <br />
          📅 Estimated Completion Date: <strong>{endDate}</strong>
          <br />
          🏅 Badge Earned: <strong>{getBadge()}</strong>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {topics.length > 0 && (
        <div className="topic-tracker">
          <h4>🗂 Your Topics</h4>
          <ul>
            {topics.map((topic, i) => (
              <li key={i}>
                <label>
                  <input
                    type="checkbox"
                    checked={checkedTopics.includes(topic)}
                    onChange={() => toggleTopic(topic)}
                  />
                  {topic}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {quote && <div className="quote-box">🧠 {quote}</div>}
    </div>
  );
};

export default StudyPlanner;
