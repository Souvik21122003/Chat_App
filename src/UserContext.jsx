
// import { createContext } from "react";

// import { useState } from "react";
// import { my_axios } from "./axios.config";
// import { useEffect } from "react";

// export const UserContext = createContext({})

// const ContextProvider =  ({ children }) => {
    
//     const [contusername, setContusername] = useState('')

//     const [id,setId]=useState('')

//     useEffect(() => {
//       asyncHandler()
       
//     }, [contusername,setContusername])
    
//     const asyncHandler = async function ()
//     {
//        const res= await my_axios.get('/profile')
//         console.log('useEffect called ')
            
//             setContusername(res?.data?.username)
//             setId(res?.data?.id)

//             console.log(res.data.username,'this one is a response');
//     }

  
    
//     return(
//     <UserContext.Provider value={{contusername,setContusername,id,setId}}>
//         {children}
//         </UserContext.Provider>
//     )
// }

// export {ContextProvider}

// // import { createContext, useState, useEffect } from "react";
// // import { my_axios } from "./axios.config";

// // export const UserContext = createContext({});

// // const ContextProvider = ({ children }) => {
// //     const [contusername, setContusername] = useState('');
// //     const [id, setId] = useState('');

// //     useEffect(() => {
// //         my_axios.get('/profile')
// //             .then((res) => {
// //                 console.log(res);
// //                 setContusername(res.data.username);
// //                 setId(res.data._id);
// //             })
// //             .catch((err) => {
// //                 console.error("Failed to fetch profile:", err); // Handle the error gracefully
// //                 // Optionally, you can set some error state here or return early
// //             });
// //     }, []);

// //     return (
// //         <UserContext.Provider value={{ contusername, setContusername, id, setId }}>
// //             {children}
// //         </UserContext.Provider>
// //     );
// // };

// // export { ContextProvider };

import { createContext, useState, useLayoutEffect } from "react";
import { my_axios } from "./axios.config";

export const UserContext = createContext({});

const ContextProvider = ({ children }) => {
    const [contusername, setContusername] = useState('');
    const [id, setId] = useState('');
    const[isLoading,setIsLoading]=useState(true)

    useLayoutEffect(() => {
        const fetchProfile = async () => {
            try {
                console.log("Fetching profile data...");
                const res = await my_axios.get('/profile');
                console.log("Profile data fetched:", res.data);
                setContusername(res.data.username);
                setId(res.data.id);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
   
        };

        fetchProfile(); // Fetch profile data when the component is mounted
    }, []); // Ensure this array is empty to run only once on mount


    return (
        <UserContext.Provider value={{ contusername, setContusername, id, setId }}>
            {children}
        </UserContext.Provider>
    );
};

export { ContextProvider };

