import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth.jsx';
const NAV = {
  borrower: [['/dashboard', 'Dashboard'], ['/catalog', 'Equipment'], ['/requests', 'My requests'], ['/notifications', 'Notifications']],
  admin: [['/admin', 'Dashboard'], ['/admin/requests', 'Requests'], ['/admin/equipment', 'Inventory'], ['/admin/loans', 'Loan monitor']],
};
export default function Layout() {
  const { user, logout } = useAuth(); const nav = useNavigate();
  return (<div className="shell">
    <aside><div className="brand">Campus Equipment</div>
      <nav>{NAV[user.role === 'admin' ? 'admin' : 'borrower'].map(([to, t]) => <NavLink key={to} to={to} end>{t}</NavLink>)}</nav>
      <div className="me"><b>{user.name}</b><small>{user.role}</small><button className="btn ghost" onClick={() => { logout(); nav('/'); }}>Log out</button></div></aside>
    <main><Outlet /></main></div>);
}
