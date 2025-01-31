import fs from 'fs/promises';
import path from 'path';

const DB_FILE = 'users.json';

// Initialize database
async function initDB() {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify({ users: {} }));
  }
}

async function readDB() {
  const data = await fs.readFile(DB_FILE, 'utf8');
  return JSON.parse(data);
}

async function writeDB(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

export async function getUserSearches(userId) {
  await initDB();
  const db = await readDB();
  return db.users[userId] || { searches: 0, isPremium: false, remainingSearches: 5 };
}

export async function incrementUserSearches(userId) {
  await initDB();
  const db = await readDB();
  
  if (!db.users[userId]) {
    db.users[userId] = { searches: 0, isPremium: false, remainingSearches: 5 };
  }
  
  db.users[userId].searches += 1;
  db.users[userId].remainingSearches -= 1;
  
  await writeDB(db);
  return db.users[userId];
}

export async function addPremiumUser(userId, searches = 50) {
  await initDB();
  const db = await readDB();
  
  db.users[userId] = {
    searches: 0,
    isPremium: true,
    remainingSearches: searches
  };
  
  await writeDB(db);
  return db.users[userId];
}

export async function removePremiumUser(userId) {
  await initDB();
  const db = await readDB();
  
  if (db.users[userId]) {
    db.users[userId].isPremium = false;
    db.users[userId].remainingSearches = 0;
  }
  
  await writeDB(db);
}