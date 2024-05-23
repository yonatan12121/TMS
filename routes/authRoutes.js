const express = require('express');
const { register, login, forgotPassword, resetPassword, verify, getProfile } = require('../controllers/authController');
const protect = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user and send a verification email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful, please check your email for verification link.
 *       400:
 *         description: User already exists.
 *       500:
 *         description: Server error.
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/verify/{token}:
 *   get:
 *     summary: Verify user email
 *     description: Verify the email of a user using the verification token.
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Verification token
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *       400:
 *         description: Invalid or expired token.
 *       500:
 *         description: Server error.
 */
router.get('/verify/:token', verify);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "yonatan122@gmail.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid credentials or unverified email
 *       500:
 *         description: Server error
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved profile information
 *       '401':
 *         description: Unauthorized, token not provided or invalid
 *       '500':
 *         description: Internal server error
 */

router.get('/profile', protect, getProfile);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Generate a password reset token and send it to the user's email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset link sent to your email.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Reset the user's password using the reset token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful.
 *       400:
 *         description: Invalid or expired reset token.
 *       500:
 *         description: Server error.
 */
router.post('/reset-password', resetPassword);

router.get('/reset-password', (req, res) => {
    const token = req.query.token;
    res.send(`
        <form id="resetPasswordForm" action="/api/auth/reset-password" method="POST">
            <input type="hidden" id="tokenInput" name="token" value="${token}" />
            <label for="newPassword">New Password:</label>
            <input type="password" id="newPassword" name="newPassword" required />
            <button type="submit">Reset Password</button>
        </form>
        <script>
            // Use JavaScript to submit the form with the token in a secure manner
            document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent default form submission
                
                const token = document.getElementById('tokenInput').value;
                const newPassword = document.getElementById('newPassword').value;
                
                // Example AJAX (using fetch) to send data securely
                fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token, newPassword }),
                })
                .then(response => {
                    if (response.status === 200) {
                        alert('Password reset successful!');
                    } else {
                        alert('Failed to reset password. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again later.');
                });
            });
        </script>
    `);
});





module.exports = router;
