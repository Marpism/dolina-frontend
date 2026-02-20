import MobileNavBar from "../MobileNavBar/MobileNavBar";
import { useEffect } from "react";
import "./Pages.css";
import bullet from "../../images/about_diamond-fill.svg";
import university from "../../images/about_university.png";
import logo from "../../images/logo_pic.png";
import stone from "../../images/about_stone.jpg";
import mount from "../../images/about_urals-2.jpg";

export default function AboutPage({
  onBurgerClick,
  onBurgerClose,
  isBurgerOpen,
  orders,
  cart,
  onCatClick,
  isLoggedIn,
}) {
  useEffect(() => {
    document.title = "О нас — Долина самоцветов";
  }, []);

  return (
    <>
      <main className="about">
        <div className="about__container">
          <div>
            <h1 className="about__header">
              Добро пожаловать в Долину Самоцветов!
            </h1>
            <p className="about__subheader">
              У нас вы найдёте украшения с натуральными камнями, от
              элегантно-скромных и минималистичных до необычных, редких и
              по-настоящему уникальных.
            </p>
            <p className="about__maintext">
              Весь наш небольшой коллектив крепко объединяет любовь к
              натуральному камню. Многие из нас по образованию геологи:
              закончили Свердловский горный институт им. Вахрушева (ныне
              УГГУ-Уральский государственный горный университет). Работали по
              специальности на месторождениях Казахстана, Якутии и родного
              Урала. И вот уже более 20 лет занимаемся изделиями из природного
              камня.
            </p>
          </div>
          <div className="about__masonry">
            <img className="about__masonry-item" src={university} alt="УГГУ"></img>
            <img
              className="about__masonry-item"
              src={stone}
              alt="Долина Самоцветов"
            ></img>
            <img
              className="about__masonry-item about__masonry-item_logo"
              alt="Логотип с серебряным копытцем"
              src={logo}
            ></img>
            <img
              className="about__masonry-item"
              src={mount}
              alt="Уральские горы"
            ></img>
          </div>
        </div>
        <div
          className="about__container"
          style={{ marginTop: "50px", alignItems: "flex-start" }}
        >
          <div className="about__code">
            <h2 className="about__header">Наши принципы</h2>
            <ul className="about__principles">
              <li className="about__principles-item">
                <img className="about__bullet" src={bullet} alt=""></img>
                <p className="about__viptext">
                  Приобретая украшение у нас, вы получите красивый натуральный
                  камень, отобранный нами лично. Никаких "облагороженных" и
                  имитаций.
                </p>
              </li>
              <li className="about__principles-item">
                <img className="about__bullet" src={bullet} alt=""></img>
                <p className="about__viptext">
                  По любому нашему изделию мы с радостью предоставим
                  персональную консультацию дипломированного и опытного
                  специалиста.
                </p>
              </li>
              <li className="about__principles-item">
                <img className="about__bullet" src={bullet} alt=""></img>
                <p className="about__viptext">
                  Наши поставщики и партнеры — независимые мастера с Урала,
                  цитадели ювелирного и камнерезного искусства, и всей России.
                </p>
              </li>
              <li className="about__principles-item">
                <img className="about__bullet" src={bullet} alt=""></img>
                <p className="about__viptext">
                  Мы придерживаемся разумной и деликатной ценовой политики:
                  считаем, что наживаться на наших покупательницах неприемлемо и
                  непорядочно. Поэтому стараемся, чтобы цены в нашем магазине
                  были минимальными.
                </p>
              </li>
              <li className="about__principles-item">
                <img className="about__bullet" src={bullet} alt=""></img>
                <p className="about__viptext">
                  Снобизм в отношении природного камня неуместен — замечательным
                  украшением образа может стать как дорогой по цене, так и очень
                  доступный, но не менее достойный самоцвет.
                </p>
              </li>
              <li className="about__principles-item">
                <img className="about__bullet" src={bullet} alt=""></img>
                <p className="about__viptext">
                  Мы очень ценим возможность зарабатывать на жизнь, делая то,
                  что мы любим, и общаться с близкими по духу людьми. Если у вас
                  есть к нам замечания, обязательно высказывайте их! Нам всегда
                  интересно ваше мнение, ведь мы хотим развиваться сами и
                  развивать нашу индустрию украшений из природного камня!
                </p>
              </li>
              <li className="about__principles-item">
                <img className="about__bullet" src={bullet} alt=""></img>
                <p className="about__viptext">
                  Поскольку экран не всегда передает истинный облик камня, нам
                  можно вернуть товар без объяснения причин, если вы получите не
                  то, чего ожидали, а мы с удовольствием поможем вам подобрать
                  именно ваше украшение и именно ваш камень.
                </p>
              </li>
            </ul>
          </div>
          <div style={{ maxWidth: "565px", marginBottom: "60px" }}>
            <p className="about__subheader">
              Долина Самоцветов это наше любимое детище. Мы сами придумали её,
              продумали и создали вебсайт. Сами общаемся с покупателями и,
              главное, сами определяем ассортимент.
            </p>
            <p className="about__maintext">
              Мы делаем упор на вневременные украшения с акцентом на
              индивидуальную красоту самоцветов. Нередко мы сначала приобретаем
              понравившиеся интересные камни, что называется, "в сырье". Затем в
              дело вступают наши мастера-камнерезы. Они обрабатывают камень и
              изготавливают кабошоны и вставки. И уже на самом важном, финальном
              этапе волшебники-ювелиры создают украшения, оправляя камни в
              металл.
            </p>
            <p
              className="about__maintext"
              style={{ fontWeight: "500", color: "#014a31" }}
            >
              Значительная часть нашего ассортимента это уникальные природные
              друзы, щётки, кристаллы и прочие оригинальные, природные редкости.
            </p>
            <p className="about__maintext">
              С таким подходом мы не можем, да и не хотим выйти на маркетплейсы,
              где всё заточено на массовую продажу однообразных изделий. Зато
              как же мы радуемся, когда находим близких по духу людей!
            </p>
            <p className="about__subheader">
              Будьте красивы! Радуйте себя и своих близких!
            </p>
            <p className="about__subheader">
              С любовью, коллектив «Долины Самоцветов»
            </p>
          </div>
        </div>
      </main>
      <MobileNavBar
        onBurger={onBurgerClick}
        isBurgerOpen={isBurgerOpen}
        onBurgerClose={onBurgerClose}
        cart={cart}
        orders={orders}
        onCatClick={onCatClick}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
