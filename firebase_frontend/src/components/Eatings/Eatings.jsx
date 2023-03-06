import { Context } from "../../contexts/index";
import FBMenuService from '../../service/FBMenuService';
import React from 'react';
import { useEffect, useState } from "react";
import Ingredients from "./Ingredients/Ingredients";
import Eating from "./Eating/Eating";


const menuService = new FBMenuService();


const Eatings = ((props) => {
    const [state, dispatch] = React.useContext(Context);
    const [loading, set_loading] = useState(true);
    const [eatings, set_eatings] = useState([]);

    const addNotification = ((type, text) => {
        dispatch({ 'type': 'add_notification', 'notification': {type, text} })
    })

    useEffect(() => {
        updateEatingList();
    }, [props.day_id]);


    const udateCategories = (() => {
        menuService.getEatingCategories().then(function (result) {
            if (result.error === false) {
                dispatch({ 'type': 'update_eating_category', 'eatingCategories': result.objects });
            } else {
                addNotification('error', result.message)
            }
        });
    });


    if (!state.menu.hasOwnProperty("eatingCategories")) {
        udateCategories();
    }


    const updateEatingList = (() => {
        menuService.getDayEatings(props.day_id).then(function (result) {
            if (result.error === false) {
                set_eatings(result.objects);
            } else {
                addNotification('error', result.message)
            }
            set_loading(false)
        });
    });


    const updateEating = ((data) => {
        menuService.updateDayEating(data).then(function (result) {
            if (result.error === false) {
                updateEatingList();
            } else {
                addNotification('error', result.message)
            }
        });
    });


    const deleteEating = ((id) => {
        menuService.deleteEating(id).then(function (result) {
            if (result.error === false) {
                updateEatingList();
            } else {
                addNotification('error', result.message)
            }
        });
    });


    const empty_result_html = eatings.length === 0 ? (
        <div className="alert alert-info w-100" role="alert" style={{ 'maxHeight': "60px" }}>
            {loading ? 'Загрузка...' : 'Нет приемов пищи'}
        </div>
    ) : '';


    return (
        <div className="row h-100">
            {empty_result_html}

            <div className="m-0 p-0 h-90">

                {eatings.map((eating) => {
                    return (<div className='card p-0 m-1' key={eating.id}>
                        <div className="eating card-header d-flex justify-content-between  bg-light p-0">
                            <div className="input-group m-0">
                                < Eating eating={eating} day_id={props.day_id} key={eating.id} />

                                <div className='col-1' onClick={(() => { deleteEating(eating) })}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash my-3" viewBox="0 0 16 16">
                                        <title> Удалить прием пищи </title>
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <Ingredients eating_id={eating.id} />
                    </div>
                    )
                })}
            </div>

            <div className='text-start align-self-end'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle mx-1" viewBox="0 0 16 16" style={{ cursor: 'pointer' }}
                    onClick={(() => { updateEating({ hike_day_id: props.day_id }) })}>
                    <title> Добавить прием пищи </title>
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                прием пищи
            </div>
        </div>
    );
});

export default Eatings;