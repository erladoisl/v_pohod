import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000';

const getConfig = ((token) => {
    return {headers: {"Authorization": `Token ${token}`,
        "Content-Type": "application/json"}};
});

export default class HikeService {
    constructor() { };


    getHikes(token, only_user_hikes) {
        let data = [];
        const url = only_user_hikes ? `${API_URL}/api/user-hikes/` : `${API_URL}/api/hikes/`;

        return axios.get(url, getConfig(token)).then(response => {
            data = response.data;
        }).catch(error => {
            console.log(`ERROR in getEatingCategories: ${error}`);
        }).then(() => {
            return data;
        });
    }
}