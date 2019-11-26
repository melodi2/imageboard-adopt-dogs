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
                    console.log("infinite scrolling");
                    console.log(
                        "me.images[me.images.length - 1].id",
                        images[images.length - 1].id
                    );
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
                            console.log("err in moreimages get axios", err);
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
            this.file = e.target.files[0];
            var label = document.querySelectorAll(".labelforInput");

            label[0].innerText = e.target.files[0].name;

            console.log("after label.innerText", label[0].innerText);
        },
        show: function(id) {
            console.log("image id ", id);
            this.currentId = id;
        },
        unsetCurrentImage: function() {
            location.hash = "";
        },
        deleteImagefromArray: function(id) {
            for (var i = 0; i < this.images.length; i++) {
                if (this.images[i].id == id) {
                    console.log(
                        "deleteImagefromArray is running, object i in images",
                        this.images[i]
                    );
                    var index = this.images.indexOf(this.images[i]);
                    console.log("index inside loop", index);
                    if (index > -1) {
                        this.images.splice(index, 1);
                    }
                }
            }
            console.log("before splice index", index);
            console.log("after splice index", index);
        },
        deleteImage: function(id) {
            console.log("deleteImage vue");
            // var me = this;
            this.deleteImagefromArray(id);
            axios.post(`deleteimage/${id}`).then(function(res) {
                // console.log(
                //     "deleted the image and the comments, res.data",
                //     res.data.id
                // );
                // console.log("BEFORE me.images", me.images);
                // console.log("AFTER me.images", me.images);
            });
        }
    }
});
