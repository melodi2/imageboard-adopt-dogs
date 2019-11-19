const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImages = function getImages() {
    return db.query("SELECT * FROM images ORDER BY created_at DESC");
};

module.exports.addImage = function addImage(
    title,
    description,
    username,
    imageUrl
) {
    return db.query(
        "INSERT INTO images (title, description, username, url) VALUES ($1, $2, $3, $4) returning *",
        [title, description, username, imageUrl]
    );
};
