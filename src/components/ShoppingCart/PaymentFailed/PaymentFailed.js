import "./PaymentFailed.css";
import MobileNavBar from "../../MobileNavBar/MobileNavBar";
import { useEffect } from "react";

export default function PaymentFailed({
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
    document.title = "Оплата не прошла - Долина самоцветов";
  }, []);

  return (
    <>
      <main className="success-page">
        <div>
          <p className="success-maintext">
            <b>Оплата не прошла.</b>
          </p>
          <br></br>
          <p className="success-maintext">
            Вы можете <a href="/me/orders">перейти к списку заказов</a> и
            попробовать снова!
          </p>
        </div>
      </main>
      <MobileNavBar
        onBurger={onBurgerClick}
        isBurgerOpen={isBurgerOpen}
        onBurgerClose={onBurgerClose}
        cart={cart}
        orders={orders}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
