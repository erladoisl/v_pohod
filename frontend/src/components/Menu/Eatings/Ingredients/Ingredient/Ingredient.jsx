
import { Context } from "../../../../../contexts/index";
import MenuService from '../../../../../service/MenuService';
import { useEffect, useState, useContext } from "react";


const menuService = new MenuService();


const Ingredient = ((props) => {
    const [state, dispatch] = useContext(Context);
    const [ingredient, set_ingredient] = useState(props.ingredient)

    // создание словарей
    {
        const updateFoodList = (() => {
            menuService.getFood().then(function (result) {
                if (result.error === false) {
                    dispatch({ 'type': 'update_food', 'food': JSON.parse(result.data) });
                } else {
                    console.log(result);
                }
            });
        });


        const updateFormulaList = (() => {
            menuService.getFormula().then(function (result) {
                if (result.error === false) {
                    dispatch({ 'type': 'update_formula', 'formula': JSON.parse(result.data) });
                } else {
                    console.log(result);
                };
            });
        });


        if (!state.menu.hasOwnProperty("food")) {
            updateFoodList();
        };

        if (!state.menu.hasOwnProperty("formula")) {
            updateFormulaList();
        };
    }

    const updateIngredient = (() => {
        console.log(ingredient)
        menuService.updateIngredient(ingredient).then(function (result) {
            if (result.error === false) {
                console.log('Update Ingredient. Success', result);
            } else {
                console.log(result);
            }
        });
    });


    return (
        <>
            <select className="form-select btn-sm text-wrap px-3 rounded-0" aria-label="Default select example"
                defaultValue={parseInt(ingredient.food_id)}
                onChange={((event) => { set_ingredient({ ...ingredient, food_id: event.target.value }) })}
                onBlur={(() => { updateIngredient() })} >

                {state.menu.hasOwnProperty("food") && state.menu.food.map((food) => {
                    return (
                        <option value={food.pk} key={food.pk}>{food.fields.name}</option>
                    )
                })}
            </select>

            <select className="form-select  btn-sm text-wrap px-3 border-start-0 rounded-0" aria-label="Default select example"
                defaultValue={parseInt(ingredient.formula_id)}
                onChange={((event) => { set_ingredient({ ...ingredient, formula_id: event.target.value }) })}
                onBlur={(() => { updateIngredient() })}>
                {state.menu.hasOwnProperty("formula") && state.menu.formula.map((formula) => {
                    return (
                        <option value={formula.pk} key={formula.pk}>{formula.fields.name}</option>
                    )
                })}
            </select>
        </>
    );
});

export default Ingredient;