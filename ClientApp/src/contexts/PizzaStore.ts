import { createContext, useContext } from "react";

export const PizzaContext = createContext(
  {} as {
    pizzas: string[];
    addPizza: (pizza: string) => void;
    removePizza: (pizza: string) => void;
  },
);

export const usePizzaContext = () => useContext(PizzaContext);

export const initialState: { pizzas: string[] } = {
  pizzas: [],
};

export function pizzaReducer(
  prevState: typeof initialState,
  action: { type: string; payload: unknown },
): typeof initialState {
  switch (action.type) {
    case "add": {
      return {
        ...prevState,
        pizzas: [...prevState.pizzas, action.payload as string],
      };
    }
    case "remove": {
      return {
        ...prevState,
        pizzas: prevState.pizzas.filter(
          (pizza) => pizza !== (action.payload as string),
        ),
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
