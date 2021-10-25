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
            zipCodes: [],
        };
    },
    methods: {
        getCity() {
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
        getZipCode() {
            if (this.$refs.input.value) {
                axios
                    .get("http://localhost:8080/city?city=" + this.city, {
                        params: {
                            param: this.city,
                        },
                    })
                    .then((response) => {
                        console.log(response);
                        if (response.data.obj !== null) {
                            this.error = "";
                            this.zipCodes = response.data.obj;
                        } else {
                            this.zipCodes = [];
                            this.error = "No entry found for this city";
                        }
                    });
            }
        },
    },
});

app.mount("#app");
