import React from 'react';

import './IngredientList.css';
import LoadingIndicator from "../UI/LoadingIndicator";


const IngredientList = props => {
  const {
    onRemoveItem,
    isLoading,
  } = props;

  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      {isLoading
        ? (
          <LoadingIndicator />
        )
        : (
          <ul>
            {props.ingredients.map(ig => (
              <li key={ig.id} onClick={onRemoveItem.bind(this, ig.id)}>
                <span>{ig.title}</span>
                <span>{ig.amount}x</span>
              </li>
            ))}
          </ul>
        )
      }
    </section>
  );
};

export default IngredientList;
