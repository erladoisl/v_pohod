
import { Context } from "../../../../contexts/index";
import MenuService from '../../../../service/MenuService';
import React from 'react';
import { useEffect, useState } from "react";
import Ingredient from "./Ingredient/Ingredient";


const menuService = new MenuService();


const Ingredients = ((props) => {
    const [state, dispatch] = React.useContext(Context);
    const [ingredients, set_ingredients] = useState([]);

    useEffect(() => {
        updateIngredients();
    }, []);


    const updateFood = (() => {
        menuService.getFood().then(function (result) {
            if (result.error === false) {
                dispatch({ 'type': 'update_food', 'food': JSON.parse(result.data) });
            } else {
                console.log(result);
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
                console.log(result);
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
                console.log(result);
            }
        });
    });


    const updateIngredient = ((data) => {
        menuService.updateIngredient(data).then(function (result) {
            if (result.error === false) {
                updateIngredients();
            } else {
                console.log(result);
            }
        });
    });


    const deleteIngredient = ((id) => {
        menuService.deleteIngredient(id).then(function (result) {
            if (result.error === false) {
                updateIngredients();
            } else {
                console.log(result);
            }
        });
    });


    const empty_result_html = ingredients.length === 0 ? (
        <div className="alert alert-info w-100" role="alert">
            Не найдено
        </div>
    ) : '';


    return (
        <div>
            <ul className="list-group list-group-flush">
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

            <div className='col-1 m-2' onClick={(() => { updateIngredient({ eating_id: props.eating_id }) })}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                    <title> Добавить ингредиент </title>
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
            </div>
        </div>
    );
});

export default Ingredients;