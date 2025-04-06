import React from "react";

import { NavigationContainer } from '@react-navigation/native'
import Routes from "./src/routes";

import { LogBox } from "react-native";

LogBox.ignoreLogs(['This method is deprecated']);

function App() {
    return (
        <NavigationContainer>

            <Routes />

        </NavigationContainer>
    );
}


export default App; 