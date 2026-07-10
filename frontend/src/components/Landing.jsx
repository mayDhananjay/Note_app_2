import { useState } from 'react';
import axios from 'axios';
import { 
  StickyNote, 
  Search, 
  Lock, 
  User, 
  Mail, 
  Plus, 
  Pin, 
  Share2, 
  Check, 
  X, 
  ArrowRight, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

const Landing = ({ setUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' or 'signup'
  
  // Form states
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "";

  // Password validation criteria
  const hasMinLength = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/g.test(password);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (authTab === 'signup') {
      if (!username.trim()) {
        setError('Please enter a username.');
        return;
      }
      if (!hasMinLength) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (!hasSpecialChar) {
        setError('Password must contain at least one special character.');
        return;
      }
    }

    setLoading(true);
    try {
      const endpoint = authTab === 'login' ? '/api/users/login' : '/api/users/register';
      const payload = authTab === 'login' 
        ? { email: email.trim(), password }
        : { username: username.trim(), email: email.trim(), password };

      const { data } = await axios.post(`${apiUrl}${endpoint}`, payload);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username || data.user?.username || "");
      
      // Update state and log in
      setUser(data);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openAuthModal = (tab = 'login') => {
    setAuthTab(tab);
    setError('');
    setEmail('');
    setUsername('');
    setPassword('');
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-stone-50 text-stone-900 overflow-hidden selection:bg-amber-200" id="landing-container">
      {/* Drafting table subtle grid lines background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Landing Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-40 px-6 py-4 shadow-sm" id="landing-navbar">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 select-none">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600">
              <StickyNote className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-stone-900 tracking-tight">TestAing Notes</span>
              <p className="text-[10px] text-stone-500 font-medium -mt-1">Digital sticky notes board</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuthModal('login')}
              className="text-stone-600 hover:text-stone-900 font-bold text-xs px-4 py-2 rounded-xl transition-all hover:bg-stone-100 active:scale-95 cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-md"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center relative z-10" id="landing-hero">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[10px] uppercase tracking-widest font-extrabold px-3.5 py-1.5 rounded-full mb-6">
          <Sparkles className="w-3 h-3 fill-amber-500/20" />
          <span>The ultimate digital board for your thoughts</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-stone-900 tracking-tight leading-none max-w-4xl mx-auto">
          Capture, Organize, and Share Your <span className="text-amber-500 underline decoration-amber-500/30 decoration-8">Notes Instantly</span>
        </h1>
        
        <p className="text-sm sm:text-base text-stone-500 font-medium mt-6 max-w-2xl mx-auto leading-relaxed">
          Say goodbye to forgotten ideas. TestAing Notes brings the beautiful, physical feel of sticky memo pads directly to your screen, fully synchronized in real-time.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => openAuthModal('signup')}
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-black px-6 py-3.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-amber-500/10"
          >
            Create Your Board Now
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            onClick={() => openAuthModal('login')}
            className="flex items-center justify-center gap-2 bg-white hover:bg-stone-50 active:scale-95 text-stone-800 border border-stone-200 font-bold px-6 py-3.5 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
          >
            <span>Log In to Existing Board</span>
          </button>
        </div>

        {/* Feature Interactive Mockup */}
        <div className="mt-16 bg-white border border-stone-200/80 rounded-3xl p-6 md:p-8 shadow-2xl shadow-stone-200/50 max-w-4xl mx-auto relative overflow-hidden" id="interactive-mockup">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-400 to-sky-400" />
          
          <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs text-stone-400 font-semibold ml-2">Personal Board Preview</span>
            </div>
            <div className="flex items-center gap-2 bg-stone-100 px-3 py-1 rounded-xl text-[10px] font-bold text-stone-500">
              <Search className="w-3 h-3" />
              <span>Search simulated...</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
            {/* Note 1 */}
            <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-5 shadow-sm relative rotate-1 hover:rotate-0 transition-all">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-amber-200/40 rounded-b" />
              <span className="inline-flex px-2 py-0.5 bg-rose-500 text-white rounded-md text-[9px] font-extrabold uppercase tracking-wide mb-3">High</span>
              <h3 className="font-bold text-amber-950 text-xs">🚀 Project Launch Plan</h3>
              <p className="text-[11px] text-amber-900/80 mt-2 leading-relaxed">
                Complete deployment scripts and announce on Workspace channel.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] text-amber-700/60 font-medium">
                <Clock className="w-3 h-3" />
                <span>Just now</span>
              </div>
            </div>

            {/* Note 2 */}
            <div className="bg-sky-50/80 border border-sky-200/60 rounded-2xl p-5 shadow-sm relative -rotate-1 hover:rotate-0 transition-all">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-sky-200/40 rounded-b" />
              <span className="inline-flex px-2 py-0.5 bg-sky-500 text-white rounded-md text-[9px] font-extrabold uppercase tracking-wide mb-3">Low</span>
              <h3 className="font-bold text-sky-950 text-xs">🛒 Weekly Groceries</h3>
              <div className="space-y-1.5 mt-2">
                <div className="flex items-center gap-2 text-[11px] text-sky-900/80 font-medium">
                  <Check className="w-3.5 h-3.5 text-sky-600 bg-sky-100 rounded-sm" />
                  <span className="line-through opacity-60">Avocado toast bread</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-sky-900/80 font-medium">
                  <span className="w-3.5 h-3.5 border border-sky-300 rounded-sm inline-block" />
                  <span>Fresh mint & lime</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] text-sky-700/60 font-medium">
                <Clock className="w-3 h-3" />
                <span>2 hours ago</span>
              </div>
            </div>

            {/* Note 3 */}
            <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-2xl p-5 shadow-sm relative rotate-2 hover:rotate-0 transition-all">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-emerald-200/40 rounded-b" />
              <span className="inline-flex px-2 py-0.5 bg-amber-500 text-stone-950 rounded-md text-[9px] font-extrabold uppercase tracking-wide mb-3">Medium</span>
              <h3 className="font-bold text-emerald-950 text-xs">💡 Creative Ideas</h3>
              <p className="text-[11px] text-emerald-900/80 mt-2 leading-relaxed">
                Add beautiful canvas-style grid layouts with custom sticky post notes.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] text-emerald-700/60 font-medium">
                <Clock className="w-3 h-3" />
                <span>Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Showcase Grid */}
      <section className="bg-white border-t border-stone-200 py-16 px-6 relative z-10" id="landing-features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Core App Capabilities</h2>
            <p className="text-xs text-stone-500 font-semibold mt-1">Everything you need for clean, aesthetic note taking</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80">
              <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl w-11 h-11 flex items-center justify-center mb-4">
                <StickyNote className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-2">Pastel Note Presets</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Choose from beautiful pastel custom presets to emulate physical paper cards.
              </p>
            </div>

            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl w-11 h-11 flex items-center justify-center mb-4">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-2">Checklists & Lists</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Organize tasks inside notes using standard checklist or numbered formats.
              </p>
            </div>

            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80">
              <div className="p-3 bg-sky-500/10 text-sky-600 rounded-xl w-11 h-11 flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-2">Live Search Filters</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Filter and locate your sticky notes instantly as you type in real-time.
              </p>
            </div>

            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80">
              <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl w-11 h-11 flex items-center justify-center mb-4">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-2">Secure Note Sharing</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Export and share notes with URL links securely using Base64 encoding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-stone-100 py-8 px-6 text-center text-xs text-stone-400 font-semibold">
        <p>© 2026 TestAing Notes. Designed with precision and visual elegance.</p>
      </footer>

      {/* --- PREMIUM DYNAMIC AUTH POPUP MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in" id="auth-popup-modal">
          <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
            
            {/* Header Area */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-stone-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-stone-900 text-white rounded-xl">
                  {authTab === 'login' ? <Lock className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className="text-base font-black text-stone-900 tracking-tight">
                    {authTab === 'login' ? 'Welcome Back!' : 'Create New Account'}
                  </h2>
                  <p className="text-[10px] text-stone-500 font-medium -mt-0.5">
                    {authTab === 'login' ? 'Sign in to access your dashboard' : 'Join and start capturing notes'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 hover:bg-stone-100 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-6 mt-4 flex items-start gap-2 bg-rose-50 border border-rose-100 text-rose-800 p-3.5 rounded-xl text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <p className="flex-1 leading-relaxed">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="p-6 space-y-4" id="auth-modal-form">
              {authTab === 'signup' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 cursor-pointer" htmlFor="modal-username">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      id="modal-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 text-stone-900 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-xs font-medium placeholder-stone-400"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 cursor-pointer" htmlFor="modal-email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="modal-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 text-stone-900 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-xs font-medium placeholder-stone-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 cursor-pointer" htmlFor="modal-password">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="modal-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 text-stone-900 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-xs font-medium placeholder-stone-400"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Interactive Password Requirements Checklist for Signup */}
              {authTab === 'signup' && (
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[10px] space-y-1.5 text-stone-600">
                  <p className="font-extrabold text-stone-500 uppercase tracking-widest text-[9px]">Password Requirements:</p>
                  <div className="flex items-center gap-1.5">
                    <span className={hasMinLength ? "text-emerald-600 font-bold" : "text-stone-400"}>
                      {hasMinLength ? "✓" : "○"} At least 8 characters ({password.length}/8)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={hasSpecialChar ? "text-emerald-600 font-bold" : "text-stone-400"}>
                      {hasSpecialChar ? "✓" : "○"} Contains a special character (e.g., !, @, #, $, %, ^, &, *)
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed active:scale-95 text-stone-950 font-black py-3 px-4 rounded-xl text-xs transition-all duration-200 shadow-md shadow-amber-500/10 cursor-pointer mt-2"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{authTab === 'login' ? 'Login' : 'Register Account'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Modal Toggle Option */}
            <div className="bg-stone-50 px-6 py-5 border-t border-stone-100 text-center">
              {authTab === 'login' ? (
                <p className="text-xs text-stone-500 font-semibold">
                  New User?{' '}
                  <button 
                    onClick={() => { setAuthTab('signup'); setError(''); }}
                    className="text-amber-600 hover:text-amber-700 font-bold transition-colors cursor-pointer hover:underline"
                  >
                    Register Now
                  </button>
                </p>
              ) : (
                <p className="text-xs text-stone-500 font-semibold">
                  Already have an Account?{' '}
                  <button 
                    onClick={() => { setAuthTab('login'); setError(''); }}
                    className="text-amber-600 hover:text-amber-700 font-bold transition-colors cursor-pointer hover:underline"
                  >
                    Login here
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Landing;
