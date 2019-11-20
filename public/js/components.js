Vue.component("image-modal", {
    template: `#my-template`,
    data: function() {
        return {
            image: {},
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
    },
    methods: {
        close: function() {
            console.log("closing event");
            this.$emit("close");
        },
        submitComment: function() {
            console.log("submit Comment");
            axios
                .post("/comments", {
                    comment: this.comment,
                    commenter: this.commenter
                })
                .then(function(res) {
                    // console.log("inside post comments");
                });
        }
    }
});
