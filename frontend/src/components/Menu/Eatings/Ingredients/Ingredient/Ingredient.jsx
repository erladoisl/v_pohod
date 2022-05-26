
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


    const get_unit = ((food_id) => {
        let unit = 'гр.'

        for (let i = 0; i < state.menu.food.length; i++) {
            if (parseInt(state.menu.food[i].pk) == parseInt(ingredient.food_id)) {
                unit = state.menu.food[i].fields.unit
            }
        }

        return unit
    });


    return (
        <>
            <select className="form-select btn-sm text-wrap px-3 border-0 rounded-0" aria-label="food_id"
                defaultValue={parseInt(ingredient.food_id)}
                onChange={((event) => { set_ingredient({ ...ingredient, food_id: event.target.value }) })}
                onBlur={(() => { updateIngredient() })} >

                {state.menu.hasOwnProperty("food") && state.menu.food.map((food) => {
                    return (
                        <option value={food.pk} key={food.pk}>{food.fields.name}</option>
                    )
                })}
            </select>

            <select className="form-select  btn-sm px-3 text-wrap border-0 rounded-0" aria-label="Default select example"
                defaultValue={parseInt(ingredient.formula_id)}
                onChange={((event) => { set_ingredient({ ...ingredient, formula_id: event.target.value }) })}
                onBlur={(() => { updateIngredient() })}>
                {state.menu.hasOwnProperty("formula") && state.menu.formula.map((formula) => {
                    return (
                        <option value={formula.pk} key={formula.pk}>{formula.fields.name}</option>
                    )
                })}
            </select>
            <input type="text" className="btn-sm text-wrap form-control" value={`${ingredient.amount} ${get_unit(get_unit(ingredient.food_id))}`} disabled style={{width: '40%'}}></input>
        </>
    );
});

export default Ingredient;