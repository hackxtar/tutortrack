import { useState, type FormEvent } from 'react';
import { CheckCircle2, Globe, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { authApi } from '../api/services';
import { setToken } from '../api/client';

interface AuthProps {
  onLogin: () => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('amit.sharma@tutortrack.app');
  const [password, setPassword] = useState('SecurePassword123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.token) {
        setToken(res.token);
        onLogin();
      } else {
        setError('Invalid credentials');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="lg:w-1/2 bg-indigo-600 text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-bold text-2xl backdrop-blur-sm border border-white/20">
            T
          </div>
          <span className="font-['Plus_Jakarta_Sans'] font-bold text-xl tracking-tight">TutorTrack</span>
          <span className="bg-white/20 text-xs font-semibold px-2 py-0.5 rounded">Live Workspace</span>
        </div>

        <div className="relative z-10 my-16 space-y-6">
          <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-4xl lg:text-5xl tracking-tight leading-tight">
            Empowering independent tutors & small coaching centers
          </h1>
          <p className="text-indigo-100 text-lg max-w-lg leading-relaxed">
            Everything you need to manage student follow-ups, fast class logs, and parent communications without the heavy CRM bloat.
          </p>
          
          <ul className="space-y-4 pt-6 text-indigo-50">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Instant WhatsApp follow-ups</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>30s quick class notes</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Zero CRM bloat or learning curve</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10 pt-8 border-t border-white/15 flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=150&auto=format&fit=crop"
            alt="Amit Sharma"
            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
          />
          <div>
            <p className="font-['Plus_Jakarta_Sans'] font-semibold text-sm">
              "TutorTrack helped me retain students and save 5 hours weekly on follow-ups."
            </p>
            <p className="text-indigo-200 text-xs mt-1">Amit Sharma • Independent Math & Science Tutor</p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="lg:w-1/2 bg-white p-8 lg:p-16 flex flex-col justify-center overflow-y-auto">
        <div className="max-w-md w-full mx-auto space-y-8">
          
          {/* Tab Switcher */}
          <div className="flex rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`flex-1 py-2 text-center rounded-md text-sm font-semibold transition-all ${
                isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(null); }}
              className={`flex-1 py-2 text-center rounded-md text-sm font-semibold transition-all ${
                !isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Register
            </button>
          </div>

          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {isLogin ? (
              <div className="space-y-6">
                <div>
                  <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-3xl text-slate-900 tracking-tight">Welcome back, educator!</h2>
                  <p className="text-slate-500 mt-2">Sign in to access your teaching workspace and follow-ups.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      placeholder="amit.sharma@tutortrack.app"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-semibold text-slate-700">Password</label>
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign In</span>}
                  </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-8">
                  Demo Credentials: <strong className="text-slate-700 font-mono">amit.sharma@tutortrack.app</strong> / <strong className="text-slate-700 font-mono">SecurePassword123!</strong>
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-3xl text-slate-900 tracking-tight">Start your TutorTrack workspace</h2>
                  <p className="text-slate-500 mt-2">Sign in using seeded educator credentials to access workspace.</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value="Amit Sharma"
                      readOnly
                      className="w-full h-11 px-3 rounded-lg bg-slate-100 border border-slate-200 text-sm text-slate-700 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign In as Amit Sharma</span>}
                  </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                  Already have an account?{' '}
                  <button onClick={() => setIsLogin(true)} className="text-indigo-600 font-semibold hover:underline">
                    Sign in.
                  </button>
                </p>
              </div>
            )}
          </motion.div>
          
          <div className="text-center text-xs text-slate-400 pt-8">
            © 2024 TutorTrack Inc. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

