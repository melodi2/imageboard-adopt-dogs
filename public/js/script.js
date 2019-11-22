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
        currentId: location.hash.slice(1)
    },
    mounted: function() {
        var me = this;
        axios
            .get("/images")
            .then(function(response) {
                me.images = response.data;
                me.scroll(me.images);
            })
            .catch(function(err) {
                console.log(err);
            });

        window.addEventListener("hashchange", function() {
            me.currentId = location.hash.slice(1);
        });
    },
    methods: {
        scroll: function scroll(images) {
            // var me = this;
            // console.log("first time calling scroll");
            // if (location.search.indexOf("scroll=infinite")) {
            setTimeout(function() {
                // console.log(
                //     "window.innerHeight + pageYOffset >= document.body.scrollHeight",
                //     window.innerHeight + pageYOffset >=
                //         document.body.scrollHeight
                // );
                if (
                    window.innerHeight + pageYOffset >=
                    document.body.scrollHeight
                ) {
                    // console.log("infinite scrolling");
                    // console.log(
                    //     "me.images[me.images.length - 1].id",
                    //     images[images.length - 1].id
                    // );
                    axios
                        .get(`/moreimages/${images[images.length - 1].id}`)
                        .then(function(response) {
                            // console.log(
                            //     "inside axios get more images, response.data",
                            //     response.data
                            // );
                            response.data.forEach(element =>
                                images.push(element)
                            );
                            scroll(images);
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
                } else {
                    scroll(images);
                }
            }, 1000);
            // }
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
            location.hash = "";
        },
        deleteImage: function() {
            var me = this;
            axios.post(`images/${this.currentId}`).then(() => {
                console.log("deleted the image and the comments");
                axios
                    .get("/images")
                    .then(function(response) {
                        me.images = response.data;
                        me.scroll(me.images);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            });
        }
    }
});
