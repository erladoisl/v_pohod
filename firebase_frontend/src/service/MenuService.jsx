import axios from 'axios';
import { url as API_URL } from './config';
import getCookie from './util';


const getConfig = (() => {
    return {
        headers: {
            "Authorization": `Token ${getCookie('token')}`,
            "Content-Type": "application/json"
        }
    };
});


export default class MenuService {
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

    updateEatingCategory(eating_category) {
        let data = [];
        const url = `${API_URL}/api/eating-category/`;

        return axios.post(url, data = eating_category, getConfig()).then(response => {
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

        return axios.delete(url, { "data": { "name": name }, headers: getConfig()['headers'] }).then(response => {
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

    updateFood(food) {
        let data = [];
        const url = `${API_URL}/api/food/`;

        return axios.post(url, data = food, getConfig()).then(response => {
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

        return axios.delete(url, { "data": { "name": name }, headers: getConfig()['headers'] }).then(response => {
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

    updateFormula(formula) {
        let data = [];
        const url = `${API_URL}/api/formula/`;

        return axios.post(url, data = formula, getConfig()).then(response => {
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

        return axios.delete(url, { "data": { "name": name }, headers: getConfig()['headers'] }).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in deleteFormula: ${error}`);
        }).then(() => {
            return data;
        });
    }

    getDayEatings(day_id) {
        let data = [];
        const url = `${API_URL}/api/hike/day/eatings/?day_id=${day_id}`;

        return axios.get(url, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in getDayEatings: ${error}`);
        }).then(() => {
            return data;
        });
    }

    updateDayEating(eating) {
        let data = [];
        const url = `${API_URL}/api/hike/day/eatings/`;

        return axios.post(url, data = eating, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in updateDayEating: ${error}`);
        }).then(() => {
            return data;
        });
    }

    deleteEating(id) {
        let data = [];
        const url = `${API_URL}/api/hike/day/eatings/`;

        return axios.delete(url, { "data": { "id": id }, headers: getConfig()['headers'] }).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in deleteEating: ${error}`);
        }).then(() => {
            return data;
        });
    }

    getEatingIngredients(eating_id) {
        let data = [];
        const url = `${API_URL}/api/hike/day/eating/ingredient/?eating_id=${eating_id}`;

        return axios.get(url, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in getEatingIngredients: ${error}`);
        }).then(() => {
            return data;
        });
    }

    updateIngredient(ingredient) {
        let data = [];
        const url = `${API_URL}/api/hike/day/eating/ingredient/`;

        return axios.post(url, data = ingredient, getConfig()).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in updateIngredient: ${error}`);
        }).then(() => {
            return data;
        });
    }

    deleteIngredient(id) {
        let data = [];
        const url = `${API_URL}/api/hike/day/eating/ingredient/`;

        return axios.delete(url, { "data": { "id": id }, headers: getConfig()['headers'] }).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in deleteIngredient: ${error}`);
        }).then(() => {
            return data;
        });
    }
};