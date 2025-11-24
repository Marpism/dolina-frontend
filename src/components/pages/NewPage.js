import Catalog from "../Catalog/Catalog";
import MobileNavBar from "../MobileNavBar/MobileNavBar";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productsApi from "../../utils/Api";


export default function NewPage({ onCardClick, onLikeClick, products, setProducts, savedProducts, isLoggedIn, terms, onCatClick, category, tags, onTagClick, onBurgerClick, onBurgerClose, isBurgerOpen, search, setSearch, orders, cart, sortBy, setSortBy, sortOrder, setSortOrder, fetchProducts, productFilters, setProductFilters, isLoadingMore, showLoadMore }) {

  useEffect(() => {
    document.title = "Новинки — Долина самоцветов"
  }, []);

  const navigate = useNavigate();
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    document.title = "Новинки — Долина самоцветов"
    productsApi.productsByType('new')
      .then((products) => {
        setNewProducts(products)
      })
      .catch(err => console.log(err));

  }, []);

  function handleButtonClick() {
    onCatClick('');
    navigate('/catalog/');
  }

  return (
    <>
      <h1 className='new-category-header category-header'>&bull; НОВИНКИ &bull;</h1>
      <Catalog
        onCardClick={onCardClick}
        onLikeClick={onLikeClick}
        products={newProducts}
        setProducts={setProducts}
        savedProducts={savedProducts}
        isLoggedIn={isLoggedIn}
        fetchProducts={fetchProducts}
        productFilters={productFilters}
        setProductFilters={setProductFilters}
        isLoadingMore={isLoadingMore}
        showLoadMore={showLoadMore}
      />
      <MobileNavBar
        onBurger={onBurgerClick}
        isBurgerOpen={isBurgerOpen}
        onBurgerClose={onBurgerClose}
        cart={cart}
        onCatClick={onCatClick}
        orders={orders} />

      <div className="load-more_button-conainer"><button onClick={handleButtonClick} className="load-more_button">В каталог</button></div>
    </>
  )
}