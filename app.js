const app = Vue.createApp({
    data() {
        return {};
    },
    data() {
        return {
            plz: "",
            city: "",
            loc: "",
            pop: "",
            state: "",
            error: "",
        };
    },
    methods: {
        getData() {
            if (this.$refs.input.value) {
                axios
                    .get("http://localhost:8080/plz?plz=id:" + this.plz, {
                        params: {
                            param: this.plz,
                        },
                    })
                    .then((response) => {
                        console.log(response);
                        if (response.data.obj !== null) {
                            this.error = "";
                            this.city = "City is: " + response.data.obj.city;
                            this.state = "State is: " + response.data.obj.state;
                        } else {
                            this.city = "";
                            this.state = "";
                            this.error = "No entry found for this zip-code";
                        }
                    });
            }
        },
    },
});

app.mount("#app");
