const mongoose = require('mongoose');
const PostSchema = require('../models/post').schema;
const UserSchema = require('../models/user').schema;

const TestDB = mongoose.connection.useDb('test');
const MainDB = mongoose.connection.useDb('fishinMap');

const TestPost = TestDB.model('Post', PostSchema);
const MainPost = MainDB.model('Post', PostSchema);
const TestUser = TestDB.model('User', UserSchema);
const MainUser = MainDB.model('User', UserSchema);

const getPendingPostsFromTest = async (req, res) => {
    try {
        const posts = await TestPost.find({ status: 'pending' }).populate({
            path: 'user',
            model: MainUser
        });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching pending posts', err });
    }
};

const approvePost = async (req, res) => {
    try {
        const post = await TestPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found in test DB' });
        }

        const user = await MainUser.findById(post.user);
        if (user) {
            user.rank = (user.rank || 0) + 1;
            await user.save();
        }

        post.status = 'approved';
        const approvedPost = new MainPost(post.toObject());
        await approvedPost.save();
        await TestPost.findByIdAndDelete(req.params.id);

        res.status(201).json({ message: '✅ Post approved and moved to main DB', post: approvedPost });
    } catch (err) {
        res.status(500).json({ message: 'Error approving post', error: err.message });
    }
};

const declinePost = async (req, res) => {
    try {
        const deleted = await TestPost.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Post not found in test DB' });
        }
        res.status(200).json({ message: '🗑️ Post declined and deleted from test DB' });
    } catch (err) {
        res.status(500).json({ message: 'Error declining post', error: err.message });
    }
};
const assignUsersToTestPosts = async (req, res) => {
    try {
        const posts = await TestPost.find({ user: { $in: [null, undefined] } });
        if (!posts.length) {
            return res.status(200).json({ message: "no posts with no users" });
        }

        const users = await MainUser.find({}, '_id');
        if (!users.length) {
            return res.status(400).json({ message: "no users at the main DB" });
        }

        const updates = posts.map(async (post) => {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            post.user = randomUser._id;
            return await post.save();
        });

        await Promise.all(updates);

        res.status(200).json({ message: `users to posts${posts.length}` });

    } catch (error) {
        console.error("defining user:", error);
        res.status(500).json({ message: "server error:", error: error.message });
    }
};


module.exports = {
    getPendingPostsFromTest,
    approvePost,
    declinePost,
    assignUsersToTestPosts
};
