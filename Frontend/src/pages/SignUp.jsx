import { useContext, useState } from "react";
import "../styles/pages/SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MyContext } from "../context/MyContext";
import { signup } from "../../services/authApi";
import handleError from "../utils/handleError";
import logo from "../assets/matrixAiLogo.png";
function Signin() {
  const { setUser } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const validate = () => {
    const newError = {};
    // Email format validation pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //validation of field and set error of required and valid
    if (!formData.username.trim()) {
      newError.username = "! username is required";
    }
    if (!formData.email.trim()) {
      newError.email = "! email is required";
    }
    if (!emailRegex.test(formData.email.trim())) {
      newError.email = "! enter a valid email ";
    }
    if (!formData.password.trim()) {
      newError.password = "! passwored is required";
    }
    //  if (formData.password.trim().length< 6) {
    //   newError.password = "! passwored length should be 6";
    // }
    setErrors(newError);
    return Object.keys(newError).length === 0;
  };
  // Update form state when user types
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // prevent double clicked
    if (loading) return;
    //validation
    if (!validate()) return;

    setLoading(true);

    try {
      // Send signup request to backend
      const res = await signup({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
      });

      toast.success("Account created successfully");
      setUser(res.user);
      navigate("/");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container">
      <h3 onClick={()=>{navigate("/")}}>
        {" "}
        Matrix Ai{" "}
        <img className="logo" src={logo} alt="logo" />
      </h3>
      <p className="subtitle">Sign Up</p>
      {/* sign up form  */}
      <form onSubmit={handleSubmit}>
        <div className="inputDiv">
          <label>username</label>
          <input
            name="username"
            type="text"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
          />
        {/* show error */}
          {<span className="InputErrors">{errors.username}</span>}
        </div>
        <div className="inputDiv">
          <label>email</label>
          <input
            name="email"
            type="text"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
          />
          {<span className="InputErrors">{errors.email}</span>}
        </div>
        <div className="inputDiv">
          <label>password</label>
          <input
            name="password"
            type="text"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
          />
          {<span className="InputErrors">{errors.password}</span>}
        </div>
        <button disabled={loading} className="sign-btn" type="submit">
          {loading ? "Signing up..." : "Sign Up"}
        </button>
{/* link and navigate */}
        <p className="auth-link">
          Already have account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
export default Signin;
