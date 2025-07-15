'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './login.css';

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth-user', { credentials: 'include' });
        if (res.ok) {
          router.replace('/hiring');
          return;
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
      setLoading(false);
    };
    checkSession();
  }, [router]);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const login = async () => {
    if (!username || !password) {
      setShake(true);
      showToast('⚠️ Please fill all fields!');
      setTimeout(() => setShake(false), 500);
      return;
    }

    const res = await fetch('/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      showToast('✅ Login successful!', 'success');
      setTimeout(() => router.push('/hiring'), 1000);
    } else {
      setShake(true);
      showToast('🚫 Invalid credentials');
      setTimeout(() => setShake(false), 500);
    }
  };

  const Signup = () => router.push('/signup');

  if (loading) {
    return (
      <div className="login-container">
        <div className="floating-bg"></div>
        <h2 className="checking-text">✨ Checking session…</h2>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="floating-bg"></div>

      {toast && (
        <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          {toast.message}
        </div>
      )}

      <div className={`login-card glass fade-in-up ${shake ? 'shake' : ''}`}>
        <h1 className="login-title">🔐 Login Panel</h1>
        <p className="login-subtitle">Access your account below</p>

        <div className="input-group">
          <input
            type="text"
            placeholder="👤 Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
        </div>

        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <span onClick={() => setShowPassword(!showPassword)} className="toggle-password">
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <label className="remember-switch">
          <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
          <span className="slider"></span>
          <span className="label-text">Remember me</span>
        </label>

        <button onClick={login} className="login-btn">Sign In</button>

        <p className="signup-text">Don’t have an account?</p>
        <button onClick={Signup} className="signup-btn">Sign Up</button>
      </div>
    </div>
  );
}
