import Product from "../Product/Product";
import MobileNavBar from "../MobileNavBar/MobileNavBar";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import productsApi from '../../utils/Api';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProductPage({ onLikeClick, savedProducts, onAddClick, isLoggedIn, cart, onCardClick, terms, onCatClick, onBurgerClick, onBurgerClose, isBurgerOpen, search, setSearch, orders, stoneDescriptions }) {

  const { newSlug } = useParams();

  let lastIndex = newSlug.lastIndexOf("-");
  let productId = newSlug.substring(lastIndex + 1);

  const [productData, setProductData] = useState(null);
  const [matchedStoneDescriptions, setMatchedStoneDescriptions] = useState([]);


  useEffect(() => {
    productsApi.getProduct(productId)
      .then((data) => { setProductData(data[0]); })
      .catch((error) => console.error('Error fetching product:', error));
  }, [newSlug, productId]);

  useEffect(() => {
    if (productData) {
      const productTags = productData.tags ? productData.tags.map(tag => tag.termId.toString()) : [];

      const matchedDescriptions = stoneDescriptions.filter(description => {
        const descriptionTags = JSON.parse(description.tags).map(tag => tag.toString());
        return descriptionTags.some(tag => productTags.includes(tag));
      });

      setMatchedStoneDescriptions(matchedDescriptions);
    }
  }, [productData, stoneDescriptions]);


  if (!productData) {
    return (
      <div style={{ minHeight: '200vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton height={515} width={480} />
          <Skeleton height={500} width={300} />
          <Skeleton height={400} width={300} />
        </div>
        <Skeleton style={{ margin: '50px 0 40px 0' }} height={20} width={300} />
        <Skeleton count={3} />
        <Skeleton style={{ margin: '40px 0' }} height={20} width={300} />
      </div>
    );
  }

  return (
    <>

      {/* <Crumbs/> */}
      <Product
        productData={productData}
        salePrice={productData.salePrice}
        onLikeClick={onLikeClick}
        savedProducts={savedProducts}
        onAddClick={onAddClick}
        isLoggedIn={isLoggedIn}
        cart={cart}
        onCardClick={onCardClick}
        stoneDescriptions={matchedStoneDescriptions}
      ></Product>
      <MobileNavBar
        onBurger={onBurgerClick}
        isBurgerOpen={isBurgerOpen}
        onBurgerClose={onBurgerClose}
        cart={cart}
        onCatClick={onCatClick}
        orders={orders}
        isLoggedIn={isLoggedIn} />
    </>
  )
}