
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


    const deleteDay = ((id) => {
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
                                <input type="text" className="form-control bg-light border-0 text-wrap" value={eating.name} placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                <span className="input-group-text bg-light border-0" id="basic-addon2">
                                    <div className="btn-group">

                                        <select class="form-select bg-light btn-sm px-4 border-0">
                                            {state.menu.hasOwnProperty("eatingCategories") && state.menu.eatingCategories.map((category) => {
                                                return (
                                                    <option selected={eating.eating_category_id === category.pk ? 'selected' : ''} key={category.id}>{category.fields.name}</option>
                                                )
                                            })}
                                        </select>
                                    </div></span>
                            </div>
                        </div>

                        <ul className="list-group list-group-flush">
                            <Ingredients eating_id={eating.id} />
                        </ul>
                    </div>
                )
            })}
        </div>
    );
});

export default Eatings;