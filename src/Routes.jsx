    import React, { useContext } from 'react'
import { UserContext } from './UserContext'
import Register from './Register'
import Chat from './Chat'
    
function Routes() {
    const { contusername, setContusername,id } = useContext(UserContext)
     
    if (contusername)
    {
        console.log(contusername,"  ",id);
        
        return (
             <Chat/>
            )

    }
    
    return (<Register/>)
    
    }
    
    export default Routes
    