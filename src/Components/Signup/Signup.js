import { useState } from "react";

import "./Signup.css";
import { Auth, dataBase } from "../../Config/Firebaseconfig";

function Signup(props) {
  console.log(props);
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  function inputName(event) {
    setName(event.target.value);
  }
  function inputEmail(event) {
    setEmail(event.target.value);
  }
  function inputPassword(event) {
    setPassword(event.target.value);
  }
  // function AddNameInDatabase(userId) {
  //   Db.collection("Users")
  //     .doc(userId)
  //     .set({
  //       name: Name,
  //     })
  //     .then(() => {
  //       props.history.push("/");
  //     })
  //     .catch((error) => {
  //       console.error("Error writing document: ", error);
  //     });
  // }
  //

  function buttonClick() {
    Auth.createUserWithEmailAndPassword(Email, Password).then(function a(
      response
    ) {
      const userID = response.user.uid;

      dataBase
        .collection("Users")
        .doc(userID)
        .set({ name: Name, email: Email, userid: userID })
        .then(function b() {
          props.history.push("/");
        })
        .catch(function (err) {
          console.log(err);
        });
    });
    // .then((userCredential) => {
    //   // Signed in
    //   var user = userCredential.user;
    //   // ...
    // })
    // .catch((error) => {
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // ..
    // });
  }
  return (
    <div className="registerPage">
      <div className="registerButton">
        <h2>Start Your Chat By registering</h2>
        <div>Enter Your Name</div>
        <input
          onChange={inputName}
          value={Name}
          className="nameInput"
          placeholder="Your Name"
        ></input>
        <div>Enter Your Email</div>
        <input
          onChange={inputEmail}
          value={Email}
          className="emailInput"
          placeholder="Your Email"
        ></input>
        <div>Enter Your Password</div>
        <input
          onChange={inputPassword}
          value={Password}
          className="passwordInput"
          type="password"
          placeholder="Your Password"
        ></input>
        <div>
          <button className="handleButton" onClick={buttonClick}>
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}
export default Signup;
