import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { useAuth } from '../../services/auth.jsx';
import { Empty, fmt } from '../../components/ui.jsx';
export default function Notifications() {
  const { user } = useAuth(); const [ns, setNs] = useState([]); const load = () => api.listNotifications(user.user_id).then(setNs);
  useEffect(() => { load(); }, []);
  return (<><h1>Notifications</h1>{ns.length ? <div className="list">{ns.map((n) => <div key={n.notification_id} className={`row between item ${n.is_read ? '' : 'unread'}`}>
    <span>{n.message}<br /><small>{fmt(n.created_at)}</small></span>{!n.is_read && <button className="btn ghost" onClick={() => api.markRead(n.notification_id).then(load)}>Mark read</button>}</div>)}</div> : <Empty>You're all caught up.</Empty>}</>);
}
