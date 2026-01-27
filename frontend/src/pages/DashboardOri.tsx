// import React, { useEffect, useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Layout, Plus, Activity, LogOut, User as UserIcon, 
//   Loader2, X, MessageSquare, PieChart, Clock, ChevronDown,
//   BrainCircuit, Sparkles, Smile, Frown, Meh, BarChart3, ChevronRight, RefreshCw, Zap, Lightbulb
// } from 'lucide-react';

// interface User { id: string; username: string; email: string; }
// interface Feedback { 
//   id: string; 
//   message: string; 
//   created_at: string;
//   theme?: string;
//   sentiment?: 'positive' | 'negative' | 'neutral';
//   confidence?: string | number;
//   summary?: string;
// }
// interface Stats { total: number; today: number; }
// interface Cluster { theme: string; total: number; }

// const Dashboard: React.FC = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
//   const [clusters, setClusters] = useState<Cluster[]>([]);
//   const [stats, setStats] = useState<Stats>({ total: 0, today: 0 });
  
//   // --- AI States ---
//   const [isBulkAnalyzing, setIsBulkAnalyzing] = useState(false);
//   const [isGeneratingSolution, setIsGeneratingSolution] = useState(false);
//   const [analyzingId, setAnalyzingId] = useState<string | null>(null);

//   // --- UI States ---
//   const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
//   const [clusterFeedbacks, setClusterFeedbacks] = useState<Feedback[]>([]);
//   const [loadingCluster, setLoadingCluster] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [feedbackMessage, setFeedbackMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [status, setStatus] = useState<{type: 'success' | 'error', text: string} | null>(null);

//   const navigate = useNavigate();
//   const PAGE_LIMIT = 10;

//   const fetchData = useCallback(async (pageNum: number, isAppending: boolean = false) => {
//     if (isAppending) setLoadingMore(true);
//     else setLoading(true);

//     try {
//       const [userRes, feedbackRes, statsRes, clusterRes] = await Promise.all([
//         fetch('http://localhost:3000/api/me', { credentials: 'include' }),
//         fetch(`http://localhost:3000/api/feedback/get-feedbacks?page=${pageNum}&limit=${PAGE_LIMIT}`, { credentials: 'include' }),
//         fetch('http://localhost:3000/api/feedback/stats', { credentials: 'include' }),
//         fetch('http://localhost:3000/api/clusters/themes', { credentials: 'include' })
//       ]);

//       if (!userRes.ok) throw new Error('Unauthorized');
      
//       const userData = await userRes.json();
//       const feedbackData = await feedbackRes.json();
//       const statsData = await statsRes.json();
//       const clusterData = await clusterRes.json();

//       setUser(userData.user);
//       setStats(statsData);
//       setClusters(clusterData.clusters || []);

//       const newFeedbacks = feedbackData.feedbacks || [];
//       if (isAppending) setFeedbacks(prev => [...prev, ...newFeedbacks]);
//       else setFeedbacks(newFeedbacks);

//       setHasMore(newFeedbacks.length === PAGE_LIMIT);
//     } catch (error) {
//       console.error("Fetch error:", error);
//       navigate('/signin');
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   }, [navigate]);

//   useEffect(() => { fetchData(1); }, [fetchData]);

//   // --- AI Actions ---
//   const handleBulkAnalyze = async () => {
//     setIsBulkAnalyzing(true);
//     try {
//       const res = await fetch('http://localhost:3000/api/feedback-ai/theme/bulk', { method: 'POST', credentials: 'include' });
//       if (res.ok) await fetchData(1, false);
//     } finally { setIsBulkAnalyzing(false); }
//   };

//   const handleSingleAnalyze = async (id: string) => {
//     setAnalyzingId(id);
//     try {
//       const res = await fetch(`http://localhost:3000/api/feedback-ai/${id}/theme`, { method: 'POST', credentials: 'include' });
//       if (res.ok) await fetchData(page, false);
//     } finally { setAnalyzingId(null); }
//   };

