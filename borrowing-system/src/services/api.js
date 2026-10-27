// MOCK API (localStorage). Every function mirrors a future REST call on the Express server.
// To go live: replace each body with fetch('/api/...') and keep the same signature + return shape.
const KEY = 'campus_equip_db';
const today = () => new Date().toISOString().slice(0, 10);
const seed = {
  seq: { user: 2, equip: 7, req: 1, note: 1 },
  users: [{ user_id: 1, name: 'System Admin', email: 'admin@campus.edu', password: 'admin123', role: 'admin', contact_number: '09000000000', office: 'IT Office' }],
  equipment: [
    ['Projector','AV','Good','HD projector with HDMI and VGA.',4],['DSLR Camera','Media','Good','Includes lens and 32GB card.',3],
    ['Laptop','Computing','Good','Core i5, 8GB RAM.',10],['Extension Cord','Electrical','Fair','5-meter, 4 outlets.',8],
    ['Microscope','Laboratory','Good','Binocular compound microscope.',6],['Portable Speaker','AV','Good','Bluetooth PA speaker with mic.',2],
  ].map(([name, category, condition, description, quantity], i) => ({ equipment_id: i + 1, name, category, condition, description, quantity, available: quantity })),
  requests: [], notifications: [],
};
const load = () => JSON.parse(localStorage.getItem(KEY) || 'null') || (localStorage.setItem(KEY, JSON.stringify(seed)), structuredClone(seed));
const save = (db) => localStorage.setItem(KEY, JSON.stringify(db));
const wait = (v) => new Promise((r) => setTimeout(() => r(structuredClone(v)), 150));
const fail = (m) => Promise.reject(new Error(m));
const withStatus = (r) => (r.status === 'approved' && r.due_date < today() ? { ...r, status: 'overdue' } : r);
const notify = (db, user_id, message) => db.notifications.unshift({ notification_id: db.seq.note++, user_id, message, is_read: false, created_at: new Date().toISOString() });

export const api = {
  async login(email, password) {
    const u = load().users.find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (!u) return fail('Incorrect email or password.');
    const { password: _, ...safe } = u; return wait(safe);
  },
  async register(data) {
    const db = load();
    if (db.users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) return fail('That email is already registered.');
    db.users.push({ ...data, user_id: db.seq.user++ }); save(db); return wait({ ok: true });
  },
  async listEquipment() { return wait(load().equipment); },
  async getEquipment(id) { const e = load().equipment.find((x) => x.equipment_id === +id); return e ? wait(e) : fail('Equipment not found.'); },
  async saveEquipment(e) {
    const db = load();
    if (e.equipment_id) { const i = db.equipment.findIndex((x) => x.equipment_id === e.equipment_id); db.equipment[i] = { ...db.equipment[i], ...e }; }
    else db.equipment.push({ ...e, equipment_id: db.seq.equip++ });
    save(db); return wait({ ok: true });
  },
  async deleteEquipment(id) { const db = load(); db.equipment = db.equipment.filter((x) => x.equipment_id !== id); save(db); return wait({ ok: true }); },
  async listRequests(userId) {
    const db = load();
    return wait(db.requests.filter((r) => !userId || r.user_id === userId).map(withStatus).map((r) => ({
      ...r, equipment_name: db.equipment.find((e) => e.equipment_id === r.equipment_id)?.name,
      user_name: db.users.find((u) => u.user_id === r.user_id)?.name,
    })).sort((a, b) => b.request_id - a.request_id));
  },
  async createRequest(r) {
    const db = load(); const e = db.equipment.find((x) => x.equipment_id === r.equipment_id);
    if (r.quantity > e.available) return fail(`Only ${e.available} available.`);
    db.requests.push({ ...r, request_id: db.seq.req++, status: 'pending', request_date: new Date().toISOString(), return_date: null, approved_by: null });
    save(db); return wait({ ok: true });
  },
  async updateRequest(id, status, adminId) { // status: approved | rejected | returned
    const db = load(); const r = db.requests.find((x) => x.request_id === id); const e = db.equipment.find((x) => x.equipment_id === r.equipment_id);
    if (status === 'approved') { if (r.quantity > e.available) return fail('Not enough stock to approve.'); e.available -= r.quantity; r.approved_by = adminId; }
    if (status === 'returned') { e.available += r.quantity; r.return_date = today(); }
    r.status = status; notify(db, r.user_id, `Your request for ${e.name} was ${status}.`); save(db); return wait({ ok: true });
  },
  async sendReminder(id) { const db = load(); const r = db.requests.find((x) => x.request_id === id); const e = db.equipment.find((x) => x.equipment_id === r.equipment_id); notify(db, r.user_id, `Reminder: ${e.name} is due ${r.due_date}. Please return it.`); save(db); return wait({ ok: true }); },
  async listNotifications(userId) { return wait(load().notifications.filter((n) => n.user_id === userId)); },
  async markRead(id) { const db = load(); db.notifications.find((n) => n.notification_id === id).is_read = true; save(db); return wait({ ok: true }); },
};
