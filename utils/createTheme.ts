import { argbFromHex, themeFromSourceColor } from "@material/material-color-utilities";

export const createTheme = () => {
  const randomHexColor = `#${Math.floor(Math.random()*16777215).toString(16)}`
  const theme = themeFromSourceColor(argbFromHex(randomHexColor))

  return theme
};
