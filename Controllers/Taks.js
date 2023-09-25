
const Task = require("../Models/Tasks")

exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body

        // Check if title or description is missing
        if (!title || !description)
            return res.status(400).json({
                success: false,
                message: "Fill all fields"
            });
        // Create a new task with the provided title, description, and user
        const task = new Task({ title, description, user: req.user })

        // Save the task to the database
        await task.save()

        return res.status(200).json({ success: true })
    } catch (error) {
        console.error("Error during OTP verification:", error);
        return res.status(500).json({
            success: false, message:
                "Internal server error"
        });
    }
}

exports.getTask = async (req, res) => {
    try {
        const student = req.user._id;

        // Find tasks for the given student
        const studentask = await Task.find({ user: student });

        // Check if studentask are found
        if (studentask.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({ success: false, message: studentask });
    } catch (error) {
        console.error("Error during OTP verification:", error);
        return res.status(500).json({
            success: false, message:
                "Internal server error"
        });
    }
};

exports.updateTask = async (req, res) => {
    try {
        // Get user ID from request parameters
        const { id } = req.params;

        // Check if user is logged in
        if (!req.user) return res.status(404).json({
            success: false,
            message: "Not Found"
        });
        // Find user by ID
        const student = await Task.findById(id);

        // Check if student exists
        if (!student) return res.status(400).json({
            success: false,
            message: "Unautherized"
        });
        // Save updated student to database
        student.isCompleted = !student.isCompleted
        await student.save();

        return res.status(200).json({
            success: true,
            message: "Student updated successfully"
        });

    } catch (error) {
        console.error("Error during OTP verification:", error);
        return res.status(500).json({
            success: false, message:
                "Internal server error"
        });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        // Get student ID from request parameters
        const { id } = req.params;

        // Find student by ID
        const student = await Task.findById(id);

        // Check if student exists
        if (!student) return res.status(400).json({
            success: false,
            message: "Unautherized"
        });
        // Delete student from database
        await student.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {
        console.error("Error during OTP verification:", error);
        return res.status(500).json({
            success: false, message:
                "Internal server error"
        });
    }
};