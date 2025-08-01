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

module.exports = {
    getPendingPostsFromTest
};