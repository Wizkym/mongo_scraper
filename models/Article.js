const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a new ArticleSchema object
const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    imgLink: {
        type: String,
        required: false
    }
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;