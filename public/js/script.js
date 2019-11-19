new Vue({
    el: "#main",
    data: {
        name: "Habanero!",
        seen: false,
        images: [],
        title: "",
        description: "",
        username: "",
        file: null
    },
    mounted: function() {
        // console.log("my Vue component has mounted!");
        // console.log("this is my images data: ", this.images);
        var me = this;
        axios
            .get("/images")
            .then(function(response) {
                // console.log("response from /images", response.data);
                // console.log("me.images: ", me.images);
                me.images = response.data;
            })
            .catch(function(err) {
                console.log(err);
            });
    },
    methods: {
        handleClick: function(e) {
            e.preventDefault();
            console.log("this", this);
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
            console.log("e.target.files[0]", e.target.files[0]);
            console.log("handle change is happening");
            this.file = e.target.files[0];
        }
    }
});
