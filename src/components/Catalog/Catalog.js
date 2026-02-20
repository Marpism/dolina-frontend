import "./Catalog.css";
import Card from "../Card/Card";

export default function Catalog({
  onCardClick,
  products,
  setProducts,
  onLikeClick,
  savedProducts,
  search,
  setSearch,
  fetchProducts,
  productFilters,
  setProductFilters = false,
  isLoadingMore,
  showLoadMore = false,
  catalogLoading = false,
  onCatClick,
}) {
  function resetFilters() {
    onCatClick("");
  }

  return (
    <section className={`catalog ${catalogLoading ? "loading" : ""}`}>
      {products.length == 0 &&
        productFilters &&
        productFilters.search.length > 0 && (
          <>
            <br />
            Ничего не найдено
          </>
        )}
      {products.length == 0 &&
        productFilters &&
        (productFilters.colors.length > 0 ||
          productFilters.masterpiece ||
          productFilters.iridescent) && (
          <>
            <br />
            По вашим параметрам ничего не нашлось. Попробуйте{" "}
            <span
              className="filters_reset hover_type_normal pointer"
              onClick={() => resetFilters("")}
            >
              сбросить фильтры
            </span>
            .
          </>
        )}
      <ul className="catalog-list">
        {products.map((product) => (
          <Card
            id={product.productId}
            slug={product.slug}
            name={product.title}
            price={product.price}
            key={product.productId}
            onCardClick={onCardClick}
            onLikeClick={onLikeClick}
            pictures={product.pictures}
            savedProducts={savedProducts}
            inStock={product.inStock}
            search={search}
            setSearch={setSearch}
            createdAt={product.createdAt}
            discount={product.discount}
            salePrice={product.salePrice}
          ></Card>
        ))}
      </ul>
      {showLoadMore && (
        <div className="load-more_button-conainer">
          <button
            className={"load-more_button" + (isLoadingMore ? " loading" : "")}
            onClick={() =>
              setProductFilters((prevFilters) => ({
                ...prevFilters,
                offset: productFilters.offset + productFilters.pageSize,
              }))
            }
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "загружаем..." : "загрузить ещё"}
          </button>
        </div>
      )}
    </section>
  );
}
