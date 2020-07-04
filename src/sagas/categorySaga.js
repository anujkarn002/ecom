import { call, put, select } from 'redux-saga/effects';
import firebase from 'firebase/firebase';

import {
  LOADING,
  SET_REQUEST_STATUS,
  GET_CATEGORIES,
  CANCEL_GET_CATEGORIES,
  ADD_CATEGORY,
  EDIT_CATEGORY,
  REMOVE_CATEGORY,
} from 'constants/constants';

import { 
  getCategoriesSuccess, 
  addCategorySuccess, 
  editCategorySuccess,
  removeCategorySuccess 
} from 'actions/categoryActions';

import { displayActionMessage } from 'helpers/utils';
import { history } from 'routers/AppRouter';
import { ADMIN_CATEGORIES } from 'constants/routes';

function* initRequest() {
  yield put({ type: LOADING, payload: true });
  yield put({ type: SET_REQUEST_STATUS, payload: null });
}

function* handleError(e) {
  yield put({ type: LOADING, payload: false });
  yield put({ type: SET_REQUEST_STATUS, payload: e });
  console.log('ERROR: ', e);
}

function* handleAction(location, message, status) {
  if (location) yield call(history.push, location);
  yield call(displayActionMessage, message, status);
}

function* categorySaga({ type, payload }) {
  switch (type) {
    case GET_CATEGORIES:
      try {
        yield initRequest();
        const state = yield select();
        const result = yield call(firebase.getCategories);
        console.log(result);
        console.log(1);
        console.log(result.categories);
        yield put(getCategoriesSuccess({ 
          categories: result.categories,
          lastKey: result.lastKey ? result.lastKey : state.categories.lastRefKey,
          total: result.total ? result.total : state.categories.total
        }));
        console.log(2)
        // yield put({ type: SET_LAST_REF_KEY, payload: result.lastKey });
        yield put({ type: LOADING, payload: false });
      } catch (e) {
        console.log("get_categories-error");
        yield handleError(e);
      }
      break;
    case ADD_CATEGORY:
      try {
        yield initRequest();

        const key = yield call(firebase.generateKey, 'categories');
        const downloadURL = yield call(firebase.storeImage, key, 'categories', payload.image);


        yield call(firebase.addCategory, key, { ...payload, image: downloadURL });

        yield put(addCategorySuccess({
          id: key,
          ...payload,
          image: downloadURL
        }));
        yield handleAction(ADMIN_CATEGORIES, 'Item succesfully added', 'success');
        yield put({ type: LOADING, payload: false });
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, 'Item failed to add: ' + e.message_, 'error');
      }
      break;
    case EDIT_CATEGORY:
      try {
        yield initRequest();

        const { image } = payload.updates;

        if (image.constructor === File && typeof image === 'object') {
          yield call(firebase.deleteImage, payload.id, 'categories');
          const downloadURL = yield call(firebase.storeImage, payload.id, 'categories', image);
          const updates = { ...payload.updates, image: downloadURL };

          yield call(firebase.editCategory, payload.id, updates);
          yield put(editCategorySuccess({ 
            id: payload.id, 
            updates
          }));
          
        } else {
          yield call(firebase.editCategory, payload.id, payload.updates);
          yield put(editCategorySuccess({ 
            id: payload.id, 
            updates: payload.updates
          }));
          
        }

        yield handleAction(ADMIN_CATEGORIES, 'Item succesfully edited', 'success');
        yield put({ type: LOADING, payload: false });
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, 'Item failed to edit: ' + e.message, 'error');
      }
      break;
    case REMOVE_CATEGORY:
      try {
        yield initRequest();
        yield call(firebase.removeCategory, payload);
        yield call(firebase.deleteImage, payload.id, 'categories');
        yield put(removeCategorySuccess(payload));
        yield put({ type: LOADING, payload: false });
        yield handleAction(ADMIN_CATEGORIES, 'Item succesfully removed', 'success');
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, 'Item failed to remove: ' + e.message, 'error');
      }
      break;
    default:
      return;
  }
}

export default categorySaga;