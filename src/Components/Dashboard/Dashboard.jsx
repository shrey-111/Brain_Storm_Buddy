import React from "react";
import "./Dashboard.css";
import { motion } from "framer-motion";

 const Dashboard = () => {
//   const user = {
//     name: "Shreya",
//     avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Shreya",
//     coins: 120,
//   };

  const cards = [
    {
      title: "Courses",
      description: "Prepare for UPSC, State PCS, and more",
      color: "#D1FAE5",
      icon: "📚",
      path: "/explore"
    },
    {
      title: "Task Manager",
      description: "Track daily goals & productivity",
      color: "#DBEAFE",
      icon: "✅",
      path: "/taskmanager"
    },
    {
      title: "Study Tracker",
      description: "Log sessions & monitor progress",
      color: "#EDE9FE",
      icon: "📈",
      path: "/studytracker"
    },
    // {
    //   title: "Task Manager",
    //   description: "Compete with peers & earn coins",
    //   color: "#FCE7F3",
    //   icon: "🏆",
    //   path: "/leaderboard"
    // },
    {
      title: "Study Planner",
      description: "Plan your study with tasks",
      color: "#FFFFE0",
      icon: "🧑‍🤝‍🧑",
      path: "/study"
    },
    {
      title: "Profile",
      description: "See your stats, streaks & avatar",
      color: "#FFCCCB",
      icon: "👤",
      path: "/MyProfile"
    },
  ];

  return (
    <div className="dashboard">
      {/* <motion.div
        className="user-stats"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <img src={user.avatar} alt="avatar" className="avatar" />
        <div>
          <h3>{user.name}</h3>
          <p>🪙 {user.coins} Coins</p>
        </div>
      </motion.div> */}

      <h1 className="dashboard-title">
        🚀 Welcome to <span>Brain Storm Buddy</span>
      </h1>

      <div className="dashboard-grid">
        {cards.map((card, idx) => (
          <motion.a
            href={card.path}
            key={idx}
            className="dashboard-card"
            style={{ backgroundColor: card.color }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;