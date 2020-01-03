import React from "react";

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Home from "./src/screens/Home.js";
import Note from "./src/screens/Note.js";

const AppNavigator = createStackNavigator(
  {
    Home: Home,
    Note: Note
  },
  {
    initialRouteName: "Home"
  }
);

export default createAppContainer(AppNavigator);
