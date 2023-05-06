import io from 'socket.io-client';
import Connection from './Components/Connection';
import socket from './socket';


function App() {
  return (
    <div className="App">
      <Connection/>
    </div>
  );
}

export default App;