//   const handleGenerateSolution = async (theme: string) => {
//     setIsGeneratingSolution(true);
//     try {
//       const res = await fetch(`http://localhost:3000/api/solutions/themes/${theme}/generate`, { 
//         method: 'POST', 
//         credentials: 'include',
//         headers: { 'Origin': 'http://localhost:5173' } // Ensure CSRF bypasses
//       });
//       const data = await res.json();
//       if (res.ok) {
//         alert(`Solution Generated: ${data.solution.solution_summary}`);
//       }
//     } catch (err) {
//       console.error("Solution generation failed", err);
//     } finally {
//       setIsGeneratingSolution(false);
//     }
//   };

//   const handleViewCluster = async (theme: string) => {
//     setSelectedCluster(theme);
//     setLoadingCluster(true);
//     try {
//       const res = await fetch(`http://localhost:3000/api/clusters/themes/${theme}`, { credentials: 'include' });
//       const data = await res.json();
//       setClusterFeedbacks(data.feedbacks || []);
//     } finally { setLoadingCluster(false); }
//   };

//   const getSentimentIcon = (sentiment?: string) => {
//     switch (sentiment) {
//       case 'positive': return <Smile className="w-4 h-4 text-green-500" />;
//       case 'negative': return <Frown className="w-4 h-4 text-red-500" />;
//       default: return <Meh className="w-4 h-4 text-amber-500" />;
//     }
//   };

//   const handleFeedbackSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const response = await fetch('http://localhost:3000/api/feedback/store-feedback', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: feedbackMessage }),
//         credentials: 'include',
//       });
//       if (response.ok) {
//         setFeedbackMessage('');
//         await fetchData(1, false);
//         setIsModalOpen(false);
//       }
//     } finally { setIsSubmitting(false); }
//   };

//   if (loading && page === 1) return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

//   return (
//     <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
//         <div className="p-6 flex items-center gap-2 text-indigo-600 font-bold border-b">
//           <Layout className="w-6 h-6" /> <span className="text-xl tracking-tight">InsightPulse</span>
//         </div>
//         <nav className="flex-1 px-4 py-6 space-y-2">
//           <button className="w-full flex items-center gap-3 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold"><Activity size={18} /> Dashboard</button>
//           <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-xl text-sm font-medium"><BarChart3 size={18} /> Analytics</button>
//         </nav>
//         <div className="p-4 border-t">
//           <button onClick={() => navigate('/signin')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl"><LogOut size={18} /> Logout</button>
//         </div>
//       </aside>

//       <main className="flex-1 flex flex-col overflow-hidden">
//         <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
//           <div className="flex items-center gap-4">
//              <span className="text-xs font-black bg-gray-100 px-2 py-1 rounded text-gray-400">ENGINE v2.5</span>
//              <button onClick={handleBulkAnalyze} disabled={isBulkAnalyzing} className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 disabled:opacity-50">
//                {isBulkAnalyzing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />} Bulk AI Classify
//              </button>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="text-right hidden sm:block">
//               <p className="text-sm font-bold leading-none">{user?.username}</p>
//               <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-1">Verified Admin</p>
//             </div>
//             <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
//               {user?.username?.charAt(0).toUpperCase() || <UserIcon size={18} />}
//             </div>
//           </div>
//         </header>

//         <div className="p-8 overflow-y-auto">
//           <div className="flex justify-between items-center mb-8">
//             <div>
//               <h1 className="text-4xl font-black tracking-tight">Intelligence Hub</h1>
//               <p className="text-gray-500 font-medium">Categorizing {stats.total} data points into actionable technical roadmaps.</p>
//             </div>
//             <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-95 transition-all">
//               <Plus size={20} /> Ingest Feedback
//             </button>
//           </div>

//           {/* Theme Cluster Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
//             {clusters.map((cluster, i) => (
//               <button key={i} onClick={() => handleViewCluster(cluster.theme)} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all text-left relative overflow-hidden group">
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><BrainCircuit size={20} /></div>
//                   <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-600 transition-transform translate-x-0 group-hover:translate-x-1" />
//                 </div>
//                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">AI Theme</p>
//                 <p className="text-lg font-black text-gray-900 capitalize mb-2">{cluster.theme.replace('_', ' ')}</p>
//                 <div className="flex items-baseline gap-1">
//                    <span className="text-3xl font-black text-indigo-600">{cluster.total}</span>
//                    <span className="text-xs font-bold text-gray-400">entries</span>
//                 </div>
//               </button>
//             ))}
//           </div>

