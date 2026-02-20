import "./SuccessPage.css";
import MobileNavBar from "../../MobileNavBar/MobileNavBar";
import sparkle from "../../../images/sparkle-success.svg";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usersApi from "../../../utils/UsersApi";

export default function SuccessPage({
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
    document.title = "Заказ оформлен — Долина самоцветов";
  }, []);

  const { orderId } = useParams();
  const navigate = useNavigate();

  if (!orderId) navigate("/"); 

  useEffect(() => {
    usersApi.orderSuccess(orderId);
  }, [orderId]);

  return (
    <>
      <main className="success-page">
        <div>
          <h1 className="success-header">
            Заказ №{orderId} оформлен успешно! Спасибо за покупку{" "}
            <img style={{ marginLeft: "8px" }} src={sparkle} alt=""></img>
          </h1>
          <p className="success-maintext">
            В ближайшее время мы упакуем ваш заказ, передадим в доставку,
          </p>
          <p className="success-maintext">
            {" "}
            а в вашем личном кабинете появится трек-номер для отслеживания!
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
