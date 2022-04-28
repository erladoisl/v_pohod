import axios from 'axios';
import { url as API_URL } from './config';
import getCookie from './util';


const getConfig = (() => {
    return {headers: {"Authorization": `Token ${getCookie('token')}`,
        "Content-Type": "application/json"}};
});


export default class HikeService {
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
    };
};