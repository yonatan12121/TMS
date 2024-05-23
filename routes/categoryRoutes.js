const express = require('express');
const router = express.Router();
const { createCategory, updateCategory, deleteCategory } = require('../controllers/category');
const protect = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - createdBy
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the category
 *         name:
 *           type: string
 *           description: The name of the category
 *         description:
 *           type: string
 *           description: A brief description of the category
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created the category
 *         tasks:
 *           type: array
 *           items:
 *             type: string
 *           description: List of tasks associated with the category
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the category was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the category was last updated
 *       example:
 *         id: "60c72b2f9b1e8e6b4c8a5e3b"
 *         name: "Work"
 *         description: "Tasks related to work"
 *         createdBy: "60c72b2f9b1e8e6b4c8a5e3a"
 *         tasks: ["60c72b2f9b1e8e6b4c8a5e3c"]
 *         createdAt: "2023-05-20T07:34:00.000Z"
 *         updatedAt: "2023-05-20T07:34:00.000Z"
 */

/**
 * @swagger
 * /api/catagory/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - createdBy
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Work"
 *               description:
 *                 type: string
 *                 example: "Work related tasks"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Category with this name already exists
 *       500:
 *         description: Server error
 */
router.post('/categories', protect, createCategory);

/**
 * @swagger
 * /api/catagory/categories/{categoryId}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Personal"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.put('/categories/:categoryId', protect, updateCategory);

/**
 * @swagger
 * /api/catagory/categories/{categoryId}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.delete('/categories/:categoryId', protect, deleteCategory);

module.exports = router;
