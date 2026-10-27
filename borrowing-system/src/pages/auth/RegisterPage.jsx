import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Combobox from '../../components/Combobox.jsx';
import { COLLEGES } from '../../data/colleges.js';
import { api } from '../../services/api.js';
const init = { role: 'student', name: '', email: '', contact_number: '', password: '', confirm: '', student_number: '', college: '', course: '', year_level: 1, employee_number: '', department: '', position: '' };
export default function RegisterPage() {
  const nav = useNavigate(); const [f, setF] = useState(init); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => { e.preventDefault(); setErr('');
    if (f.password.length < 8) return setErr('Password must be at least 8 characters.');
    if (f.password !== f.confirm) return setErr('Passwords do not match.');
    if (f.role === 'student' && (!f.college || !f.course)) return setErr('Choose your college and program.');
    setBusy(true); const { confirm, ...data } = f; // backend: POST /api/auth/register (hash password server-side)
    try { await api.register(data); nav('/login', { state: { msg: 'Account created. You can log in now.' } }); } catch (x) { setErr(x.message); setBusy(false); } };
  const S = f.role === 'student';
  return (<div className="auth"><form className="card wide" onSubmit={submit}>
    <h1>Create an account</h1>{err && <p className="err" role="alert">{err}</p>}
    <div className="seg">{['student', 'staff'].map((r) => <button type="button" key={r} className={f.role === r ? 'on' : ''} onClick={() => setF({ ...f, role: r })}>{r === 'student' ? 'Student' : 'Staff'}</button>)}</div>
    <div className="grid2">
      <label className="field"><span>Full name</span><input required value={f.name} onChange={set('name')} /></label>
      <label className="field"><span>Contact number</span><input required value={f.contact_number} onChange={set('contact_number')} /></label>
      <label className="field full"><span>Email</span><input type="email" required value={f.email} onChange={set('email')} /></label>
      {S ? <>
        <label className="field"><span>Student number</span><input required value={f.student_number} onChange={set('student_number')} /></label>
        <label className="field"><span>Year level</span><select value={f.year_level} onChange={set('year_level')}>{[1, 2, 3, 4].map((y) => <option key={y}>{y}</option>)}</select></label>
        <div className="full"><Combobox label="College" placeholder="Click and type to search your college" options={Object.keys(COLLEGES)} value={f.college} onChange={(v) => setF({ ...f, college: v, course: '' })} /></div>
        <div className="full"><Combobox label="Program" placeholder={f.college ? 'Search your program' : 'Choose a college first'} disabled={!f.college} options={COLLEGES[f.college] || []} value={f.course} onChange={(v) => setF({ ...f, course: v })} /></div>
      </> : <>
        <label className="field"><span>Employee number</span><input required value={f.employee_number} onChange={set('employee_number')} /></label>
        <label className="field"><span>Department</span><input required value={f.department} onChange={set('department')} /></label>
        <label className="field full"><span>Position (optional)</span><input value={f.position} onChange={set('position')} /></label></>}
      <label className="field"><span>Password</span><input type="password" required value={f.password} onChange={set('password')} /></label>
      <label className="field"><span>Confirm password</span><input type="password" required value={f.confirm} onChange={set('confirm')} /></label>
    </div>
    <button className="btn" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
    <p className="hint">Already registered? <Link to="/login">Log in</Link></p></form></div>);
}