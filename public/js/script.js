new Vue({
    el: "#main",
    data: {
        name: "Habanero!",
        seen: false,
        images: []
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
            .catch(err => console.log(err));
    },
    methods: {
        myFunction: function(animalClickedOn) {
            console.log("my function is running");
            console.log("animalClickedOn: ", animalClickedOn);
            this.name = animalClickedOn;
        }
    }
});
