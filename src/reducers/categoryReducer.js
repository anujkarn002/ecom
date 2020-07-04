import {     
  ADD_CATEGORY_SUCCESS, 
  REMOVE_CATEGORY_SUCCESS,
  EDIT_CATEGORY_SUCCESS,
  GET_CATEGORIES_SUCCESS,
} from 'constants/constants';

export default (state = {
  lastRefKey: null,
  total: 0,
  items: []
}, action) => {
  switch (action.type) {
    case GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        lastRefKey: action.payload.lastKey,
        total: action.payload.total,
        items: [ ...state.items, ...action.payload.categories ]
      };
    case ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case REMOVE_CATEGORY_SUCCESS:
      return {
        ...state,
        items: state.items.filter(category => category.id !== action.payload)
      }
    case EDIT_CATEGORY_SUCCESS:
      return {
        ...state,
        items: state.items.map((category) => {
          if (category.id === action.payload.id) {
            return {
              ...category,
              ...action.payload.updates
            };
          }
          return category;
        }) 
      };
    default:
      return state;
  }
};
