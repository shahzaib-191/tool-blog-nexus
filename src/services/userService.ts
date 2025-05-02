
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

// Mock data
let users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    isAdmin: true,
    createdAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@example.com",
    isAdmin: false,
    createdAt: "2025-02-01T00:00:00Z"
  },
  {
    id: "3",
    name: "John Doe",
    email: "john@example.com",
    isAdmin: false,
    createdAt: "2025-03-01T00:00:00Z"
  },
  {
    id: "4",
    name: "Jane Smith",
    email: "jane@example.com",
    isAdmin: false,
    createdAt: "2025-03-15T00:00:00Z"
  },
];

// Get all users
export const getAllUsers = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...users]), 500);
  });
};

// Get user by id
export const getUserById = (id: string): Promise<User | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(users.find(user => user.id === id));
    }, 500);
  });
};

// Create user
export const createUser = (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: User = {
        ...user,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      resolve(newUser);
    }, 500);
  });
};

// Update user
export const updateUser = (id: string, updates: Partial<User>): Promise<User | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        resolve(users[userIndex]);
      } else {
        resolve(undefined);
      }
    }, 500);
  });
};

// Delete user
export const deleteUser = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = users.length;
      users = users.filter(user => user.id !== id);
      resolve(users.length < initialLength);
    }, 500);
  });
};
