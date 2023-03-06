import {
    delete_object,
    edit_object,
    get_objects,
    get_objects_by_field,
    updateIngredientAmount
} from './FirebaseService';

export default class MenuService {
    getEatingCategories() {
        return get_objects('eating_category')
    }

    updateEatingCategory(eating_category) {
        return edit_object(eating_category, 'eating_category')
    }

    deleteEatingCategory(object) {
        return delete_object(object, 'eating_category')
    }

    getFood() {
        return get_objects('food')
    }

    updateFood(food) {
        return edit_object(food, 'food')
    }

    deleteFood(object) {
        return delete_object(object, 'food')
    }

    getFormula() {
        return get_objects('formula')
    }

    updateFormula(formula) {
        return edit_object(formula, 'formula')
    }

    deleteFormula(object) {
        return delete_object(object, 'formula')
    }

    getDayEatings(hike_day_id) {
        return get_objects_by_field('hike_day_id', hike_day_id, 'eatings')//, 'eating_category_id', true)
    }

    updateDayEating(object) {
        return edit_object(object, 'eatings')
    }

    deleteEating(object) {
        return delete_object(object, 'eatings')
    }

    getEatingIngredients(eating_id) {
        return get_objects_by_field('eating_id', eating_id, 'ingredients')
    }

    updateIngredient(object) {
        return edit_object(object, 'ingredients')
    }

    updateIngredientAmount(ingredient) {
        return updateIngredientAmount(ingredient)
    }
    deleteIngredient(object) {
        return delete_object(object, 'ingredients')
    }
};