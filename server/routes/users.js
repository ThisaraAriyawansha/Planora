import express from 'express';
import db from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
const bcrypt = require('bcrypt'); // Assuming db and authenticateToken are defined elsewhere
// Get current user's profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, name, email, role, status, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get all users (Admin only)
router.get('/', authenticateToken, requireRole(['Admin']), async (req, res) => {
  try {
    const [users] = await db.execute('SELECT id, email, name, role, status, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user status (Admin only)
router.put('/:id/status', authenticateToken, requireRole(['Admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;

    await db.execute('UPDATE users SET status = ? WHERE id = ?', [status, userId]);
    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get organizers (Admin only)
router.get('/organizers', authenticateToken, requireRole(['Admin']), async (req, res) => {
  try {
    const [organizers] = await db.execute(
      'SELECT id, name, email, status FROM users WHERE role = "Organizer" ORDER BY name ASC'
    );
    res.json(organizers);
  } catch (error) {
    console.error('Get organizers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, currentPassword, newPassword } = req.body;
    const userId = req.user.id; // From auth token

    // Verify the user is updating their own profile
    if (parseInt(id) !== userId) {
      return res.status(403).json({ message: 'You can only update your own profile' });
    }

    // Get the current user data
    const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    let hashedPassword = user.password;

    // If changing password, validate current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required' });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // Check if email is being changed to one that exists
    if (email && email !== user.email) {
      const [existing] = await db.execute('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
      if (existing.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update the user
    const [result] = await db.execute(
      'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
      [name || user.name, email || user.email, hashedPassword, id]
    );

    // Get updated user data
    const [updatedUsers] = await db.execute(
      'SELECT id, name, email, role, status FROM users WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Profile updated successfully',
      user: updatedUsers[0]
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});


export default router;