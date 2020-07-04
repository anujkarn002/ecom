import { 
  ADD_CATEGORY,
  ADD_CATEGORY_SUCCESS, 
  REMOVE_CATEGORY, 
  REMOVE_CATEGORY_SUCCESS,
  EDIT_CATEGORY, 
  EDIT_CATEGORY_SUCCESS,
  GET_CATEGORIES,
  GET_CATEGORIES_SUCCESS,
  CANCEL_GET_CATEGORIES 
} from 'constants/constants';

export const getCategories = lastRef => ({
  type: GET_CATEGORIES,
  payload: lastRef
});

export const getCategoriesSuccess = categories => ({
  type: GET_CATEGORIES_SUCCESS,
  payload: categories
});

export const cancelGetCategories = () => ({
  type: CANCEL_GET_CATEGORIES
});

export const addCategory = category => ({
  type: ADD_CATEGORY,
  payload: category
});

export const addCategorySuccess = category => ({
  type: ADD_CATEGORY_SUCCESS,
  payload: category
});

export const removeCategory = id => ({
  type: REMOVE_CATEGORY,
  payload: id
});

export const removeCategorySuccess = id => ({
  type: REMOVE_CATEGORY_SUCCESS,
  payload: id
});

export const editCategory = (id, updates) => ({
  type: EDIT_CATEGORY,
  payload: {
    id,
    updates
  }
});

export const editCategorySuccess = updates => ({
  type: EDIT_CATEGORY_SUCCESS,
  payload: updates
});
