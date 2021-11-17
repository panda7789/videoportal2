import React from 'react';

interface INavigationContext {
  actualPage: number;
  setActualPage: (value: number) => void;
}

const defaultState = {
  actualPage: 0,
  setActualPage: () => {},
};

const NavigationContext = React.createContext<INavigationContext>(defaultState);
export default NavigationContext;
