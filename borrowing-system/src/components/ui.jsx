export const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—');
export const Badge = ({ status }) => <span className={`badge ${status}`}>{status}</span>;
export const Empty = ({ children }) => <p className="empty">{children}</p>;
export function Modal({ title, onClose, children }) {
  return (<div className="scrim" onMouseDown={onClose}><div className="modal" role="dialog" aria-label={title} onMouseDown={(e) => e.stopPropagation()}>
    <div className="row between"><h2>{title}</h2><button className="btn ghost" onClick={onClose} aria-label="Close">✕</button></div>{children}</div></div>);
}
export const Stat = ({ label, value, tone }) => <div className={`stat ${tone || ''}`}><b>{value}</b><span>{label}</span></div>;
