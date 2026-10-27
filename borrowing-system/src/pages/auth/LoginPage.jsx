import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth.jsx';
export default function LoginPage() {
  const { login } = useAuth(); const nav = useNavigate(); const { state } = useLocation();
  const [f, setF] = useState({ email: '', password: '' }); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (e) => { e.preventDefault(); setBusy(true); setErr('');
    try { const u = await login(f.email, f.password); nav(u.role === 'admin' ? '/admin' : '/dashboard'); } catch (x) { setErr(x.message); setBusy(false); } };
  return (<div className="auth"><form className="card" onSubmit={submit}>
    <h1>Log in</h1>{state?.msg && <p className="ok">{state.msg}</p>}{err && <p className="err" role="alert">{err}</p>}
    <label className="field"><span>Email</span><input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
    <label className="field"><span>Password</span><input type="password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
    <button className="btn" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
    <p className="hint">New here? <Link to="/register">Create an account</Link><br />Demo admin: admin@campus.edu / admin123</p></form></div>);
}
