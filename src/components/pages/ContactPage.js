import MobileNavBar from "../MobileNavBar/MobileNavBar";
import './ContactPage.css';
import { useEffect } from "react";

export default function ContactPage({ terms, onCatClick, category, onBurgerClick, onBurgerClose, isBurgerOpen, search, setSearch, orders, cart, isLoggedIn }) {
  useEffect(() => {
    document.title = 'Контакты — Долина самоцветов';
  }, []);

  return (
    <>
      <main className="contacts">
        <h1 className="">Контакты</h1>
        <div className="contacts-container">
          <div className="contacts_block_1">
            <div className="contacts-row">
              <div className="contacts-icon contacts-icon__phone"></div>
              <div>
                <p><a className="contacts-maintext" href='tel:88002001705'>8 (800) 200 17 05</a></p>
                <p className="contacts-caption">Звонок бесплатный по России</p>
              </div>
            </div>

            <div className="contacts-row">
              <div className="contacts-icon contacts-icon__mail"></div>
              <div>
                <p><a className="contacts-maintext" href="mailto:info@dolina.shop">info@dolina.shop</a></p>
                <p className="contacts-caption">По всем вопросам</p>
              </div>
            </div>
            <p className="contacts-schedule">ИП Орлова Маргарита Владимировна</p>
            <p className="contacts-schedule">Свердловская область, г. Екатеринбург</p>
          </div>
          <div className="contacts_block_1">
            <div className="contacts_block_1">
              <div className="contacts-row">
                <div className="contacts-icon contacts-icon__clock"></div>
                <div>
                  <p className="contacts-maintext">Часы работы</p>
                  <p className="contacts-caption">Консультации по телефону</p>
                  <p className="contacts-schedule">Пн-Пт 08:00 — 17:00 (московское время)</p>
                  <p className="contacts-schedule">Сб-Вс выходные дни.</p>
                </div>
              </div>
            </div>

          </div>
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
  )
}
