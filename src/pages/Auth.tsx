import { useState } from 'react';
import { CheckCircle2, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthProps {
  onLogin: () => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);

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
          <span className="bg-white/20 text-xs font-semibold px-2 py-0.5 rounded">Auth MVP</span>
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
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-center rounded-md text-sm font-semibold transition-all ${
                isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
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
            {isLogin ? (
              <div className="space-y-6">
                <div>
                  <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-3xl text-slate-900 tracking-tight">Welcome back, educator!</h2>
                  <p className="text-slate-500 mt-2">Sign in to access your teaching workspace and follow-ups.</p>
                </div>

                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email or Phone Number</label>
                    <input
                      type="text"
                      placeholder="name@example.com or +91..."
                      required
                      className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-semibold text-slate-700">Password</label>
                      <a href="#" className="text-xs font-medium text-indigo-600 hover:underline">Forgot password?</a>
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 pt-1">
                    <input type="checkbox" id="remember" className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" />
                    <label htmlFor="remember" className="text-sm text-slate-600">Remember me for 30 days</label>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center mt-2"
                  >
                    Sign In
                  </button>
                </form>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-sm text-slate-400">Or continue with</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button
                  type="button"
                  onClick={onLogin}
                  className="w-full h-11 rounded-lg bg-white text-slate-700 font-medium flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Globe className="w-5 h-5 text-slate-500" />
                  Continue with Google
                </button>

                <p className="text-center text-sm text-slate-500 mt-8">
                  Don't have an account?{' '}
                  <button onClick={() => setIsLogin(false)} className="text-indigo-600 font-semibold hover:underline">
                    Register here.
                  </button>
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-3xl text-slate-900 tracking-tight">Start your TutorTrack workspace</h2>
                  <p className="text-slate-500 mt-2">Set up your free coaching tracker in under 60 seconds.</p>
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      placeholder="Amit Sharma"
                      required
                      className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      placeholder="amit@example.com"
                      required
                      className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mobile Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98765..."
                        required
                        className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Primary Role</label>
                      <select className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700">
                        <option>Independent Tutor</option>
                        <option>Coaching Center Owner</option>
                        <option>Assistant Teacher</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Create Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="flex items-start gap-2 pt-2">
                    <input type="checkbox" id="terms" required className="w-4 h-4 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" />
                    <label htmlFor="terms" className="text-sm text-slate-600 leading-tight">
                      I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center mt-4"
                  >
                    Create Free Account
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
