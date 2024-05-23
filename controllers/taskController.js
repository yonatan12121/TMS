const Task = require('../models/Task');
const Category = require('../models/Category');
const Comment = require('../models/Comment');

// Create a new task
exports.createTask = async (req, res) => {
    const { title, description, dueDate, priority, assignedTo, category } = req.body;
    const createdBy = req.user._id;

    try {
        const task = new Task({
            title,
            description,
            dueDate,
            priority,
            assignedTo,
            category,
            createdBy
        });

        await task.save();

        // Create and save a notification for the assigned user
        const notification = new Notification({
            type: 'TaskAssigned',
            user: assignedTo,
            task: task._id
        });
        await notification.save();

        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get tasks created by the logged-in user
exports.getTasks = async (req, res) => {
    const createdBy = req.user._id;

    try {
        const tasks = await Task.find({ createdBy }).populate('assignedTo category comments');
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a task

exports.updateTask = async (req, res) => {
    const { taskId } = req.params;
    const updates = req.body;
    const createdBy = req.user._id;
    console.log(updates, taskId, createdBy);

    try {
        // Find the task and update it
        const task = await Task.findOneAndUpdate(
            { _id: taskId, createdBy },
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('assignedTo category comments');

        // If the task is not found, return 404
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Create and save notification to task creator
        const notification = new Notification({
            type: 'TaskUpdated',
            user: task.createdBy,
            task: task._id
        });
        await notification.save();

        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.markTaskCompleted = async (req, res) => {
    const { taskId } = req.params;
    const createdBy = req.user._id;

    try {
        const task = await Task.findOne({ _id: taskId, createdBy });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = 'Completed';
        await task.save();

        // Create and save notification to task creator
        const notification = new Notification({
            type: 'TaskCompleted',
            user: task.createdBy,
            task: task._id
        });
        await notification.save();

        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.markTaskForReview = async (req, res) => {
    const { taskId } = req.params;
    const createdBy = req.user._id;

    try {
        const task = await Task.findOne({ _id: taskId, createdBy });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = 'For Review';
        await task.save();

        // Create and save notification to task creator
        const notification = new Notification({
            type: 'TaskForReview',
            user: task.createdBy,
            task: task._id
        });
        await notification.save();

        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    const { taskId } = req.params;
    const createdBy = req.user._id;

    try {
        const task = await Task.findOneAndDelete({ _id: taskId, createdBy });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Assign task to a user
exports.assignTask = async (req, res) => {
    const { taskId, userId } = req.params;
    const createdBy = req.user._id;

    try {
        const task = await Task.findOneAndUpdate(
            { _id: taskId, createdBy },
            { $addToSet: { assignedTo: userId } },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Create and save a notification for the assigned user
        const notification = new Notification({
            type: 'TaskAssigned',
            user: userId,
            task: taskId
        });
        await notification.save();

        res.status(200).json(task);
    } catch (error) {
        console.error('Error assigning task:', error);
        res.status(500).json({ message: 'Server error' });
    }
};





// Filter tasks
exports.filterTasks = async (req, res) => {
    const { category, priority, dueDate, status } = req.query;
    const createdBy = req.user._id;
    const filter = { createdBy };

    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };
    if (status) filter.status = status;

    try {
        const tasks = await Task.find(filter).populate('assignedTo category comments');
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a comment to a task
exports.addComment = async (req, res) => {
    const { taskId } = req.params;
    const { content } = req.body;
    const createdBy = req.user._id;
console.log(content);
    try {
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Ensure content is not empty
        if (!content) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        const comment = new Comment({
            text: content,
            createdBy,
            task: taskId
        });

        await comment.save();

        task.comments.push(comment._id);
        await task.save();

        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const Notification = require('../models/notification');
const { sendReportEmail } = require('../utils/email');

// Controller function to send notifications
exports.sendNotification = async (type, userId, taskId) => {
    try {
        const notification = new Notification({
            type,
            user: userId,
            task: taskId
        });

        await notification.save();
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

// Controller function to share a task with another user
exports.shareTask = async (req, res) => {
    try {
        const { taskId, userId } = req.params;

        const task = await Task.findByIdAndUpdate(
            taskId,
            { $addToSet: { assignedTo: userId } },
            { new: true }
        );

        res.status(200).json({ message: 'Task shared successfully', task });
    } catch (error) {
        console.error('Error sharing task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Controller function to generate a report

exports.generateReport = async (req, res) => {
    try {
        const createdBy = req.user._id;

        // Query tasks where the current user is either the creator or assigned to
        const tasks = await Task.find({
            $or: [
                { createdBy },
                { assignedTo: req.user._id }
            ]
        });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'Completed').length;
        const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
        const forReviewTasks = tasks.filter(task => task.status === 'For Review').length;

        const overdueTasks = tasks.filter(task => {
            return task.status === 'Pending' && task.dueDate < new Date();
        }).length;

        // Calculate completion rate
        const completionRate = (completedTasks / totalTasks) * 100;

        const reportData = {
            totalTasks,
            completedTasks,
            pendingTasks,
            forReviewTasks,
            completionRate,
            overdueTasks
            // Add more metrics as needed
        };

        // Check if the user wants to send the report via email
        if (req.query.sendEmail === 'true') {
            await sendReportEmail(req.user.email, reportData); // Assuming req.user.email contains user's email
            res.status(200).json({ message: 'Report sent via email', reportData });
        } else {
            res.status(200).json({ reportData });
        }
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


