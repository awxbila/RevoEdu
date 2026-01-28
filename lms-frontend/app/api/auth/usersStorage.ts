import { promises as fs } from "fs";
import path from "path";

export type MockUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
};

const USERS_FILE = path.join(process.cwd(), "app/api/auth/users.json");

let cachedUsers: MockUser[] | null = null;

async function loadUsers(): Promise<MockUser[]> {
  if (cachedUsers) return cachedUsers;

  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    cachedUsers = JSON.parse(data) as MockUser[];
    return cachedUsers;
  } catch (err) {
    // File doesn't exist, use default users
    cachedUsers = [
      {
        id: 1,
        name: "Dr. Budi Santoso",
        email: "budi@example.com",
        password: "password123",
        role: "LECTURER",
      },
      {
        id: 2,
        name: "Prof. Adi Wijaya",
        email: "adi@example.com",
        password: "password123",
        role: "LECTURER",
      },
      {
        id: 3,
        name: "Student One",
        email: "student@example.com",
        password: "password123",
        role: "STUDENT",
      },
    ];
    return cachedUsers;
  }
}

async function saveUsers(users: MockUser[]): Promise<void> {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    cachedUsers = users;
  } catch (err) {
    console.error("[ERROR] Failed to save users:", err);
  }
}

export async function findUserByEmail(email: string) {
  const users = await loadUsers();
  const normalized = email.trim().toLowerCase();
  const found = users.find((u) => u.email === normalized);
  console.log(
    `[DEBUG] findUserByEmail("${normalized}"): ${found ? "found" : "not found"}`
  );
  return found;
}

export async function addUser(data: Omit<MockUser, "id">) {
  const users = await loadUsers();
  const nextId = (users[users.length - 1]?.id || 0) + 1;
  const newUser: MockUser = {
    id: nextId,
    ...data,
    email: data.email.trim().toLowerCase(),
  };
  users.push(newUser);
  await saveUsers(users);
  console.log(
    `[DEBUG] addUser: created user #${nextId} with email ${newUser.email}`
  );
  console.log(`[DEBUG] Total users now: ${users.length}`);
  return newUser;
}

export async function getUserById(id: number) {
  const users = await loadUsers();
  return users.find((u) => u.id === id);
}

export async function listUsers() {
  return loadUsers();
}
