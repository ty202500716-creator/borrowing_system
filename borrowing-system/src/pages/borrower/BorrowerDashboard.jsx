import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import { useAuth } from '../../services/auth.jsx';
import { Badge, Empty, Stat, fmt } from '../../components/ui.jsx';
export default function BorrowerDashboard() {
  const { user } = useAuth(); const [rs, setRs] = useState([]);
  useEffect(() => { api.listRequests(user.user_id).then(setRs); }, [user]);
  const n = (s) => rs.filter((r) => r.status === s).length; const active = rs.filter((r) => ['approved', 'overdue'].includes(r.status));
  return (<><h1>Hello, {user.name.split(' ')[0]}</h1>
    <div className="stats"><Stat label="Pending" value={n('pending')} /><Stat label="Borrowed now" value={n('approved')} /><Stat label="Overdue" value={n('overdue')} tone="warn" /><Stat label="Returned" value={n('returned')} /></div>
    <h2>Items you have</h2>{active.length ? <div className="list">{active.map((r) => <div key={r.request_id} className="row between item"><span><b>{r.equipment_name}</b> × {r.quantity}<br /><small>Due {fmt(r.due_date)}</small></span><Badge status={r.status} /></div>)}</div> : <Empty>Nothing borrowed right now. <Link to="/catalog">Browse equipment</Link></Empty>}</>);
}
