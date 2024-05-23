const Category = require('../models/Category');

// Create a new category
exports.createCategory = async (req, res) => {
    const { name, description, tasks } = req.body;
    const createdBy = req.user._id;

    try {
        // Check if a category with the same name already exists for the user
        const existingCategory = await Category.findOne({ name, createdBy });

        if (existingCategory) {
            return res.status(400).json({ message: 'Category with this name already exists' });
        }

        const category = new Category({ name, description, createdBy, tasks });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Update a category
exports.updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.body;
    const createdBy = req.user._id;

    try {
        const category = await Category.findOneAndUpdate(
            { _id: categoryId, createdBy },
            { name },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    const { categoryId } = req.params;
    const createdBy = req.user._id;

    try {
        const category = await Category.findOneAndDelete({ _id: categoryId, createdBy });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
