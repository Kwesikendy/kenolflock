/**
 * Kenol Flock ChMS - Firestore Seed Script
 * ==========================================
 * Run this ONCE after setting up your real Firebase project to populate
 * initial church data into Firestore cloud collections.
 *
 * Usage (after setting real API keys in .env.local):
 *   node scripts/seed-firestore.js
 *
 * Or add to package.json: "seed": "node scripts/seed-firestore.js"
 */

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, setDoc, doc, getDocs } = require("firebase/firestore");

// ⚠️  FILL IN YOUR REAL FIREBASE CREDENTIALS from .env.local before running:
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "kenol-flock-prod.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "kenol-flock-prod",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "kenol-flock-prod.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// SEED DATA
// ==========================================
const seedMembers = [
  { firstName: "John", lastName: "Doe", email: "john@example.com", phone: "+233 54 100 0001", status: "Member", joinDate: "2023/01/15", createdAt: "2023/01/15" },
  { firstName: "Jane", lastName: "Smith", email: "jane@example.com", phone: "+233 54 100 0002", status: "Staff", joinDate: "2022/06/20", createdAt: "2022/06/20" },
  { firstName: "Robert", lastName: "Johnson", email: "robert@example.com", phone: "+233 54 100 0003", status: "Regular", joinDate: "2023/11/05", createdAt: "2023/11/05" },
  { firstName: "Emily", lastName: "Davis", email: "emily@example.com", phone: "+233 54 100 0004", status: "Guest", joinDate: "2024/02/10", createdAt: "2024/02/10" },
  { firstName: "Michael", lastName: "Brown", email: "michael@example.com", phone: "+233 54 100 0005", status: "Member", joinDate: "2020/09/12", createdAt: "2020/09/12" },
];

const seedDonations = [
  { reference: "TXN1719523091000", donor: "John Doe", email: "john@example.com", amount: 150, purpose: "Tithe", date: "2026/06/25", status: "Success" },
  { reference: "TXN1719523092000", donor: "Jane Smith", email: "jane@example.com", amount: 300, purpose: "Building Fund", date: "2026/06/24", status: "Success" },
  { reference: "TXN1719523093000", donor: "Robert Johnson", email: "robert@example.com", amount: 50, purpose: "Welfare", date: "2026/06/20", status: "Success" },
];

const seedEvents = [
  { title: "Sunday Miracle & Anointing Service", description: "Join Rev. Kenol for our powerful weekly worship, teaching, and impartation.", date: "2026-07-12", time: "09:00 AM", location: "Main Sanctuary & Online Stream", category: "Service", expectedAttendance: 1250, status: "Upcoming", createdAt: "2026-07-01" },
  { title: "Global Youth Impact & Empowerment", description: "Special youth convention featuring guest worship leaders, career workshops, and networking.", date: "2026-07-18", time: "04:00 PM", location: "Youth Auditorium", category: "Youth", expectedAttendance: 450, status: "Upcoming", createdAt: "2026-07-02" },
  { title: "Community Bread of Life Outreach", description: "Food distribution, medical checkups, and street evangelism across the local neighborhood.", date: "2026-07-25", time: "08:30 AM", location: "Community Center Grounds", category: "Outreach", expectedAttendance: 600, status: "Upcoming", createdAt: "2026-07-03" },
];

// ==========================================
// ADMIN USER ROLES (Firestore: userRoles/{uid})
// Set these UIDs after creating users in Firebase Console → Authentication
// ==========================================
const seedUserRoles = [
  // Replace "REPLACE_WITH_ACTUAL_FIREBASE_UID" with real UIDs from Firebase Auth console
  { uid: "REPLACE_UID_PASTOR", email: "pastor@kenolflock.org", role: "Admin", displayName: "Rev. Kenol (Senior Pastor)" },
  { uid: "REPLACE_UID_FINANCE", email: "finance@kenolflock.org", role: "Finance", displayName: "Deaconess Sarah (Financial Secretary)" },
];

async function seedCollection(collectionName, data) {
  console.log(`\n🌱 Seeding '${collectionName}' collection (${data.length} records)...`);
  const existing = await getDocs(collection(db, collectionName));
  if (!existing.empty) {
    console.log(`   ⚠️  '${collectionName}' already has ${existing.size} records — skipping to prevent duplicates.`);
    return;
  }
  for (let i = 0; i < data.length; i++) {
    const id = `seed_${collectionName}_${i + 1}`;
    await setDoc(doc(db, collectionName, id), data[i]);
    console.log(`   ✅  Written: ${id}`);
  }
  console.log(`   🎉 Seeded ${data.length} records into '${collectionName}'`);
}

async function seedUserRolesCollection(roles) {
  console.log(`\n🌱 Seeding 'userRoles' collection (${roles.length} admin accounts)...`);
  for (const roleRecord of roles) {
    if (roleRecord.uid.startsWith("REPLACE_")) {
      console.log(`   ⚠️  Skipping ${roleRecord.email} — replace the UID placeholder with the real Firebase Auth UID first.`);
      continue;
    }
    await setDoc(doc(db, "userRoles", roleRecord.uid), roleRecord);
    console.log(`   ✅  Role set for: ${roleRecord.email} → ${roleRecord.role}`);
  }
}

async function main() {
  console.log("🔥 Kenol Flock ChMS – Firestore Seed Script");
  console.log("==========================================");
  console.log(`📡 Connecting to Firebase project: ${firebaseConfig.projectId}`);

  try {
    await seedCollection("members", seedMembers);
    await seedCollection("donations", seedDonations);
    await seedCollection("events", seedEvents);
    await seedUserRolesCollection(seedUserRoles);

    console.log("\n\n🏆 All collections seeded successfully!");
    console.log("🔗 Open your Firebase console to verify: https://console.firebase.google.com/project/" + firebaseConfig.projectId + "/firestore");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seed script failed:", error);
    process.exit(1);
  }
}

main();
