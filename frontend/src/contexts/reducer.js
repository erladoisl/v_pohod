export const reducer = (state, action) => {
  switch (action.type) {
    case "toggle_button":
      return {
        ...state,
        active: !state.active
      }
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
        eatingCategories: action.eatingCategories
      }
      case 'update_food':
        return {
          ...state,
          food: action.food
        }
    default:
      return state
  }
}

export const initialState = {
  active: false,
  user: undefined,
  eatingCategories: [],
  food: []
}