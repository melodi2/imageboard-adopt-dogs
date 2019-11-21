const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImages = function getImages() {
    return db.query("SELECT * FROM images ORDER BY id DESC LIMIT 6;");
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
        "INSERT INTO comments (username, comment, image_id) VALUES ($1, $2, $3) returning *",
        [username, comment, imageId]
    );
};

module.exports.getComments = function getComments(imageId) {
    return db.query(
        "SELECT created_at CONVERT(varchar, getdate(), 0), username, comment, image_id FROM comments WHERE image_id=$1 ORDER BY id DESC",
        [imageId]
    );
};

module.exports.getMoreImages = function getMoreImages(imageId) {
    return db
        .query(
            `SELECT * FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3`,
            [imageId]
        )
        .then(({ rows }) => rows);
};
