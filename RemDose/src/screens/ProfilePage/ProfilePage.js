import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {colors} from '../../config/colors';
import React, {useState, useEffect} from 'react';
import { auth } from '../../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

//RESOURCES
/***************************************************************************************
*    
*    Title: React Native Firebase
*    Author: React Native Firebase
*    Availability: https://rnfirebase.io/
*
***************************************************************************************/

export default function ProfilePage({navigation}) {

  //For user name at top
  const [userName, setUserName] = useState('');

  //Navigates to Splash screen when logout
  const handleLogOut = () => {
    auth.signOut()
    .then(() => {
      navigation.replace("SplashScreen")
    })
    .catch(err => alert(err.message))
  }

  useEffect(() => {
    getData();
  }, []);
  
  const getData = () => {
    try {
      AsyncStorage.getItem('UserData')
      .then(value => {
        if (value != null) {
          setUserName(value.toUpperCase());
          console.log(userName)
        }
      })
    }catch(err) {
      console.log(err);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
          <Text style={styles.title}> HELLO {userName}! </Text>
      </View>
      <TouchableOpacity style={[styles.btn]}
        onPress={handleLogOut}>
        <Text  style={[styles.label]}> LOG OUT </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: "center",
  },
  btn: {
    borderRadius: 20,
    backgroundColor: colors.turq,
    marginBottom: 10,
    width: 300,
    marginTop: 150,
  },
  label: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue' : '' ,
    padding: 15,
    color: colors.white,
  },
  titleWrapper: {
    backgroundColor: colors.lightblue,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    width: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.textBlack,
  },
});
