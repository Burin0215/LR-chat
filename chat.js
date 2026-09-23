// ที่เก็บข้อความแชท — เลือกอัตโนมัติ:
//   - FIREBASE_CONFIG มีค่า  → Firestore (คุยข้ามเครื่องได้จริง)
//   - FIREBASE_CONFIG = null → โหมดทดลอง เก็บใน localStorage (คุยได้เฉพาะแท็บในเบราว์เซอร์เดียวกัน)
// ทุกข้อความอยู่ใน collection เดียว "messages": { room, senderId, text, ts }
//   room = "global" (ห้องรวม) หรือ "dm_<id1>_<id2>" (แชทส่วนตัว, id เรียงตามตัวอักษร)

const CHAT_MAX_LENGTH = 500;

const dmRoomId = (a, b) => 'dm_' + [a, b].sort().join('_');

function createChatBackend() {
  if (typeof FIREBASE_CONFIG !== 'undefined' && FIREBASE_CONFIG && typeof firebase !== 'undefined') {
    return createFirestoreBackend();
  }
  return createLocalBackend();
}

function createFirestoreBackend() {
  const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(FIREBASE_CONFIG);
  const db = app.firestore();
  const col = db.collection('messages');
  return {
    mode: 'firebase',
    // ฟังข้อความของห้องที่ระบุ (สูงสุด 30 ห้องตามข้อจำกัดของ Firestore "in") — คืนฟังก์ชันยกเลิก
    subscribe(rooms, onChange, onError) {
      return col.where('room', 'in', rooms.slice(0, 30)).onSnapshot(
        (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
        (err) => onError && onError(err)
      );
    },
    send(room, senderId, text) {
      return col.add({ room, senderId, text, ts: Date.now() });
    },
    remove(id) {
      return col.doc(id).delete();
    },
  };
}

function createLocalBackend() {
  const KEY = 'lrchat_local_messages';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const listeners = new Set();
  const emit = () => listeners.forEach((fn) => fn());
  // แท็บอื่นเขียน localStorage → เหตุการณ์ storage ทำให้แท็บนี้อัปเดตด้วย
  window.addEventListener('storage', (e) => { if (e.key === KEY) emit(); });
  const write = (list) => { localStorage.setItem(KEY, JSON.stringify(list)); emit(); };
  let seq = 0;
  return {
    mode: 'local',
    subscribe(rooms, onChange) {
      const fn = () => onChange(read().filter((m) => rooms.includes(m.room)));
      listeners.add(fn);
      fn();
      return () => listeners.delete(fn);
    },
    async send(room, senderId, text) {
      write([...read(), { id: `m-${Date.now()}-${seq++}`, room, senderId, text, ts: Date.now() }]);
    },
    async remove(id) {
      write(read().filter((m) => m.id !== id));
    },
  };
}
