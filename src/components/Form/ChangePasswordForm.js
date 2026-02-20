import "./Form.css";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ChangePasswordForm({ onSubmit }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValidationError, setPasswordValidationError] = useState("");
  const [confirmPasswordValidationError, setConfirmPasswordValidationError] =
    useState("");
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const { token } = useParams();
  const navigate = useNavigate();

  if (!token) navigate("/");

  useEffect(() => {
    if (password.length > 6 && password === confirmPassword) {
      setSubmitDisabled(false);
      setPasswordValidationError("");
      setConfirmPasswordValidationError("");
    } else {
      setSubmitDisabled(true);
      if (password.length <= 6) {
        setPasswordValidationError("Пароль должен быть длиннее 6 символов");
      } else {
        setPasswordValidationError("");
      }
      if (password !== confirmPassword) {
        setConfirmPasswordValidationError("Пароли не совпадают");
      } else {
        setConfirmPasswordValidationError("");
      }
    }
  }, [password, confirmPassword]);

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleConfirmPasswordChange(e) {
    setConfirmPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (password === confirmPassword) {
      onSubmit(token, password);
    }
  }

  return (
    <>
      <body className="form-page">
        <div className="form">
          <section className="form__container">
            <form name="change-password-form" onSubmit={handleSubmit}>
              <fieldset className="form__fieldset">
                <h1 className="form__title">Изменение пароля</h1>

                <input
                  style={{ margin: "10px 0" }}
                  className="form__input"
                  placeholder="Введите новый пароль"
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  maxLength={30}
                  onChange={handlePasswordChange}
                  value={password || ""}
                ></input>
                <p className="input__error">{passwordValidationError}</p>

                <input
                  style={{ margin: "10px 0" }}
                  className="form__input"
                  placeholder="Повторите новый пароль"
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={6}
                  maxLength={30}
                  onChange={handleConfirmPasswordChange}
                  value={confirmPassword || ""}
                ></input>
                <p className="input__error">{confirmPasswordValidationError}</p>

                <button
                  type="submit"
                  name="submit"
                  className="form__submit-button hover_type_normal"
                  disabled={submitDisabled}
                >
                  Продолжить
                </button>
              </fieldset>
            </form>
          </section>
          <div id="buttonContainerId"></div>
        </div>
      </body>
    </>
  );
}
