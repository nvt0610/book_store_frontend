// src/utils/navigation.ts

let navigator: any = null;

export const setNavigator = (nav: any) => {
  navigator = nav;
};

export const navigateTo = (path: string) => {
  if (navigator) navigator(path);
};
