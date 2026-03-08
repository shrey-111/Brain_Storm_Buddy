import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig.js"; // Ensure Firebase is initialized here
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import "./Explore.css";
import U1 from "../../public/UPSC1.png";
import U2 from "../../public/UPSC2.png";
import U3 from "../../public/u3.jpg";
import U4 from "../../public/UPSC4.png";
import U5 from "../../public/u5.jpg";
import TM from "../../public/TM.jpg";
import UP from "../../public/UP.png";
import WB from "../../public/WB.png";
import P1 from "../../public/P1.png";
import P2 from "../../public/P2.png";
import FD1 from "../../public/FD1.png";
import FD2 from "../../public/FD2.png";
import FD3 from "../../public/FD3.png";
import FD4 from "../../public/FD4.png";
import FD5 from "../../public/FD5.png";
import BD1 from "../../public/BD1.png";
import BD2 from "../../public/BD2.png";
import BD3 from "../../public/BD3.png";
import BD4 from "../../public/BD4.png";
import B1 from "../../public/B1.png";
import B2 from "../../public/B2.png";
import B3 from "../../public/B3.png";
import B4 from "../../public/B4.png";
import B5 from "../../public/B5.png";
import S1 from "../../public/SSC1.png";
import S2 from "../../public/SSC2.png";
import S3 from "../../public/SS3.png";
import S4 from "../../public/SSC4.png";
import S5 from "../../public/SSC5.png";
import G from "../../public/GE.png";
import G1 from "../../public/GE1.png";
import G2 from "../../public/GE2.png";
import G3 from "../../public/GE3.png";
import G4 from "../../public/GE4.png";
import G5 from "../../public/GE5.png";
import N1 from "../../public/NDA1.png";
import N2 from "../../public/NDA2.png";
import N3 from "../../public/NDA3.png";
import N4 from "../../public/NDA4.png";
import N5 from "../../public/NDA5.png";
import A1 from "../../public/AI1.png";
import A2 from "../../public/AI2.png";
import A3 from "../../public/AI3.png";
import A4 from "../../public/AI4.png";
import A5 from "../../public/AI5.png";
import A6 from "../../public/AI6.png";
import AD1 from "../../public/AD1.png";
import AD2 from "../../public/AD2.png";
import AD3 from "../../public/AD3.png";
import AD4 from "../../public/AD4.png";
import IOS1 from "../../public/IOS1.png";
import IOS3 from "../../public/IOS3.png";
import IOS4 from "../../public/IOS4.png";
import IOS5 from "../../public/IOS5.png";
import SE1 from "../../public/SE1.png";
import SE2 from "../../public/SE2.png";
import SE3 from "../../public/SE3.png";
import SE5 from "../../public/SE5.png";
import useAuth from "../../custom-hooks/useAuth.js";

