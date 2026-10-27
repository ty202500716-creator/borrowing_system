import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { Empty, Modal } from '../../components/ui.jsx';
const blank = { name: '', category: '', condition: 'Good', description: '', quantity: 1, available: 1 };
export default function EquipmentManagement() {
  const [items, setItems] = useState([]); const [q, setQ] = useState(''); const [edit, setEdit] = useState(null);
  const load = () => api.listEquipment().then(setItems); useEffect(() => { load(); }, []);
  const set = (k) => (e) => setEdit({ ...edit, [k]: e.target.value });
  const save = async (e) => { e.preventDefault(); await api.saveEquipment({ ...edit, quantity: +edit.quantity, available: Math.min(+edit.available, +edit.quantity) }); setEdit(null); load(); };
  const del = (i) => window.confirm(`Delete ${i.name}?`) && api.deleteEquipment(i.equipment_id).then(load);
  const shown = items.filter((i) => `${i.name} ${i.category}`.toLowerCase().includes(q.toLowerCase()));
  return (<><div className="row between"><h1>Inventory</h1><button className="btn" onClick={() => setEdit(blank)}>Add equipment</button></div>
    <input className="search" placeholder="Search inventory" value={q} onChange={(e) => setQ(e.target.value)} />
    {shown.length ? <div className="scroll"><table><thead><tr><th>Name</th><th>Category</th><th>Condition</th><th>Available</th><th /></tr></thead>
      <tbody>{shown.map((i) => <tr key={i.equipment_id}><td>{i.name}</td><td>{i.category}</td><td>{i.condition}</td><td>{i.available} / {i.quantity}</td>
        <td className="acts"><button className="btn ghost sm" onClick={() => setEdit(i)}>Edit</button><button className="btn ghost sm" onClick={() => del(i)}>Delete</button></td></tr>)}</tbody></table></div> : <Empty>No equipment found.</Empty>}
    {edit && <Modal title={edit.equipment_id ? 'Edit equipment' : 'Add equipment'} onClose={() => setEdit(null)}><form onSubmit={save}><div className="grid2">
      <label className="field"><span>Name</span><input required value={edit.name} onChange={set('name')} /></label>
      <label className="field"><span>Category</span><input required value={edit.category} onChange={set('category')} /></label>
      <label className="field"><span>Condition</span><select value={edit.condition} onChange={set('condition')}>{['Good', 'Fair', 'Poor', 'Under repair'].map((c) => <option key={c}>{c}</option>)}</select></label>
      <label className="field"><span>Total quantity</span><input type="number" min="0" required value={edit.quantity} onChange={set('quantity')} /></label>
      <label className="field"><span>Available now</span><input type="number" min="0" required value={edit.available} onChange={set('available')} /></label>
      <label className="field full"><span>Description</span><textarea rows="2" value={edit.description} onChange={set('description')} /></label></div>
      <button className="btn">Save equipment</button></form></Modal>}</>);
}
