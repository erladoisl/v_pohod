
import { Context } from "../../../../contexts/index";
import MenuService from '../../../../service/MenuService';
import React from 'react';
import { useEffect, useState } from "react";


const menuService = new MenuService();


const Ingredients = ((props) => {
    const [state, dispatch] = React.useContext(Context);
    const [ingredients, set_ingredients] = useState([]);

    useEffect(() => {
        if (ingredients.length === 0) {
            updateIngredients();
        };
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
        <div className="">
            <ul className="list-group list-group-flush">
                {ingredients.map((ingredient) => {
                    return (
                        <li className="list-group-item d-flex justify-content-between m-0 p-0">
                            <select class="form-select btn-sm text-wrap px-3 rounded-0" aria-label="Default select example">
                                {state.menu.hasOwnProperty("food") && state.menu.food.map((food) => {
                                    return (
                                        <option selected={ingredient.food_id === food.pk ? 'selected' : ''} key={food.id}>{food.fields.name}</option>
                                    )
                                })}
                            </select>
                            
                            <select class="form-select  btn-sm text-wrap px-3 border-start-0 rounded-0" aria-label="Default select example">
                                {state.menu.hasOwnProperty("formula") && state.menu.formula.map((formula) => {
                                    return (
                                        <option selected={ingredient.formula_id === formula.pk ? 'selected' : ''} key={formula.id}>{formula.fields.name}</option>
                                    )
                                })}
                            </select>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
});

export default Ingredients;