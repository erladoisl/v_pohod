export const reducer = (state, action) => {
    switch (action.type) {
        case 'update_user':
            return {
                ...state,
                user: action.user
            };
        case 'edit_user':
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.user
                }
            };
        case 'update_eating_category':
            return {
                ...state,
                menu: {
                    ...state.menu,
                    eatingCategories: action.eatingCategories
                }
            };
        case 'update_food':
            return {
                ...state,
                menu: {
                    ...state.menu,
                    food: action.food
                }
            };
        case 'update_formula':
            return {
                ...state,
                menu: {
                    ...state.menu,
                    formula: action.formula
                }
            };
        case 'add_notification':
            return {
                ...state,
                notifications: (state.hasOwnProperty('notifications') ? state.notifications: []).concat(action.notification)
            };
        case 'delete_notification':
            state.notifications.splice(action.index, 1)
            return {
                ...state
            };
        default:
            break
    }
}


export const initialState = {
    menu: {},
    notifications: []
}