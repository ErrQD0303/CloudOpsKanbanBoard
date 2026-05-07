import { PizzaContext, initialState, pizzaReducer } from "./PizzaStore";

import { useReducer } from "react";

type Props = {
  children: React.ReactNode;
};

function PizzaProvider({ children }: Props) {
  const [state, dispatch] = useReducer(pizzaReducer, initialState);

  const addPizza = (pizza: string) => {
    dispatch({ type: "add", payload: pizza });
  };

  const removePizza = (pizza: string) => {
    dispatch({ type: "remove", payload: pizza });
  };

  return (
    <PizzaContext.Provider
      value={{ pizzas: state.pizzas, addPizza, removePizza }}
    >
      {children}
    </PizzaContext.Provider>
  );
}

export { PizzaProvider };
