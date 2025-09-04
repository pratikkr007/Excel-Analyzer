import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await dispatch(login({ email, password })).unwrap();
      // Login successful - redirect handled by authSlice or component
      navigate("/dashboard"); // Adjust to your app's route
    } catch (error) {
      console.error("Login failed:", error);
      // Error handling is already in the authSlice, but you can add additional UI feedback here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/*<div className="forgot-password">
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>*/}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
        
        <div className="login-divider">
          <span>Or continue with</span>
        </div>
       
        <div className="social-login">
      {/*    <button className="social-button google">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M16.5 9.20455C16.5 8.56636 16.4455 7.95273 16.3409 7.36364H9V10.845H13.2955C13.1155 11.97 12.4773 12.9232 11.5091 13.5564V15.5636H14.1136C15.6182 14.1682 16.5 11.9318 16.5 9.20455Z" fill="#4285F4"/>
              <path d="M9 17C11.2955 17 13.2682 16.1705 14.7136 14.7564L12.1091 12.7491C11.3273 13.3473 10.2955 13.6818 9 13.6818C6.78636 13.6818 4.88182 12.1341 4.18636 10.0909H1.46818V12.1636C2.90455 15.0318 5.69545 17 9 17Z" fill="#34A853"/>
              <path d="M4.18636 10.0909C3.95455 9.40909 3.81818 8.68182 3.81818 7.99999C3.81818 7.31817 3.95455 6.5909 4.18636 5.90909V3.83636H1.46818C0.759091 5.27727 0.363636 6.8909 0.363636 7.99999C0.363636 9.10908 0.759091 10.7227 1.46818 12.1636L4.18636 10.0909Z" fill="#FBBC05"/>
              <path d="M9 4.31818C10.3864 4.31818 11.6273 4.84091 12.5682 5.79545L14.7682 3.59545C13.2636 2.19091 11.2909 1 9 1C5.69545 1 2.90455 2.96818 1.46818 5.83636L4.18636 7.90909C4.88182 5.86591 6.78636 4.31818 9 4.31818Z" fill="#EA4335"/>
            </svg>
            Google
          </button>*/}
     {/*     <button className="social-button github">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </button>*/}
        </div>
      </div>
    </div>
  );
}

export default Login;