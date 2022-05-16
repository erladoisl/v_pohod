import { Context } from "../../../contexts/index";
import MenuService from '../../../service/MenuService';
import React from 'react';
import { useEffect, useState } from "react";
import Ingredients from "./Ingredients/Ingredients";


const menuService = new MenuService();


const Eatings = ((props) => {
    const [state, dispatch] = React.useContext(Context);
    const [eatings, set_eatings] = useState([]);

    useEffect(() => {
        if (eatings.length === 0) {
            updateEatingList();
        };
    }, []);

    useEffect(() => {
        updateEatingList();
    }, [props.day_id]);


    const udateCategories = (() => {
        menuService.getEatingCategories().then(function (result) {
            if (result.error === false) {
                dispatch({ 'type': 'update_eating_category', 'eatingCategories': JSON.parse(result.data) });
            } else {
                console.log(result);
            }
        });
    });


    if (!state.menu.hasOwnProperty("eatingCategories")) {
        udateCategories();
    }


    const updateEatingList = (() => {
        menuService.getDayEatings(props.day_id).then(function (result) {
            if (result.error === false) {
                set_eatings(result.data);
            } else {
                console.log(result);
            }
        });
    });


    const updateEating = ((data) => {
        menuService.updateDayEating(data).then(function (result) {
            if (result.error === false) {
                updateEatingList();
            } else {
                console.log(result);
            }
        });
    });


    const deleteEating = ((id) => {
        menuService.deleteEating(id).then(function (result) {
            if (result.error === false) {
                updateEatingList();
            } else {
                console.log(result);
            }
        });
    });


    const empty_result_html = eatings.length === 0 ? (
        <div className="alert alert-info w-100" role="alert">
            Не найдено
        </div>
    ) : '';


    return (
        <div className="row">
            {empty_result_html}

            {eatings.map((eating, i) => {
                return (
                    <div className='card p-0 m-1' key={i}>

                        <div className="eating card-header d-flex justify-content-between  bg-light p-0">
                            <div className="input-group m-0">
                                <input type="text" className="form-control bg-light border-0" value={eating.name} onChange={((e) => { updateEating({ ...eating, name: e.target.value }) })} />
                                <span className="input-group-text bg-light border-0" id="basic-addon2">
                                    <div className="btn-group">

                                        <select className="form-select bg-light btn-sm px-4 border-0" defaultValue={eating.eating_category_id} onChange={((event) => { updateEating({ ...eating, eating_category_id: event.target.value }) })}>
                                            {state.menu.hasOwnProperty("eatingCategories") && state.menu.eatingCategories.map((category, i) => {
                                                return (
                                                    <option key={i} value={category.pk}>{category.fields.name}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </span>

                                <div className='col-1' onClick={(() => { deleteEating(eating.id) })}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash my-3" viewBox="0 0 16 16">
                                        <title> Удалить прием пищи </title>
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <ul className="list-group list-group-flush">
                            <Ingredients eating_id={eating.id} />
                        </ul>
                    </div>
                )
            })}

            <div className='col-1' onClick={(() => { updateEating({ hikeDay_id: props.day_id }) })}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                    <title> Добавить прием пищи </title>
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
            </div>
        </div>
    );
});

export default Eatings;