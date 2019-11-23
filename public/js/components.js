Vue.component("image-modal", {
    template: `#my-template`,
    data: function() {
        return {
            image: {},
            comments: [],
            comment: "",
            commenter: ""
        };
    },
    props: ["id"],
    mounted: function() {
        var me = this;
        console.log("this.id", this.id);
        axios
            .get(`/singleImage/${this.id}`)
            .then(function(res) {
                console.log(
                    "single image GET route is  working, res.data.image",
                    res.data.image
                );
                if (res.data.image && res.data.image != {}) {
                    me.image = res.data.image;
                } else {
                    console.log("no such an image");
                    me.close();
                }
            })
            .catch(function(err) {
                console.log("error in GET /singleImage", err);
            });
        axios
            .get(`/comments/${this.id}`)
            .then(function(res) {
                console.log("comments res.data", res.data);
                me.comments = res.data;
            })
            .catch(function(err) {
                console.log("error in GET /comments", err);
            });
    },
    watch: {
        id: function() {
            var me = this;
            // console.log("this.id", this.id);
            axios
                .get(`/singleImage/${this.id}`)
                .then(function(res) {
                    if (res.data.image && res.data.image != {}) {
                        me.image = res.data.image;
                    } else {
                        console.log("no such an image, watch");
                        me.close();
                    }
                })
                .catch(function(err) {
                    console.log("error in GET /singleImage", err);
                });
            axios
                .get(`/comments/${this.id}`)
                .then(function(res) {
                    //     console.log("res.data", res.data);
                    me.comments = res.data;
                })
                .catch(function(err) {
                    console.log("error in GET /comments", err);
                });
        }
    },
    methods: {
        close: function() {
            console.log("closing event");
            this.$emit("close");
        },
        submitComment: function() {
            console.log("submit Comment");
            var he = this;
            axios
                .post("/comments", {
                    comment: this.comment,
                    commenter: this.commenter,
                    imageId: this.id
                })
                .then(function(res) {
                    console.log(
                        "inside post comments res.data.comments",
                        res.data.comments
                    );
                    he.comments.unshift(res.data.comments);
                });
        }
    }
});
