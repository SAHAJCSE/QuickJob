import React, { useState } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import { UserProfile } from '../types';

interface AuthViewProps {
  onSuccess: (userProfile: UserProfile) => void;
  onCancel: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess, onCancel }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'verify'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('Robert Fox');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Handle Google OAuth Login
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const profile: UserProfile = {
        name: user.displayName || 'Robert Fox',
        avatarUrl:
          user.photoURL ||
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA4vNdnM68n2M8a5_y7WCisepj9GryIwUAKkxd2lSMbarPltAU9Fbxfq_EK9tVZzLGcmQyhMPK_Hmldtf7SRdjh3IKyHPZFmuKZwbR5JQZDukXblMBiwrup8Kh3opStvxcpMB0Rhj5VkguV-FbQPpai_dk_uTeiD0T29i7RiN4IU2JqG7Ctqgp_KDApqMozyrsJsmRmDao6ywVb-QDHZiEVEtfwZ3qAf_buAb4ZeTNJHXGnV6AJTxlu',
        title: 'Senior Product Designer',
        location: 'San Francisco, CA (Remote)',
        isOpenToOpportunities: true,
        cvFileName: 'Robert_Fox_Product_CV.pdf',
        cvFileSize: '1.4 MB',
        cvUploadedDate: 'Uploaded 2d ago',
        skills: ['Figma', 'UI/UX Design', 'Design System', 'Prototyping', 'User Research'],
      };

      // Store user record in Firestore
      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          email: user.email,
          displayName: profile.name,
          photoURL: profile.avatarUrl,
          title: profile.title,
          location: profile.location,
          skills: profile.skills,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      onSuccess(profile);
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setErrorMsg(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email & Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const profile: UserProfile = {
        name: user.displayName || name || 'Robert Fox',
        avatarUrl:
          user.photoURL ||
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA4vNdnM68n2M8a5_y7WCisepj9GryIwUAKkxd2lSMbarPltAU9Fbxfq_EK9tVZzLGcmQyhMPK_Hmldtf7SRdjh3IKyHPZFmuKZwbR5JQZDukXblMBiwrup8Kh3opStvxcpMB0Rhj5VkguV-FbQPpai_dk_uTeiD0T29i7RiN4IU2JqG7Ctqgp_KDApqMozyrsJsmRmDao6ywVb-QDHZiEVEtfwZ3qAf_buAb4ZeTNJHXGnV6AJTxlu',
        title: 'Senior Product Designer',
        location: 'San Francisco, CA (Remote)',
        isOpenToOpportunities: true,
        cvFileName: 'Robert_Fox_Product_CV.pdf',
        cvFileSize: '1.4 MB',
        cvUploadedDate: 'Uploaded 2d ago',
        skills: ['Figma', 'UI/UX Design', 'Design System', 'Prototyping', 'User Research'],
      };

      onSuccess(profile);
    } catch (err: any) {
      console.error('Sign In Error:', err);
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email & Password Sign Up with Verification
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (name) {
        await updateProfile(user, { displayName: name });
      }

      // Send Email Verification
      await sendEmailVerification(user);

      // Save record to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name || 'Robert Fox',
        photoURL: '',
        title: 'Senior Product Designer',
        location: 'San Francisco, CA (Remote)',
        skills: ['Figma', 'UI/UX Design', 'Design System', 'Prototyping'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setInfoMsg(`Verification link sent to ${email}! Check your inbox to verify.`);
      setMode('verify');
    } catch (err: any) {
      console.error('Sign Up Error:', err);
      setErrorMsg(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Verification Code Simulation
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMsg('Please enter a valid verification code');
      return;
    }

    const profile: UserProfile = {
      name: name || 'Robert Fox',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA4vNdnM68n2M8a5_y7WCisepj9GryIwUAKkxd2lSMbarPltAU9Fbxfq_EK9tVZzLGcmQyhMPK_Hmldtf7SRdjh3IKyHPZFmuKZwbR5JQZDukXblMBiwrup8Kh3opStvxcpMB0Rhj5VkguV-FbQPpai_dk_uTeiD0T29i7RiN4IU2JqG7Ctqgp_KDApqMozyrsJsmRmDao6ywVb-QDHZiEVEtfwZ3qAf_buAb4ZeTNJHXGnV6AJTxlu',
      title: 'Senior Product Designer',
      location: 'San Francisco, CA (Remote)',
      isOpenToOpportunities: true,
      cvFileName: 'Robert_Fox_Product_CV.pdf',
      cvFileSize: '1.4 MB',
      cvUploadedDate: 'Uploaded 2d ago',
      skills: ['Figma', 'UI/UX Design', 'Design System', 'Prototyping', 'User Research'],
    };

    onSuccess(profile);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-10 pb-20 bg-[#F2F1F8] flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="w-10 h-10 bg-[#18181B] rounded-2xl flex items-center justify-center text-[#CEF237] font-extrabold text-sm shadow-xs">
            JF
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-bold text-slate-500 hover:text-slate-900"
          >
            Close ✕
          </button>
        </div>

        <h1 className="text-2xl font-black text-[#18181B] tracking-tight">
          {mode === 'signin' ? 'Welcome Back !!' : mode === 'signup' ? 'Create Account' : 'Verify Email'}
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          {mode === 'signin'
            ? 'Sign in to access your saved jobs and applications'
            : mode === 'signup'
            ? 'Join Job Finder to discover matching opportunities'
            : 'Enter verification code or check your inbox'}
        </p>

        {/* Mode Toggle Tabs */}
        <div className="flex bg-slate-200 p-1 rounded-2xl mt-5">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
              setInfoMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              mode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
              setInfoMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error / Info Messages */}
        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-100 text-rose-800 text-xs rounded-2xl font-medium border border-rose-200">
            {errorMsg}
          </div>
        )}
        {infoMsg && (
          <div className="mt-4 p-3 bg-emerald-100 text-emerald-800 text-xs rounded-2xl font-medium border border-emerald-200">
            {infoMsg}
          </div>
        )}

        {/* Google OAuth Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 bg-white text-slate-800 border border-slate-200 rounded-2xl font-bold text-xs flex items-center justify-center gap-3 shadow-xs hover:bg-slate-50 active:scale-98 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative bg-[#F2F1F8] px-3 text-[10px] font-bold text-slate-400 uppercase">
            Or with Email
          </span>
        </div>

        {/* Email Sign In Form */}
        {mode === 'signin' && (
          <form onSubmit={handleEmailSignIn} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="robert.fox@example.com"
                className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#CEF237] text-[#18181B] font-extrabold text-xs rounded-2xl shadow-md hover:brightness-95 active:scale-98 transition"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Email Sign Up Form */}
        {mode === 'signup' && (
          <form onSubmit={handleEmailSignUp} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Robert Fox"
                className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="robert.fox@example.com"
                className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#CEF237] text-[#18181B] font-extrabold text-xs rounded-2xl shadow-md hover:brightness-95 active:scale-98 transition"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up & Verify'}
            </button>
          </form>
        )}

        {/* OTP / Verification Form */}
        {mode === 'verify' && (
          <form onSubmit={handleVerifyOTP} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Enter 6-Digit Code / Verification Pin</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-slate-900 text-lg"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#18181B] text-[#CEF237] font-extrabold text-xs rounded-2xl shadow-md hover:brightness-110 active:scale-98 transition"
            >
              Verify & Complete Sign In
            </button>
          </form>
        )}
      </div>

      {/* Guest Sign In Option */}
      <div className="pt-6 text-center">
        <button
          type="button"
          onClick={() => {
            onSuccess({
              name: 'Robert Fox',
              avatarUrl:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuA4vNdnM68n2M8a5_y7WCisepj9GryIwUAKkxd2lSMbarPltAU9Fbxfq_EK9tVZzLGcmQyhMPK_Hmldtf7SRdjh3IKyHPZFmuKZwbR5JQZDukXblMBiwrup8Kh3opStvxcpMB0Rhj5VkguV-FbQPpai_dk_uTeiD0T29i7RiN4IU2JqG7Ctqgp_KDApqMozyrsJsmRmDao6ywVb-QDHZiEVEtfwZ3qAf_buAb4ZeTNJHXGnV6AJTxlu',
              title: 'Senior Product Designer',
              location: 'San Francisco, CA (Remote)',
              isOpenToOpportunities: true,
              cvFileName: 'Robert_Fox_Product_CV.pdf',
              cvFileSize: '1.4 MB',
              cvUploadedDate: 'Uploaded 2d ago',
              skills: ['Figma', 'UI/UX Design', 'Design System', 'Prototyping', 'User Research'],
            });
          }}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 underline"
        >
          Continue as Guest Candidate
        </button>
      </div>
    </div>
  );
};
