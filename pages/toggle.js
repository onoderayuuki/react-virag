import { useContext } from 'react';

import { themeContext } from './test';

export default function toggleButton(){
  const ctx = useContext(themeContext);
  const handleClick = () => {
      ctx.setIsDark(!ctx.dark) // Context値更新
  }

  return (
      <>
      {ctx}
    <button onClick={handleClick}>
     Toggle theme context!
    </button>
    </>
  );
}