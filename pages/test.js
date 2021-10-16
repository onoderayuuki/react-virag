import React from 'react';
import { themeContext, useDark } from './context.js';
import { ToggleButton } from "./toggle"

export default function NextPage (){
  const ctx = useDark();
  return (
    <themeContext.Provider value={ctx}>
        test
      <ToggleButton />
    </themeContext.Provider>
  );
};