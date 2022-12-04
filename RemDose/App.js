import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View} from 'react-native';
import Navigation from './src/screens/Navigation';
import React, {Component, Fragment} from 'react';
import { Provider } from 'react-redux';
import { Store } from './src/redux/store';
import 'react-native-gesture-handler';


export default function App() {
  return (
    <Provider store={Store}>
      <Navigation/> 
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
