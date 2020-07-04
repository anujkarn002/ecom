import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '../ui/CircularProgress';
import MessageDisplay from '../ui/MessageDisplay';


import { ADMIN_PRODUCTS } from 'constants/routes';
import { getCategories } from 'actions/categoryActions';
import { isLoading as dispatchIsLoading } from 'actions/appActions';

const CategoryList = ({ 
  isLoading, 
  requestStatus, 
  categoriesLength,
  lastRefKey,
  totalItems,
  dispatch,
  children 
}) => {
  const [isFetching, setFetching] = useState(false);

  useEffect(() => {
    if (categoriesLength === 0){
      fetchCategories();
    }
    
    window.scrollTo(0, 0);
    return () => dispatch(dispatchIsLoading(false));
  }, []);

  useEffect(() => {
    setFetching(false);
  }, [lastRefKey]);

  const fetchCategories = () => {
    setFetching(true);
    dispatch(getCategories(lastRefKey));
  };

  return (
    <>
      
      {children}
    </>
  )
};

CategoryList.propType = {
  isLoading: PropTypes.bool.isRequired,
  requestStatus: PropTypes.string.isRequired,
  categoriesLength: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default CategoryList;

