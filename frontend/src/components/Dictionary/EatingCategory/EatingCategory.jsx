import React from 'react';
import { Context } from "../../../contexts/index"
import { useRef, useState } from "react"
import MenuService from '../../../service/MenuService';
const menuService = new MenuService();

let categories = [
    {
        id: 1,
        name: 'Завтрак'
    },
    {
        id: 2,
        name: 'Перекус'
    },
    {
        id: 3,
        name: 'Обед'
    },
    {
        id: 4,
        name: 'Ужин'
    },
]


export default function EatingCategory() {
    const [state, dispatch] = React.useContext(Context);
    window.state = state
    const [eatingCategories, setEatingCategories] = useState(categories)
    const newCategory = useRef()

    const addCategorySubmit = ((e) => {
        console.log(`new category: ${newCategory}`)
        e.preventDefault()
        menuService.addEatingCategory(newCategory.current.value, state.user.token).then(function (result) {
            if (result.error == false) {
                dispatch({ 'type': 'addEatingCategory', 'newCategory': result.data })
            } else {
                console.log(result)
            }
        });
    });

    return (
        <div className="col-12">
            <h1 className="fw-light">Типы приемов пищи</h1>

            <ul className="list-group mb-3">

                {eatingCategories.map((category, i) => {
                    return (
                        <div class="input-group p-1" key={i}>
                            <input type="text" class="form-control" value={category.name} placeholder="Promo code" disabled />
                            {/* <button type="submit" class="btn btn-secondary">Сохранить</button> */}
                            <button type="submit" class="btn btn-danger" onClick={() => {console.log(`delete ${category.id}`)}}>X</button>
                        </div>
                    )
                })}
            </ul>
            <form className="card p-2">
                <div className="input-group">
                    <input type="text" ref = {newCategory} className="form-control" placeholder="Новый тип" />
                    <button type="submit" className="btn btn-secondary" onClick={addCategorySubmit}>Добавить</button>
                </div>
            </form>
        </div>
    )
}