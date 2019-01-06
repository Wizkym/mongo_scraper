// Dependencies
const express = require('express');
const axios = require('axios');
// Import models
const db = require('../models/Index');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const router = express.Router();

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        console.log("DATABASE CONNECTED");
    })
    .catch((error) => {
        console.log("DATABASE NOT FOUND", error);
    });

router.get("/", (req,res) => {
    res.redirect("/scrape");
});

// Route for getting all Articles from the db
router.get("/articles", (req, res) => {
    db.Article.find({})
        .then((article) => {
            // If successful, find Articles and send them back to the client
            res.render('articles', { article: article });
        })
        .catch((err) => {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// A GET route for scraping latest news
router.get("/scrape", (req, res) => {
    // Making a request via axios
    axios.get("https://www.smartbrief.com/industry/tech").then((response) => {
        // Load the body of the HTML into cheerio
        let $ = cheerio.load(response.data);

        // With cheerio, find each article and loop
        $(".multi-summary-wrapper").each((i, element) => {
            // Save an empty result object
            let result = {};

            result.title = $(element).find(".multi-summary-title a").text();
            result.summary = $(element).find(".multi-summary-body p").text();
            result.link = $(element).find(".multi-summary-source a").attr("href");
            result.imgLink = $(element).find(".multi-summary-image a img").attr("src");

            // Create a new Article using the `result` object built from scraping
            db.Article.findOne({ title: result.title })
                .then((dbArticle) => {
                    // If successful send it back to the client
                    if (dbArticle) {
                        console.log("This is a duplicate");
                    } else {
                        db.Article.create(result)
                            .then((dbArticle) => {
                                // View the added result in the console
                                console.log(dbArticle);
                            })
                            .catch((err) => {
                                // If an error occurred, send it to the client
                                return res.json(err);
                            });
                    }
                })
                .catch((err) => {
                    // If an error occurred, send it to the client
                    res.json(err);
                });
        });
    })
    .then( (res) => {
        console.log(res);
    })
    .catch( (err) => {
            console.log(err);
    });
    // If we were able to successfully scrape and save an Article, send a message to the client
    res.redirect("/articles");
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", (req, res) => {
    let result = {};
     const myPromise = () => {
         return new Promise((resolve, reject) => {
             db.Article.findOne({ _id: req.params.id })
                 .then( (article) => {
                     result.article = article;
                     resolve();
                 })
                 .catch( (err) => {
                     res.json(err);
                     reject();
                 });

         });
     };
     myPromise().then(response => {
         // Get comments
         db.Comment.find({ article: req.params.id })
             .then((comment) => {
                 // Load article and send result
                 result.comment = comment;
                 res.render('expand', result);
             })
             .catch((err) => {
                 // If an error occurred, send it to the client
                 console.log(err);
             });
     });

});

// Route for saving/updating an Article's associated Comments
router.post("/comments/:id", (req, res) => {
    db.Comment.create(req.body)
        .then((dbComment) => {
            console.log("NEW COMMENT", dbComment);
            res.send(dbComment);
        })
        .catch((err) => {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for deleting comments
router.delete("/comments/:id", (req,res) => {
    db.Comment.findByIdAndRemove(req.params.id)
        .then((deleted) => {
            res.send(deleted);
        })
        .catch((err) => {
            console.log(err)
        })
});

module.exports = router;