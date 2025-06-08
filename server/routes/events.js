import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Get all events
router.get('/', async (req, res) => {
  try {
    const [events] = await db.execute(`
      SELECT e.*, u.name as organizer_name 
      FROM events e 
      LEFT JOIN users u ON e.organizer_id = u.id 
      WHERE e.status = 'active'
      ORDER BY e.date ASC
    `);

    // Get images for each event
    for (let event of events) {
      const [images] = await db.execute('SELECT image_url FROM event_images WHERE event_id = ?', [event.id]);
      event.images = images.map((img) => img.image_url);
    }

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all events for admin
router.get('/admin', async (req, res) => {
  try {
    const [events] = await db.execute(`
      SELECT e.*, u.name as organizer_name 
      FROM events e 
      LEFT JOIN users u ON e.organizer_id = u.id 
      ORDER BY e.date ASC
    `);

    // Get images for each event
    for (let event of events) {
      const [images] = await db.execute('SELECT image_url FROM event_images WHERE event_id = ?', [event.id]);
      event.images = images.map((img) => img.image_url);
    }

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const [events] = await db.execute(
      `
      SELECT e.*, u.name as organizer_name 
      FROM events e 
      LEFT JOIN users u ON e.organizer_id = u.id 
      WHERE e.id = ?
    `,
      [req.params.id]
    );

    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = events[0];

    // Get images
    const [images] = await db.execute('SELECT image_url FROM event_images WHERE event_id = ?', [event.id]);
    event.images = images.map((img) => img.image_url);

    // Get registration count
    const [regCount] = await db.execute('SELECT COUNT(*) as count FROM registrations WHERE event_id = ?', [
      event.id,
    ]);
    event.registrations_count = regCount[0].count;

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create event (Organizer/Admin only)
router.post(
  '/',
  authenticateToken,
  requireRole(['Admin', 'Organizer']),
  upload.fields([
    { name: 'main_image', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { title, date, time, location, description, capacity, category } = req.body;
      const files = req.files;
      const main_image = files.main_image ? `/uploads/${files.main_image[0].filename}` : null;
      const additionalImages = files.images ? files.images.map((file) => `/uploads/${file.filename}`) : [];
      const organizer_id = req.user.role === 'Admin' ? req.body.organizer_id || req.user.id : req.user.id;

      const [result] = await db.execute(
        'INSERT INTO events (title, date, time, location, description, capacity, main_image, category, organizer_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [title, date, time, location, description, capacity, main_image, category, organizer_id, 'active']
      );

      const eventId = result.insertId;

      // Save additional images to event_images table
      for (const imageUrl of additionalImages) {
        await db.execute('INSERT INTO event_images (event_id, image_url) VALUES (?, ?)', [eventId, imageUrl]);
      }

      res.status(201).json({ message: 'Event created successfully', eventId });
    } catch (error) {
      console.error('Create event error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update event (Organizer/Admin only)
router.put(
  '/:id',
  authenticateToken,
  requireRole(['Admin', 'Organizer']),
  upload.fields([
    { name: 'main_image', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const eventId = req.params.id;
      const { title, date, time, location, description, capacity, category, status, imagesToDelete } = req.body;
      const files = req.files;

      // Parse imagesToDelete as an array
      const imagesToDeleteArray = imagesToDelete
        ? Array.isArray(imagesToDelete)
          ? imagesToDelete
          : [imagesToDelete]
        : [];

      // Check if user owns the event (unless admin)
      if (req.user.role !== 'Admin') {
        const [events] = await db.execute('SELECT organizer_id FROM events WHERE id = ?', [eventId]);
        if (events.length === 0 || events[0].organizer_id !== req.user.id) {
          return res.status(403).json({ message: 'Not authorized to update this event' });
        }
      }

      // Delete specified images
      for (const imageUrl of imagesToDeleteArray) {
        const imagePath = path.join(__dirname, '..', imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Delete image file
        }
        await db.execute('DELETE FROM event_images WHERE event_id = ? AND image_url = ?', [eventId, imageUrl]);
      }

      let updateQuery = 'UPDATE events SET title = ?, date = ?, time = ?, location = ?, description = ?, capacity = ?, category = ?';
      let updateValues = [title, date, time, location, description, capacity, category];

      if (files.main_image) {
        // Delete old main image if it exists
        const [event] = await db.execute('SELECT main_image FROM events WHERE id = ?', [eventId]);
        if (event[0]?.main_image) {
          const oldMainImagePath = path.join(__dirname, '..', event[0].main_image);
          if (fs.existsSync(oldMainImagePath)) {
            fs.unlinkSync(oldMainImagePath);
          }
        }
        updateQuery += ', main_image = ?';
        updateValues.push(`/uploads/${files.main_image[0].filename}`);
      }

      if (status && req.user.role === 'Admin') {
        updateQuery += ', status = ?';
        updateValues.push(status);
      }

      updateQuery += ' WHERE id = ?';
      updateValues.push(eventId);

      await db.execute(updateQuery, updateValues);

      // Handle additional images
      if (files.images) {
        for (const image of files.images) {
          await db.execute('INSERT INTO event_images (event_id, image_url) VALUES (?, ?)', [
            eventId,
            `/uploads/${image.filename}`,
          ]);
        }
      }

      res.json({ message: 'Event updated successfully' });
    } catch (error) {
      console.error('Update event error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete event (Organizer/Admin only)
router.delete('/:id', authenticateToken, requireRole(['Admin', 'Organizer']), async (req, res) => {
  try {
    const eventId = req.params.id;

    // Check if user owns the event (unless admin)
    if (req.user.role !== 'Admin') {
      const [events] = await db.execute('SELECT organizer_id FROM events WHERE id = ?', [eventId]);
      if (events.length === 0 || events[0].organizer_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this event' });
      }
    }

    // Delete associated images from storage and database
    const [images] = await db.execute('SELECT image_url FROM event_images WHERE event_id = ?', [eventId]);
    for (const image of images) {
      const imagePath = path.join(__dirname, '..', image.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete image file
      }
    }

    // Delete from event_images table
    await db.execute('DELETE FROM event_images WHERE event_id = ?', [eventId]);

    // Delete from registrations table
    await db.execute('DELETE FROM registrations WHERE event_id = ?', [eventId]);

    // Delete main image
    const [event] = await db.execute('SELECT main_image FROM events WHERE id = ?', [eventId]);
    if (event[0]?.main_image) {
      const mainImagePath = path.join(__dirname, '..', event[0].main_image);
      if (fs.existsSync(mainImagePath)) {
        fs.unlinkSync(mainImagePath); // Delete main image file
      }
    }

    // Delete event
    await db.execute('DELETE FROM events WHERE id = ?', [eventId]);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete individual image
router.delete('/image/:eventId', authenticateToken, requireRole(['Admin', 'Organizer']), async (req, res) => {
  try {
    const { eventId } = req.params;
    const { imageUrl } = req.body;

    // Check if user owns the event (unless admin)
    if (req.user.role !== 'Admin') {
      const [events] = await db.execute('SELECT organizer_id FROM events WHERE id = ?', [eventId]);
      if (events.length === 0 || events[0].organizer_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this image' });
      }
    }

    // Delete image from storage
    const imagePath = path.join(__dirname, '..', imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete image from database
    await db.execute('DELETE FROM event_images WHERE event_id = ? AND image_url = ?', [eventId, imageUrl]);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get events by organizer
router.get('/organizer/:organizerId', authenticateToken, async (req, res) => {
  try {
    const organizerId = req.params.organizerId;

    // Check authorization
    if (req.user.role !== 'Admin' && req.user.id !== parseInt(organizerId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const [events] = await db.execute('SELECT * FROM events WHERE organizer_id = ? ORDER BY date ASC', [
      organizerId,
    ]);

    // Get images for each event
    for (let event of events) {
      const [images] = await db.execute('SELECT image_url FROM event_images WHERE event_id = ?', [event.id]);
      event.images = images.map((img) => img.image_url);
    }

    res.json(events);
  } catch (error) {
    console.error('Get organizer events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Update event status (Admin only)
router.put(
  '/:id/status',
  authenticateToken,
  requireRole(['Admin']),
  async (req, res) => {
    try {
      const eventId = req.params.id;
      const { status } = req.body;

      if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      const [result] = await db.execute(
        'UPDATE events SET status = ? WHERE id = ?',
        [status, eventId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.json({ message: 'Event status updated successfully' });
    } catch (error) {
      console.error('Update event status error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);



export default router;
