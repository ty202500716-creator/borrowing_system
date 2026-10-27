import { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { api } from './services/api.js';
import { useAuth } from './services/auth.jsx';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import BorrowerDashboard from './pages/borrower/BorrowerDashboard.jsx';
import EquipmentCatalog from './pages/borrower/EquipmentCatalog.jsx';
import EquipmentDetails from './pages/borrower/EquipmentDetails.jsx';
import MyRequests from './pages/borrower/MyRequests.jsx';
import Notifications from './pages/borrower/Notifications.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import RequestManagement from './pages/admin/RequestManagement.jsx';
import EquipmentManagement from './pages/admin/EquipmentManagement.jsx';
import LoanMonitor from './pages/admin/LoanMonitor.jsx';
import wmsuLogo from './assets/wmsu_logo.png';

// Landing page lives here. Its styles are scoped to .lp so styles.css and index.html stay untouched.
const LANDING_CSS = `
html{scroll-behavior:smooth}
.lp{min-height:100vh;background:#fff;color:#2a2224;font:16px/1.6 'Segoe UI',system-ui,-apple-system,Roboto,Arial,sans-serif}
.lp *{box-sizing:border-box}
.lp a{font-weight:inherit;color:inherit;text-decoration:none}
.lp-wrap{max-width:1120px;margin:0 auto;padding:0 1.25rem}
.lp-util{background:#3d050e;color:#f3d9dc;font-size:.82rem}
.lp-util .lp-wrap{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding-top:.45rem;padding-bottom:.45rem;flex-wrap:wrap}
.lp-util a{margin-left:1.2rem;color:#f3d9dc}.lp-util a:hover{color:#f4c430}
.lp-head{background:#fff;border-bottom:1px solid #e6dcdd}
.lp-head .lp-wrap{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding-top:.9rem;padding-bottom:.9rem;flex-wrap:wrap}
.lp-brand{display:flex;align-items:center;gap:.9rem}
.lp-logo{width:64px;height:64px;object-fit:contain;flex:none;display:block}
.lp-brand b{display:block;font:700 1.3rem/1.15 Georgia,'Times New Roman',serif;color:#7a0c1c}
.lp-brand span{font-size:.88rem;color:#6e5f62}
.lp-acts{display:flex;gap:.6rem}
.lp-btn{display:inline-block;padding:.65rem 1.4rem;border-radius:6px;font-weight:600;font-size:.95rem;border:2px solid #7a0c1c;background:#7a0c1c;color:#fff!important;transition:all .15s}
.lp-btn:hover{background:#5a0813;border-color:#5a0813;transform:translateY(-1px)}
.lp-btn.alt{background:#fff;color:#7a0c1c!important}.lp-btn.alt:hover{background:#7a0c1c;color:#fff!important}
.lp-btn.gold{background:#f4c430;border-color:#f4c430;color:#3a0a10!important;box-shadow:0 4px 14px rgba(244,196,48,.35)}.lp-btn.gold:hover{background:#e0b020;border-color:#e0b020}
.lp-btn.ghost{background:transparent;border-color:rgba(255,255,255,.7);color:#fff!important}.lp-btn.ghost:hover{background:#fff;color:#7a0c1c!important}
.lp-nav{background:#7a0c1c;border-bottom:4px solid #f4c430;position:sticky;top:0;z-index:20;box-shadow:0 2px 8px rgba(0,0,0,.15)}
.lp-nav .lp-wrap{display:flex;flex-wrap:wrap}
.lp-nav a{color:#fff;padding:.85rem 1.3rem;font-weight:600;font-size:.92rem;letter-spacing:.02em;transition:background .15s}
.lp-nav a:hover,.lp-nav a.on{background:#5a0813;color:#f4c430}
.lp-hero{background:radial-gradient(circle at 85% 20%,rgba(244,196,48,.16),transparent 45%),linear-gradient(135deg,#4f0712 0%,#7a0c1c 100%);color:#fff}
.lp-hero .lp-wrap{display:grid;grid-template-columns:1.3fr 1fr;gap:3.5rem;align-items:center;padding-top:4.5rem;padding-bottom:4.5rem}
.lp-kicker{display:inline-block;border-left:4px solid #f4c430;padding-left:.7rem;font-size:.82rem;letter-spacing:.12em;text-transform:uppercase;color:#f3d9dc;margin:0 0 1.1rem}
.lp h1{font:700 clamp(2rem,4.6vw,3.1rem)/1.12 Georgia,'Times New Roman',serif;margin:0 0 1.1rem;color:#fff}
.lp h1::after{display:none}
.lp-lead{color:#f0d6d9;max-width:52ch;margin:0 0 2rem;font-size:1.08rem}
.lp-cta{display:flex;gap:.8rem;flex-wrap:wrap}
.lp-facts{align-self:center;height:auto;min-height:0;width:100%;position:static;background:#fff;color:#2a2224;border-top:6px solid #f4c430;border-radius:10px;padding:1.6rem;box-shadow:0 18px 45px rgba(0,0,0,.35)}
.lp-facts h2{font:700 1.3rem Georgia,serif;letter-spacing:.02em;color:#7a0c1c;margin:0 0 1.1rem;display:flex;align-items:center;gap:.6rem}
.lp-facts h2::before{content:"";width:6px;height:1.3rem;background:#f4c430;border-radius:3px}
.lp-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:.7rem}
.lp-stats div{background:#faf5f5;border:1px solid #eadfe0;border-radius:8px;padding:.9rem .5rem;text-align:center}
.lp-stats b{display:block;font:700 2rem/1.1 Georgia,serif;color:#7a0c1c}
.lp-stats span{display:block;margin-top:.3rem;font-size:.76rem;color:#6e5f62;line-height:1.25}
.lp-stats div:nth-child(2) b{color:#1f6b46}
.lp-bar{height:8px;background:#eadfe0;border-radius:99px;overflow:hidden;margin:1.2rem 0 .5rem}
.lp-bar span{display:block;height:100%;background:linear-gradient(90deg,#1f6b46,#3aa571);border-radius:99px}
.lp-facts p{margin:0;font-size:.82rem;color:#6e5f62}
.lp-sec{padding:4rem 0}.lp-sec.alt{background:#faf5f5;border-top:1px solid #eadfe0;border-bottom:1px solid #eadfe0}
.lp h2.lp-title{font:700 1.8rem Georgia,'Times New Roman',serif;color:#7a0c1c;margin:0 0 .4rem}
.lp-title::after{content:"";display:block;width:60px;height:4px;background:#f4c430;border-radius:2px;margin-top:.6rem}
.lp-sub{color:#6e5f62;margin:1rem 0 1.8rem;max-width:62ch}
.lp-tablewrap{overflow-x:auto;border:1px solid #e1d3d5;border-radius:10px;background:#fff;box-shadow:0 6px 20px rgba(122,12,28,.07)}
.lp .lp-table{width:100%;border-collapse:collapse;border:0;background:#fff}
.lp .lp-table th{background:#7a0c1c;color:#fff;text-align:left;padding:.85rem 1rem;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;border-bottom:0}
.lp .lp-table td{padding:.8rem 1rem;border-bottom:1px solid #efe4e5;font-size:.94rem;background:transparent}
.lp .lp-table tbody tr:nth-child(even) td{background:#fbf7f7}
.lp .lp-table tbody tr:hover td{background:#fdf1d2}
.lp .lp-table tbody tr:last-child td{border-bottom:0}
.lp-table code{font:600 .82rem ui-monospace,Menlo,Consolas,monospace;color:#7a0c1c;background:#f6eaec;padding:.15rem .45rem;border-radius:4px}
.lp-pill{display:inline-block;padding:.2rem .7rem;border-radius:99px;font-size:.82rem;font-weight:600;white-space:nowrap}
.lp-in{background:#e4f4ec;color:#1f6b46}.lp-out{background:#fbe6e9;color:#a31228}
.lp-empty{padding:1.6rem;color:#6e5f62}
.lp-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;list-style:none;margin:0;padding:0}
.lp-steps li{background:#fff;border:1px solid #e1d3d5;border-top:4px solid #7a0c1c;border-radius:10px;padding:1.5rem;box-shadow:0 4px 14px rgba(122,12,28,.06);transition:transform .2s,box-shadow .2s}
.lp-steps li:hover{transform:translateY(-4px);box-shadow:0 12px 26px rgba(122,12,28,.14)}
.lp-steps i{font:700 1.05rem Georgia,serif;font-style:normal;width:40px;height:40px;border-radius:50%;background:#f4c430;color:#4f0712;display:grid;place-items:center;margin-bottom:.9rem}
.lp-steps h3{font:700 1.1rem Georgia,serif;color:#7a0c1c;margin:0 0 .4rem}
.lp-steps p{margin:0;color:#5b4d50;font-size:.94rem}
.lp-two{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
.lp-box{border:1px solid #e1d3d5;border-left:5px solid #f4c430;border-radius:10px;padding:1.4rem 1.5rem;background:#fff;box-shadow:0 4px 14px rgba(122,12,28,.06)}
.lp-box h3{font:700 1.1rem Georgia,serif;color:#7a0c1c;margin:0 0 .4rem}.lp-box p{margin:0;color:#5b4d50;font-size:.94rem}
.lp-foot{background:#3d050e;color:#ecd2d6;border-top:5px solid #f4c430;font-size:.9rem}
.lp-foot .lp-wrap{display:flex;justify-content:space-between;align-items:center;gap:1.5rem;flex-wrap:wrap;padding-top:2rem;padding-bottom:2rem}
.lp-foot .lp-brand{gap:.8rem}
.lp-foot .lp-logo{width:52px;height:52px;background:#fff;border-radius:50%;padding:2px}
.lp-foot b{display:block;color:#fff;font:700 1.05rem Georgia,serif;margin-bottom:.2rem}
.lp-foot a:hover{color:#f4c430}
@media(max-width:860px){.lp-hero .lp-wrap{grid-template-columns:1fr;gap:2.2rem;padding-top:2.6rem;padding-bottom:2.6rem}.lp-steps,.lp-two{grid-template-columns:1fr}.lp-nav a{padding:.7rem .9rem}}
`;

function Landing() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  useEffect(() => { api.listEquipment().then(setItems).catch(() => {}); }, []);
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  const total = items.reduce((a, e) => a + e.quantity, 0);
  const free = items.reduce((a, e) => a + e.available, 0);
  const pct = total ? Math.round((free / total) * 100) : 0;
  const code = (id) => `EQ-${String(id).padStart(3, '0')}`;
  return (<div className="lp"><style>{LANDING_CSS}</style>
    <div className="lp-util"><div className="lp-wrap"><span>Zamboanga City, Philippines</span><span><Link to="/login">Log in</Link><Link to="/register">Register</Link></span></div></div>
    <header className="lp-head"><div className="lp-wrap">
      <div className="lp-brand"><img className="lp-logo" src={wmsuLogo} alt="WMSU seal" /><div><b>Western Mindanao State University</b><span>Equipment Borrowing and Inventory System</span></div></div>
      <div className="lp-acts"><Link className="lp-btn alt" to="/login">Log in</Link><Link className="lp-btn" to="/register">Register</Link></div></div></header>
    <nav className="lp-nav" aria-label="Page sections"><div className="lp-wrap"><a className="on" href="#top">Home</a><a href="#equipment">Equipment</a><a href="#how">How to borrow</a><a href="#who">Who can borrow</a></div></nav>
    <section className="lp-hero" id="top"><div className="lp-wrap">
      <div><p className="lp-kicker">For students and university staff</p>
        <h1>Equipment Borrowing System </h1>
        <p className="lp-lead">File a request for projectors, cameras, laptops, laboratory equipment and other items, then follow its status until the item is returned.</p>
        <div className="lp-cta"><Link className="lp-btn gold" to="/login">Log in to borrow</Link><Link className="lp-btn ghost" to="/register">Create an account</Link></div></div>
      <div className="lp-facts"><h2>Inventory</h2>
        <div className="lp-stats"><div><b>{items.length}</b><span>Equipment types</span></div><div><b>{free}</b><span>Units available</span></div><div><b>{total - free}</b><span>Units on loan</span></div></div>
        <div className="lp-bar"><span style={{ width: `${pct}%` }} /></div>
        <p>{pct}% of units are available. Counts update as requests are approved and items are returned.</p></div></div></section>
    <section className="lp-sec" id="equipment"><div className="lp-wrap">
      <h2 className="lp-title">Equipment available for borrowing</h2>
      <p className="lp-sub">Log in to send a request. Availability shown here is the number of units currently in the storage.</p>
      <div className="lp-tablewrap">{items.length ? <table className="lp-table"><thead><tr><th>Code</th><th>Equipment</th><th>Category</th><th>Condition</th><th>Available</th></tr></thead>
        <tbody>{items.map((e) => <tr key={e.equipment_id}><td><code>{code(e.equipment_id)}</code></td><td>{e.name}</td><td>{e.category}</td><td>{e.condition}</td>
          <td><span className={`lp-pill ${e.available ? 'lp-in' : 'lp-out'}`}>{e.available ? `${e.available} of ${e.quantity}` : 'None available'}</span></td></tr>)}</tbody></table>
        : <p className="lp-empty">No equipment has been listed yet.</p>}</div></div></section>
    <section className="lp-sec alt" id="how"><div className="lp-wrap">
      <h2 className="lp-title">How to borrow</h2><p className="lp-sub">Borrowing is done through a request that the administrator reviews.</p>
      <ol className="lp-steps">
        <li><i>1</i><h3>Log in or register</h3><p>Use your account to sign in. If you do not have one yet, register as a student or as staff.</p></li>
        <li><i>2</i><h3>File a request</h3><p>Choose the equipment, the quantity, your start and due dates, and state the purpose of the loan.</p></li>
        <li><i>3</i><h3>Claim and return</h3><p>You will be notified once the request is approved or rejected. Return the item on or before the due date; items not returned by then are marked overdue.</p></li></ol></div></section>
    <section className="lp-sec" id="who"><div className="lp-wrap">
      <h2 className="lp-title">Who can borrow</h2><p className="lp-sub">Registration asks for the details below so the administrator knows who is responsible for each item.</p>
      <div className="lp-two">
        <div className="lp-box"><h3>Students</h3><p>Full name, contact number, student number, year level, college and program.</p></div>
        <div className="lp-box"><h3>Staff</h3><p>Full name, contact number, employee number, department and position.</p></div></div></div></section>
    <footer className="lp-foot"><div className="lp-wrap">
      <div className="lp-brand"><img className="lp-logo" src={wmsuLogo} alt="" /><div><b>Western Mindanao State University</b>Normal Road, Baliwasan, Zamboanga City 7000</div></div>
      <div>Equipment Borrowing and Inventory System<br /><Link to="/login">Log in</Link> · <Link to="/register">Register</Link></div></div></footer>
  </div>);
}
const Protected = ({ role, children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if ((role === 'admin') !== (user.role === 'admin')) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
};
export default function App() {
  return (<Routes>
    <Route path="/" element={<Landing />} /><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} />
    <Route element={<Protected><Layout /></Protected>}>
      <Route path="/dashboard" element={<BorrowerDashboard />} /><Route path="/catalog" element={<EquipmentCatalog />} /><Route path="/catalog/:id" element={<EquipmentDetails />} />
      <Route path="/requests" element={<MyRequests />} /><Route path="/notifications" element={<Notifications />} /></Route>
    <Route element={<Protected role="admin"><Layout /></Protected>}>
      <Route path="/admin" element={<AdminDashboard />} /><Route path="/admin/requests" element={<RequestManagement />} />
      <Route path="/admin/equipment" element={<EquipmentManagement />} /><Route path="/admin/loans" element={<LoanMonitor />} /></Route>
    <Route path="*" element={<Navigate to="/" replace />} /></Routes>);
}