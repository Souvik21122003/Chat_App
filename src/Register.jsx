import React  from 'react'
import { UserContext } from './UserContext'
import { my_axios } from './axios.config'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { useState } from 'react';
function Register() {  
 

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [regOrlog,setregOrlog]=useState('register')
    
    const { contusername, setContusername } = useContext(UserContext)

    const{id,setId}=useContext(UserContext)
    
    const handleSubmit =async  (e) => {
        e.preventDefault()
 try {
           
           const res=await my_axios.post(`/${regOrlog==='login'?'login':'register'}`, { username, password })
               
          console.log(res);
          
     
         setContusername(res.data.username)
     setId(res.data._id)
     

     setUsername('')
     setPassword('')

     
          
   
     
     console.log(contusername , 'username');
     
         
 } catch (error) {
    throw new Error("registration failed ");
    
 }
        

    }

  return (
      <div className='bg-blue-50 h-screen flex items-center'>
          <form className='w-64 mx-auto display-flex align-middle '
              onSubmit={handleSubmit}
          >
              <input type="text"
                  value={username}
                  onChange={(e)=>(setUsername(e.target.value))}
                  placeholder='username'
                  className='block w-full p-2 mb-2 rounded-md border ' />    
              
              <input type="password"
                  value={password}
                  onChange={(e)=>(setPassword(e.target.value))}
                  placeholder='password'
                  className='block w-full p-2 mb-2 rounded-md border' /> 
              
                  
             
                  <button className='bg-blue-500 text-center text-white block w-full p-2 mb-2  rounded-md'
                  onSubmit={handleSubmit}
                  >
                      {regOrlog==='login'?'Login':'Register'}
              </button>
              {regOrlog==='register'&&<div className='flex pl-3 gap-2'>
                  Already a member ?
                  <button className='font-bold'onClick={()=>{setregOrlog('login')}}>
                      Login
                 </button>
              </div>}
              {regOrlog==='login'&&<div className='flex pl-3 gap-2'>
                   Haven't Registered Yet
                  <button className='font-bold' onClick={()=>{setregOrlog('register')}}>
                      Register
                 </button>
              </div>}
              
           </form>
    </div>
  )
}

export default Register
