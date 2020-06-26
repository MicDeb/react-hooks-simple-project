import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setIngredients(filteredIngredients);
  }, [])

  const addIngredientHandler = (ingredient) => {
    fetch('https://react-hooks-ingredint-list.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
      return response.json()
    }).then((responseData) => {
      setIngredients((state) => [
        ...state,
        { id: responseData.name , ...ingredient }
      ]);
    });
  };

  const removeIngredientHandler = (ingredientId) => {
    fetch(`https://react-hooks-ingredint-list.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    }).then(() => {
      setIngredients((state) => {
        return state.filter((elem) => elem.id !== ingredientId);
      });
    });
  };

  return (
    <div className="App">
      <IngredientForm
        onAddIngredient={addIngredientHandler}
      />

      <section>
        <Search
          onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
