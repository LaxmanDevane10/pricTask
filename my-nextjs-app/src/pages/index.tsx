import { useEffect, useState } from 'react';
import UserForm from '../components/UserForm';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

const API_URL = 'http://localhost:5001/nextjs-backend-app/us-central1';

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/getUsers`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleCreate = async (user: { name: string; email: string; age: number }) => {
    try {
      const response = await fetch(`${API_URL}/createUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const createdUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, createdUser]);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdate = async (user: { name: string; email: string; age: number }) => {
    if (!editingUser) return;
    try {
      const response = await fetch(`${API_URL}/updateUser/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      setUsers(users.map(u => (u.id === editingUser.id ? { ...u, ...user } : u)));
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/deleteUser/${id}`, { method: 'DELETE' });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto shadow-lg rounded-lg bg-white p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">User Dashboard</h1>

        <UserForm
          onSubmit={editingUser ? handleUpdate : handleCreate}
          initialData={editingUser ? { name: editingUser.name, email: editingUser.email, age: editingUser.age } : undefined}
        />

        <div className="mt-8">
  <h2 className="text-xl font-semibold mb-4">User List</h2>
  <ul className="list-none space-y-4">
    {users.map(user => (
      <li key={user.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-md">
        <div>
          (<span className="font-semibold">{user.name}</span> - {user.age} years old - {user.email})
        </div>
        <div className="space-x-4"> {/* This adds horizontal space between buttons */}
          <button
            onClick={() => setEditingUser(user)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(user.id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </li>
    ))}
  </ul>
</div>

      </div>
    </div>
  );
};

export default Home;
