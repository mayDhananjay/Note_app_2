import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { StickyNote, Clock, AlertCircle, Home } from 'lucide-react';

const SharePage = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    const fetchSharedNote = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/api/notes/share/${id}`);
        setNote(data);
      } catch (err) {
        setError(err.response?.data?.message || "Note not found or link has expired.");
      } finally {
        setLoading(false);
      }
    };
    fetchSharedNote();
  }, [id, apiUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50/70 text-stone-900 flex items-center justify-center">
        <div className="text-xl font-bold text-stone-500 animate-pulse">Loading shared note...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-stone-50/70 text-stone-900 flex flex-col items-center justify-center px-4 selection:bg-amber-200 selection:text-stone-900 overflow-hidden" id="share-page-container">
      {/* Premium subtle drafting-table grid background lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="flex flex-col items-center mb-8 text-center" id="share-logo-header">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-600 mb-3 shadow-xs">
            <StickyNote className="w-8 h-8 animate-bounce" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Shared Notes</h1>
          <p className="text-xs text-stone-500 font-medium mt-1">Shared Sticky Memo Pad</p>
        </div>

        {error ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-md text-center" id="share-error-card">
            <div className="flex justify-center mb-4 text-rose-500">
              <AlertCircle className="w-12 h-12" />
            </div>
            <h2 className="text-lg font-bold text-stone-900 mb-2">Could Not Open Note</h2>
            <p className="text-sm text-stone-500 mb-6">{error}</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-2.5 px-5 rounded-xl text-xs transition-colors shadow-md">
              <Home className="w-4 h-4" />
              <span>Go to My Board</span>
            </Link>
          </div>
        ) : (
          <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-8 shadow-lg relative min-h-[250px] flex flex-col justify-between" id="share-note-card">
            {/* Decorative physical stick-tape header */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-amber-200/50 rotate-1 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.02)]" />
            
            <div className="pt-4">
              <h2 className="text-2xl font-black text-amber-950 tracking-tight mb-4 border-b border-amber-200/40 pb-2">{note.title}</h2>
              <p className="text-sm text-amber-900/80 whitespace-pre-wrap leading-relaxed min-h-[100px]">{note.description}</p>
            </div>

            <div className="mt-8 pt-4 border-t border-amber-200/30 flex items-center justify-between text-xs text-amber-700/60 font-medium">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Shared Note</span>
              </div>
              <Link to="/" className="text-amber-800 hover:text-amber-950 hover:underline font-bold transition-colors">
                Create Your Own Board
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharePage;
