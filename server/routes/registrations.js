import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register for event
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { event_id } = req.body;
    const user_id = req.user.id;

    // Check if already registered
    const [existing] = await db.execute(
      'SELECT * FROM registrations WHERE user_id = ? AND event_id = ?',
      [user_id, event_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check event capacity
    const [event] = await db.execute(
      'SELECT capacity FROM events WHERE id = ? AND status = "active"',
      [event_id]
    );

    if (event.length === 0) {
      return res.status(404).json({ message: 'Event not found or inactive' });
    }

    const [regCount] = await db.execute(
      'SELECT COUNT(*) as count FROM registrations WHERE event_id = ?',
      [event_id]
    );

    if (regCount[0].count >= event[0].capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Register user
    await db.execute(
      'INSERT INTO registrations (user_id, event_id) VALUES (?, ?)',
      [user_id, event_id]
    );

    res.status(201).json({ message: 'Successfully registered for event' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user registrations
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const [registrations] = await db.execute(`
      SELECT e.*, r.created_at as registered_at
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.user_id = ?
      ORDER BY e.date ASC
    `, [req.user.id]);

    res.json(registrations);
  } catch (error) {
    console.error('Get user registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event participants (Organizer/Admin)
router.get('/event/:eventId', authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // Check if user is organizer of this event or admin
    if (req.user.role !== 'Admin') {
      const [event] = await db.execute('SELECT organizer_id FROM events WHERE id = ?', [eventId]);
      if (event.length === 0 || event[0].organizer_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    const [participants] = await db.execute(`
      SELECT u.id, u.name, u.email, r.created_at as registered_at
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      WHERE r.event_id = ?
      ORDER BY r.created_at DESC
    `, [eventId]);

    res.json(participants);
  } catch (error) {
    console.error('Get event participants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;