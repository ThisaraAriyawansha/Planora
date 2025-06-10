import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import nodemailer from 'nodemailer'; // Import Nodemailer

const router = express.Router();

// Configure Nodemailer transporter with Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fueltrixteam@gmail.com', // Provided Gmail address
    pass: 'eqnd bkeo iwqk egmh', // Provided app password
  },
});

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

    // Check event capacity and fetch event details
    const [event] = await db.execute(
      'SELECT id, title, date, location, capacity FROM events WHERE id = ? AND status = "active"',
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

    // Fetch user's email
    const [user] = await db.execute('SELECT email, name FROM users WHERE id = ?', [user_id]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Register user
    await db.execute(
      'INSERT INTO registrations (user_id, event_id) VALUES (?, ?)',
      [user_id, event_id]
    );

    // Prepare email content with modern CSS design
    const mailOptions = {
      from: '"Planora Team" <fueltrixteam@gmail.com>',
      to: user[0].email,
      subject: `Registration Confirmation for ${event[0].title}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Event Registration Confirmation</title>
        </head>
        <body style="margin: 0; padding: 20px; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <tr>
              <td style="padding: 20px;">
                <!-- Header -->
                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                  <tr>
                    <td style="text-align: center; padding-bottom: 20px;">
                      <h1 style="font-size: 24px; color: #333333; margin: 0;">Registration Confirmed!</h1>
                      <p style="font-size: 16px; color: #666666; margin: 8px 0 0;">Thank you for registering with Planora</p>
                    </td>
                  </tr>
                </table>
                <!-- Event Details -->
                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f9f9f9; border-radius: 6px; padding: 15px;">
                  <tr>
                    <td>
                      <h2 style="font-size: 18px; color: #333333; margin: 0 0 15px 0;">Event Details</h2>
                      <p style="font-size: 14px; color: #555555; margin: 8px 0;"><strong>Event Name:</strong> ${event[0].title}</p>
                      <p style="font-size: 14px; color: #555555; margin: 8px 0;"><strong>Date:</strong> ${new Date(event[0].date).toLocaleString()}</p>
                      <p style="font-size: 14px; color: #555555; margin: 8px 0;"><strong>Location:</strong> ${event[0].location || 'TBD'}</p>
                    </td>
                  </tr>
                </table>
                <!-- Message -->
                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; padding: 20px 0;">
                  <tr>
                    <td>
                      <p style="font-size: 16px; color: #666666; margin: 0 0 10px;">Dear ${user[0].name},</p>
                      <p style="font-size: 16px; color: #666666; margin: 0;">We're excited to have you join us for this event! You'll receive further updates as the event date approaches.</p>
                    </td>
                  </tr>
                </table>
                <!-- CTA Button -->
                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; text-align: center; padding: 10px 0;">
                  <tr>
                    <td>
                      <a href="#" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 16px; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Event Details</a>
                    </td>
                  </tr>
                </table>
                <!-- Footer -->
                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-top: 1px solid #e5e5e5; padding-top: 20px; margin-top: 20px;">
                  <tr>
                    <td style="text-align: center;">
                      <p style="font-size: 14px; color: #999999; margin: 0;">Best regards,<br>Planora Team</p>
                      <p style="font-size: 12px; color: #cccccc; margin: 8px 0 0;">© 2025 Planora. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Successfully registered for event and confirmation email sent' });
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