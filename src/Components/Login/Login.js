import { Link } from "react-router-dom";
import { useState } from "react";
import { Auth } from "../../Config/Firebaseconfig";
import "./Login.css";

function Login(props) {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  function inputEmail(event) {
    setEmail(event.target.value);
  }
  function inputPassword(event) {
    setPassword(event.target.value);
  }
  function buttonClick() {
    Auth.signInWithEmailAndPassword(Email, Password).then(function k() {
      props.history.push("/Home");
    });
    // .then((userCredential) => {
    //   // Signed in
    //   var user = userCredential.user;
    //   // ...
    // })
    // .catch((error) => {
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    // });
  }
  return (
    <div className="loginPage">
      <div className="loginButton">
        {/* <h1>Loads Of Tasks To Accomplish!</h1> */}
        {/* <div>LOGIN HERE</div> */}
        <div>Enter Your Email</div>
        <input
          onChange={inputEmail}
          value={Email}
          className="emailInput"
          placeholder="Your Email"
        ></input>
        <div>Enter your Password</div>
        <input
          onChange={inputPassword}
          value={Password}
          className="passwordInput"
          type="password"
          placeholder="Your Password"
        ></input>
        <div>
          <button className="handleButton" onClick={buttonClick}>
            LOGIN
          </button>
        </div>
        <div>
          Don't have an account?{" "}
          <Link to="/Signup">
            <span>Create One</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Login;
