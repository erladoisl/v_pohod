import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000';

export default class MenuService {
    constructor() { }

    getEatingCategories(token) {
        let data = [];
        const url = `${API_URL}/api/eating-category/`;

        return axios.get(url).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in getEatingCategories: ${error}`);
        }).then(() => {
            return data;
        });
    }

    addEatingCategory(name, token) {
        let data = [];
        const url = `${API_URL}/api/eating-category/`;

        return axios.post(url, data = {
            "token": token,
            "name": name
        }).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in addEatingCategory: ${error}`);
        }).then(() => {
            return data;
        });
    }

    getFood(token) {
        let data = [];
        const url = `${API_URL}/api/food/`;

        return axios.get(url).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in getFood: ${error}`);
        }).then(() => {
            return data;
        });
    }

    addFood(name, amount_per_person, token) {
        let data = [];
        const url = `${API_URL}/api/food/`;

        return axios.post(url, data = {
            "token": token,
            "name": name,
            "amount_per_person": amount_per_person
        }).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in addFood: ${error}`);
        }).then(() => {
            return data;
        });
    }

    getFormula(token) {
        let data = [];
        const url = `${API_URL}/api/formula/`;

        return axios.get(url).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in getFood: ${error}`);
        }).then(() => {
            return data;
        });
    }

    addFormula(name, value, token) {
        let data = [];
        const url = `${API_URL}/api/formula/`;

        return axios.post(url, data = {
            "token": token,
            "name": name,
            "value": value
        }).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in addFood: ${error}`);
        }).then(() => {
            return data;
        });
    }
}