import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setIngredients(filteredIngredients);
  }, [])

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);
    fetch('https://react-hooks-ingredint-list.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
      setIsLoading(false);
      return response.json()
    }).then((responseData) => {
      setIngredients((state) => [
        ...state,
        { id: responseData.name , ...ingredient }
      ]);
    });
  };

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);
    fetch(`https://react-hooks-ingredint-list.firebaseio.com/ingredients/${ingredientId}.jsn`, {
      method: 'DELETE',
    }).then(() => {
      setIsLoading(false);
      setIngredients((state) => {
        return state.filter((elem) => elem.id !== ingredientId);
      });
    }).catch(() => {
      setError('Something went wrong');
      setIsLoading(false);
    });
  };

  const clearError = () => {
    setError(false);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        isLoading={isLoading}
      />

      <section>
        <Search
          onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
}

export default Ingredients;
