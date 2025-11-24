import './SearchForm.css';
import { useMediaQuery } from 'react-responsive';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchForm({ search, setSearch, productFilters, setProductFilters, onBurgerClose, isBurgerOpen }) {
  const isBigScreen = useMediaQuery({ minWidth: 768 }); // надо бы перенести в константы
  const isSmallScreen = useMediaQuery({ maxWidth: 520 });

  const [searchText, setSearchText] = useState('');

  const navigate = useNavigate();
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);


  function handleRequestChange(event) {
    setSearchText(event.target.value)
  }

  function onSearchSubmit(event) {
    event.preventDefault();
    navigate('/catalog')
    setProductFilters(prevFilters => ({
      ...prevFilters,
      category: '',
      tags: [],
      iridescent: '',
      masterpiece: '',
      search: searchText,
      offset: 0
    }));

    if (inputRef1.current) {
      inputRef1.current.value = '';
    }
    if (inputRef2.current) {
      inputRef2.current.value = '';
    }

    if (isBurgerOpen == true) {
      onBurgerClose();
    }
  }

  useEffect(() => {
  }, [searchText]);

  return (
    <>
      {isBigScreen && (<div className=''>
        <form name="search-form" className='search-form_mobile'>
          <input
            type='text'
            name='search'
            className='search-form__input'
            placeholder=''
            defaultValue={search || ''}
            onChange={handleRequestChange}
            ref={inputRef1}
          />
          <button className='search-form__submit-button hover_type_normal' type='submit' onClick={onSearchSubmit}></button>
        </form>
      </div>)}
      {isSmallScreen && (
        <form name="search-form" className='search-form_mobile' onSubmit={onSearchSubmit}>
          <div className='mobile-glass'></div>
          <input
            type='text'
            name='search'
            className='search-form__input_mobile'
            placeholder='Найти на Долине Самоцветов' // артикул? хмм...
            defaultValue={search || ''}
            onChange={handleRequestChange}
            ref={inputRef2}
          />
          {/* <button className='search-form__submit-button hover_type_normal' type='submit'></button> */}
        </form>
      )}
    </>
  )
}
