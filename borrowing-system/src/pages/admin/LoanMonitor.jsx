import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { Badge, Empty, fmt } from '../../components/ui.jsx';
export default function LoanMonitor() {
  const [rs, setRs] = useState([]); const [q, setQ] = useState(''); const [msg, setMsg] = useState('');
  const load = () => api.listRequests().then(setRs); useEffect(() => { load(); }, []);
  const loans = rs.filter((r) => ['approved', 'overdue'].includes(r.status) && `${r.user_name} ${r.equipment_name}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (a.status === 'overdue' ? -1 : 1) - (b.status === 'overdue' ? -1 : 1) || String(a.due_date).localeCompare(String(b.due_date)));
  const remind = (r) => api.sendReminder(r.request_id).then(() => setMsg(`Reminder sent to ${r.user_name}.`));
  const ret = (r) => api.updateRequest(r.request_id, 'returned').then(load);
  return (<><h1>Loan monitor</h1>{msg && <p className="ok">{msg}</p>}
    <input className="search" placeholder="Search borrower or equipment" value={q} onChange={(e) => setQ(e.target.value)} />
    {loans.length ? <div className="scroll"><table><thead><tr><th>Borrower</th><th>Equipment</th><th>Qty</th><th>Due</th><th>Status</th><th /></tr></thead>
      <tbody>{loans.map((r) => <tr key={r.request_id}><td>{r.user_name}</td><td>{r.equipment_name}</td><td>{r.quantity}</td><td>{fmt(r.due_date)}</td><td><Badge status={r.status} /></td>
        <td className="acts"><button className="btn ghost sm" onClick={() => remind(r)}>Send reminder</button><button className="btn sm" onClick={() => ret(r)}>Mark returned</button></td></tr>)}</tbody></table></div> : <Empty>No items are currently on loan.</Empty>}</>);
}