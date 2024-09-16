import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Enable CORS
const corsHandler = cors({ origin: true });

export const createUser = onRequest(async (req, res) => {
  try {
    const { name, email, age } = req.body;

    // Ensure that all required fields are provided
    if (!name || !email || age === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const newUser = { name, email, age };
    const userRef = await db.collection('users').add(newUser);

    // Return the user data along with the ID in the response
    res.status(200).json({ id: userRef.id, ...newUser, message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user', details: error });
  }
});



// Read Users
export const getUsers = onRequest(async (req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const snapshot = await db.collection('users').get();
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to get users', details: error });
    }
  });
});

// Update User
export const updateUser = onRequest(async (req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== 'PATCH') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const id = req.path.split('/').pop();
      const { name, email, age } = req.body;

      // Ensure ID and fields are provided
      if (!id) {
        return res.status(400).json({ error: 'Document ID is missing' });
      }
      if (!name || !email || !age) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await db.collection('users').doc(id).update({ name, email, age });
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user', details: error });
    }
  });
});

// Delete User
export const deleteUser = onRequest(async (req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const id = req.path.split('/').pop();

      if (!id) {
        return res.status(400).json({ error: 'Document ID is missing' });
      }

      await db.collection('users').doc(id).delete();
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user', details: error });
    }
  });
});
