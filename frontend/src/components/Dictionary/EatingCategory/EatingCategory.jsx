import React from 'react';
import { Context } from "../../../contexts/index"
import { useRef } from "react"
import MenuService from '../../../service/MenuService';


const menuService = new MenuService();


export default function EatingCategory() {
    const [state, dispatch] = React.useContext(Context);
    const newCategory = useRef()

    const addCategorySubmit = ((e) => {
        e.preventDefault()
        menuService.addEatingCategory(newCategory.current.value, state.user.token).then(function (result) {
            if (result.error === false) {
                udateCategories()
                newCategory.current.value = ''
            } else {
                console.log(result)
            }
        });
    });


    const deleteCategory = ((name) => {
        menuService.deleteEatingCategory(name, state.user.token).then(function (result) {
            if (result.error === false) {
                udateCategories()
            } else {
                console.log(result)
            }
        });
    });


    const udateCategories = (() => {
        menuService.getEatingCategories(state.user.token).then(function (result) {
            if (result.error === false) {
                dispatch({ 'type': 'update_eating_category', 'eatingCategories': JSON.parse(result.data) })
            } else {
                console.log(result)
            }
        });
    });

    
    if (state.eatingCategories.length === 0) {
        udateCategories();
    }

    
    return (
        <div className="col-12 py-5 card mb-3">
            <h2 className="fw-light">Типы приемов пищи</h2>

            <ul className="list-group mb-3">
                {state.eatingCategories.map((category, i) => {
                    return (
                        <div className="input-group p-1" key={i}>
                            <input type="text" className="form-control" value={category.fields.name} placeholder="Promo code" disabled />

                            <button type="submit" className="btn btn-danger" onClick={() => { deleteCategory(category.fields.name) }}>X</button>
                        </div>
                    )
                })}
            </ul>

            <form className="card p-2" onSubmit={addCategorySubmit}>
                <div className="input-group">
                    <input type="text" ref={newCategory} className="form-control" placeholder="Новый тип" required />

                    <button type="submit" className="btn btn-secondary">Добавить</button>
                </div>
            </form>
        </div>
    )
}