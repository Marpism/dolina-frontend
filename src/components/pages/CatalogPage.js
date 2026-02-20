import Catalog from "../Catalog/Catalog";
import MobileNavBar from "../MobileNavBar/MobileNavBar";
import Tags from "../Tags/Tags";
import { useEffect } from "react";

export default function CatalogPage({
  onCardClick,
  onLikeClick,
  products,
  setProducts,
  savedProducts,
  isLoggedIn,
  terms,
  onCatClick,
  category,
  tags,
  onTagClick,
  onBurgerClick,
  onBurgerClose,
  isBurgerOpen,
  search,
  setSearch,
  orders,
  cart,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  fetchProducts,
  productFilters,
  setProductFilters,
  isLoadingMore,
  showLoadMore,
  catalogLoading,
  onColorClick,
  onSizeClick,
}) {
  useEffect(() => {
    document.title = "Каталог — Долина самоцветов";
  }, []);

  return (
    <>
      {productFilters.search && (
        <div className="search_results_title">
          Результаты поиска по запросу "{productFilters.search}"
        </div>
      )}
      <Tags
        terms={terms}
        tags={terms.tags}
        categories={terms.categories}
        onTagClick={onTagClick}
        activeCategory={category}
        activeTags={tags}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        productFilters={productFilters}
        setProductFilters={setProductFilters}
        onColorClick={onColorClick}
        onSizeClick={onSizeClick}
        onCatClick={onCatClick}
      />
      <Catalog
        onCardClick={onCardClick}
        onLikeClick={onLikeClick}
        products={products}
        // stones={stones}
        setProducts={setProducts}
        savedProducts={savedProducts}
        isLoggedIn={isLoggedIn}
        fetchProducts={fetchProducts}
        productFilters={productFilters}
        setProductFilters={setProductFilters}
        isLoadingMore={isLoadingMore}
        showLoadMore={showLoadMore}
        catalogLoading={catalogLoading}
        onCatClick={onCatClick}
      />
      <MobileNavBar
        onBurger={onBurgerClick}
        isBurgerOpen={isBurgerOpen}
        onBurgerClose={onBurgerClose}
        cart={cart}
        onCatClick={onCatClick}
        orders={orders}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
