import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CategoryForm from '../components/CategoryForm';
import { addCategory } from 'actions/categoryActions';

const AddCategory = () => {
  const isLoading = useSelector(state => state.app.loading);
  const dispatch = useDispatch();

  const onSubmit = (category) => {
    dispatch(addCategory(category));
  };

  return (
    <div className="product-form-container">
      <h2>Add New Category</h2>
      <CategoryForm 
          isLoading={isLoading}
          onSubmit={onSubmit}
      />
    </div>
  );
};

export default withRouter(AddCategory);
