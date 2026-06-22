import { useContext, useState } from "react";
import "../styles/pages/SignUp.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../context/MyContext";
import { signin } from "../../services/authApi";
import toast from "react-hot-toast";
import handleError from "../utils/handleError";
function Signin() {
  const { setUser } = useContext(MyContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({});
  };
  // Validate signin form inputs
  const validate = () => {
    const newError = {};
    //empty fields
    if (!formData.username.trim()) {
      newError.username = "username required";
    }
    if (!formData.password.trim()) {
      newError.password = "passwored required";
    }
    //set error
    setErrors(newError);
    // Return validation result
    return Object.keys(newError).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate signin requests
    if (loading) return;
    // Stop submission if validation fails
    if (!validate()) return;
    setLoading(true);

    try {
      // Send signin request to backend
      const res = await signin({
        username: formData.username.trim(),
        password: formData.password.trim(),
      });

      // Store authenticated user in global state
      setUser(res.user);

      toast.success("Login Successful");
      navigate("/");
    } catch (err) {
      if (err.status === 401) {
        setUser(null);
      }
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h3>
        Matrix AI
        <img className="logo" src="src/assets/matrixAiLogo.png" alt="logo" />
      </h3>

      <p className="subtitle">Sign In</p>
      {/* Signin form */}
      <form onSubmit={handleSubmit}>
        {/* Username input field */}
        <div className="inputDiv">
          <label>username</label>
          <input
            name="username"
            type="text"
            placeholder="Enter your email"
            value={formData.username}
            onChange={handleChange}
          />
          {/* Display username validation error */}
          <span className="InputErrors">{errors.username}</span>
        </div>

        {/* Password input field */}
        <div className="inputDiv">
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          {/* Display password validation error */}
          <span className="InputErrors">{errors.password}</span>
        </div>

        <button disabled={loading} className="sign-btn" type="submit">
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {/* Link to signup page */}
        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default Signin;
