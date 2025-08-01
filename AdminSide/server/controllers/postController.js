const mongoose = require('mongoose');
const PostSchema = require('../models/post').schema;

const TestPost = mongoose.connection.useDb('test').model('Post', PostSchema);
const MainPost = mongoose.connection.useDb('fishinMap').model('Post', PostSchema);

const getPendingPostsFromTest = async (req, res) => {
    try {
        const posts = await TestPost.find({ status: 'pending' }).populate('user');
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

module.exports = {
    getPendingPostsFromTest,
    approvePost,
    declinePost
};