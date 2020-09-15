const store = new Vuex.Store({
    // State ------->
    state: {
    },

    // Mutations ------->
    mutations: {
    },

    // Getters ------->
    getters: {

    },

    // Actions ------->
    actions: {
        getDataByPost ({commit}, getConditons) {
            return new Promise((resolve, reject) => {
                let data = getConditons.data
                let requestUrl = getConditons.requestUrl
                axios({
                    method: 'post',
                    url: requestUrl,
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    data: data
                }).then(
                    res => {
                        resolve(res)
                    },
                    err => {
                        reject(err)
                    }
                )
            })
        },
        getDataByGet ({commit}, getConditons) {
            return new Promise((resolve, reject) => {
                let requestUrl = getConditons.requestUrl
                axios({
                    method: 'get',
                    url: requestUrl,
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                
                }).then(
                    res => {
                        resolve(res)
                    },
                    err => {
                        reject(err)
                    }
                )
            })
        },
    }
})