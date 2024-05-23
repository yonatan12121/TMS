const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const  protect  = require('../middleware/auth'); // Assuming you have an auth middleware

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Notification ID
 *         type:
 *           type: string
 *           enum: ['TaskAssigned', 'TaskUpdated', 'TaskCompleted', 'TaskForReview']
 *           description: Type of notification
 *         user:
 *           type: string
 *           description: User ID
 *         task:
 *           type: string
 *           description: Task ID
 *         read:
 *           type: boolean
 *           description: Read status of the notification
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Notification creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Notification update timestamp
 */

/**
 * @swagger
 * /api/notification:
 *   get:
 *     summary: Get all notifications for a user
 *     description: Retrieve all notifications for the logged-in user.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Server error
 */
router.get('/', protect, getNotifications);

/**
 * @swagger
 * /api/notification/{id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     description: Mark a specific notification as read by its ID.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/read', protect, markAsRead);

module.exports = router;