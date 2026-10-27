import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { Stat } from '../../components/ui.jsx';
export default function AdminDashboard() {
  const [rs, setRs] = useState([]); const [eq, setEq] = useState([]);
  useEffect(() => { api.listRequests().then(setRs); api.listEquipment().then(setEq); }, []);
  const n = (s) => rs.filter((r) => r.status === s).length;
  return (<><h1>Admin dashboard</h1><div className="stats">
    <Stat label="Equipment types" value={eq.length} /><Stat label="Units available" value={eq.reduce((a, e) => a + e.available, 0)} />
    <Stat label="Pending requests" value={n('pending')} /><Stat label="On loan" value={n('approved')} /><Stat label="Overdue" value={n('overdue')} tone="warn" /></div></>);
}
