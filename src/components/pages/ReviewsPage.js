import MobileNavBar from "../MobileNavBar/MobileNavBar";
import "./ContactPage.css";
import { useEffect } from "react";
import Reviews from "../Reviews/Reviews";
import ReviewsForm from "../Reviews/ReviewsForm";

export default function ReviewsPage({
  reviews,
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
  onsubmit,
  isLoggedIn,
}) {
  useEffect(() => {
    document.title = "Отзывы — Долина самоцветов";
  }, []);

  return (
    <>
      <main className="reviews">
        <h1 className="wishlist-header">Отзывы</h1>
        <div className="reviews-container">
          <ReviewsForm onsubmit={onsubmit} />
          <Reviews reviews={reviews} />
        </div>
      </main>
      <MobileNavBar
        onBurger={onBurgerClick}
        isBurgerOpen={isBurgerOpen}
        onBurgerClose={onBurgerClose}
        cart={cart}
        onCatClick={onCatClick}
        orders={orders}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
