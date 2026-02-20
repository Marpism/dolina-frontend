import Form from "./Form";
import { useEffect, useState } from "react";
import { EMAIL_REGEXP } from "../../utils/constants";

export default function RegisterForm({
  onRegistration,
  inputError,
  terms,
  onCatClick,
  category,
  search,
  setSearch,
  isLoggedIn,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameValidationError, setNameValidationError] = useState("");
  const [emailValidationError, setEmailValidationError] = useState("");
  const [passwordValidationError, setPasswordValidationError] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(true);

  useEffect(() => {
    if (name.length > 1 && EMAIL_REGEXP.test(email) && password.length > 5) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [name, email, password]);

  function handleSubmit(e) {
    e.preventDefault();
    if (EMAIL_REGEXP.test(email)) {
      setEmailValidationError("");
      onRegistration(name, email, password);
    } else {
      setEmailValidationError("Введён некорректный email");
    }
  }

  function handleNameChange(e) {
    setName(e.target.value);
    if (e.target.value.length > 1) {
      setNameValidationError("");
    } else {
      setNameValidationError("Имя не может быть короче 2 букв");
    }
  }

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

  return (
    <Form
      title="Добро пожаловать в Долину самоцветов!"
      name="register"
      buttonText="Продолжить"
      submitDisabled={submitDisabled}
      onSubmit={handleSubmit}
      terms={terms}
      onCatClick={onCatClick}
      category={category}
      search={search}
      setSearch={setSearch}
      isLoggedIn={isLoggedIn}
    >
      {/* <label htmlFor="username" className='form__input-label'>Имя</label> */}
      <input
        className="form__input"
        placeholder="Введите ваше имя"
        type="text"
        name="username"
        required
        minLength={2}
        maxLength={30}
        onChange={handleNameChange}
        value={name || ""}
      ></input>
      <p className="input__error">{nameValidationError}</p>

      {/* <label htmlFor="email" className='form__input-label'>E-mail</label> */}
      <input
        className="form__input"
        placeholder="Введите свой e-mail"
        type="email"
        name="email"
        required
        minLength={2}
        maxLength={30}
        onChange={handleEmailChange}
        value={email || ""}
      ></input>

      <p className="input__error">{emailValidationError}</p>

      {/* <label htmlFor="password" className='form__input-label'>Пароль</label> */}
      <input
        className="form__input"
        placeholder="Пароль от 6 символов"
        type="password"
        name="password"
        required
        minLength={8}
        maxLength={30}
        onChange={handlePasswordChange}
        value={password || ""}
      ></input>

      <p className="input__error">{passwordValidationError}</p>
      <p className="input__error">{inputError}</p>
    </Form>
  );
}
