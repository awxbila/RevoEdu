export type MockUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
};

const users: MockUser[] = [
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

export function findUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  const found = users.find((u) => u.email === normalized);
  console.log(
    `[DEBUG] findUserByEmail("${normalized}"): ${found ? "found" : "not found"}`
  );
  return found;
}

export function addUser(data: Omit<MockUser, "id">) {
  const nextId = (users[users.length - 1]?.id || 0) + 1;
  const newUser: MockUser = {
    id: nextId,
    ...data,
    email: data.email.trim().toLowerCase(),
  };
  users.push(newUser);
  console.log(
    `[DEBUG] addUser: created user #${nextId} with email ${newUser.email}`
  );
  console.log(`[DEBUG] Total users now: ${users.length}`);
  return newUser;
}

export function getUserById(id: number) {
  return users.find((u) => u.id === id);
}

export function listUsers() {
  return users;
}
