const app = Vue.createApp({
    data() {
        return {};
    },
    data() {
        return {
            redisPlz: "",
            redisCity: "",
            redisLoc: "",
            redisPop: "",
            redisState: "",
            redisCityError: "",
            redisPlzError: "",
            redisZipCodes: [],

            moPlz: "",
            moCity: "",
            moLoc: "",
            moPop: "",
            moState: "",
            moCityError: "",
            moPlzError: "",
            moZipCodes: [],
        };
    },
    methods: {
        redisGetCity() {
            if (this.$refs.redisPlz.value) {
                axios
                    .get("http://localhost:8080/redis/plz?plz=" + this.redisPlz, {
                        params: {
                            param: this.redisPlz,
                        },
                    })
                    .then((response) => {
                        console.log(response);
                        if (response.data.obj !== null) {
                            this.redisPlzError = "";
                            this.redisCity = response.data.obj.city;
                            this.redisState = response.data.obj.state;
                            this.redisPop = response.data.obj.pop;
                            this.redisLoc = response.data.obj.loc;
                        } else {
                            this.redisCity = "";
                            this.redisState = "";
                            this.redisPlzError = "No entry found for this zip-code";
                        }
                    });
            }
        },
        redisGetZipCode() {
            if (this.$refs.redisCity.value) {
                axios
                    .get(
                        "http://localhost:8080/redis/city?city=" +
                        this.redisCity.toUpperCase(), {
                            params: {
                                param: this.redisCity,
                            },
                        }
                    )
                    .then((response) => {
                        console.log(response);
                        if (response.data.obj.length != 0) {
                            this.redisCityError = "";
                            this.redisZipCodes = response.data.obj;
                            this.redisPlz = this.redisZipCodes[0];
                            this.redisState = "";
                            this.redisPop = "";
                            this.redisLoc = "";
                        } else {
                            this.redisZipCodes = [];
                            this.redisCityError = "No entry found for this city";
                        }
                    });
            }
        },
        moGetCity() {
            if (this.$refs.moPlz.value) {
                axios
                    .get("http://localhost:8080/mo/plz?plz=" + this.moPlz, {
                        params: {
                            param: this.moPlz,
                        },
                    })
                    .then((response) => {
                        if (response.data.obj !== null) {
                            this.moPlzError = "";
                            this.moCity = response.data.obj.city;
                            this.moState = response.data.obj.state;
                            this.moPop = response.data.obj.pop;
                            this.moLoc = response.data.obj.loc;
                        } else {
                            this.moCity = "";
                            this.moState = "";
                            this.moPlzError = "No entry found for this zip-code";
                        }
                    });
            }
        },
        moGetZipCode() {
            if (this.$refs.moCity.value) {
                axios
                    .get(
                        "http://localhost:8080/mo/city?city=" +
                        this.moCity.toUpperCase(), {
                            params: {
                                param: this.moCity,
                            },
                        }
                    )
                    .then((response) => {
                        //console.log(response);
                        if (response.data.obj.length != 0) {
                            this.moCityError = "";
                            this.moZipCodes = [];
                            for (let i = 0; i < response.data.obj.length; i++) {
                                this.moZipCodes.push(response.data.obj[i].plz);
                            }
                            this.moPlz = this.moZipCodes[0];
                            this.moState = "";
                            this.moPop = "";
                            this.moLoc = "";
                        } else {
                            this.moZipCodes = [];
                            this.moCityError = "No entry found for this city";
                        }
                    });
            }
        },

        cassGetCity() {
            if (this.$refs.cassPlz.value) {
                axios
                    .get("http://localhost:8080/cass/plz?plz=" + this.cassPlz, {
                        params: {
                            param: this.cassPlz,
                        },
                    })
                    .then((response) => {
                        if (response.data.obj !== null) {
                            this.cassPlzError = "";
                            this.cassCity = response.data.obj.city;
                            this.cassState = response.data.obj.state;
                            this.cassPop = response.data.obj.pop;
                            this.cassLoc = response.data.obj.loc;
                        } else {
                            this.cassCity = "";
                            this.cassState = "";
                            this.cassPlzError = "No entry found for this zip-code";
                        }
                    });
            }
        },
        cassGetZipCode() {
            if (this.$refs.cassCity.value) {
                axios
                    .get(
                        "http://localhost:8080/cass/city?city=" +
                        this.cassCity.toUpperCase(), {
                            params: {
                                param: this.cassCity,
                            },
                        }
                    )
                    .then((response) => {
                        //console.log(response);
                        if (response.data.obj.length != 0) {
                            this.cassCityError = "";
                            this.cassZipCodes = [];
                            for (let i = 0; i < response.data.obj.length; i++) {
                                this.cassZipCodes.push(response.data.obj[i].plz);
                            }
                            this.cassPlz = this.cassZipCodes[0];
                            this.cassState = "";
                            this.cassPop = "";
                            this.cassLoc = "";
                        } else {
                            this.cassZipCodes = [];
                            this.cassCityError = "No entry found for this city";
                        }
                    });
            }
        },
    },
});

app.mount("#app");
