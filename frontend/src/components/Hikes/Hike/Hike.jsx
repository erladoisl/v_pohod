import React from 'react';
import { useState, useEffect } from "react";
import HikeService from '../../../service/HikeService';
import { useLocation } from 'react-router-dom'
import Days from './Days/Days';


const hikeService = new HikeService();


const Hike = (() => {
    const { state } = useLocation();
    const [use_example, setUseExample] = useState(false);
    const [example_HTML, setExampleHTML] = useState('');
    const [messageHTML, setMessageHTML] = React.useState('');
    const [form_data, setFormData] = React.useState({
        id: -1,
        name: "",
        description: "",
        participant_count: 0,
        example_hike_id: -1
    });

    if (state && state.hasOwnProperty('id') && state.id > 0 && form_data.id === -1) {
        hikeService.getHike(state.id).then(((result) => {
            setFormData(result.data);
        }));
    };

    const download_menu = (() => {
        alert('Еще не рализовано');
    });


    return (
        <div className="container pt-5">
            <div className="py-5 text-center">
                <h2> {form_data.name} </h2>
            </div>
            {messageHTML}
            <div className="row g-3 text-start">
                <div className="col-12">
                    {form_data.description}
                </div>

                <div className="col-sm-12">
                    Количество участников:
                    {form_data.participant_count}
                </div>
            </div>

            <br />

            <div className='text-start'>
                <button onClick={(() => { download_menu() })} className="btn btn-primary">
                    Загрузить раскладку
                </button>
            </div>

            <br />

            {state && state.hasOwnProperty('id') && state.id > 0 ? <Days hike_id={state.id} /> : <></>}

            <br className="my-4" />
        </div>
    );
});


export default Hike;