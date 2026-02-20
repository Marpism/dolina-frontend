import "./Footer.css";
import { NavLink } from "react-router-dom";
import paymentPic from "../../images/visa_mastercard_mir_logo1.png";
import { useMediaQuery } from "react-responsive";

export default function Footer() {
  const isBigScreen = useMediaQuery({ minWidth: 768 }); // надо бы перенести в константы
  const isSmallScreen = useMediaQuery({ maxWidth: 520 });

  return (
    <>
      {isBigScreen && (
        <footer className="footer">
          <div className="footer-container">
            <div className="footer_block_1">
              <p className="footer-details">© 2015-2025 Долина самоцветов.</p>
              <p className="footer-details">ИП Орлова Маргарита Владимировна</p>
              <p className="footer-details">
                ИНН: 667479287120 ОГРНИП: 315665800038107
              </p>
              <p className="footer-details">
                р/с: 4080 2810 9030 0000 1787 АО “РАЙФФАЙЗЕНБАНК”
              </p>
            </div>

            <div className="footer_block_1">
              <img src={paymentPic} className="footer-pics"></img>
            </div>
            <div className="footer_block_1">
              <h3 className="footer-header">О нас</h3>
              <NavLink to="/delivery" className="footer-link navlink_size_m">
                Доставка и оплата
              </NavLink>
              <NavLink to="/about" className="footer-link navlink_size_m">
                О Долине самоцветов
              </NavLink>
              <NavLink to="/reviews" className="footer-link navlink_size_m">
                Отзывы
              </NavLink>
              <NavLink to="/contacts" className="footer-link navlink_size_m">
                Контакты
              </NavLink>
            </div>
          </div>
        </footer>
      )}
      {isSmallScreen && null}
    </>
  );
}
