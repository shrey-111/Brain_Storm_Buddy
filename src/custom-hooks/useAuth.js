import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState({});
  const db = getFirestore(); // Initialize Firestore

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data from Firestore to get displayName
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({
            ...user,
            displayName: userData.displayName || user.displayName,
          });
        } else {
          setCurrentUser(user);
        }

        console.log("user signed in", user);
      } else {
        setCurrentUser(null);
        console.log("no user found");
      }
    });

    return () => unsubscribe(); // Clean up subscription
  }, [db]);

  return {
    currentUser,
  };
};

export default useAuth;
