import "./Crumbs.css";

// пока чисто для виду
export default function Crumbs() {
  return (
    <div className="crumbs">
      <ul className="crumbs__list">
        <li className="crumb">
          <a href="#" className="crumb__link">
            Главная /
          </a>
        </li>
        <li className="crumb">
          <a href="#" className="crumb__link">
            Серьги /
          </a>
        </li>
        <li className="crumb">
          <a href="#" className="crumb__link">
            Малахит{" "}
          </a>
        </li>
      </ul>
      <div className="crumb-buttons">
        {/* <button type='button' className='crumb-button'/>
        <button type='button' className='crumb-button'/> */}
      </div>
    </div>
  );
}

// import React from 'react';

// const Breadcrumbs = ({ paths }) => {
//   return (
//     <nav aria-label="breadcrumb">
//       <ol className="breadcrumb">
//         {paths.map((path, index) => (
//           <li key={index} className={`breadcrumb-item${index === paths.length - 1 ? ' active' : ''}`}>
//             {index !== paths.length - 1 ? (
//               <a href={path.url}>{path.label}</a>
//             ) : (
//               path.label
//             )}
//           </li>
//         ))}
//       </ol>
//     </nav>
//   );
// };

// export default Breadcrumbs;

// import React from 'react';
// import Breadcrumbs from './Breadcrumbs';

// const App = () => {
//   const paths = [
//     { label: 'Home', url: '/' },
//     { label: 'Category', url: '/category' },
//     { label: 'Subcategory', url: '/category/subcategory' },
//     { label: 'Current Page' },
//   ];

//   return (
//     <div>
//       <Breadcrumbs paths={paths} />
//       {/* Your other content */}
//     </div>
//   );
// };

// export default App;
