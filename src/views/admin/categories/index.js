import React from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CategoryList from 'components/category/CategoryList';
import Boundary from 'components/ui/Boundary';
import CategoryItem from '../components/CategoryItem';

import { ADD_CATEGORY } from 'constants/routes';

const Categories = ({ history, location }) => {
  const { store } = useSelector(state => ({
    store: {
      categoriesLength: state.categories.items.length,
      categories: state.categories.items,
      isLoading: state.app.loading,
      requestStatus: state.app.requestStatus,
      lastRefKey: state.categories.lastRefKey,
      totalItems: state.categories.total
    }
  }));
  const dispatch = useDispatch();

  const onClickAddCategory = () => {
    history.push(ADD_CATEGORY);
  };
  
  // TODO insufficient permission
  // TODO fix filters modal
  return (
    <Boundary>
      <div className="product-admin-header">
        <h3 className="product-admin-header-title">
          Categories
        </h3>
        <button 
            className="button button-small"
            onClick={onClickAddCategory}
        >
          Add New Category
        </button>
      </div>
      <div className="product-admin-items">
        <CategoryList
            dispatch={dispatch}
            categories={store.categories}
            categoriesLength={store.categoriesLength}
            isLoading={store.isLoading}
            location={location}
            totalItems={store.totalItems}
            lastRefKey={store.lastRefKey}
            requestStatus={store.requestStatus}
        >
            <div className="grid grid-product grid-count-3">
              <div className="grid-col"></div>
              <div className="grid-col">
                <h5>Name</h5>
              </div>
              <div className="grid-col">
                <h5>Date Added</h5>
              </div>
            </div>
            {store.categories.length === 0 ? new Array(10).fill({}).map((category, index) => (
              <CategoryItem 
                  key={`product-skeleton ${index}`}
                  category={category}
              />
            )): store.categories.map(category => (
              <CategoryItem 
                  key={category.id}
                  category={category}
                  dispatch={dispatch}
              />
            ))}
        </CategoryList>
      </div>
    </Boundary>
  );
};

export default withRouter(Categories);