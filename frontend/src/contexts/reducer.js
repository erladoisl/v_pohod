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
    default:
      return state
  }
}

export const initialState = {
  active: false,
  user: undefined
}