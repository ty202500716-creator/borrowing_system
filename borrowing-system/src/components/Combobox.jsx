import { useEffect, useRef, useState } from 'react';
// Click to open, type to search, click an option to select.
export default function Combobox({ label, options, value, onChange, placeholder, disabled }) {
  const [open, setOpen] = useState(false); const [q, setQ] = useState(''); const ref = useRef();
  useEffect(() => { const h = (e) => !ref.current?.contains(e.target) && setOpen(false); document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);
  const list = options.filter((o) => o.toLowerCase().includes(q.toLowerCase()));
  return (<label className="field combo" ref={ref}><span>{label}</span>
    <input value={open ? q : value} placeholder={placeholder} disabled={disabled} onFocus={() => { setOpen(true); setQ(''); }} onChange={(e) => setQ(e.target.value)} />
    {open && <ul role="listbox">{list.length ? list.map((o) => <li key={o} role="option" aria-selected={o === value} onMouseDown={() => { onChange(o); setOpen(false); }}>{o}</li>) : <li className="none">No match. Try another word.</li>}</ul>}
  </label>);
}
