import { useContext, useState } from "react";
import "./SignUp.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../context/MyContext";
function Signin() {
  const {setUser}=useContext(MyContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     try{
        const response= await fetch("http://localhost:8080/api/signin",{
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
  username: formData.username.trim(),
  password: formData.password.trim(),
    }),
  }
);
if (!response.ok) {
  console.log("Request failed:", response.status);
  return;
}
console.log(response);

const res =await response.json();
setUser(res.user);
   navigate("/");

}catch(err){console.log(err);

}

  };

  return (
    <div className="container">
      <h3>
        Matrix AI
        <img className="logo" src="src/assets/matrixAiLogo.png" alt="logo" />
      </h3>

      <p className="subtitle">Sign In</p>

      <form onSubmit={handleSubmit}>
        <div className="inputDiv">
          <label>username</label>
          <input
            name="username"
            type="text"
            placeholder="Enter your email"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="inputDiv">
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button className="sign-btn" type="submit">
          Sign In
        </button>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default Signin;
