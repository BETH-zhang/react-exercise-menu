import { Children } from 'react';

export const toArray = (myObj) => {
  const array = myObj.map((value, index) => {
    return [value];
  });

  console.log(array);
  return array;
}

export const getNodeChildren = (children) => {
  const childList = Array.isArray(children) ? children : [children];
  return childList
   .filter(child => child && child.type && child.type.isTreeNode);
}