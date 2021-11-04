import {
    GET_INITIAL_RAINGS
  } from "./ratingActions";
  
  export const initialState = {
    rating: []
  };
  
  function ratingReducer(state = initialState, action) {
    switch (action.type) {
      case GET_INITIAL_RAINGS: {
          let prueba2 = 0
          let prueba = action.payload
          prueba = prueba.map(e => {
            return {...e, rating: e.rating.reduce()}//**************************** */
            })
           //{id: 1, votes: 1, ratings: [5,2,3]}
          //[{productId: 1, votes: 1, average: 1}, {productId: 2, votes: 1, average: 1}]
          //action.productId
          //action.rating
          //1. action.rating
        return {
          ...state,
          rating: action.payload
        };
      }
      default:
        return state;
    }
  }
  
  export default ratingReducer;
  