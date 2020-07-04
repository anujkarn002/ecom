import React, { useRef } from 'react';
import { withRouter } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ImageLoader from 'components/ui/ImageLoader';

import { removeCategory } from 'actions/categoryActions';
import { EDIT_CATEGORY } from 'constants/routes';
import { displayDate, displayActionMessage } from 'helpers/utils';

const CategoryItem = ({ category, dispatch, history }) => {
  const categoryRef = useRef(null);

  const onClickEdit = () => {
    history.push(`${EDIT_CATEGORY}/${category.id}`);
  };

  const onDeleteCategory = () => {
    categoryRef.current.classList.toggle('item-active');
  };
  
  const onConfirmDelete = () => {
    dispatch(removeCategory(category.id));
    displayActionMessage('Item successfully deleted');
    categoryRef.current.classList.remove('item-active');
  };

  const onCancelDelete = () => {
    categoryRef.current.classList.remove('item-active');
  };

  return (
    <SkeletonTheme color="#e1e1e1" highlightColor="#f2f2f2">
      <div 
          className={`item item-products ${!category.id && 'item-loading'}`}
          ref={categoryRef}
      >
        <div className="grid grid-count-3" style={{height: 50}}>
        <div className="grid-col item-img-wrapper">
            {category.image ? (
              <ImageLoader 
                  alt={category.name}
                  className="item-img"
                  src={category.image} 
              />
            ) : <Skeleton width={50} height={30}/>}
          </div>
          <div className="grid-col">
            <span className="text-overflow-ellipsis">{category.name || <Skeleton width={50}/>}</span>
          </div>
          <div className="grid-col">
            <span>{category.dateAdded ? displayDate(category.dateAdded) : <Skeleton width={30}/>}</span>
          </div>
        </div>
        {category.id && (
          <div className="item-action">
            <button 
                className="button button-border button-small"
                onClick={onClickEdit}
            >
              Edit
            </button>
            &nbsp;
            <button
                className="button button-border button-small"
                onClick={onDeleteCategory}
            >
              Delete
            </button>
            <div className="item-action-confirm">
              <h5>Are you sure you want to delete this?</h5>
              <button 
                  className="button button-small button-border"
                  onClick={onCancelDelete}
              >
                No
              </button>
              &nbsp;
              <button 
                  className="button button-small"
                  onClick={onConfirmDelete}
              >
                Yes
              </button>
            </div>
          </div>
        )}
      </div>
    </SkeletonTheme>
  );
};

export default withRouter(CategoryItem);
