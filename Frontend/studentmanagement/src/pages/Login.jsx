import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const EMPTY_LOGIN = { username: '', password: '' };
const EMPTY_REG = { username: '', email: '', password: '', confirmPassword: '' };

export default function Login() {
  const [tab, setTab] = useState('login');
  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN);
  const [regForm, setRegForm] = useState(EMPTY_REG);
  const [regErrors, setRegErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginForm);
      addToast('Login successful!');
      navigate('/dashboard');
    } catch {
      addToast('Invalid credentials. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateReg = () => {
    const e = {};
    if (!regForm.username.trim()) e.username = 'Username is required';
    if (!regForm.email.trim() || !/\S+@\S+\.\S+/.test(regForm.email)) e.email = 'Valid email is required';
    if (regForm.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (regForm.password !== regForm.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errors = validateReg();
    if (Object.keys(errors).length) { setRegErrors(errors); return; }
    setLoading(true);
    try {
      await register({ username: regForm.username, email: regForm.email, password: regForm.password });
      addToast('Account created! Please sign in.');
      setRegForm(EMPTY_REG);
      setRegErrors({});
      setTab('login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center min-vh-100">
      <div className="login-card card shadow-lg p-4">

        {/* Brand */}
        <div className="text-center mb-4">
          <i className="bi bi-mortarboard-fill text-primary" style={{ fontSize: '2.5rem' }} />
          <h4 className="mt-2 fw-bold">EduAdmin</h4>
          <p className="text-muted small">Student Management System</p>
        </div>

        {/* Tabs */}
        <ul className="nav nav-pills nav-fill mb-4 auth-tabs">
          <li className="nav-item">
            <button
              className={`nav-link${tab === 'login' ? ' active' : ''}`}
              onClick={() => { setTab('login'); setRegErrors({}); }}
            >
              <i className="bi bi-box-arrow-in-right me-1" /> Sign In
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link${tab === 'register' ? ' active' : ''}`}
              onClick={() => setTab('register')}
            >
              <i className="bi bi-person-plus me-1" /> Register
            </button>
          </li>
        </ul>

        {/* Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Username</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-person" /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock" /></span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-semibold" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-box-arrow-in-right me-2" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className="text-center text-muted small mt-3 mb-0">
              Don't have an account?{' '}
              <button type="button" className="btn btn-link btn-sm p-0" onClick={() => setTab('register')}>
                Register here
              </button>
            </p>
          </form>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Username</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-person" /></span>
                <input
                  type="text"
                  className={`form-control${regErrors.username ? ' is-invalid' : ''}`}
                  placeholder="Choose a username"
                  value={regForm.username}
                  onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                />
                {regErrors.username && <div className="invalid-feedback">{regErrors.username}</div>}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-envelope" /></span>
                <input
                  type="email"
                  className={`form-control${regErrors.email ? ' is-invalid' : ''}`}
                  placeholder="Enter email address"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                />
                {regErrors.email && <div className="invalid-feedback">{regErrors.email}</div>}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock" /></span>
                <input
                  type="password"
                  className={`form-control${regErrors.password ? ' is-invalid' : ''}`}
                  placeholder="Min. 6 characters"
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                />
                {regErrors.password && <div className="invalid-feedback">{regErrors.password}</div>}
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock-fill" /></span>
                <input
                  type="password"
                  className={`form-control${regErrors.confirmPassword ? ' is-invalid' : ''}`}
                  placeholder="Repeat password"
                  value={regForm.confirmPassword}
                  onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                />
                {regErrors.confirmPassword && <div className="invalid-feedback">{regErrors.confirmPassword}</div>}
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-semibold" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-person-check me-2" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            <p className="text-center text-muted small mt-3 mb-0">
              Already have an account?{' '}
              <button type="button" className="btn btn-link btn-sm p-0" onClick={() => setTab('login')}>
                Sign in here
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
