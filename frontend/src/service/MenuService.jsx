import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000';

export default class MenuService {
    constructor() { }

    getEatingCategories(token) {
        let data = [];
        const url = `${API_URL}/api/eating-category/`;

        return axios.get(url, data = {
            "token": token,
        }).then(response => {
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
}