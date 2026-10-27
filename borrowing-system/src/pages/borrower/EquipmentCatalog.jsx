import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import { Empty } from '../../components/ui.jsx';
export default function EquipmentCatalog() {
  const [items, setItems] = useState([]); const [q, setQ] = useState(''); const [cat, setCat] = useState('All');
  useEffect(() => { api.listEquipment().then(setItems); }, []);
  const cats = ['All', ...new Set(items.map((i) => i.category))];
  const shown = items.filter((i) => (cat === 'All' || i.category === cat) && i.name.toLowerCase().includes(q.toLowerCase()));
  return (<><h1>Equipment</h1>
    <div className="row"><input className="search" placeholder="Search equipment" value={q} onChange={(e) => setQ(e.target.value)} />
      <select value={cat} onChange={(e) => setCat(e.target.value)}>{cats.map((c) => <option key={c}>{c}</option>)}</select></div>
    {shown.length ? <div className="cards">{shown.map((i) => <Link key={i.equipment_id} to={`/catalog/${i.equipment_id}`} className="tag">
      <small>{i.category}</small><b>{i.name}</b><span className={i.available ? 'avail' : 'avail none'}>{i.available ? `${i.available} of ${i.quantity} available` : 'All borrowed'}</span></Link>)}</div> : <Empty>No equipment matches your search.</Empty>}</>);
}
