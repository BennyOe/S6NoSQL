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
            cityError: "",
            plzError: "",
            zipCodes: [],
        };
    },
    methods: {
        getCity() {
            if (this.$refs.plz.value) {
                axios
                    .get("http://localhost:8080/plz?plz=" + this.plz, {
                        params: {
                            param: this.plz,
                        },
                    })
                    .then((response) => {
                        console.log(response);
                        if (response.data.obj !== null) {
                            this.plzError = "";
                            this.city = response.data.obj.city;
                            this.state = response.data.obj.state;
                            this.pop = response.data.obj.pop;
                            this.loc = response.data.obj.loc;
                        } else {
                            this.city = "";
                            this.state = "";
                            this.plzError = "No entry found for this zip-code";
                        }
                    });
            }
        },
        getZipCode() {
            if (this.$refs.city.value) {
                axios
                    .get(
                        "http://localhost:8080/city?city=" +
                            this.city.toUpperCase(),
                        {
                            params: {
                                param: this.city,
                            },
                        }
                    )
                    .then((response) => {
                        console.log(response);
                        if (response.data.obj.length != 0) {
                            this.cityError = "";
                            this.zipCodes = response.data.obj;
                            this.plz = this.zipCodes[0];
                            this.state = "";
                            this.pop = "";
                            this.loc = "";
                        } else {
                            this.zipCodes = [];
                            this.cityError = "No entry found for this city";
                        }
                    });
            }
        },
    },
});

app.mount("#app");
