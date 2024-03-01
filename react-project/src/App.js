import logo from './logo.svg';
import './App.css';
import socket from "./server"
import { useEffect, useState } from "react"


let userName = "";

function App() { 
  //userState Hook 사용
  const [chats, set_chats] = useState([]);
  const [is_Connected, set_is_Connected] = useState(socket.connected);
  const [Msg, set_message] = useState("");

  //userEffect Line
  useEffect(async()=>{
    askUserName();
    socket.emit("add user", userName, (res)=>{
      if(res?.ok){
        console.log("Login Response Success", res);
      }
      else{
        console.log("Login Response Fail", res);
      }
    });

    socket.on('login', (data)=>{
      set_is_Connected(true);
      setNumUsersMessage(data)
      console.log(`on - login : ${data.userName} : ${data.numUsers}`)
    });
    socket.on('user joined', (data) =>{
      console.log(`on - joined : ${data.userName} : ${data.numUsers}`)
      add_message(`Notice : ${data.userName} joined`)
    });
    socket.on('user left', (data) =>{
      console.log(`on - left : ${data.userName} : ${data.numUsers}`)
      add_message(`Notice : ${data.userName} lefted`)
    });
    socket.on('new message', (data)=>{
      console.log("on - data : ", data);
      add_message(`${data.userName} : ${data.message}`)
    });

    // Remove Server's listener
    return () => {
      socket.off('add user');
      socket.off('disconnect');
      socket.off('new message');
    };
  }, []);

  const askUserName = ()=>{
    userName = prompt("Please Enter the Name");
    console.log("username : ", userName);
  };

  const setNumUsersMessage = (data)=>{
    let message = '';
    if(data.numUsers == 1){
      message = `Notice : there is 1 participant`;
    }
    else{
      message = `Notice : there are ${data.numUsers} participant`;
    }
    add_message(message);
  };

  const add_message = (txt)=>{
    set_chats(chats => chats.concat(txt))
  };

  const send_message = ()=>{
    console.log(Msg);
    add_message(`${userName} : ${Msg}`)
    socket.emit('new message', Msg); 
    set_message("")
  };

  const onChange = (e) => {
    set_message(e.target.value);
  }

  return (
    <div className="App">
      <header className='App-header'>
        <div>
          <ul>
            {chats.map((val, index)=>{
              // return (<li key={index}>{val}</li>)
              const part = val.split(":")
              return (<tr key={index}><td>{part[0].trim()}</td><td>:</td><td>{part[1].trim()}</td></tr>)
            })}
          </ul>
        </div>
        <div>
          <input
            onChange={onChange} value={Msg} className='inputMessage'
            onKeyDown={(e)=>{
              if(e.key == "Enter"){
                send_message();
              }
            }}>
          </input>
          <button onClick={send_message} >Send</button>
        </div>
      </header>
    </div>
  );
}

export default App;
