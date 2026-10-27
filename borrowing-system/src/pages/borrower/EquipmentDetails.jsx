import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api.js';
import { useAuth } from '../../services/auth.jsx';
export default function EquipmentDetails() {
  const { id } = useParams(); const { user } = useAuth(); const nav = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const [e, setE] = useState(null); const [f, setF] = useState({ quantity: 1, start_date: today, due_date: today, purpose: '' }); const [err, setErr] = useState('');
  useEffect(() => { api.getEquipment(id).then(setE).catch((x) => setErr(x.message)); }, [id]);
  const set = (k) => (ev) => setF({ ...f, [k]: ev.target.value });
  const submit = async (ev) => { ev.preventDefault(); setErr('');
    if (f.due_date < f.start_date) return setErr('Due date must be on or after the start date.');
    try { await api.createRequest({ ...f, quantity: +f.quantity, user_id: user.user_id, equipment_id: e.equipment_id }); nav('/requests'); } catch (x) { setErr(x.message); } };
  if (!e) return <p>{err || 'Loading…'}</p>;
  return (<><button className="btn ghost" onClick={() => nav(-1)}>← Back</button><h1>{e.name}</h1>
    <p>{e.description}</p><p><small>{e.category} · Condition: {e.condition} · {e.available} of {e.quantity} available</small></p>
    <form className="card" onSubmit={submit}><h2>Request to borrow</h2>{err && <p className="err" role="alert">{err}</p>}
      <div className="grid2"><label className="field"><span>Quantity</span><input type="number" min="1" max={e.available} value={f.quantity} onChange={set('quantity')} /></label>
        <span /><label className="field"><span>Start date</span><input type="date" min={today} value={f.start_date} onChange={set('start_date')} /></label>
        <label className="field"><span>Due date</span><input type="date" min={f.start_date} value={f.due_date} onChange={set('due_date')} /></label>
        <label className="field full"><span>Purpose</span><textarea required rows="3" value={f.purpose} onChange={set('purpose')} /></label></div>
      <button className="btn" disabled={!e.available}>Send request</button></form></>);
}
