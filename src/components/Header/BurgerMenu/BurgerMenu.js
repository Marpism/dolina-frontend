import "./BurgerMenu.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SearchForm from "../../SearchForm/SearchForm";

export default function BurgerMenu({
  isOpen,
  onClose,
  onCloseterms,
  terms,
  onCatClick,
  activeCategory,
  search,
  setSearch,
  productFilters,
  setProductFilters,
}) {
  const navigate = useNavigate();

  function handleClick(event) {
    event.preventDefault();
    onClose();
    onCatClick(event.target.dataset.id);
  }

  return (
    <div className={isOpen ? "burger__popup burger__visible" : "burger__popup"}>
      <div className="burger__container">
        <SearchForm
          search={search}
          setSearch={setSearch}
          productFilters={productFilters}
          setProductFilters={setProductFilters}
          onBurgerClose={onClose}
          isBurgerOpen={isOpen}
        />
        <div className="burger-menu__container">
          <nav className="burger__navigation">
            <NavLink
              to="catalog"
              className="burger__link"
              onClick={handleClick}
            >
              Каталог
            </NavLink>
            {terms.categories &&
              terms.categories.map((term) => (
                <NavLink
                  to=""
                  className="burger__link"
                  onClick={handleClick}
                  key={term.termId}
                  data-id={term.termId}
                >
                  {term.name}
                </NavLink>
              ))}
            <NavLink
              to="/new"
              className="burger__link burger_new-link"
              onClick={onClose}
            >
              Новинки
            </NavLink>
          </nav>
          <div className="burger__abouts">
            <NavLink
              to="/delivery"
              className="burger__about-link"
              onClick={onClose}
            >
              Доставка
            </NavLink>
            <NavLink
              to="/about"
              className="burger__about-link"
              onClick={onClose}
            >
              О нас
            </NavLink>
            <NavLink
              to="/reviews"
              className="burger__about-link"
              onClick={onClose}
            >
              Отзывы
            </NavLink>
            <NavLink
              to="/contacts"
              className="burger__about-link"
              onClick={onClose}
            >
              Контакты
            </NavLink>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="burger__close-button"
        onClick={onClose}
      ></button>
    </div>
  );
}
