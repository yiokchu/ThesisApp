import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native';
import {colors} from '../config/colors';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../firebase';

//RESOURCES
/***************************************************************************************
*    
*    Title: React Native Firebase
*    Author: React Native Firebase
*    Availability: https://rnfirebase.io/
*
*    Title: React Native Authentication with Firebase and Expo in 27 minutes
*    Author: Made with Matt
*    Date: 2021
*    Availability: https://www.youtube.com/watch?v=ql4J6SpLXZA
*
*    Title: Connect Firebase to Expo Application
*    Author: Coders Life
*    Date: 2020
*    Availability: https://www.youtube.com/watch?v=wCl3uKmDzvI
*
***************************************************************************************/

export default function SigninScreen({navigation}) {

  //Hold the user information
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //stores data
  const setData = async () => {
    try {
      await AsyncStorage.setItem('UserData', userName);
    } catch (err) {
      console.log(err);
    }
  }

  //navigates to homepage if the user is valid
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("Reminders")
      }
    })

    return unsubscribe
  }, [])

  //creates a new user
  const handleSignUp = () => {
    auth.createUserWithEmailAndPassword(email, password)
    setData()
    .then(userCredentials => {
        const user = userCredentials.user;
        setData();
        console.log("Registered with: " + user.email)
        console.log("Registered as: " + userName)
    })
    .catch(err => console.log(err.message))
  }

  //checks if user is valid
  const handleLogin = () => {
    auth.signInWithEmailAndPassword(email, password)
    setData()
    .then(userCredentials => {
      const user = userCredentials.user;
      console.log("Logged In as: " + user.email)
  })
  .catch(err => err.message)
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Image 
          style={styles.remImg}
          source={require('../../assets/RemDoseLogo.png')}
      />

      <TextInput style={styles.input} 
        placeholder={'Name'} 
        value={userName} 
        onChangeText={(value) => setUserName(value)}
      />
      <TextInput style={styles.input} 
      placeholder={'Email'} 
        value={email} 
        onChangeText={(value) => setEmail(value)}
      />
      <TextInput style={styles.input} 
        placeholder={'Password'} 
        value={password} 
        onChangeText={(value) => setPassword(value)}
        secureTextEntry
      />

    <TouchableOpacity
        style={[styles.btn]}
        onPress={handleLogin}>
            <Text style={[styles.label]}>LOG IN</Text>
    </TouchableOpacity>
    <TouchableOpacity
        style={[styles.btn2]}
        onPress={handleSignUp}>
            <Text style={[styles.label2]}>SIGN UP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#E6E6E6',
    padding: 15,
    borderRadius: 20,
    fontSize: 18,
    width: 300,
    marginVertical: 20,
    paddingLeft: 25,
  },
  remImg: {
    width: 150,
    height: 150,
    marginTop: 120,
    marginBottom: 25,
  },
  btn: {
    borderRadius: 20,
    backgroundColor: colors.turq,
    marginBottom: 10,
    width: 300,
    marginTop: 100,
  },
  btn2: {
    borderRadius: 22,
    borderWidth: 3,
    borderColor:  colors.turq,
    marginBottom: 10,
    width: 300,
    marginTop: 10,
  },
  label: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue' : '' ,
    padding: 15,
    color: colors.white,
  },
  label2: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue' : '' ,
    padding: 15,
    color: colors.turq,
  },
});
