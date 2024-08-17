
  
import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from './UserContext';
import Contact from './Contact';
import { my_axios } from './axios.config';
import _ from 'lodash'

function Chat() {
  const [ws, setWs] = useState(null);
  const [online, setOnline] = useState([]);
  const { id,contusername,setId,setContusername } = useContext(UserContext);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMsg, setNewMsg] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [msgArr, setMsgArr] = useState([])
  const[offline,setOffline]=useState([])
  const divUnderMessages = useRef();
  
  useEffect(() => {
    connectWS()

  }, []);

  const connectWS = function () {
    const ws = new WebSocket('ws://localhost:4000');
    setWs(ws);
     ws.addEventListener('open', () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
    });

    ws.addEventListener('close', () => {
      setIsConnected(false);

      setTimeout(() => {
        console.log('Disconnected .....Trying to connect');
        connectWS()
      }, 1000)
      

    });

    ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });

    ws.addEventListener('message',handleMsg);
  }


    useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({behavior:'smooth', block:'end'});
    }
    }, [msgArr]);
  
  useEffect(() => {
    if (selectedUserId)
    {
      my_axios.get('/msg' + `/${selectedUserId}` + `/${id}`).then( res => {
             
           setMsgArr(_.uniqBy(res.data.result,'_id'))
           }).catch(()=>console.log(err))
    }
  }, [selectedUserId])
  

  
  useEffect(() => {
  my_axios.get('/allUser').then(res => {
    const all = res.data.AllUser;
    
    // Filter out users who are already online or match the current id
    const filteredUsers = all.filter((c) =>( c._id !== id)||(!c._id||!c.username)).filter((c) => {
      for (let i = 0; i < online.length; i++) {
        if(c._id === online[i].id) return false;
      }
      return true;
    })

    const newOffline = _.uniqBy(filteredUsers, '_id')
    console.log(newOffline);
    

    setOffline(newOffline)
    
  }).catch((err) => {
    console.log(err);
  });
}, [online]);

  
  const handleMsg = function (e) {
    const msgData = JSON.parse(e.data);
      const st = new Set();
      const newArr = [];

      if (msgData?.online) {
        msgData.online.forEach(element => {
          if (!st.has(element.id) && element.id !== id&& Object.keys(element).length > 0) {
            st.add(element.id);
            newArr.push(element);
          }
        });
        setOnline(newArr);
    }
    else if (msgData?.msg)
      {
        console.log('showing received text',msgData);
        setMsgArr(prev => [...prev, { text: msgData.msg.text, sender: msgData.msg.sender, _id:msgData.msg._id,recipient:msgData.msg.recipient }]) 
      }
    }
    
  const logout = async function () {
    my_axios.post('/logout').then(res => {
      
      if (ws)
       ws.close()
      const newOnline = online.filter(c => (c.id !== id)&&c.id)
      setOnline(newOnline)

      console.log(online);
      

      setWs(null)
        setId('')
      setContusername('')
     
      
    }

       ).catch(err=>console.log(err)
    )
 
     }  
  
  
    const sendMessage = (e) => {
      
      e.preventDefault();
      if (ws && isConnected && selectedUserId && newMsg.trim() !== '') {

        setMsgArr(prev=>[...prev,{text:newMsg,sender:id,recepient:selectedUserId,_id:Date.now()}])
        
        
        console.log('Sending message:', newMsg);
        ws.send(JSON.stringify({
          message: {
            text: newMsg,
            recipient: selectedUserId,
            sender:id
          }
        }));
        setNewMsg(''); 
      }
      
      else {
        console.log('WebSocket is not connected or message is invalid');
      }
    };
    
    return (
      <div className='flex w-full h-screen'>
      <div className="bg-white w-1/3 flex  flex-col p-6">
          <div className=' flex-grow'>
             {online.map((c) => (
          <Contact
          key={c.id}
          id={c.id}
          onlineState={true}
          username={c.username}
          onClick={() => { setSelectedUserId(c.id) }}
          selected={c.id === selectedUserId}
          />
        ))}
        {offline.map(c => (
            <Contact
              key={c._id}
              id={c._id}
              onlineState={false}
              username={c.username}
              onClick={() => setSelectedUserId(c._id)}
              selected={c._id === selectedUserId} />
          ))}
        </div>
        
                <div className="p-2 text-center flex items-center justify-center">
          <span className="mr-2 text-sm text-gray-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
            {contusername}
          </span>
          <button
            onClick={logout}
            className="text-sm bg-blue-100 py-1 px-2 text-gray-500 border rounded-sm">logout</button>
            </div>
        </div>
      

      <div className="bg-blue-100 w-2/3 flex flex-col p-2">
        <div className="flex-grow">

          {!selectedUserId && (
            <div className='flex h-full flex-grow items-center justify-center'>
              <div>&larr; select a person from left sidebar</div>
            </div>
          )}

        {!!selectedUserId &&(
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                  {msgArr.map(message => (
                    
                    <div key={message._id} className={(message.sender === id ? 'text-right': 'text-left')}>
                    <div className={"text-left inline-block p-2 my-2 rounded-md text-sm " +(message.sender === id ? 'bg-blue-500 text-white':'bg-white text-gray-500')}>
                      {message.text}
                      {/* {message.file && (
                        <div className="">
                          <a target="_blank" className="flex items-center gap-1 border-b" href={axios.defaults.baseURL + '/uploads/' + message.file}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                            </svg>
                            {message.file}
                          </a>
                        </div>
                      )} */}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}
        </div>
          
        {!!selectedUserId && (
          <form className="flex p-4 gap-2" onSubmit={sendMessage}>
            <input
              type="text"
              className="border-0 outline-none p-3 flex-grow rounded-sm text-start"
              placeholder='Enter text here'
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
            />
            <button
              className="bg-blue-500 p-4 rounded-md"
              type='submit'
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Chat;

