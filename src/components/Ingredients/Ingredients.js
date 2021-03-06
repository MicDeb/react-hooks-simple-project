import React, { useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id)
    default:
      throw new Error('Should not get there!')
  }
}

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...httpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR_ERROR':
      return { ...httpState, error: null };
    default:
      throw new Error('Should not get reached!');
  }
}

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, [])

  const addIngredientHandler = useCallback((ingredient) => {
    dispatchHttp({type: 'SEND'});
    fetch('https://react-hooks-ingredint-list.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
      dispatchHttp({type: 'RESPONSE'});
      return response.json()
    }).then((responseData) => {
      dispatch({ type: 'ADD', ingredient: { id: responseData.name , ...ingredient } })
    });
  }, []);

  const removeIngredientHandler = useCallback((ingredientId) => {
    dispatchHttp({type: 'SEND'});
    fetch(`https://react-hooks-ingredint-list.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    }).then(() => {
      dispatchHttp({type: 'RESPONSE'});
      dispatch({ type: 'DELETE', id: ingredientId });
    }).catch(() => {
      dispatchHttp({type: 'ERROR', errorMessage: 'Something went wrong!'});
    });
  }, []);

  const clearError = useCallback(() => {
    dispatchHttp({type: 'CLEAR_ERROR'});
  }, []);

  const ingredientsList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [ingredients, removeIngredientHandler])

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        isLoading={httpState.loading}
      />

      <section>
        <Search
          onLoadIngredients={filteredIngredientsHandler}
        />
        {ingredientsList}
      </section>
    </div>
  );
}

export default Ingredients;
