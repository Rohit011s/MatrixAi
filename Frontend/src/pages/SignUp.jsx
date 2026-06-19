import { useState } from "react";
import "./SignUp.css"
import { Link, useNavigate } from 'react-router-dom'

function Signin() {
  const navigate=useNavigate();
    const [formData, setFormData] = useState({
      username: " ",
      email: " ",
      password: " ",
    });

    const handleChange=(e)=>{
        setFormData({
...formData,[e.target.name]:e.target.value
        })
    };
    const handleSubmit=async(e)=>{
       e.preventDefault();
       try{
        const response= await fetch("http://localhost:8080/api/signup",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
    }),
  }
);
  const res=await response.json();

}catch(err){console.log(err);
}

       
          // navigate("/");
console.log(formData);

    }
  return (
    <div className="container">
<h3> Mtrix Ai <img className="logo" src="src/assets/matrixAiLogo.png" alt="logo" /></h3>
<p className="subtitle">Sign Up</p>
    <form onSubmit={handleSubmit}>
    <div className="inputDiv">
     <label>username</label>
      <input name="username" type="text" placeholder="username" value={formData.username} onChange={handleChange} />
      </div> 
    <div className="inputDiv">
      <label>email</label>
      <input name="email" type="text" placeholder="email" value={formData.email} onChange={handleChange} />
      </div> 
    <div className="inputDiv">
      <label>password</label>
      <input name="password" type="text" placeholder="password" value={formData.password} onChange={handleChange} />
      </div> 
        <button className="sign-btn" type="submit">
          Sign Up
        </button>

        <p className="auth-link">
          Already have account? <Link  to="/signin">Sign In</Link>
        </p>
    </form>

    </div>

  );
}
export default Signin;
