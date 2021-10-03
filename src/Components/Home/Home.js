import { useEffect, useState } from "react";
import firebase from "firebase";
import { Auth, dataBase } from "../../Config/Firebaseconfig";
import { v4 } from "uuid";
import "./Home.css";

function Home(props) {
  const [userID, setUserID] = useState("");
  const [userName, setuserName] = useState("");
  const [usersList, setusersList] = useState([]);
  const [chatUserName, setchatUserName] = useState("");
  const [chatUserID, setchatUserID] = useState("");
  const [conversationID, setConversationID] = useState("");
  const [text, setText] = useState("");
  const [Messages, setMessages] = useState([]);

  useEffect(handleAuth, []);

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
      .orderBy("createdTime")
      .onSnapshot(function (z) {
        console.log(z);
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
        <div style={{ marginBottom: "5px" }}>
          <div className="message1">
            <div className="text1">{item.message}</div>
          </div>
          {/* <div className="date1">
            <div
              style={{ fontSize: "11px", color: "gray", marginBottom: "3px" }}
            >
              Apr 16
            </div>
          </div> */}
        </div>
      );
    } else {
      return (
        <div style={{ marginBottom: "5px" }}>
          <div className="message2">
            <div className="text2">{item.message}</div>
          </div>
          {/* <div className="date2">
            <div
              style={{ fontSize: "11px", color: "gray", marginBottom: "3px" }}
            >
              Apr 16
            </div>
          </div> */}
        </div>
      );
    }
  });

  console.log({ Messages });
  const x = usersList
    .filter(function (item) {
      if (item.key !== userID) {
        return true;
      } else {
        return false;
      }
    })
    .map(function (item) {
      return (
        <div
          className={
            chatUserID === item.key ? "conversation active " : "conversation"
          }
          key={item.key}
          onClick={function sample() {
            handleChatuser(item);
          }}
        >
          <div className="title-text"> {item.Name}</div>
        </div>
      );
    });

  function textChange(event) {
    setText(event.target.value);
  }

  function addinDataBase() {
    if (text) {
      const messageId = v4();
      dataBase
        .collection("Conversations")
        .doc(conversationID)
        .collection("messages")
        .doc(messageId)
        .set({
          messageId: messageId,
          message: text,
          By: userID,
          To: chatUserID,
          createdTime: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(function () {
          setText("");
        });
    }
  }
  function Signout() {
    Auth.signOut()
      .then(function () {
        props.history.push("/");
      })
      .catch(function () {});
  }

  return (
    <div>
      <div className="header">
        <div className="headerText">Welcome {userName}</div>
        <div>
          <button onClick={Signout}>Logout</button>
        </div>
      </div>
      <div className="layout">
        <div className="items">
          <div className="box1">{x}</div>
          <div className="box2">
            <div className="right-box1">{chatUserName}</div>
            {chatUserID ? (
              <div className="right-box2">{viewMessages} </div>
            ) : (
              <div
                className="right-box2"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Select User to Continue Chatting
              </div>
            )}

            {chatUserID ? (
              <div
                className="right-box3"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <input
                  style={{ flex: 7 }}
                  placeholder="Type a Message"
                  id="message-input"
                  onChange={textChange}
                  value={text}
                />
                <button style={{ flex: 1 }} onClick={addinDataBase}>
                  Send
                </button>
              </div>
            ) : (
              <div className="right-box3" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
