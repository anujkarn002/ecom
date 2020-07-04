import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { editCategory } from 'actions/categoryActions';

import CategoryForm from '../components/CategoryForm';

const EditCategory = (props) => {
  const { category, isLoading } = useSelector(state => ({
    category: state.categories.items.find(category => category.id === props.match.params.id),
    isLoading: state.app.loading
  }));
  const dispatch = useDispatch();

  const onSubmitForm = (updates) => {
    dispatch(editCategory(category.id, updates));
  };

  return (
    <div className="product-form-container">
      {!category && <Redirect to="/dashboard/categories" />}
      <h2>Edit Category</h2>
      <CategoryForm 
          isLoading={isLoading}
          onSubmit={onSubmitForm}
          category={category} 
      />
    </div>
  );
};

export default withRouter(EditCategory);