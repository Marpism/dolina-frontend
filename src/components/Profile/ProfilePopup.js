import { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { EMAIL_REGEXP } from "../../utils/constants";

export default function ProfilePopup({
  isOpen,
  onClose,
  onUpdateUser,
  onSignout,
}) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setName(currentUser.name);
    setEmail(currentUser.email);
  }, [currentUser, isOpen]);

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }

  function handleSubmit(e) {
    onUpdateUser({
      name,
      email,
    });
  }

  return (
    <div className={`profile-popup ${isOpen ? `popup_opened` : ""}`}>
      <section className="profile-form__container">
        <form name="profile-form" onSubmit={handleSubmit}>
          <fieldset className="profile-form__fieldset">
            <h1 className="form__title">Редактировать персональные данные</h1>

            <input
              type="text"
              minLength={2}
              maxLength={40}
              name="name"
              id="form-input-username"
              className="profile-form__input"
              required
              onChange={handleChangeName}
              value={name || ""}
            />

            {/* <span className="form-input-username-error"></span> */}

            <input
              type="email"
              minLength={5}
              maxLength={30}
              name="email"
              id="form-input-email"
              className="profile-form__input"
              required
              onChange={handleChangeEmail}
              value={email || ""}
            />
            {/* <span className="form-input-subscription-error"></span> */}

            <button
              type="submit"
              name="submit"
              className="form__submit-button profile-form__button hover_type_normal"
            >
              Сохранить
            </button>
            <span className="profile-form_span" onClick={onSignout}>
              Выйти из аккаунта
            </span>
          </fieldset>
        </form>
        <button
          type="button"
          className="profile-popup__close-button"
          onClick={onClose}
        ></button>
      </section>
    </div>
  );
}
