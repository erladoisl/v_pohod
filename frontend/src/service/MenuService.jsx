import axios from 'axios';
import { url as API_URL } from './config';
import getCookie from './util';


const getConfig = (() => {
    return {headers: {"Authorization": `Token ${getCookie('token')}`,
        "Content-Type": "application/json"}};
});


export default class MenuService {
    getHikes(only_user_hikes) {
        let data = [];
        const url = only_user_hikes ? `${API_URL}/api/user-hikes/` : `${API_URL}/api/hikes/`;

        return axios.get(url, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in getEatingCategories: ${error}`);
        }).then(() => {
            return data;
        });
    }


    getEatingCategories() {
        let data = [];
        const url = `${API_URL}/api/eating-category/`;

        return axios.get(url, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in getEatingCategories: ${error}`);
        }).then(() => {
            return data;
        });
    }

    addEatingCategory(name) {
        let data = [];
        const url = `${API_URL}/api/eating-category/`;

        return axios.post(url, data = {
            "name": name
        }).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in addEatingCategory: ${error}`);
        }).then(() => {
            return data;
        });
    }

    deleteEatingCategory(name) {
        let data = [];
        const url = `${API_URL}/api/eating-category/`;

        return axios.delete(url, {"data": {"name": name}}).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in deleteEatingCategory: ${error}`);
        }).then(() => {
            return data;
        });
    }

    getFood() {
        let data = [];
        const url = `${API_URL}/api/food/`;

        return axios.get(url, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in getFood: ${error}`);
        }).then(() => {
            return data;
        });
    }

    addFood(name, amount_per_person) {
        let data = [];
        const url = `${API_URL}/api/food/`;

        return axios.post(url, data = {
            "name": name,
            "amount_per_person": amount_per_person
        }, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in addFood: ${error}`);
        }).then(() => {
            return data;
        });
    }

    deleteFood(name) {
        let data = [];
        const url = `${API_URL}/api/food/`;

        return axios.delete(url, {"data": {"name": name}}).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in deleteFood: ${error}`);
        }).then(() => {
            return data;
        });
    }

    getFormula() {
        let data = [];
        const url = `${API_URL}/api/formula/`;

        return axios.get(url, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in getFood: ${error}`);
        }).then(() => {
            return data;
        });
    }

    addFormula(name, value) {
        let data = [];
        const url = `${API_URL}/api/formula/`;

        return axios.post(url, data = {
            "name": name,
            "value": value
        }, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in addFood: ${error}`);
        }).then(() => {
            return data;
        });
    }

    deleteFormula(name) {
        let data = [];
        const url = `${API_URL}/api/formula/`;

        return axios.delete(url, {"data": {"name": name}}).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in deleteFormula: ${error}`);
        }).then(() => {
            return data;
        });
    }
};