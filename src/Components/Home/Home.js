import { useEffect, useState } from "react";
import firebase from "firebase";
import { Auth, dataBase } from "../../Config/Firebaseconfig";
import { v4 } from "uuid";
import "./Home.css";

function Home() {
  const [userID, setUserID] = useState("");
  const [userName, setuserName] = useState("");
  const [usersList, setusersList] = useState([]);
  const [chatUserName, setchatUserName] = useState("");
  const [chatUserID, setchatUserID] = useState("");
  const [conversationID, setConversationID] = useState("");
  const [text, setText] = useState("");
  const [Messages, setMessages] = useState([]);

  function handleAuth() {
    Auth.onAuthStateChanged(function c(response) {
      console.log(response);
      const userId = response.uid;
      setUserID(userId);
      dataBase
        .collection("Users")
        .doc(userId)
        .get()
        .then(function docs(doc) {
          setuserName(doc.data().name);
        });
      dataBase
        .collection("Users")
        .get()
        .then(function users(docuser) {
          const list = docuser.docs;
          console.log(list);
          const maplist = list.map(function (item) {
            return item.data();
          });
          console.log(maplist);
          const userlist = maplist.map(function (item) {
            return { Name: item.name, key: item.userid };
          });
          setusersList(userlist);
        });
    });
  }
  useEffect(handleAuth, []);
  function handleChatuser(item) {
    setchatUserID(item.key);
    setchatUserName(item.Name);
    let m;
    if (item.key < userID) {
      m = `${item.key}${userID}`;
    } else {
      m = `${userID}${item.key}`;
    }
    setConversationID(m);
    dataBase
      .collection("Conversations")
      .doc(m)
      .collection("messages")
      .get()
      .then(function (z) {
        const y = z.docs;
        console.log(y);
        const ylist = y.map(function (item) {
          return item.data();
        });
        setMessages(ylist);
      });
  }

  const viewMessages = Messages.map(function (item) {
    if (item.By === userID) {
      return (
        <div style={{ textAlign: "right" }}>
          <p className="rightMessage">{item.message}</p>
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: "left" }}>
          <p className="leftMessage">{item.message}</p>
        </div>
      );
    }
  });

  const x = usersList
    .filter(function (item) {
      // console.log(item, userID);
      if (item.key !== userID) {
        return true;
      } else {
        return false;
      }
    })
    .map(function (item) {
      return (
        <div
          onClick={function sample() {
            handleChatuser(item);
          }}
        >
          {item.Name}
        </div>
      );
    });

  function textChange(event) {
    setText(event.target.value);
  }
  function addinDataBase() {
    const messageId = v4();
    dataBase
      .collection("Conversations")
      .doc(conversationID)
      .collection("messages")
      .doc(messageId)
      .set({
        message: text,
        By: userID,
        To: chatUserID,
        createdTime: firebase.database.ServerValue.TIMESTAMP,
      })
      .then(function () {
        setText("");
      });
  }
  return (
    <div>
      {" "}
      <h3>Welcome {userName}</h3>
      <section className="container">
        <div className="listOfUsers">
          <div className="displayName">
            {/* <div className="displayPic">
              <img
                src="https://i.pinimg.com/originals/be/ac/96/beac96b8e13d2198fd4bb1d5ef56cdcf.jpg"
                alt=""
              />
            </div> */}
            <div style={{ margin: "0 10px" }}>
              <div style={{ fontWeight: 500 }}>{x}</div>
            </div>
          </div>
        </div>
        <div className="chatArea">
          {chatUserID ? (
            <div>
              <div className="chatHeader">{chatUserName}</div>
              <div className="messageSections">{viewMessages}</div>
              <div className="chatControls">
                <textarea
                  onChange={textChange}
                  value={text}
                  placeholder="Type a message"
                />
                <button onClick={addinDataBase}>Send</button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <h2>Select User to Chat</h2>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
export default Home;
