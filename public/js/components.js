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
    props: ["id", "url", "username", "title", "description"],
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
                me.image = res.data.image;
            })
            .catch(function(err) {
                console.log("error in GET /singleImage", err);
            });
        axios
            .get(`/comments/${this.id}`)
            .then(function(res) {
                console.log("res.data", res.data);
                me.comments = res.data;
            })
            .catch();
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
                    // console.log("inside post comments");
                    he.comments.unshift(res.data.comments);
                });
        }
    }
});
