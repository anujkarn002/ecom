import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CircularProgress from 'components/ui/CircularProgress';
import ImageLoader from 'components/ui/ImageLoader';

import Input from 'components/ui/Input';
import useFileHandler from 'hooks/useFileHandler';


// import uuid from 'uuid';

const CategoryForm = ({ category, onSubmit, isLoading }) => {
  const [field, setField] = useState({
    name: { value: category ? category.name : ''},
    description: { value: category ? category.description : '' },
    imageUrl: { value: category ? category.image : '' }
  });

  const userId = useSelector(state => state.auth.id);


  const { 
    imageFile, 
    setImageFile, 
    isFileLoading, 
    onFileChange 
  } = useFileHandler({ image: {}});

  const onCategoryNameInput = (e, value, error) => {
    setField({ ...field,  name: { value, error } });
  }

  const onCategoryDescriptionInput = (e, value, error) => {
    setField({ ...field,  description: { value, error } });
  }


  const onSubmitForm = (e) => {
    e.preventDefault();
    const noError = Object.keys(field).every(key => !!!field[key].error);

    if (field.name.value 
      && (imageFile.image.file || field.imageUrl.value)
      && noError
    ) {
      const category = {};

      for (let i in field) {
        category[i] = field[i].value;
      }

      onSubmit({ 
        ...category, 
        dateAdded: new Date().getTime(),
        addedBy: userId,
        image: imageFile.image.file ? imageFile.image.file : field.imageUrl.value
      });
    }
  }

  return (
      <div>
        <form 
            className="product-form" 
            onSubmit={onSubmitForm}
        >
          <div className="product-form-inputs">
            <div className="d-flex">
              <div className="product-form-field">
                <Input 
                    label="* Category Name"
                    maxLength={60}
                    readOnly={isLoading}
                    placeholder="Electronics"
                    onInputChange={onCategoryNameInput}
                    isRequired={true}
                    field="name"
                    style={{ textTransform: 'capitalize' }}
                    type="text"
                    value={field.name.value}
                />
              </div>
            </div>
            <div className="product-form-field product-textarea">
              <Input 
                  label="Category Description"
                  maxLength={200}
                  cols={37}
                  rows={5}
                  readOnly={isLoading}
                  placeholder="Nice Description"
                  onInputChange={onCategoryDescriptionInput}
                  isRequired={false}
                  field="description"
                  type="textarea"
                  value={field.description.value}
              />
            </div>
            <br/>
            <div className="product-form-field product-form-submit">
              <button 
                  className="button"
                  disabled={isLoading}
                  type="submit"
              >
                <CircularProgress visible={isLoading} theme="light" />
                {isLoading ? 'Saving Category' : 'Save Category'}
              </button>
            </div>
          </div>
          <div className="product-form-file">
            <div className="product-form-field">
              <span className="d-block padding-s">* Image</span>
              <input 
                  disabled={isLoading}
                  hidden
                  id="product-input-file"
                  onChange={(e) => onFileChange(e, 'image')}
                  readOnly={isLoading}
                  type="file" 
              />
              {!isFileLoading && (
                <label htmlFor="product-input-file">
                  Choose Image
                </label>
              )}
            </div>
            {(imageFile.image.url || field.imageUrl.value) && (
              <div className="product-form-img-wrapper">
                <ImageLoader
                    alt=""
                    className="product-form-image-preview"
                    src={imageFile.image.url || field.imageUrl.value} 
                />
                </div>
            )}
          </div>
        </form>
      </div>
    );
}

export default CategoryForm;
