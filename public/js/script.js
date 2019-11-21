new Vue({
    el: "#main",
    data: {
        name: "Habanero!",
        seen: false,
        images: [],
        title: "",
        description: "",
        username: "",
        file: null,
        currentId: null
    },
    mounted: function() {
        var me = this;
        axios
            .get("/images")
            .then(function(response) {
                me.images = response.data;
                me.scroll();
            })
            .catch(function(err) {
                console.log(err);
            });
    },
    methods: {
        scroll: function() {
            if (location.search.indexOf("scroll=infinite")) {
                setTimeout(function() {
                    console.log(
                        "window.innerHeight + pageYOffset >= document.body.scrollHeight",
                        window.innerHeight + pageYOffset >=
                            document.body.scrollHeight
                    );
                    if (
                        window.innerHeight + pageYOffset >=
                        document.body.scrollHeight
                    ) {
                        console.log("infinite scrolling");
                        var me = this;
                        axios
                            .get("/moreimages", {
                                id: this.images[this.images.length - 1].id
                            })
                            .then(function(response) {
                                console.log("inside axios get more images");
                                me.images = response.data;
                            })
                            .catch(function(err) {
                                console.log(err);
                            });
                    }
                }, 1000);
            }
        },
        handleClick: function(e) {
            e.preventDefault();
            var fd = new FormData();
            fd.append("file", this.file);
            fd.append("title", this.title);
            fd.append("description", this.description);
            fd.append("username", this.username);
            var me = this;
            axios
                .post("/upload", fd)
                .then(function(res) {
                    console.log("res from POST /upload", res.data);
                    me.images.unshift(res.data.image);
                })
                .catch(function(err) {
                    console.log("error in POST /upload", err);
                });
        },
        handleChange: function(e) {
            // console.log("e.target.files[0]", e.target.files[0]);
            // console.log("handle change is happening");
            this.file = e.target.files[0];
        },
        show: function(id) {
            console.log("image id ", id);
            this.currentId = id;
        },
        unsetCurrentImage: function() {
            this.currentId = null;
        }
    }
});