const Explore = () => {
  const navigate = useNavigate();

  const [selectedField, setSelectedField] = useState(null);
  const [selectedSubField, setSelectedSubField] = useState(null);
  const [joinedCommunities, setJoinedCommunities] = useState([]); // Track joined communities
  const [loading, setLoading] = useState(true); // For handling user data loading

  const fields = [
    { name: "Civil Services", subFields: ["UPSC", "State PCS"] },
    { name: "Web Developers", subFields: ["Frontend", "Backend"] },
    { name: "App Developers", subFields: ["Android Developers", "IOS Developers"] },
    { name: "Gate", subFields: ["Beginner", "Practice"] },
    { name: "Competetive Exams", subFields: ["SSC", "Banking", "State Exams", "NDA"] },
    { name: "Artificial Intelligence", subFields: ["Deep Learning", "Machine Learning"] },
  ];


const communitiesBySubField = {
    UPSC: [
      {
        "name": "UPSC Prep Group",
        "collectionName": "upscprepgroup",
        "description": "A one-stop community for UPSC aspirants.",
        "image": U1,
      },
      {
        "name": "Daily Current Affairs",
        "collectionName": "dailycurrentaffairs",
        "description": "Get the latest current affairs for UPSC.",
        "image": U2,
      },
      {
        "name": "Mains Answer Writing",
        "collectionName": "mainsanswerwriting",
        "description": "Improve answer writing skills for UPSC mains.",
        "image": U3,
      },
      {
        "name": "Prelims Practice Hub",
        "collectionName": "prelimspracticehub",
        "description": "Practice MCQs and quizzes for UPSC prelims.",
        "image": U4,
      },
      {
        "name": "Optional Subjects",
        "collectionName": "optionalsubjects",
        "description": "Master UPSC optional subjects with experts.",
        "image": U5,
      },
    ],
    "State PCS": [
      {
        "name": "Tamil Nadu PCS Group",
        "collectionName": "tamilnadupcsgroup",
        "description": "Discussion group for Tamil Nadu PCS exams.",
        "image": TM,
      },
      {
        "name": "Uttar Pradesh PCS Group",
        "collectionName": "uttarpradeshpcsgroup",
        "description": "Discussion group for Uttar Pradesh PCS exams.",
        "image": UP,
      },
      {
        "name": "West Bengal PCS Group",
        "collectionName": "westbengalpcsgroup",
        "description": "Discussion group for West Bengal PCS exams.",
        "image": WB,
      },
      {
        "name": "Punjab PCS Group",
        "collectionName": "punjabpcsgroup",
        "description": "Focused discussions for Punjab PCS exams.",
        "image": P1,
      },
      {
        "name": "Rajasthan PCS Group",
        "collectionName": "rajasthanpcsgroup",
        "description": "A dedicated group for Rajsthan PCS aspirants.",
        "image": P2,
      },
    ],
    Frontend: [
      {
        "name": "Frontend Dev Hub",
        "collectionName": "frontenddevhub",
        "description": "Connect with frontend developers worldwide.",
        "image": FD1,
      },
      {
        "name": "Frontend Masters",
        "collectionName": "frontendmasters",
        "description": "Explore techniques in frontend development.",
        "image": FD2,
      },
      {
        "name": "Beginners Group",
        "collectionName": "beginnersgroup",
        "description": "A supportive group for new frontend learners.",
        "image": FD3,
      },
      {
        "name": "UI/UX Builders",
        "collectionName": "uiuxbuilders",
        "description": "Discuss and share UI/UX designs and implementations.",
        "image": FD4,
      },
      {
        "name": "Coding Challenges",
        "collectionName": "codingchallenges",
        "description": "Take on challenges to enhance frontend coding skills.",
        "image": FD5,
      },
    ],
    Backend: [
      {
        "name": "Node.js Group",
        "collectionName": "nodejsgroup",
        "description": "Learn server-side JavaScript.",
        "image": BD1,
      },
      {
        "name": "Express Developers",
        "collectionName": "expressdevelopers",
        "description": "Focus on lightweight web frameworks.",
        "image": BD2,
      },
      {
        "name": "Backend Experts",
        "collectionName": "backendexperts",
        "description": "Share tips on backend development.",
        "image": BD4,
      },
      {
        "name": "API Builders",
        "collectionName": "apibuilders",
        "description": "Create scalable and secure APIs.",
        "image": BD3,
      },
    ],
    "Android Developers": [
      {
        "name": "Android Basics",
        "collectionName": "androidbasics",
        "description": "Learn the fundamentals of Android app development.",
        "image": AD1,
      },
      {
        "name": "Kotlin for Android",
        "collectionName": "kotlinforandroid",
        "description": "Master Kotlin, the modern language for Android apps.",
        "image": AD2,
      },
      {
        "name": "UI/UX in Android",
        "collectionName": "uiuxinandroid",
        "description": "Create Android app interfaces with Design.",
        "image": AD3,
      },
      {
        "name": "Advanced Android",
        "collectionName": "advancedandroid",
        "description": "Dive into advanced topics like Jetpack and performance optimization.",
        "image": AD4,
      },
    ],
    "IOS Developers": [
      {
        "name": "iOS Basics",
        "collectionName": "iosbasics",
        "description": "Learn the fundamentals of iOS app development with Swift.",
        "image": IOS1,
      },
      {
        "name": "Swift for iOS",
        "collectionName": "swiftforios",
        "description": "Master Swift to build efficient iOS real-time applications.",
        "image": IOS3,
      },
      {
        "name": "UI/UX in iOS",
        "collectionName": "uiuxinios",
        "description": "Design intuitive and responsive user interfaces for iOS apps.",
        "image": IOS4,
      },
      {
        "name": "Advanced iOS Development",
        "collectionName": "advancediosdevelopment",
        "description": "Explore advanced concepts like Core Data and SwiftUI.",
        "image": IOS5,
      },
    ],
    Beginner: [
      {
        "name": "GATE CS Prep",
        "collectionName": "gatecsprep",
        "description": "Prepare for GATE Computer Science with expert guidance.",
        "image": G,
      },
      {
        "name": "GATE PYQs",
        "collectionName": "gatepyqs",
        "description": "Practice previous years' GATE questions for better insights.",
        "image": G1,
      },
      {
        "name": "GATE Strategy Hub",
        "collectionName": "gatestrategyhub",
        "description": "Explore new strategies and tips to crack the GATE exam.",
        "image": G2,
      },
    ],
    Practice: [
      {
        "name": "GATE Mock Tests",
        "collectionName": "gatemocktests",
        "description": "Simulate real GATE exams with timed mock tests.",
        "image": G3,
      },
      {
        "name": "Challenges",
        "collectionName": "challenges",
        "description": "Sharpen your skills with problem-solving exercises.",
        "image": G4,
      },
      {
        "name": "Topic-Wise Practice",
        "collectionName": "topicwisepractice",
        "description": "Master GATE concepts with focused topic-wise practice.",
        "image": G5,
      },
    ],
    SSC: [
      {
        "name": "SSC CGL Prep",
        "collectionName": "ssccglprep",
        "description": "Ace the SSC CGL exam with expert tips and materials.",
        "image": S1,
      },
      {
        "name": "SSC CHSL Practice",
        "collectionName": "ssccshlpractice",
        "description": "Prepare for SSC CHSL with mock tests and guides.",
        "image": S2,
      },
      {
        "name": "SSC GD Focus",
        "collectionName": "sscgdfocus",
        "description": "Learn new strategies to crack SSC GD exams effectively.",
        "image": S3,
      },
      {
        "name": "Quantitative Mastery Group",
        "collectionName": "quantitativemasterygroup",
        "description": "Boost your SSC prep with quantitative aptitude drills.",
        "image": S4,
      },
      {
        "name": "SSC General Awareness",
        "collectionName": "sscgeneralawareness",
        "description": "Stay updated with general knowledge.",
        "image": S5,
      },
    ],
    Banking: [
      {
        "name": "IBPS PO Prep",
        "collectionName": "ibpspoprep",
        "description": "Comprehensive resources to crack IBPS PO exams.",
        "image": B1,
      },
      {
        "name": "SBI Clerk Focus",
        "collectionName": "sbiclerkfocus",
        "description": "Targeted practice for the SBI Clerk exam.",
        "image": B2,
      },
      {
        "name": "RBI Assistant Guide",
        "collectionName": "rbiasistantguide",
        "description": "Tips and tricks to excel in RBI Assistant exams.",
        "image": B3,
      },
      {
        "name": "Banking Awareness",
        "collectionName": "bankingawareness",
        "description": "Master banking and financial awareness for exams.",
        "image": B4,
      },
      {
        "name": "Mock Tests for Banking",
        "collectionName": "mocktestsforbanking",
        "description": "Simulate real banking exams with mock tests.",
        "image": B5,
      },
    ],
    "State Exams": [
      {
        "name": "State Police Services",
        "collectionName": "statepoliceservices",
        "description": "Recruitment exams for state police and law enforcement.",
        "image": SE1,
      },
      {
        "name": "State Teacher Eligibility Tests",
        "collectionName": "stateteachertests",
        "description": "Eligibility exams for teaching positions in state schools.",
        "image": SE2,
      },
      {
        "name": "State Finance and Accounts Exams",
        "collectionName": "statefinanceexams",
        "description": "Recruitment exams for finance and audit positions in states.",
        "image": SE3,
      },
      {
        "name": "State Health Services Exams",
        "collectionName": "statehealthservices",
        "description": "Exams for healthcare professionals in state services.",
        "image": SE5,
      },
    ],
    NDA: [
      {
        "name": "NDA Written Prep",
        "collectionName": "ndawrittenprep",
        "description": "Master the syllabus and ace the NDA written exam.",
        "image": N1,
      },
      {
        "name": "NDA Maths Practice",
        "collectionName": "ndamathspractice",
        "description": "Boost your problem-solving skills with focused maths prep.",
        "image": N2,
      },
      {
        "name": "General Ability Hub",
        "collectionName": "generalabilityhub",
        "description": "Prepare for the general ability test with expert tips.",
        "image": N3,
      },
      {
        "name": "SSB Interview Guide",
        "collectionName": "ssbinterviewguide",
        "description": "Learn strategies to excel in the SSB interview process.",
        "image": N5,
      },
      {
        "name": "NDA Physical Prep",
        "collectionName": "ndaphysicalprep",
        "description": "Get ready for the physical fitness test with guidance.",
        "image": N4,
      },
    ],
    "Deep Learning": [
      {
        "name": "Neural Network Basics",
        "collectionName": "neuralnetworkbasics",
        "description": "Learn the fundamentals of neural networks and their applications.",
        "image": A1,
      },
      {
        "name": "Deep Learning Models",
        "collectionName": "deeplearningmodels",
        "description": "Explore advanced models like CNNs, RNNs, and transformers.",
        "image": A2,
      },
      {
        "name": "AI Applications Hub",
        "collectionName": "aiapplicationshub",
        "description": "Discover real-world applications of AI and deep learning.",
        "image": A3,
      },
    ],
    "Machine Learning": [
      {
        "name": "ML Basics",
        "collectionName": "mlbasics",
        "description": "Start your journey with the fundamentals of machine learning.",
        "image": A4,
      },
      {
        "name": "Supervised Learning",
        "collectionName": "supervisedlearning",
        "description": "Dive into classification and regression techniques.",
        "image": A5,
      },
      {
        "name": "Unsupervised Learning",
        "collectionName": "unsupervisedlearning",
        "description": "Explore clustering and dimensionality reduction methods.",
        "image": A6,
      },
    ],

  };



  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        const userDocRef = doc(db, "users", currentUser.uid); // Using currentUser.uid
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setJoinedCommunities(userData.joinedCommunities || []);
        }

        setLoading(false);
      };

      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleJoinCommunity = async (communityName, communityId) => {
    if (!currentUser) {
      toast.error("You must be logged in to join a community.");
      return;
    }

    const userId = currentUser.uid; // Dynamically get the current user ID
    const userDocRef = doc(db, "users", userId);

    try {
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const alreadyJoined = (userData.joinedCommunities || []).includes(communityId);

        if (alreadyJoined) {
          navigate(`/community/${communityId}`);
          return;
        } else {
          await updateDoc(userDocRef, {
            joinedCommunities: [...(userData.joinedCommunities || []), communityId],
          });
        }
      } else {
        await setDoc(userDocRef, {
          uid: userId,
          joinedCommunities: [communityId],
        });
      }

      toast.success("Successfully joined the community!");
      navigate(`/community/${communityId}`);
    } catch (error) {
      console.error("Error joining community:", error);
      toast.error("Failed to join the community. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="explore-container">
      <div className="field-section">
        {!selectedField ? (
          <ul className="field-list">
            {fields.map((field, index) => (
              <li
                key={index}
                className="field-item"
                onClick={() => setSelectedField(field.name)}
              >
                {field.name}
              </li>
            ))}
          </ul>
        ) : (
          <div className="selected-field">
            <h3>{selectedField}</h3>
            <ul className="subfield-list">
              {fields
                .find((field) => field.name === selectedField)
                .subFields.map((subField, index) => (
                  <li
                    key={index}
                    className={`subfield-item ${selectedSubField === subField ? "selected" : ""}`}
                    onClick={() => setSelectedSubField(subField)}
                  >
                    {subField}
                  </li>
                ))}
            </ul>
            <button
              className="back-button"
              onClick={() => {
                setSelectedField(null);
                setSelectedSubField(null);
              }}
            >
              Back
            </button>
          </div>
        )}
      </div>

      <div className="community-section">
        <h2>Communities</h2>
        {selectedSubField ? (
          <div className="community-list">
            {communitiesBySubField[selectedSubField]?.map((community, index) => (
              <div key={index} className="community-item">
                <img src={community.image} alt={community.name} className="community-image" />
                <div className="community-details">
                  <h3>{community.name}</h3>
                  <p>{community.description}</p>
                  <button
                    className="join-button"
                    onClick={() => handleJoinCommunity(community.name, community.collectionName)}
                  >
                    {joinedCommunities.includes(community.collectionName) ? "Joined" : "Join Now"}
                  </button>
                </div>
              </div>
            )) || <p>No communities available for this subfield.</p>}
          </div>
        ) : (
          <p>Please select a subfield to view communities.</p>
        )}
      </div>
    </div>
  );
};

export default Explore;
