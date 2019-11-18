const express = require("express");
const app = express();

const db = require("./utils/db");

app.use(express.static("./public"));

app.get("/images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            // console.log("rows.url", rows);
            res.json(rows);
        })
        .catch();
    //database query instead of this hardcoded
});

app.listen(8080, () => console.log("Imageboard up and running..."));
