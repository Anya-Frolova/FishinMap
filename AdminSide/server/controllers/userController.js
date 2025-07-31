const mongoose = require('mongoose');
const User = require('../models/user');
const TestUser = mongoose.connection.useDb('test').model('User', User.schema);

const getAllUsers = async (req, res) => {
    try {
        console.log("📥 GET /api/users called");
        const users = await User.find();
        console.log("✅ Users found:", users.length);
        res.status(200).json(users);
    } catch (error) {
        console.error("❌ Error in getAllUsers:", error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.role !== 'Admin') {
            return res.status(403).json({ message: 'Access denied: Not an admin' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                role: user.role,
                rank: user.rank
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
};

const getUsersWithRank4 = async (req, res) => {
    try {
        const users = await User.find({ rank: 4 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users with rank 4', error });
    }
};

const upgradeToExpert = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: 'Expert' },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User upgraded to expert', user });
    } catch (error) {
        res.status(500).json({ message: 'Error upgrading user', error });
    }
};

const keepAsFisherman = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: 'Regular' },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User kept as fisherman', user });
    } catch (error) {
        res.status(500).json({ message: 'Error keeping user as fisherman', error });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err });
    }
};

const approveUser = async (req, res) => {
    try {
        const testUser = await TestUser.findById(req.params.id);

        if (!testUser) {
            return res.status(404).json({ message: "User not found in test DB" });
        }

        const approvedUser = new User({
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            email: testUser.email,
            password: testUser.password,
            role: "Expert",
            rank: testUser.rank || 0
        });

        await approvedUser.save();
        await TestUser.findByIdAndDelete(req.params.id);

        res.status(201).json({ message: "User approved and moved to production DB", user: approvedUser });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

module.exports = {
    getAllUsers,
    loginUser,
    getUsersWithRank4,
    upgradeToExpert,
    keepAsFisherman,
    getUserById,
    approveUser
};
