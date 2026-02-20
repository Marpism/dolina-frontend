import Form from "./Form";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EMAIL_REGEXP } from "../../utils/constants";

export default function LoginForm({
  onLogin,
  inputError,
  terms,
  onCatClick,
  category,
  search,
  setSearch,
  isLoggedIn,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValidationError, setEmailValidationError] = useState("");
  const [passwordValidationError, setPasswordValidationError] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(true);

  useEffect(() => {
    if (EMAIL_REGEXP.test(email) && password.length > 5) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [email, password]);

  function handleEmailChange(e) {
    setEmail(e.target.value);

    if (EMAIL_REGEXP.test(e.target.value)) {
      setEmailValidationError("");
    } else {
      setEmailValidationError("Введён некорректный email");
    }
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);

    if (e.target.value.length > 5) {
      setPasswordValidationError("");
    } else {
      setPasswordValidationError("Пароль должен быть длиннее 6 символов");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    onLogin(email, password);
  }

  return (
    <Form
      title="С возвращением!"
      name="login"
      buttonText="Войти"
      submitDisabled={submitDisabled}
      onSubmit={handleSubmit}
      terms={terms}
      onCatClick={onCatClick}
      category={category}
      search={search}
      setSearch={setSearch}
      isLoggedIn={isLoggedIn}
    >
      <label htmlFor="email" className="form__input-label">
        E-mail
      </label>
      <input
        className="form__input"
        placeholder="Введите e-mail"
        type="email"
        name="email"
        required
        minLength={2}
        maxLength={30}
        onChange={handleEmailChange}
        value={email || ""}
      ></input>
      <p className="input__error">{emailValidationError}</p>
      <label htmlFor="password" className="form__input-label">
        Пароль
      </label>
      <input
        className="form__input"
        placeholder="Введите пароль"
        type="password"
        name="password"
        required
        minLength={6}
        maxLength={30}
        onChange={handlePasswordChange}
        value={password || ""}
      ></input>
      <p className="input__error">{passwordValidationError}</p>
      <p className="input__error">{inputError}</p>
      <Link to="/forgot_password" className="forgot-link">
        Забыли пароль?
      </Link>
    </Form>
  );
}
