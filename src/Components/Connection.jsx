import React from "react";
import axios from "axios";
import { initReactI18next } from "react-i18next";

function Connection({ onLogin }) {
  const [roomID, setRoomID] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  // Control enter

 // i18next.use(initReactI18next).init({en.json, ru.json}, lng: "en")

  const onEnter = async() => {
    if (!roomID || !userName) {
      return alert("Incorrect input!");
    }
    const obj = {
      roomID,
      userName,
    };
    setLoading(true);
    await axios.post('/rooms', obj);
    onLogin(obj);
  };

  

  return (
    <div>
      <h2 className="title">
        <span>WEB CHAT: </span>
        <div>
          <ul className="flip3">
            <li className="word1">SHARE EMOTIONS</li>
            <li className="word2">EVOLVE NETWORK</li>
            <li className="word3">CREATE CONNECT</li>
          </ul>
        </div>
      </h2>
      <div className="form__field">
        <input
          type="text"
          className="field__input"
          placeholder="Room ID"
          value={roomID}
          onChange={(e) => setRoomID(e.target.value)}
          maxLength={5}
        />
        <label className="field__label">
          Room ID
        </label>
      </div>
      <div className="form__field">
        <input
          type="text"
          className="field__input"
          placeholder="User Name"
          value={userName}
          maxLength={32}
          onChange={(e) => setUserName(e.target.value)}
        />
        <label className="field__label">
          User Name
        </label>
      </div>
      <div className="button__container">
        <button disabled={isLoading} onClick={onEnter} className="button">
          {isLoading ? "Connection..." : "Connect"}
        </button>
      </div>
    </div>
  );
}
export default Connection;
