const defaultAuthReducerState = {
  inventory: {
    ruby: [],
    bean: [],
    miscellaneous: [],
    key: []
  }
}



export default (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...action.player
      }
    case 'LOGOUT':
      return {};
    case 'ADD_INVENTORY_ITEM':
      const items = state.inventory[action.itemRef]
      items.push(action.item)
      return {
        ...state,
        inventory: {
          ...state.inventory,
          [action.itemRef]: items
        }
      }
    case "UPDATE_PLAYER":
      return {
        ...state,
        ...action.updates
      }
    default:
      return state
  }
}
