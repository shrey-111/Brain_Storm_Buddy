import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig.js"; // Ensure your firebaseConfig is properly imported
import { toast } from 'react-toastify';
import "./Login.css";

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login logic
        const userCredential = await signInWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
        toast.success(`Welcome back, ${userCredential.user.email}!`);
        navigate("/");
      } else {
        // Signup logic
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
        const user = userCredential.user;

        // Store user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: form.name,
          email: form.email,
        });

        toast.success("Signup successful! Please log in.");;
        setIsLogin(true); // Switch to login mode after signup
        setForm({ name: "", email: "", password: "" });
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-signup-container">
      <div className="left-panel"></div>
      <div className="right-panel">
        <form className="form-container" onSubmit={handleSubmit}>
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>

          {!isLogin && (
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>

          <p>
            {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
            <span
              className="toggle-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginSignup;
