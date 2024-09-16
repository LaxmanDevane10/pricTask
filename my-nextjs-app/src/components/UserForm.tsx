import { useState, useEffect } from 'react';

interface UserFormProps {
  onSubmit: (user: { name: string; email: string; age: number }) => void;
  initialData?: { name: string; email: string; age: number };
}

const UserForm = ({ onSubmit, initialData }: UserFormProps) => {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [age, setAge] = useState(initialData?.age || 0);

  // Update form fields when initialData (editingUser) changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setAge(initialData.age);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && age > 0) {
      onSubmit({ name, email, age });
      setName('');
      setEmail('');
      setAge(0);
    } else {
      alert('Please fill out all fields');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mb-6 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">{initialData ? 'Edit User' : 'Create User'}</h2>
      
      <div className="flex flex-col mb-6"> {/* Add margin-bottom here */}
        <label className="mb-2 font-semibold text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter Name"
          required
        />
      </div>
      
      <div className="flex flex-col mb-6"> {/* Add margin-bottom here */}
        <label className="mb-2 font-semibold text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter Email"
          required
        />
      </div>
      
      <div className="flex flex-col mb-6"> {/* Add margin-bottom here */}
        <label className="mb-2 font-semibold text-gray-700">Age</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter Age"
          required
        />
      </div>
      
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
      >
        {initialData ? 'Update' : 'Create'}
      </button>
    </form>
  );
};

export default UserForm;
