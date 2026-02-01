
import './Tags.css';
import { useEffect, useMemo, useState } from 'react';
import caret from '../../images/caret-down_mini.svg';
import sorting from '../../images/sorting_2.svg';
import { useMediaQuery } from 'react-responsive';
import { NavLink, useLocation } from 'react-router-dom';

export default function Tags({
  terms,
  tags,
  categories,
  onTagClick,
  onColorClick,
  onSizeClick,
  activeCategory,
  activeTags,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  productFilters,
  setProductFilters,
  onCatClick
}) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [stonesInputValue, setStonesInputValue] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  const isBigScreen = useMediaQuery({ minWidth: 771 });
  const isSmallScreen = useMediaQuery({ maxWidth: 770 });
  const location = useLocation();

  const ringsCategoryId = useMemo(() => {
    const list = terms?.categories || categories || [];
    const found = list.find(
      c =>
        c?.name?.trim()?.toLowerCase() === 'кольца' ||
        c?.slug?.toLowerCase?.() === 'kolca' ||
        c?.slug?.toLowerCase?.() === 'koltsa'
    );
    return found?.termId ?? null;
  }, [terms, categories]);

  const isRings =
    ringsCategoryId != null &&
    Number(productFilters?.category) === Number(ringsCategoryId);

  const sortedSizes = useMemo(() => {
    const toNum = (sizeObj) => {
      let str = String(sizeObj?.name ?? '').trim()
        .replace(',', '.')
        .replace('½', '.5');
      const m = str.match(/[\d.]+/g);
      if (!m) return Number.POSITIVE_INFINITY;
      const num = parseFloat(m[0]);
      return Number.isNaN(num) ? Number.POSITIVE_INFINITY : num;
    };

    return [...(terms?.sizes || [])]
      .filter(size => size.count > 0)
      .sort((a, b) => toNum(a) - toNum(b));
  }, [terms?.sizes]);

  const handleTagToggle = (tag) => {
    let activeTagsTemporary = [];
    if (selectedTags.includes(tag)) {
      activeTagsTemporary = selectedTags.filter(selectedTag => selectedTag !== tag);
    } else {
      activeTagsTemporary = [...selectedTags, tag];
    }
    setSelectedTags(activeTagsTemporary);
    onTagClick(activeTagsTemporary);
  };

  function handleCategoryClick(event) {
    event.preventDefault();
    const selectedCategoryId = event.target.dataset.id;
    onCatClick(selectedCategoryId);
    setOpenDropdownIndex(null);
  }

  const handleColorToggle = (color) => {
    let activeColorsTemporary = [];
    if (selectedColors.includes(color)) {
      activeColorsTemporary = selectedColors.filter(selectedColor => selectedColor !== color);
    } else {
      activeColorsTemporary = [...selectedColors, color];
    }
    setSelectedColors(activeColorsTemporary);
    onColorClick(activeColorsTemporary);
  };

  const handleSizeToggle = (size) => {
    let activeSizesTemporary = [];
    if (selectedSizes.includes(size)) {
      activeSizesTemporary = selectedSizes.filter(selectedSize => selectedSize !== size);
    } else {
      activeSizesTemporary = [...selectedSizes, size];
    }
    setSelectedSizes(activeSizesTemporary);
    onSizeClick(activeSizesTemporary);
  };

  const toggleDropdown = (index, event) => {
    event.stopPropagation();
    setOpenDropdownIndex(prevIndex => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    if (tags) {
      // базовый список (только с товарами)
      let next = tags.filter(tag => tag.count !== 0);

      // по категории
      if (productFilters.category > 0) {
        const activeCategoryTags = JSON.parse(
          categories.filter(item => item.termId == productFilters.category)[0].category_tags
        );
        next = next.filter(tag => activeCategoryTags.includes(Number(tag.termId)));
      }

      // поиск по камням
      if (stonesInputValue.length > 0) {
        const q = stonesInputValue.toLowerCase();
        next = next.filter(tag => tag.name.toLowerCase().includes(q));
      }

      setFilteredTags(next);
    }
  }, [tags, productFilters, stonesInputValue, categories]);

  // Синхронизация локальных выбранных значений со стором фильтров
  useEffect(() => setSelectedTags(productFilters.tags || []), [productFilters.tags]);
  useEffect(() => setSelectedColors(productFilters.colors || []), [productFilters.colors]);
  useEffect(() => setSelectedSizes(productFilters.sizes || []), [productFilters.sizes]);

  useEffect(() => {
    setSelectedCategoryName('');
  }, [productFilters]);

  // Закрытие дропдаунов по клику вне
  useEffect(() => {
    const handleClick = (event) => {
      const target = event.target;
      const parent = target.parentElement;
      if (
        !target.classList.contains('dropdown_selector') &&
        !(parent && parent.classList.contains('dropdown_selector'))
      ) {
        setOpenDropdownIndex(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Имя выбранной категории из URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const categoryId = query.get('category');
    if (categoryId && terms?.categories) {
      const category = terms.categories.find(cat => cat.termId === parseInt(categoryId));
      if (category) setSelectedCategoryName(category.name);
    }
  }, [location.search, terms?.categories]);

  function handleStonesInput(input) {
    const inputValue = input.target.value;
    setStonesInputValue(inputValue);
  }

  const handleSortChange = (value) => {
    setProductFilters(prevFilters => ({
      ...prevFilters,
      sortBy: value,
      offset: 0
    }));
  };

  const handleMasterpieceChange = (event) => {
    setProductFilters(prevFilters => ({
      ...prevFilters,
      masterpiece: event.target.checked ? 1 : ''
    }));
  };

  const handleIridescentChange = (event) => {
    setProductFilters(prevFilters => ({
      ...prevFilters,
      iridescent: event.target.checked ? 1 : ''
    }));
  };

  // Если ушли из «Кольца» — сброс размеров и закрытие дропдауна размеров (index 8)
  useEffect(() => {
    if (!isRings && (selectedSizes.length > 0 || (productFilters.sizes?.length || 0) > 0)) {
      setSelectedSizes([]);
      setProductFilters(prev => ({ ...prev, sizes: [], offset: 0 }));
      if (openDropdownIndex === 8) setOpenDropdownIndex(null);
    }
  }, [isRings]);

  const sortOptions = [
    { value: 'default', label: 'По умолчанию' },
    { value: 'price-asc', label: 'По возрастанию цены' },
    { value: 'price-desc', label: 'По убыванию цены' },
    { value: 'date-desc', label: 'По новизне' },
    { value: 'discount-desc', label: 'По размеру скидки' }
  ];

  return (
    <section className='tag-section'>
      {isBigScreen && (
        <>
          <div className='sorting-area'>
            <div className='sorting-dropdown'>
              <button
                type='button'
                className='sorting__button pointer'
                onClick={(event) => toggleDropdown(0, event)}
              >
                <img src={sorting} alt="sort" />
              </button>

              <div className={`sorting-content overflow-hidden ${openDropdownIndex === 0 ? 'sorting-content_visible' : ''}`}>
                <div className="tags__dropdown sorting_by">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      style={{ fontWeight: productFilters.sortBy === option.value ? 'bold' : 'normal' }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {isRings && (
              <div className='sorting-dropdown'>
                <button
                  type='button'
                  className='sorting-dropdown__button pointer'
                  onClick={(event) => toggleDropdown(8, event)}
                >
                  {selectedSizes.length > 0 ? `Размеры (${selectedSizes.length}) ` : 'Размеры'}
                  <img src={caret} alt="caret" style={{ marginLeft: '5px' }} />
                </button>

                <div className={`sorting-content dropdown_selector ${openDropdownIndex === 8 ? 'sorting-content_visible' : ''}`}>
                  <div className="tags__dropdown dropdown_selector">
                    {sortedSizes.map(size => (
                      <label key={size.termId} className='tag-label'>
                        <input
                          type="checkbox"
                          value={size.termId}
                          className='tag-button_dropdown'
                          checked={selectedSizes?.some(s => s === size.termId) || false}
                          onChange={(event) => {
                            event.stopPropagation();
                            handleSizeToggle(size.termId);
                          }}
                        />
                        <div
                          className='tag-pseudo-checkbox pointer'
                          onClick={(event) => event.stopPropagation()}
                        >
                          {size.name}
                        </div>
                      </label>
                    ))}
                  </div>
                  <button type='button' className='sorting-button' onClick={() => setOpenDropdownIndex(null)}>Готово</button>
                </div>
              </div>
            )}

            <div className='sorting-dropdown'>
              <button
                type='button'
                className='sorting-dropdown__button pointer'
                onClick={(event) => toggleDropdown(5, event)}
              >
                Все камни <img src={caret} alt="caret" style={{ marginLeft: '5px' }} />
              </button>

              <div className={`sorting-content dropdown_selector ${openDropdownIndex === 5 ? 'sorting-content_visible' : ''}`}>
                <div className="tags__dropdown dropdown_selector">
                  <div className='dropdown_selector'>
                    <input className='stone-search' type='text' onChange={handleStonesInput} placeholder='начните вводить название' />
                  </div>
                  {tags && filteredTags.map(tag => (
                    <label key={tag.termId} className='tag-label'>
                      <input
                        type="checkbox"
                        value={tag.termId}
                        className='tag-button_dropdown'
                        checked={selectedTags?.some(t => t === tag.termId) || false}
                        onChange={(event) => {
                          event.stopPropagation();
                          handleTagToggle(tag.termId);
                        }}
                      />
                      <div className='tag-pseudo-checkbox pointer' onClick={(event) => event.stopPropagation()}>
                        {tag.name}
                        {!productFilters.category && (<span className="tag-count">{tag.count}</span>)}
                      </div>
                    </label>
                  ))}
                </div>
                <button type='button' className='sorting-button' onClick={() => setOpenDropdownIndex(null)}>Готово</button>
              </div>
            </div>

            <div className='sorting-dropdown'>
              <button
                type='button'
                className='sorting-dropdown__button pointer'
                onClick={(event) => toggleDropdown(9, event)}
              >
                {selectedColors.length > 0 ? `Цвета (${selectedColors.length}) ` : 'Цвета'}
                <img src={caret} alt="caret" style={{ marginLeft: '5px' }} />
              </button>

              <div className={`sorting-content dropdown_selector ${openDropdownIndex === 9 ? 'sorting-content_visible' : ''}`}>
                <div className="tags__dropdown dropdown_selector">
                  {terms?.colors?.map(color => (
                    <label key={color.termId} className='tag-label'>
                      <input
                        type="checkbox"
                        value={color.termId}
                        className='tag-button_dropdown'
                        checked={selectedColors?.some(c => c === color.termId) || false}
                        onChange={(event) => {
                          event.stopPropagation();
                          handleColorToggle(color.termId);
                        }}
                      />
                      <div className='tag-pseudo-checkbox pointer' onClick={(event) => event.stopPropagation()}>
                        {color.name}<span className='color_ball' style={{ background: color.extra }}></span>
                      </div>
                    </label>
                  ))}
                </div>
                <button type='button' className='sorting-button' onClick={() => setOpenDropdownIndex(null)}>Готово</button>
              </div>
            </div>

            <label className='tag-label'>
              <input
                className='tag-button'
                type="checkbox"
                checked={!!productFilters.masterpiece}
                onChange={handleMasterpieceChange}
              />
              <div className='sorting-dropdown__button pointer'>Авторские украшения</div>
            </label>

            <label className='tag-label'>
              <input
                className='tag-button'
                type="checkbox"
                checked={!!productFilters.iridescent}
                onChange={handleIridescentChange}
              />
              <div className='sorting-dropdown__button pointer'>Оптический эффект</div>
            </label>
          </div>

          <div className='tag-area'>
            {tags && filteredTags.slice(0, 15).map(tag => (
              <label key={tag.termId} className='tag-label'>
                <input
                  type="checkbox"
                  value={tag.termId}
                  className='tag-button'
                  checked={selectedTags?.some(t => t === tag.termId) || false}
                  onChange={() => handleTagToggle(tag.termId)}
                />
                <div className='tag-pseudo-button pointer'>
                  {tag.name}{!productFilters.category && (<span className="tag-count">{tag.count}</span>)}
                </div>
              </label>
            ))}
          </div>
        </>
      )}

      {isSmallScreen && (
        <>
          <div className='sorting-area'>
            <div className='tags_flex'>
              <div className='sorting-dropdown'>
                <button
                  type='button'
                  className='sorting__button pointer'
                  onClick={(event) => toggleDropdown(0, event)}
                >
                  <img src={sorting} alt="sort" />
                </button>

                <div className={`sorting-content overflow-hidden ${openDropdownIndex === 0 ? 'sorting-content_visible' : ''}`}>
                  <div className="tags__dropdown sorting_by">
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        style={{ fontWeight: productFilters.sortBy === option.value ? 'bold' : 'normal' }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className='sorting-dropdown'>
                <button
                  type='button'
                  className='sorting-dropdown__button pointer'
                  onClick={(event) => toggleDropdown(12, event)}
                >
                  Категории <img src={caret} alt="caret" style={{ marginLeft: '5px' }} />
                </button>

                <div className={`sorting-content dropdown_selector ${openDropdownIndex === 12 ? 'sorting-content_visible' : ''}`}>
                  <div className="tags__dropdown dropdown_selector">
                    {categories && categories.map(category => (
                      <NavLink
                        to=''
                        className='tag-pseudo-checkbox'
                        onClick={handleCategoryClick}
                        key={category.termId}
                        data-id={category.termId}
                        style={{ marginBottom: '5px' }}
                      >
                        {category.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>

              {isRings && (
                <div className='sorting-dropdown'>
                  <button
                    type='button'
                    className='sorting-dropdown__button pointer'
                    onClick={(event) => toggleDropdown(8, event)}
                  >
                    {selectedSizes.length > 0 ? `Размеры (${selectedSizes.length}) ` : 'Размеры'}
                    <img src={caret} alt="caret" style={{ marginLeft: '5px' }} />
                  </button>

                  <div className={`sorting-content dropdown_selector ${openDropdownIndex === 8 ? 'sorting-content_visible' : ''}`}>
                    <div className="tags__dropdown dropdown_selector">
                      {sortedSizes.map(size => (
                        <label key={size.termId} className='tag-label'>
                          <input
                            type="checkbox"
                            value={size.termId}
                            className='tag-button_dropdown'
                            checked={selectedSizes?.some(s => s === size.termId) || false}
                            onChange={(event) => {
                              event.stopPropagation();
                              handleSizeToggle(size.termId);
                            }}
                          />
                          <div className='tag-pseudo-checkbox pointer' onClick={(event) => event.stopPropagation()}>
                            {size.name}
                          </div>
                        </label>
                      ))}
                    </div>
                    <button type='button' className='sorting-button' onClick={() => setOpenDropdownIndex(null)}>Готово</button>
                  </div>
                </div>
              )}
            </div>

            <div className='tags_flex'>
              <label className='tag-label'>
                <input
                  className='tag-button'
                  type="checkbox"
                  checked={!!productFilters.masterpiece}
                  onChange={handleMasterpieceChange}
                />
                <div className='sorting-dropdown__button pointer'>Авторское украшение</div>
              </label>

              <label className='tag-label'>
                <input
                  className='tag-button'
                  type="checkbox"
                  checked={!!productFilters.iridescent}
                  onChange={handleIridescentChange}
                />
                <div className='sorting-dropdown__button pointer'>Оптический эффект</div>
              </label>
            </div>
          </div>

          <div className='tag-area_mobile'>
            <div className='sorting-dropdown'>
              <button
                type='button'
                className='tag-pseudo-button pointer'
                onClick={(event) => toggleDropdown(9, event)}
              >
                {selectedColors.length > 0 ? `Цвет (${selectedColors.length}) ` : 'Цвет'}
                <img src={caret} alt="caret" style={{ marginLeft: '5px' }} />
              </button>

              <div className={`sorting-content dropdown_selector ${openDropdownIndex === 9 ? 'sorting-content_visible' : ''}`}>
                <div className="tags__dropdown dropdown_selector">
                  {terms?.colors?.map(color => (
                    <label key={color.termId} className='tag-label'>
                      <input
                        type="checkbox"
                        value={color.termId}
                        className='tag-button_dropdown'
                        checked={selectedColors?.some(c => c === color.termId) || false}
                        onChange={(event) => {
                          event.stopPropagation();
                          handleColorToggle(color.termId);
                        }}
                      />
                      <div className='tag-pseudo-checkbox pointer' onClick={(event) => event.stopPropagation()}>
                        {color.name}<span className='color_ball' style={{ background: color.extra }}></span>
                      </div>
                    </label>
                  ))}
                </div>
                <button type='button' className='sorting-button' onClick={() => setOpenDropdownIndex(null)}>Готово</button>
              </div>
            </div>

            {tags && filteredTags.map(tag => (
              <label key={tag.termId} className='tag-label'>
                <input
                  type="checkbox"
                  value={tag.termId}
                  className='tag-button'
                  checked={selectedTags?.some(t => t === tag.termId) || false}
                  onChange={() => handleTagToggle(tag.termId)}
                />
                <div className='tag-pseudo-button pointer'>
                  {tag.name}{!productFilters.category && (<span className="tag-count">{tag.count}</span>)}
                </div>
              </label>
            ))}
          </div>
        </>
      )}

      <div className='chosen-area'>
        {selectedCategoryName && <h1 className='category-header'>&bull; {selectedCategoryName.toUpperCase()} &bull;</h1>}
      </div>
    </section>
  );
}

