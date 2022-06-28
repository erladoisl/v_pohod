
import { Context } from "../../../../contexts/index";
import MenuService from '../../../../service/MenuService';
import { useState, useContext } from "react";
import Select from 'react-select'

const menuService = new MenuService();


const Ingredient = ((props) => {
    const [state, dispatch] = useContext(Context);
    const [ingredient, set_ingredient] = useState(props.ingredient)

    const addNotification = ((type, text) => {
        dispatch({ 'type': 'add_notification', 'notification': { type, text } })
    })

    const updateIngredient = (() => {
        menuService.updateIngredient(ingredient).then(function (result) {
            if (result.error === false) {
                console.log('Update Ingredient. Success', result);
            } else {
                addNotification('error', result.message);
            }
        });
    });

    return (
        <>
            <Select className="form-select btn-sm text-wrap border-0 rounded-0"
                options={state.menu.food}
                defaultValue={{label: ingredient.food_name, value: ingredient.food_id}} 
                onChange={((event) => { set_ingredient({ ...ingredient, food_name: event.label, food_id: event.value }) })}
                onBlur={(() => { updateIngredient() })} />

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
            <input type="text" className="btn-sm text-wrap form-control" value={`${ingredient.amount} ${ingredient.unit}`} disabled style={{ width: '40%' }}></input>
        </>
    );
});

export default Ingredient;