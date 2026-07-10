import { useState,useEffect } from 'react'
import { Routes,Route,Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Landing from './components/Landing'
import axios from 'axios'
import SharePage from './components/SharePage'


function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    return token && !savedUser;
  });
  const apiUrl = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }
      try {
        const { data } = await axios.get(`${apiUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        if (err.response && err.response.status === 401) {
          console.warn("Unauthorized on initial load, clearing token and user");
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("user");
          setUser(null);
        } else {
          console.warn("Failed to fetch user on load due to network/server issue:", err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [apiUrl]);
  if(loading){
    return(
      <div className=' min-h-screen bg-gray-900 flex items-center justify-center'>
        <div className='text-xl text-white'>Loading...</div>
      </div>
    )
  }
  
 

  return (
    
    <div className='min-h-screen bg-stone-100'>
      <Routes>
        <Route path="/login" element={user ? <Navigate to='/' />:<Login setUser={setUser}/> } />
         <Route path="/register" element={user ? <Navigate to='/' />:<Register setUser={setUser}/> } />
         <Route path ="/" element={user ? <Home user={user} setUser={setUser} /> : <Landing setUser={setUser} />} />
        <Route path="/share/:id" element={<SharePage />} />
      </Routes>
      
      </div>

    
  )
}


export default App
