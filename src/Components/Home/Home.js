import { useEffect, useState } from "react";
import firebase from "firebase";
import { Auth, dataBase } from "../../Config/Firebaseconfig";
import { v4 } from "uuid";
import "./Home.css";

function Home(props) {
  const [usersList, setusersList] = useState([]);
  const [conversationID, setConversationID] = useState("");
  const [text, setText] = useState("");
  const [Messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [chatUserDetails, setChatUserDetails] = useState({});

  useEffect(handleAuth, []);

  function handleAuth() {
    Auth.onAuthStateChanged(function c(response) {
      const userId = response.uid;
      dataBase
        .collection("Users")
        .doc(userId)
        .get()
        .then(function (response) {
          setUserDetails({ name: response.data().name, id: userId });
        })
        .catch(function (error) {
          window.alert(error.message);
        });
      dataBase
        .collection("Users")
        .get()
        .then(function users(docuser) {
          const list = docuser.docs;
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
    setChatUserDetails({ name: item.Name, id: item.key });

    let m;
    const u = userDetails.id;
    if (item.key < u) {
      m = `${item.key}${u}`;
    } else {
      m = `${u}${item.key}`;
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
    if (item.By === userDetails.id) {
      return (
        <div style={{ marginBottom: "5px" }}>
          <div className="message1">
            <div className="text1">{item.message}</div>
          </div>
          <div className="date1">
            <div
              style={{ fontSize: "11px", color: "gray", marginBottom: "3px" }}
            ></div>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ marginBottom: "5px" }}>
          <div className="message2">
            <div className="text2">{item.message}</div>
          </div>
          <div className="date2">
            <div
              style={{ fontSize: "11px", color: "gray", marginBottom: "3px" }}
            ></div>
          </div>
        </div>
      );
    }
  });

  console.log({ Messages });
  const _usersList = usersList
    .filter(function (item) {
      if (item.key !== userDetails.id) {
        return true;
      } else {
        return false;
      }
    })
    .map(function (item) {
      return (
        <div
          className={
            chatUserDetails.id === item.key
              ? "conversation active "
              : "conversation"
          }
          key={item.key}
          onClick={function sample() {
            handleChatuser(item);
          }}
        >
          <div className="title-text">{chatUserDetails.name}</div>
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
        messageId: messageId,
        message: text,
        By: userDetails.id,
        To: chatUserDetails.id,
        createdTime: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        setText("");
      });
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
        <div className="headerText">Welcome {userDetails.name}</div>
        <div>
          <button onClick={Signout}>Logout</button>
        </div>
      </div>
      <div className="layout">
        <div className="items">
          <div className="box1">{_usersList}</div>
          <div className="box2">
            <div className="right-box1">{chatUserDetails.name}</div>
            {chatUserDetails.id ? (
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

            {chatUserDetails.id ? (
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
