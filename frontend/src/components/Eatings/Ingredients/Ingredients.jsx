
import { Context } from "../../../contexts/index";
import MenuService from '../../../service/MenuService';
import React from 'react';
import { useEffect, useState } from "react";
import Ingredient from "./Ingredient/Ingredient";


const menuService = new MenuService();


const Ingredients = ((props) => {
    const [state, dispatch] = React.useContext(Context);
    const [ingredients, set_ingredients] = useState([]);
    const [loading, set_loading] = useState(true);

    const addNotification = ((type, text) => {
        dispatch({ 'type': 'add_notification', 'notification': { type, text } })
    })

    useEffect(() => {
        updateIngredients();
    }, []);

    const updateFood = (() => {
        menuService.getFood().then(function (result) {
            if (result.error === false) {
                dispatch({ 'type': 'update_food', 'food': JSON.parse(result.data) });
            } else {
                addNotification('error', result.message);
            }
        });
    });


    if (!state.menu.hasOwnProperty("food")) {
        updateFood();
    }


    const updateFormula = (() => {
        menuService.getFormula().then(function (result) {
            if (result.error === false) {
                dispatch({ 'type': 'update_formula', 'formula': JSON.parse(result.data) });
            } else {
                addNotification('error', result.message);
            };
        });
    });


    if (!state.menu.hasOwnProperty("formula")) {
        updateFormula();
    };


    const updateIngredients = (() => {
        menuService.getEatingIngredients(props.eating_id).then(function (result) {
            if (result.error === false) {
                set_ingredients(result.data);
            } else {
                addNotification('error', result.message);
            }
            set_loading(false)
        });
    });


    const updateIngredient = ((data) => {
        menuService.updateIngredient(data).then(function (result) {
            if (result.error === false) {
                updateIngredients();
            } else {
                addNotification('error', result.message);
            }
        });
    });


    const deleteIngredient = ((id) => {
        menuService.deleteIngredient(id).then(function (result) {
            if (result.error === false) {
                updateIngredients();
            } else {
                addNotification('error', result.message);
            }
        });
    });


    const empty_result_html = ingredients.length === 0 ? (
        <div className="alert alert-info w-100" role="alert">
            {loading ? 'загрузка...' : 'Нет ингредиентов'}
        </div>
    ) : '';


    return (
        <div>
            <ul className="list-group list-group-flush">
                {empty_result_html}
                {ingredients.map((ingredient) => {
                    return (
                        <li className="list-group-item d-flex justify-content-between m-0 p-0" key={ingredient.id}>
                            <Ingredient ingredient={ingredient} />

                            <div className='col-1' onClick={(() => { deleteIngredient(ingredient.id) })}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash my-3" viewBox="0 0 16 16">
                                    <title> Удалить ингредиент </title>
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                </svg>
                            </div>
                        </li>
                    )
                })}
            </ul>

            <div className='text-start m-2'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle mx-1" viewBox="0 0 16 16" style={{ cursor: 'pointer' }}
                    onClick={(() => { updateIngredient({ eating_id: props.eating_id }) })}>
                    <title> Добавить ингредиент </title>
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                ингредиент
            </div>
        </div>
    );
});

export default Ingredients;