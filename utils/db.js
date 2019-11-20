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

module.exports.getSingleImage = function getSingleImage(id) {
    return db.query("SELECT * FROM images WHERE id=$1", [id]);
};

module.exports.addComment = function addComment(username, comment, imageId) {
    return db.query(
        "INSERT INTO comments (username, comment, image_id) VALUES ($1, $2, $3)",
        [username, comment, imageId]
    );
};

module.exports.getComments = function getComments(imageId) {
    return db.query(
        "SELECT * FROM comments WHERE image_id=$1 ORDER BY created_at DESC",
        [imageId]
    );
};
