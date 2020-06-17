import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

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

  const removeIngredientHandler = (id) => {
    setIngredients((state) => {
      const filteredList = state.filter((elem) => elem.id !== id)
      return filteredList;
      });
  };

  return (
    <div className="App">
      <IngredientForm
        onAddIngredient={addIngredientHandler}
      />

      <section>
        <Search />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
