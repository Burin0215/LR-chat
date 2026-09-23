# LR-chat

ตัวลองของ Love Roulette ที่มีห้องแชท (ห้องรวม + แชทส่วนตัว) แยกจาก repo [LR](https://github.com/Burin0215/LR)
ข้อมูลในเบราว์เซอร์ใช้ชื่อแยก (`lrchat_*`) จึงไม่ปนกับ LR ตัวจริง

## โหมดแชท

- **โหมดทดลอง** (ค่าเริ่มต้น, `firebase-config.js` = `null`): ข้อความเก็บในเบราว์เซอร์ คุยได้ระหว่างแท็บในเครื่องเดียวกัน
- **Firebase**: ใส่ค่าใน `firebase-config.js` แล้วคุยข้ามเครื่องได้จริง

## ตั้งค่า Firebase

1. เข้า https://console.firebase.google.com แล้วกด **Add project** (ปิด Google Analytics ได้)
2. เมนู **Build > Firestore Database** → **Create database** → เลือก location (เช่น `asia-southeast1`) → **Start in production mode**
3. แท็บ **Rules** → วางเนื้อหาไฟล์ `firestore.rules` → **Publish**
4. **Project settings** (รูปเฟือง) → **Your apps** → ไอคอน `</>` (Web) → ตั้งชื่อ → **Register app**
5. คัดลอกค่า `firebaseConfig` มาใส่ใน `firebase-config.js` แทน `null`

## ข้อจำกัดของตัวลอง

- PIN ตรวจในเบราว์เซอร์ ไม่ได้ใช้ระบบ login ของ Firebase ผู้ที่มีความรู้ทางเทคนิคจึงส่งข้อความในนามคนอื่น หรืออ่านแชทส่วนตัวได้
- คลัง/ดอกกุหลาบ/เหรียญ ยังเก็บในเบราว์เซอร์ของแต่ละเครื่องเหมือน LR
