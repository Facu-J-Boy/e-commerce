import React from 'react';
import styles from './ProductCard.module.css';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  price: number;
}

const ProductsCard: React.FC<ProductCardProps> = ({
  id,
  image,
  title,
  price
}) => {
  return (
    <div className={styles.product}>
      <Link to={`/product/${id}`} className={styles.cardLink}>
        <div className={styles.imageContainer}>
          <img src={image} alt={title} />
        </div>
        <h1>{`$${price}`}</h1>
        <span>{title}</span>
        <button className={styles.button}>Buy</button>
      </Link>
    </div>
  );
};

export default ProductsCard;
