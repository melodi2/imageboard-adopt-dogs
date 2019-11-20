const express = require("express");
const app = express();
const db = require("./utils/db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static("./public"));
app.use(express.json());

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { title, description, username } = req.body;
    const imageUrl = `${s3Url}${req.file.filename}`;
    db.addImage(title, description, username, imageUrl)
        .then(({ rows }) => {
            console.log("rows", rows[0]);
            res.json({
                image: rows[0]
            });
        })
        .catch(err => {
            console.log(err);
        });
    console.log("this is the upload route!!");
    console.log("input: ", req.body);
    console.log("req.file: ", req.file);
    // if (req.file) {
    //     res.json({ success: true });
    // } else {
    //     res.json({ succes: false });
    // }
});

app.get("/images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            // console.log("rows.url", rows);
            res.json(rows);
        })
        .catch();
    //database query instead of this hardcoded
});

app.get("/singleImage/:imageId", (req, res) => {
    const { imageId } = req.params;
    console.log("req.params", req.params);
    db.getSingleImage(imageId).then(({ rows }) => {
        db.getComments(imageId)
            .then(comments => {
                console.log("comments in get Comments", comments.rows[0]);
                res.json({ image: rows[0], comments: comments.rows[0] });
            })
            .catch(err => {
                console.log(err);
            });
    });
});

app.post("/comments", (req, res) => {
    console.log("req.body", req.body);
    // db.addComment();
});

app.listen(8080, () => console.log("Imageboard up and running..."));
