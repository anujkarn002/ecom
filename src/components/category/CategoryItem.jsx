import React from 'react';
import PropTypes from 'prop-types';
import { displayActionMessage } from 'helpers/utils';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ImageLoader from '../ui/ImageLoader';


const CategoryItem = ({ 
  category,
  displaySelected,
  dispatch,
 }) => {

  const onClickItem = () => {
    if (category.id) {
      displayActionMessage('Feature not ready yet :)', 'info');
      // displaySelected(category);
    }
  };

  return (
    <SkeletonTheme color="#e1e1e1" highlightColor="#f2f2f2">
      <div 
          className={`flex-1 text-center px-4 py-2 m-2 ${!category.id ? 'product-loading' : ''}`}
          style={{height: 70}}
      >
        <div 
            className=""
            onClick={onClickItem}    
        >
          <div className="product-card-img-wrapper" style={{height: 50}}>
            {category.image ? (
              <ImageLoader 
                  className="product-card-img" 
                  src={category.image}
              />
            ) : <Skeleton width={'100%'} height={'90%'}/>}
          </div>
          <div className="">
            <h5 className="text-center">{category.name || <Skeleton width={80} />}</h5>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

CategoryItem.propType = {
  onClickItem: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
  category: PropTypes.object.isRequired,
};

export default CategoryItem;
