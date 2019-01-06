const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a new CommentSchema object
const CommentSchema = new Schema({
    title: String,
    body: String,
    article: String
});

// This creates our model from the above schema, using mongoose's model method
const Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;