import { createContext, useCallback, useState } from 'react';

// context default value
const defaultContext = {
  dark: false,
  setIsDark: () => {},
};

// context object
export const ChangeContext = createContext(defaultContext);

// custom Hook
export const useDark = ()=> {
  // state名はThemeContext typeのプロパティに合わせる。
  const [dark, setDark] = useState(false);
  // 関数名はThemeContext typeのプロパティに合わせる。
  const setIsDark = useCallback((current) => {
    setDark(current);
  }, []);
  return {
    dark,
    setIsDark,
  };
};