import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { useAuth } from '../../services/auth.jsx';
import { Badge, Empty, fmt } from '../../components/ui.jsx';
export default function RequestManagement() {
  const { user } = useAuth(); const [rs, setRs] = useState([]); const [q, setQ] = useState(''); const [s, setS] = useState('pending'); const [err, setErr] = useState('');
  const load = () => api.listRequests().then(setRs); useEffect(() => { load(); }, []);
  const act = (id, st) => api.updateRequest(id, st, user.user_id).then(load).catch((x) => setErr(x.message));
  const shown = rs.filter((r) => (s === 'all' || r.status === s) && `${r.user_name} ${r.equipment_name}`.toLowerCase().includes(q.toLowerCase()));
  return (<><h1>Requests</h1>{err && <p className="err">{err}</p>}
    <div className="row"><input className="search" placeholder="Search borrower or equipment" value={q} onChange={(e) => setQ(e.target.value)} />
      <select value={s} onChange={(e) => setS(e.target.value)}>{['all', 'pending', 'approved', 'rejected', 'returned', 'overdue'].map((x) => <option key={x}>{x}</option>)}</select></div>
    {shown.length ? <div className="scroll"><table><thead><tr><th>Borrower</th><th>Equipment</th><th>Qty</th><th>Due</th><th>Purpose</th><th>Status</th><th /></tr></thead>
      <tbody>{shown.map((r) => <tr key={r.request_id}><td>{r.user_name}</td><td>{r.equipment_name}</td><td>{r.quantity}</td><td>{fmt(r.due_date)}</td><td>{r.purpose}</td><td><Badge status={r.status} /></td>
        <td className="acts">{r.status === 'pending' && <><button className="btn sm" onClick={() => act(r.request_id, 'approved')}>Approve</button><button className="btn ghost sm" onClick={() => act(r.request_id, 'rejected')}>Reject</button></>}
          {['approved', 'overdue'].includes(r.status) && <button className="btn sm" onClick={() => act(r.request_id, 'returned')}>Mark returned</button>}</td></tr>)}</tbody></table></div> : <Empty>No requests in this view.</Empty>}</>);
}
