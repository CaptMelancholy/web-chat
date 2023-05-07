import { useReducer } from 'react';
import Connection from './Components/Connection';
import Chat from './Components/Chat';
import socket from './socket';
import reducer from './reducer';
import React from 'react';
import axios from 'axios';


function App() {
  const [state, dispatch] = useReducer(reducer, {
    isAuth: false,
    roomID: null,
    userName: null,
    users: [],
    messages: []
  });
  const onLogin = async(obj) => {
    dispatch({
      type: 'JOINED',
      payload: obj,
    });
    socket.emit('ROOM:JOIN', obj);
    const { data } = await axios.get(`/rooms/${obj.roomID}`);
    dispatch({
      type: 'SET_DATA',
      payload: data,
    });
  };

  const joinUser = (obj) => {
    dispatch({
      type: 'JOINED',
      payload: obj,
    });
  }

  const setData = (data) => {
    dispatch({
      type: 'SET_DATA',
      payload: data,
    });
  }

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
  }

  const newMessageSended = (message) => {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message
    })
  }

  React.useEffect(() => {
    socket.on('ROOM:SET_USERS', setUsers);
    socket.on('ROOM:NEW_MESSAGE', newMessageSended);
  }, []);



  window.socket = socket;

  return (
    <div className="App">
      {!state.isAuth ? <Connection onLogin={onLogin} /> : <Chat {...state} />}
    </div>
  );

}

export default App;