//           <div className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-sm mb-10">
//             <div className="px-8 py-5 border-b bg-gray-50/50 flex justify-between items-center font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">Raw Input Stream</div>
//             <div className="divide-y divide-gray-100">
//               {feedbacks.map((item) => (
//                 <div key={item.id} className="p-8 hover:bg-gray-50/30 transition-colors flex items-start gap-6">
//                   <div className="mt-1">{getSentimentIcon(item.sentiment)}</div>
//                   <div className="flex-1">
//                     <div className="flex justify-between items-start mb-2">
//                       <p className="text-base font-semibold text-gray-800 leading-relaxed">"{item.message}"</p>
//                       {!item.theme && (
//                         <button onClick={() => handleSingleAnalyze(item.id)} disabled={analyzingId === item.id} className="text-[10px] font-black bg-white border px-3 py-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-2">
//                           {analyzingId === item.id ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} />} CLASSIFY
//                         </button>
//                       )}
//                     </div>
//                     <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
//                        <span className="flex items-center gap-1 text-gray-400"><Clock size={12} /> {new Date(item.created_at).toLocaleTimeString()}</span>
//                        {item.theme && <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded"># {item.theme}</span>}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* --- CLUSTER DETAIL & SOLUTION MODAL --- */}
//       {selectedCluster && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md">
//           <div className="bg-white w-full max-w-3xl h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
//             <div className="p-8 border-b flex justify-between items-center bg-gray-50/30">
//               <div>
//                 <h3 className="text-2xl font-black uppercase text-gray-900">Cluster Hub: {selectedCluster.replace('_', ' ')}</h3>
//                 <p className="text-sm text-gray-500 font-bold mt-1">Reviewing AI-clustered feedback & technical roadmaps</p>
//               </div>
//               <button onClick={() => setSelectedCluster(null)} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
//             </div>
            
//             <div className="bg-indigo-600 p-6 flex items-center justify-between">
//                <div className="text-white">
//                   <p className="text-xs font-black uppercase tracking-widest opacity-80">Intelligence Action</p>
//                   <p className="text-lg font-bold">Generate a technical solution for this theme?</p>
//                </div>
//                <button 
//                   onClick={() => handleGenerateSolution(selectedCluster)}
//                   disabled={isGeneratingSolution}
//                   className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-50 flex items-center gap-2 disabled:opacity-50"
//                >
//                  {isGeneratingSolution ? <Loader2 className="animate-spin" size={16} /> : <Lightbulb size={16} />}
//                  CREATE AI ACTION PLAN
//                </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50">
//               {loadingCluster ? <div className="mt-20"><Loader2 className="animate-spin mx-auto text-indigo-600" size={40} /></div> : 
//                 clusterFeedbacks.map((fb) => (
//                   <div key={fb.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
//                     <div className="flex justify-between items-center mb-4">
//                       {getSentimentIcon(fb.sentiment)}
//                       <span className="text-[10px] font-black uppercase text-gray-400">Match Accuracy: {fb.confidence}</span>
//                     </div>
//                     <p className="text-base font-medium text-gray-700 leading-relaxed italic">"{fb.message}"</p>
//                     {fb.summary && <div className="mt-4 p-4 bg-indigo-50/30 rounded-2xl border border-indigo-50 text-xs font-bold text-indigo-700">AI INSIGHT: {fb.summary}</div>}
//                   </div>
//                 ))
//               }
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- ADD FEEDBACK MODAL --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
//             <div className="px-8 py-6 border-b flex justify-between items-center">
//               <h3 className="font-black text-gray-900 uppercase tracking-widest">New Feed Ingestion</h3>
//               <X className="cursor-pointer text-gray-400" size={24} onClick={() => setIsModalOpen(false)} />
//             </div>
//             <form onSubmit={handleFeedbackSubmit} className="p-8">
//               <textarea required value={feedbackMessage} onChange={(e) => setFeedbackMessage(e.target.value)} 
//                 placeholder="Paste raw customer feedback..." className="w-full h-48 p-6 border-2 border-gray-100 rounded-[1.5rem] outline-none focus:border-indigo-500 mb-6 text-lg font-medium" />
//               <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all">
//                 {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Commit to Database"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;