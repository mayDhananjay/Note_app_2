import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock as LockIcon, ArrowRight, AlertCircle, StickyNote } from 'lucide-react';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL || "";
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmmit = async (e) => {
     console.log("API URL:", import.meta.env.VITE_API_URL);
  console.log("apiUrl:", apiUrl);
    e.preventDefault();
    try {
      const { data } = await axios.post(`${apiUrl}/api/users/login`, {
        email, 
        password
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username || "");
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Server Error");
    }
  };

  return (
    <div className="relative min-h-screen bg-stone-50/70 text-stone-900 flex flex-col items-center justify-center px-4 selection:bg-amber-200 selection:text-stone-900 overflow-hidden" id="login-page-container">
      {/* Premium subtle drafting-table grid background lines for Light Board */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Header Branding area to match App.jsx */}
        <div className="flex flex-col items-center mb-8 text-center" id="login-logo-header">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-600 mb-3 shadow-xs">
            <StickyNote className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Personal Notes</h1>
          <p className="text-xs text-stone-500 font-medium mt-1">Digital sticky notes board</p>
        </div>

        {/* Elegant Form Card */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.06)] p-8 relative" id="login-card">
          {/* Decorative stick-tape at the top of card to look like a physical note page */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-amber-200/40 -rotate-1 rounded-b shadow-[0_1px_3px_rgba(0,0,0,0.01)]" />

          <div className="text-center mb-8 pt-2">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">Login</h2>
            <p className="text-xs text-stone-500 mt-1 font-medium">
              Welcome back! Sign in to sync your notes board.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-100 text-rose-800 p-3.5 rounded-xl text-xs font-semibold leading-relaxed mb-6" id="login-error-alert">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="flex-1">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmmit} className="space-y-5" id="login-form">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 cursor-pointer" htmlFor="login-email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="login-email"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50/50 border border-stone-200 text-stone-900 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-xs font-medium placeholder-stone-400"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="someone@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 cursor-pointer" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400">
                  <LockIcon className="w-4 h-4" />
                </span>
                <input
                  id="login-password"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50/50 border border-stone-200 text-stone-900 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-xs font-medium placeholder-stone-400"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password..."
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold py-3 px-4 rounded-xl text-xs transition-all duration-200 shadow-md shadow-amber-500/10 cursor-pointer mt-2"
              id="login-submit-button"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-500 font-semibold">
              Don't have an Account?{' '}
              <Link className="text-amber-600 hover:text-amber-700 hover:underline font-bold transition-colors" to="/register">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;




// import { useState } from 'react'
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios'

// const Login = ({setUser}) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const apiUrl = import.meta.env.VITE_API_URL || "";
    
//     const [error, setError] = useState('')
//     const navigate = useNavigate()

//     const handleSubmmit = async (e) => {
//         e.preventDefault();
//         try {
//             const { data } = await axios.post(`${apiUrl}/api/users/login`, {
//                 email, password
//             })
//             localStorage.setItem("token", data.token)
//             setUser(data);
//             navigate("/")

//         } catch (err) {
//             setError(err.response?.data?.message || "Server Error")
//         }
//     }
//     return (
//         <div className='max-w-md mx-auto mt-20 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-200'>
//             <h2 className='text-4xl font-bold text-center text-slate-800 mb-2'>Login</h2>
//             <p className="text-center text-slate-500 mb-8">
//                 Welcome back! Sign in to continue.
//             </p>
//             {error && <p className='mb-5 rounded-lg bg-red-100 border border-red-300 py-3 text-center text-red-700 font-medium'>{error}</p>}
//             <form action="" onSubmit={handleSubmmit} className='space-y-6'>
//                 <div>
//                     <h2 className='mb-2 block text-sm font-semibold text-slate-700'>Email</h2>
//                     <input
//                         className='w-full px-3 py-4 border-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 '
//                         type="email" value={email} onChange={(e) => setEmail(e.target.value)}
//                         placeholder='someone@email.com' />
//                 </div>
//                 <div>
//                     <h2 className='mb-2 block text-sm font-semibold text-slate-700'>Password</h2>
//                     <input
//                         className='w-full px-3 py-4 border-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-400'
//                         type="password" value={password} onChange={(e) => setPassword(e.target.value)}
//                         placeholder='123@djka' />
//                 </div>
//                 <button className='w-full text-amber-50 bg-blue-600  py-2   rounded-xl  mt-3 hover:bg-blue-700'>Login</button>
//             </form>
//             <p className=' mt-2 text-center '> Don't have an Account <Link className='text-blue-600 hover:underline' to="/register">Register</Link></p>

//         </div>
//     )
// }

// export default Login
