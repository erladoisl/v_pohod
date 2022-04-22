export const reducer = (state, action) => {
  switch (action.type) {
    case 'authorization':
      return {
        ...state,
        user: action.user
      }
    case 'edit_user':
      return {
        ...state,
        user: action.user
      }
    case 'update_eating_category':
      return {
        ...state,
        menu: {
          ...state.menu,
          eatingCategories: action.eatingCategories
        }
      }
    case 'update_food':
      return {
        ...state,
        menu: {
          ...state.menu,
          food: action.food
        }
      }
    case 'update_formula':
      return {
        ...state,
        menu: {
          ...state.menu,
          formula: action.formula
        }
      }
    default:
      return state
  }
}


export const initialState = {
  user: undefined,
  menu: {
  }
}