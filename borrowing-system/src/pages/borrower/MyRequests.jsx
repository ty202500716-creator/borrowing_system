import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { useAuth } from '../../services/auth.jsx';
import { Badge, Empty, fmt } from '../../components/ui.jsx';
export default function MyRequests() {
  const { user } = useAuth(); const [rs, setRs] = useState([]); const [s, setS] = useState('all');
  useEffect(() => { api.listRequests(user.user_id).then(setRs); }, [user]);
  const shown = rs.filter((r) => s === 'all' || r.status === s);
  return (<><h1>My requests</h1><select value={s} onChange={(e) => setS(e.target.value)}>{['all', 'pending', 'approved', 'rejected', 'returned', 'overdue'].map((x) => <option key={x}>{x}</option>)}</select>
    {shown.length ? <div className="scroll"><table><thead><tr><th>Equipment</th><th>Qty</th><th>Start</th><th>Due</th><th>Returned</th><th>Status</th></tr></thead>
      <tbody>{shown.map((r) => <tr key={r.request_id}><td>{r.equipment_name}</td><td>{r.quantity}</td><td>{fmt(r.start_date)}</td><td>{fmt(r.due_date)}</td><td>{fmt(r.return_date)}</td><td><Badge status={r.status} /></td></tr>)}</tbody></table></div> : <Empty>No requests yet.</Empty>}</>);
}
