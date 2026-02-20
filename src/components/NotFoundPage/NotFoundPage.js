import "./NotFoundPage.css";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main>
      <section className="notfound-page">
        <h1 className="notfound-header">404</h1>
        <span className="notfound-text">Страница не найдена</span>
        <Link to="/" className="notfound-link">
          Назад
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
