import { Link, useNavigate } from 'react-router-dom';
import { Search, LogOut, LogIn, StickyNote, X } from 'lucide-react';

const Navbar = ({ user, setUser, searchQuery, setSearchQuery, hideAuthBtn }) => {
  const navigate = useNavigate();
  
  const hendleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
    setUser(null);
    navigate('/');
  };

  const displayUsername = typeof user === 'object' 
    ? (user?.username || user?.user?.username || localStorage.getItem("username") || "")
    : (user || localStorage.getItem("username") || "");
  
  const hasUser = user || localStorage.getItem("token");

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-40 px-6 py-3.5 shadow-[0_2px_15px_rgba(0,0,0,0.02)]" id="app-navbar">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand Link */}
        <Link to="/" className="flex items-center gap-2.5 group select-none" id="navbar-brand">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600 transition-all group-hover:bg-amber-500/20 group-hover:scale-105">
            <StickyNote className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-stone-900 tracking-tight">TestAing Notes</span>
            <p className="text-[10px] text-stone-500 font-medium -mt-1">Digital sticky notes board</p>
          </div>
        </Link>

        {/* Search Bar & Actions Container */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1 sm:justify-end">
          {/* Elegant Search Input */}
          <div className="relative w-full sm:w-64 md:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-9 pr-8 py-2 bg-stone-50/50 border border-stone-200 text-stone-900 text-xs font-medium rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all cursor-text placeholder-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery && setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* User Auth Controls */}
          {hasUser ? (
            <div className="flex items-center gap-3 bg-stone-50/80 px-3.5 py-1.5 rounded-xl border border-stone-200 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700" id="navbar-welcome-message">
                <span className="text-stone-500 font-medium">Welcome,</span>
                <span className="text-amber-600 font-black">{displayUsername}</span>
              </div>
              <button
                onClick={hendleLogout}
                className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 rounded-lg border border-rose-200 transition-all cursor-pointer active:scale-95"
              >
                <LogOut className="w-3 h-3 stroke-[2.5]" />
                Logout
              </button>
            </div>
          ) : !hideAuthBtn ? (
            <Link
              to="/login"
              className="flex items-center justify-center gap-1.5 bg-stone-900 hover:bg-stone-800 active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-sm border border-stone-800 w-full sm:w-auto h-9"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login / Signup</span>
            </Link>
          ) : null}
        </div>
      </div>
      
    </nav>
  );
};

export default Navbar;




// import {Link, useNavigate} from 'react-router-dom'

// const Navbar = ({user,setUser}) => {
//     const navigate=useNavigate()
//     const hendleLogout=()=>{
//         localStorage.removeItem("token");
//         setUser(null)
//         navigate('/login')
//     }
//   return (
//     <nav className='bg-gray-800 p-4 text-white shadow-2xl '>
//         <div className='container mx-auto  flex items-center 
//         justify-between  '> 
//         <Link  to='/' className='text-2xl'>TestAing Notes</Link>
        
        
//         {user &&(
            
//             <div className='flex items-center space-x-4 '>
//                 <span className='text-gray-300 text-xl font-semibold shadow-2xl '>{user.username}</span>
//                 <button onClick={hendleLogout} className='bg-blue-500 text-white  px-3 py-1 rounded-md hover:bg-blue-700'>Logout</button>
//             </div>
//         )}
//         </div>
//        </nav>
//   )
// }

// export default Navbar
