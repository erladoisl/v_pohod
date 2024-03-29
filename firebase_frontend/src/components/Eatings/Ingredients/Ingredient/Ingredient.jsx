
import { Context } from "../../../../contexts/index";
import FBMenuService from '../../../../service/FBMenuService';
import { useEffect, useState, useContext } from "react";
import Select from 'react-select'

const menuService = new FBMenuService();


const Ingredient = ((props) => {
    const [state, dispatch] = useContext(Context);
    const [ingredient, set_ingredient] = useState(props.ingredient)
    const [options, set_options] = useState([])
    const update_options = () => {
        let options = []

        state.menu.food.forEach(el => {
            options.push({ label: el.name, value: el.id })
        });
        set_options(options)
    }
    useEffect(() => {
        update_options();
    }, [state.menu]);

    const addNotification = ((type, text) => {
        dispatch({ 'type': 'add_notification', 'notification': { type, text } })
    })

    const updateIngredient = (() => {
        if (ingredient.formula_id && ingredient.food_id) {
            console.log(`Вычисление кол-ва ингредиентов...`)
            menuService.updateIngredientAmount(ingredient).then(function (result) {
                if (!result.error) {
                    set_ingredient(result.ingredient)
                    addNotification('success', 'Количество ингредиента вычислено');
                } else {
                    addNotification('error', result.message);
                }
            })
        }
        menuService.updateIngredient(ingredient).then(function (result) {
            if (result.error === false) {
                console.log('Update Ingredient. Success', result);
                addNotification('success', 'Сохранено');
            } else {
                addNotification('error', result.message);
            }
        });
    });

    const get_ingredient_unit = ((ingredient) => {
        let result = 'гр.'

        if (state.menu.hasOwnProperty('food')) {
            const food = state.menu.food.filter(obj => {
                return obj.id === ingredient.food_id
            })
            if (food.length) {
                result = food[0].unit
            }
        }

        return result
    })

    return (
        <>
            <Select className="form-select btn-sm text-wrap border-0 rounded-0"
                options={options}
                defaultValue={{ label: ingredient.name || 'Выбрать...', value: ingredient.food_id }}
                onChange={((event) => { set_ingredient({ ...ingredient, food_id: event.value, name: event.label }) })}
                onBlur={(() => { updateIngredient() })} />

            <select className="form-select  btn-sm px-3 text-wrap border-0 rounded-0" aria-label="Default select example"
                defaultValue={ingredient.formula_id}
                onChange={((event) => { set_ingredient({ ...ingredient, formula_id: event.target.value }) })}
                onBlur={(() => { updateIngredient() })}>
                <option value={undefined}>Выбрать...</option>
                {state.menu.hasOwnProperty("formula") && state.menu.formula.map((formula) => {
                    return (
                        <option value={formula.id} key={formula.id}>{formula.name}</option>
                    )
                })}
            </select>
            <input type="text" className="btn-sm text-wrap form-control" value={`${ingredient.amount || 0} ${get_ingredient_unit(ingredient)}`} disabled style={{ width: '40%' }}></input>
        </>
    );
});

export default Ingredient;