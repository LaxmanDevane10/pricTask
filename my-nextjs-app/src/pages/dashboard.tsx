import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

const API_URL = 'http://localhost:5001/nextjs-backend-app/us-central1';

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/getUsers`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto shadow-lg rounded-lg bg-white p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">User Dashboard</h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="border px-6 py-4 text-left font-semibold">Name</th>
                <th className="border px-6 py-4 text-left font-semibold">Email</th>
                <th className="border px-6 py-4 text-left font-semibold">Age</th>
                <th className="border px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="bg-white hover:bg-gray-100 transition-all duration-200">
                  <td className="border px-6 py-4">{user.name}</td>
                  <td className="border px-6 py-4">{user.email}</td>
                  <td className="border px-6 py-4">{user.age} years old</td>
                  <td className="border px-6 py-4">
                    <button className="text-blue-600 hover:underline mr-4">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
