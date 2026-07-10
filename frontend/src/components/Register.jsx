




import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'

const Register = ({setUser}) => {
    const [email, setEmail] = useState('');
    const [username,setUsername]=useState('')
    const [password, setPassword] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL || "";
    
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmmit = async (e) => {
        e.preventDefault();
        
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialCharRegex.test(password)) {
            setError("Password must contain at least one special character.");
            return;
        }

        try {
            const { data } = await axios.post(  `${apiUrl}/api/users/register`, {
               username, email, password
            })
            localStorage.setItem("token", data.token)
            localStorage.setItem("username", data.username || "")
            localStorage.setItem("user", JSON.stringify(data))
            setUser(data);
            navigate("/")

        } catch (err) {
            setError(err.response?.data?.message || "Server Error")
        }
    }
    return (
        <div className='max-w-md mx-auto mt-20 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-200'>
            <h2 className='text-4xl font-bold text-center text-slate-800 mb-2'>Register</h2>
            <p className="text-center text-slate-500 mb-8">
               Please Register to continue.
            </p>
            {error && <p className='mb-5 rounded-lg bg-red-100 border border-red-300 py-3 text-center text-red-700 font-medium'>{error}</p>}
            <form action="" onSubmit={handleSubmmit} className='space-y-6'>
              <div>
                    <h2 className='mb-2 block text-sm font-semibold text-slate-700'>Username</h2>
                    <input
                        className='w-full px-3 py-4 border-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 '
                        type="username" value={username} onChange={(e) => setUsername(e.target.value)}
                        placeholder='Username' />
                </div>
                <div>
                    <h2 className='mb-2 block text-sm font-semibold text-slate-700'>Email</h2>
                    <input
                        className='w-full px-3 py-4 border-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 '
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder='someone@email.com' />
                </div>
                <div>
                    <h2 className='mb-2 block text-sm font-semibold text-slate-700'>Password</h2>
                    <input
                        className='w-full px-3 py-4 border-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-400'
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder='123@djka' />
                </div>
                <button className='w-full text-amber-50 bg-blue-600  py-2   rounded-xl  mt-3 hover:bg-blue-700'>Register</button>
            </form>
            <p className=' mt-2 text-center '> Already have an Account <Link className='text-blue-600 hover:underline' to="/login">Login</Link></p>

        </div>
    )
}

export default Register
