const express = require('express');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    assignTask,
    markTaskCompleted,
    markTaskForReview,
    filterTasks,
    addComment,
    generateReport,
    shareTask,
    sendNotification
} = require('../controllers/taskController');
const protect = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - createdBy
 *       properties:
 *         title:
 *           type: string
 *           description: The task title
 *         description:
 *           type: string
 *           description: The task description
 *         dueDate:
 *           type: string
 *           format: date
 *           description: The task due date
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *           default: Medium
 *           description: The task priority
 *         status:
 *           type: string
 *           enum: [Pending, Completed, For Review]
 *           default: Pending
 *           description: The task status
 *         assignedTo:
 *           type: string
 *           description: The user ID the task is assigned to
 *         createdBy:
 *           type: string
 *           description: The user ID who created the task
 *         category:
 *           type: string
 *           description: The category ID of the task
 *         comments:
 *           type: array
 *           items:
 *             type: string
 *           description: List of comment IDs related to the task
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *     InternalServerError:
 *       description: Internal server error
 */

/**
 * @swagger
 * /api/task:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/task:
 *   get:
 *     summary: Get tasks created by the logged-in user
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/task/reports:
 *   get:
 *     summary: Generate a report based on user tasks.
 *     description: Generate a report containing metrics such as total tasks, completion rate, pending tasks, etc. Optionally send the report via email.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: query
 *         name: sendEmail
 *         schema:
 *           type: boolean
 *         description: Set to true if you want to send the report via email.
 *     responses:
 *       200:
 *         description: Report generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTasks:
 *                   type: integer
 *                   description: Total number of tasks.
 *                 completedTasks:
 *                   type: integer
 *                   description: Number of completed tasks.
 *                 pendingTasks:
 *                   type: integer
 *                   description: Number of pending tasks.
 *                 forReviewTasks:
 *                   type: integer
 *                   description: Number of tasks for review.
 *                 completionRate:
 *                   type: number
 *                   format: float
 *                   description: Completion rate as a percentage.
 *                 overdueTasks:
 *                   type: integer
 *                   description: Number of overdue tasks.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

router.get('/reports', protect, generateReport);

/**
 * @swagger
 * /api/task/tasks/{taskId}/comments:
 *   post:
 *     summary: Add a comment to a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is a comment"
 *     responses:
 *       201:
 *         description: The comment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Task not found
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/tasks/:taskId/comments', protect, addComment);

/**
 * @swagger
 * /api/task/tasks/{taskId}/notifications:
 *   post:
 *     summary: Send a notification for a task.
 *     description: Send a notification to relevant users when a task is assigned, updated, or completed.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: ID of the task to send the notification for.
 *     responses:
 *       200:
 *         description: Notification sent successfully.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/tasks/:taskId/notifications', protect, sendNotification);

/**
 * @swagger
 * /api/task/tasks/{taskId}/share/{userId}:
 *   put:
 *     summary: Share a task with another user.
 *     description: Share a task or project with another user for collaboration.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: ID of the task to share.
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: ID of the user to share the task with.
 *     responses:
 *       200:
 *         description: Task shared successfully.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @swagger
 * /api/task/tasks/{taskId}/assign/{userId}:
 *   put:
 *     summary: Assign a task to a user
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to assign
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to whom the task will be assigned
 *     responses:
 *       200:
 *         description: Task assigned successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.put('/tasks/:taskId/assign/:userId', protect, assignTask);

/**
 * @swagger
 * /api/task/tasks/{taskId}/complete:
 *   post:
 *     summary: Mark a task as completed
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to mark as completed
 *     responses:
 *       200:
 *         description: Task marked as completed successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/task/tasks/{taskId}/review:
 *   post:
 *     summary: Mark a task for review
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to mark for review
 *     responses:
 *       200:
 *         description: Task marked for review successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/task/filter:
 *   get:
 *     summary: Filter tasks
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: the Id of the catagory not the name 
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Filter tasks by priority
 *       - in: query
 *         name: dueDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tasks by due date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter tasks by status
 *     responses:
 *       200:
 *         description: Filtered tasks retrieved successfully
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/task/tasks/{taskId}/update:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               assignedTo:
 *                 type: string
 *                 description: The ID of the user to whom the task will be assigned
 *               category:
 *                 type: string
 *                 description: The ID of the category to which the task belongs
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */


router.put('/tasks/:taskId/share/:userId', protect, shareTask);

router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.put('/tasks/:taskId/update', protect, updateTask);
router.delete('/:taskId', protect, deleteTask);
router.post('/:taskId/assign', protect, assignTask);
router.post('/tasks/:taskId/complete', protect, markTaskCompleted);
router.post('/tasks/:taskId/review', protect, markTaskForReview);
router.get('/filter', protect, filterTasks);
router.post('/:taskId/comments', protect, addComment);

module.exports = router;
