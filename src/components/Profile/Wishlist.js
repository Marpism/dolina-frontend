import { useState, useEffect } from "react";
import Catalog from "../Catalog/Catalog";
import productsApi from "../../utils/Api";
import MobileNavBar from "../MobileNavBar/MobileNavBar";

export default function SavedMovies({
  onCardClick,
  onLikeClick,
  savedProducts,
  terms,
  onCatClick,
  category,
  onBurgerClick,
  onBurgerClose,
  isBurgerOpen,
  search,
  setSearch,
  orders,
  cart,
  isLoggedIn,
}) {
  useEffect(() => {
    document.title = "Избранное — Долина самоцветов";
  }, []);

  const [wishlist, setWishlist] = useState([]);

  // взять массив айдишников и сделать запрос

  useEffect(() => {
    productsApi
      .getProductsById([savedProducts])
      .then((res) => {
        setWishlist(res);
      })
      .catch((err) => console.log(err));
  }, [savedProducts]);

  return (
    <main style={{ minHeight: "60vh" }}>
      <h1 className="wishlist-header">Избранное</h1>
      {savedProducts.length === 0 ? (
        <div>
          <p style={{ margin: "0 15px" }}>
            Пока в избранное ничего не добавлено
          </p>
        </div>
      ) : (
        <Catalog
          onCardClick={onCardClick}
          onLikeClick={onLikeClick}
          savedProducts={savedProducts}
          products={wishlist}
        />
      )}

      <MobileNavBar
        onBurger={onBurgerClick}
        isBurgerOpen={isBurgerOpen}
        onBurgerClose={onBurgerClose}
        cart={cart}
        orders={orders}
        onCatClick={onCatClick}
        isLoggedIn={isLoggedIn}
      />
    </main>
  );
}
