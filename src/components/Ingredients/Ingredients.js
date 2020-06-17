import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch('https://react-hooks-ingredint-list.firebaseio.com/ingredients.json')
      .then((response) => response.json())
      .then((responseData) => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount,
          });
        }
        setIngredients(loadedIngredients);
      })
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
