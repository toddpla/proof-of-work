import database from '../firebase/firebase'
import impassables from '../data/maps/level1/impassable'

export const updateEgg = (egg) => ({
  type: "UPDATE_EGG",
  egg
})

export const startOnEgg = () => {
  return (dispatch) => {
    return database.ref('egg').on('value', (snap) => {
      console.log('here');
      dispatch(updateEgg(snap.val()))
    })
  }
}

export const startWinEgg = () => {
  return (dispatch, getState) => {
    const player = getState().auth
    let locationNotFound = true
    let left, top, checkBoo
    while (locationNotFound) {
      checkBoo = false
      left = Math.floor(Math.random() * 64) * 16
      top = Math.floor(Math.random() * 42) * 16
      impassables.forEach(({x, y}) => {
        if (x === left && y === top) {
          checkBoo = true
        }
        locationNotFound = checkBoo
      })
    }
    let updates = {}
    updates[`egg`] = {left, top}
    updates[`players/${player.uid}/cash`] = player.cash + 1000
    return database.ref().update(updates)
  }
}
