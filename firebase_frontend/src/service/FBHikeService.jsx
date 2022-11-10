import { initializeApp } from "firebase/app";
import axios from 'axios';
import { url as API_URL } from './config';
import { saveAs } from 'file-saver';
import {
    delete_object,
    edit_object,
    get_objects,
    get_objects_by_field
} from './FirebaseService';
import { firebaseConfig } from "./config";
import {
    getAuth,
} from "firebase/auth";


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export default class HikeService {
    getHikes(only_user_hikes) {
        if (only_user_hikes) {
            return get_objects_by_field('user_id', auth.currentUser.uid, 'hikes')
        }
        return get_objects('hikes')
    };

    updateHike(hike) {
        return edit_object(hike, 'hikes')
    };

    deleteHike(object) {
        return delete_object(object, 'hikes')
    };


    getHikeDays(hike_id) {
        return get_objects_by_field('hike_id', hike_id, 'hike_days', 'date', true)
    };

    updateHikeDay(hike_day) {
        return edit_object(hike_day, 'hike_days')
    };

    deleteHikeDay(object) {
        return delete_object(object, 'hike_days')
    };

    getXlsx(hike_id) {
        alert('функция в процессе разработки')
        let data = [];
        const url = `${API_URL}/api/hike/menu/xlsx/?hike_id=${hike_id}`;

        return axios.get(url, { responseType: 'blob' }).then(response => {
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            saveAs(blob, "excel.xlsx");
        }).catch(error => {
            console.log(`ERROR in getXlsx: ${error}`);
        }).then(() => {
            return data;
        });
    };
};
