import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilter } from 'selectors/selector';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";


import ProductCarousel from 'components/ui/ProductCarousel';
import ProductList from 'components/product/ProductList';
import ProductItem from 'components/product/ProductItem';
import CategoryList from 'components/category/CategoryList';
import CategoryItem from 'components/category/CategoryItem';
import ProductAppliedFilters from 'components/product/ProductAppliedFilters';
import Modal from 'components/ui/Modal';
import Boundary from 'components/ui/Boundary';
import ProductModalDetails from 'components/product/ProductModalDetails';

import HeroCarousel from 'components/ui/HeroCarousel';

const Home = (props) => {
  const [isOpenModal, setModalOpen] = useState(false);
  const [productSelected, setProductSelected] = useState(null);
  const [columnCount, setColumnCount] = useState(6);

  const { store } = useSelector(state => ({
    store: {
      productsLength: state.products.items.length,
      categoriesLength: state.categories.items.length,
      products: state.products.items,
      categories: state.categories.items,
      filter: state.filter,
      basket: state.basket,
      lastRefKey: state.products.lastRefKey,
      lastCatRefKey: state.categories.lastRefKey,
      totalItems: state.products.total,
      isLoading: state.app.loading,
      filteredProducts: selectFilter(state.products.items, state.filter),
      requestStatus: state.app.requestStatus
    }
  }));

  useEffect(() => {
    onProductsLengthChanged();
  }, [store.filteredProducts]);

  const dispatch = useDispatch();
  const productListWrapper = useRef(null);

  const onClickAllItem = () => displayActionMessage('Feature not ready yet :)', 'info');

  const onProductsLengthChanged = () => {
    const width = window.screen.width - 250; // minus 250px padding

    setColumnCount(Math.floor(width / 160));
    if ((columnCount >= store.filteredProducts.length) && store.filteredProducts.length !== 0) {
      setColumnCount(store.filteredProducts.length);
    }
  };
  const isFiltered = ['keyword', 'brand', 'minPrice', 'maxPrice', 'sortBy'].some(key => !!store.filter[key]);
  const displaySelected = product => setProductSelected(product);
  const foundOnBasket = id => !!store.basket.find(item => item.id === id); 
  const onOpenModal = () => setModalOpen(true);
  const onCloseModal = () => setModalOpen(false);
  
  return (
    <>
      <HeroCarousel />
      <br />
      <h2 className=" pt-2">Shop by category</h2>
      <Boundary>
        <CategoryList
            lastRefKey={store.lastCatRefKey}
            dispatch={dispatch}
            categoriesLength={store.categoriesLength}
        >
          <div 
                className="flex" 
                style={{ gridTemplateColumns: `repeat(${store.categoriesLength}, 160px)` }}
            >
              {store.categoriesLength === 0 ? new Array(12).fill({}).map((category, index) => (
                <CategoryItem
                    key={`product-skeleton ${index}`}
                    category={category}
                />
              )) : store.categories.map(category => (
                <CategoryItem
                    dispatch={dispatch}
                    key={category.id}
                    category={category}
                />
              ))}
              </div>
        </CategoryList>
      </Boundary>
      <br />
      <h1 className="pt-2">On Sale</h1>
      <Boundary>
        <ProductCarousel itemsLength={store.productsLength}>
          {store.products.slice(0, store.productsLength-1).map((product) => (
            <ProductItem
            foundOnBasket={foundOnBasket}
            dispatch={dispatch}
            key={product.id}
            onOpenModal={onOpenModal}
            displaySelected={displaySelected}
            product={product}
        />
          ))}
        </ProductCarousel>
      </Boundary>
      <br />
      <h1 className=" pt-2">Featured</h1>

      <section className="product-list-wrapper ">
        {!store.requestStatus && (
          <div className="product-list-header">
            <div className="product-list-header-title">
              {isFiltered && (
                <h5>
                  {store.filteredProducts.length > 0 
                    && `Found ${store.filteredProducts.length} ${store.filteredProducts.length > 1 ? 'products' : 'product'}`
                  }
                </h5>
              )}
            </div>
          </div>
        )}
        <ProductAppliedFilters filter={store.filter}/>
        <Boundary>
          <ProductList
              dispatch={dispatch}
              productsLength={store.productsLength}
              filteredProductsLength={store.filteredProducts.length}
              foundOnBasket={foundOnBasket}
              isLoading={store.isLoading}
              location={props.location}
              lastRefKey={store.lastRefKey}
              totalItems={store.totalItems}
              requestStatus={store.requestStatus}
          >
            <Modal 
                isOpen={isOpenModal} 
                onRequestClose={onCloseModal}
                overrideStyle={{ padding: 0 }}
            >
              <ProductModalDetails 
                  product={productSelected}
                  dispatch={dispatch}
                  foundOnBasket={foundOnBasket}
              />
              <button 
                  className="modal-close-button"
                  onClick={onCloseModal}
              >
                <i className="fa fa-times-circle" />
              </button>
            </Modal>
            <div 
                className="product-list" 
                ref={productListWrapper}
                style={{ gridTemplateColumns: `repeat(${columnCount}, 160px)` }}
            >
              {store.filteredProducts.length === 0 ? new Array(12).fill({}).map((product, index) => (
                <ProductItem
                    foundOnBasket={foundOnBasket}
                    key={`product-skeleton ${index}`}
                    product={product}
                />
              )) : store.filteredProducts.map(product => (
                <ProductItem
                    foundOnBasket={foundOnBasket}
                    dispatch={dispatch}
                    key={product.id}
                    onOpenModal={onOpenModal}
                    displaySelected={displaySelected}
                    product={product}
                />
              ))}
            </div>
          </ProductList>
        </Boundary>
      </section>
    </>
  );
};

export default Home;
