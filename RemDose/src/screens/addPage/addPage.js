import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, SafeAreaView, Modal, TouchableOpacity, TextInput, LogBox, ScrollView, Alert, AppState} from 'react-native';
import { colors } from '../../config/colors';
import React, {useEffect, useState, useRef} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector, useDispatch } from 'react-redux';
import {setPills , setPillID} from '../../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CheckBox} from 'react-native-elements';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import moment from 'moment';

//Supressing this warning because it only appears if you are not login with your Expo account
LogBox.ignoreLogs(["Fetching", "Expo", "token"])

//RESOURCES
/***************************************************************************************
*    
*    Title: Push Notifications Overview
*    Author: Expo
*    Availability: https://docs.expo.dev/push-notifications/overview/
*
*    Title: Notifications
*    Author: Expo
*    Availability: https://docs.expo.dev/versions/latest/sdk/notifications/
*
*    Title: expo-notifications
*    Author: Expo
*    Date: 2022
*    Availability: https://github.com/expo/expo/
*
*    Title: React Native Tutorial #28 (2021) - Local & Scheduled Push Notification
*    Author: Programming with Mash
*    Date: 2021
*    Availability: https://www.youtube.com/watch?v=RgN1TEnULVQ
*
*    Title: @react-native-community/datetimepicker
*    Author: npm
*    Date: 2022
*    Code version: 6.7.1
*    Availability: https://www.npmjs.com/package/@react-native-community/datetimepicker
*
***************************************************************************************/

//global variables to set time 
global.th = 0;
global.tm = 0;

//NOTIFICATIONS

//Notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

//creates the notification with specific message and time
async function schedulePushNotification() {
  const identifier = await Notifications.scheduleNotificationAsync({
      content: {
          title: "RemDose",
          body: 'It is time to take your meds!',
      },
      trigger: { 
          type: 'daily',
          repeat: true,
          hour: th,
          minute: tm,
      },
  });
}

//Register the app to get a push notification token
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      }
      if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
  } else {
      alert('Must use physical device for Push Notifications');
  }
  
  
  if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      playSound: true,
      vibrate: true,
      });
  }

  
  if (Platform.OS === 'ios') {
    Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
    playSound: true,
    vibrate: true,
    });
  }
  
  return token;
} //----------->Finish Notifications


export default function AddPage({navigation}) {

  useEffect(() => {
    getPill();
}, [])

  //Input
  const[name, setName] = useState('');
  const[dose, setDosage] = useState('');
  const[quantity, setQuantity] = useState('');
  const[done, setDone] = useState(false);
  const[colorS, setColorS] = useState('gray');
  const[showImageModal, setImageModal] = useState(false);
  const[image, setImage] = useState('Image1');
  const [time, setTime] = useState("");

  const {pills, pillID} = useSelector(state => state.pillReducer);
  const dispatch = useDispatch();


  useEffect(() => {
       getPill();
  }, [])

  //gets the pill information
  const getPill = () => {
       const Pill = pills.find(pill=>pill.ID === pillID)
       if (Pill) {
           setName(Pill.Name);
           setDosage(Pill.Dose);
           setQuantity(Pill.Quantity);
           setDone(Pill.Done);
           setColorS(Pill.ColorS);
           setImage(Pill.Image);
           setTime(Pill.Time);
       }
  }

  //delete pill (NOT in use rn)
  const deletePill = (id) => {
    const filteredPills = pills.filter(pill => pill.ID !== id);
    AsyncStorage.setItem('Pills', JSON.stringify(filteredPills))
    .then(() => {
        dispatch(setPills(filteredPills));
        Alert.alert('Delete', 'Medication Removed Succesfully.');
    }).catch(err => console.log(err))
   }

   //if editing the pill the information remains, if not creates a new pill reminder
   const setPill = () => {
       if (name.length == 0){
            Alert.alert('Warning!', 'Please write a medication name.')
       }else {
           try {
                var Pill = {
                    ID: pillID, 
                    Name: name,
                    Dose: dose,
                    Quantity: quantity,
                    Done: done,
                    ColorS: colorS,
                    Image: image,
                    Time : time,
                }
                const index = pills.findIndex(pill => pill.ID === pillID);
                let newPills = [];
                if (index > -1) {
                    newPills = [...pills];
                    newPills[index] = Pill;
                } else {
                    newPills = [...pills, Pill];
                }
                AsyncStorage.setItem("Pills", JSON.stringify(newPills))
                .then(() => {
                    dispatch(setPills(newPills));
                    Alert.alert('Success', 'Medication Saved Successfully');
                    navigation.goBack();  
                    schedulePushNotification();
                })
                .catch(err => console.log("problem" + err))
           }catch (error){
                console.log(error);
           }
       }
   }

   //Select Time
   const [date, setDate] = useState(new Date());
   const [mode, setMode] = useState('date');
   const [show, setShow] = useState(false);
   const [text, setText] = useState('Hours: 00 | Minutes: 00');

   const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        let tempDate = new Date(currentDate);
        let fTime = 'Hours: ' + tempDate.getHours() + ' | Minutes: ' + tempDate.getMinutes();
        let fTime2 = tempDate.getHours() + ': ' + tempDate.getMinutes();
        setText(fTime)
        setTime(fTime)
        console.log( fTime )
        th = tempDate.getHours();
        tm = tempDate.getMinutes();
        console.log ( "TH " + th)
        console.log ( "Time:" + th + " " + tm)
   }

   const showMode = (currentMode) => {
       setShow(true);
       setMode(currentMode);
   }

  //Notifications
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
      });

      return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      };
  }, []);
 
  const retrieveDone = async () => {
    const value = await AsyncStorage.getItem('Sdone');
  };         

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView>
          <Modal
              visible={showImageModal}
              transparent
              onRequestClose={() => setImageModal(false)}
              animationType='slide'
              hardwareAccelerated
          >
              <View style={styles.imgModal}>
                  <View style={styles.chooseImgWrapper}>
                      <View>
                          <Text style={styles.chooseImgText}> Choose an Image </Text>
                      </View>
                      <View>
                          <TouchableOpacity style={[image === 'Image1' ? styles.imgChooseT : styles.imgChoose]}
                              onPress={() => {
                              setImage('Image1')
                          }}>
                              <Image 
                                  style={styles.img}
                                  source={require('../../../assets/pill1.png')}
                              />
                          </TouchableOpacity>
                          <TouchableOpacity style={[image === 'Image2' ? styles.imgChooseT : styles.imgChoose]}
                              onPress={() => {
                              setImage('Image2')
                          }}>
                              <Image 
                                  style={styles.img}
                                  source={require('../../../assets/pill2.png')}
                              />
                          </TouchableOpacity>
                          <TouchableOpacity style={[image === 'Image3' ? styles.imgChooseT : styles.imgChoose]}
                              onPress={() => {
                              setImage('Image3')
                          }}>
                              <Image 
                                  style={styles.img}
                                  source={require('../../../assets/pill3.png')}
                              />
                          </TouchableOpacity>
                      </View>
                      <View>
                          <TouchableOpacity style={styles.savebtn} onPress={() => setImageModal(false)}>
                              <Text style={styles.saveLabel}> Save </Text>
                          </TouchableOpacity>
                      </View>
                  </View>
              </View>
          </Modal>
          <View style={styles.imgContainer}>
              <TouchableOpacity
                  style={styles.img}
                  onPress={() => {
                      setImageModal(true)
                  }}
              >
                  <Image 
                      style={styles.img}
                      source= { image === 'Image1' ? require('../../../assets/pill1.png') :
                          image === 'Image2' ? require('../../../assets/pill2.png') :
                          image === 'Image3' ? require('../../../assets/pill3.png') : require('../../../assets/pill1.png')
                      }
                  />
              </TouchableOpacity>
          </View>

          <CheckBox
              checked={done}
              checkedColor={'#45B3CB'}
              onPress={() => {
                  setDone(!done)
              }}
          />

          <View style={styles.colorSelect}>
              <TouchableOpacity style={[colorS === 'gray' ? styles.selectG2 : styles.selectG ]}
                  onPress={() => {
                      setColorS('gray')
                  }}> 
              </TouchableOpacity>
              <TouchableOpacity style={[colorS === 'yellow' ? styles.selectY2 : styles.selectY ]}
                  onPress={() => {
                      setColorS('yellow')
                  }}>
              </TouchableOpacity>
              <TouchableOpacity style={[colorS === 'purple' ? styles.selectP2 : styles.selectP ]}
                  onPress={() => {
                      setColorS('purple')
                  }}>
              </TouchableOpacity>
              <TouchableOpacity style={[colorS === 'orange' ? styles.selectO2 : styles.selectO ]}
                  onPress={() => {
                      setColorS('orange')
                  }}>
              </TouchableOpacity>
          </View>
          <View style={styles.contWrapper}>
              <Text style={styles.subtitle}> NAME </Text>
                  <TextInput style={styles.input} placeholder={'Name'} value={name} onChangeText={(value) => setName(value)}/>
              <Text style={styles.subtitle}> DOSE </Text>
                  <View style={styles.doseWrapper}>
                      <TextInput style={styles.input2} placeholder={'Dosage'} value={dose} onChangeText={(value) => setDosage(value)}/>
                      <Text style={styles.addText}> Capsule(s) </Text>
                  </View>
              <Text style={styles.subtitle}> TIME </Text>
                  <View style={styles.timeWrapper}>
                      <Text> {time} </Text>
                      <View>
                          <TouchableOpacity onPress={() => 
                              showMode('time')
                          }>
                              <Text style={styles.button}> Click Here to Select a Time </Text>
                          </TouchableOpacity>
                      </View>

                      {show && (
                          <DateTimePicker
                          testID = 'dateTimePicker'
                          value={date}
                          mode={mode}
                          is24Hour={true}
                          display="spinner"
                          onChange={onChange}
                          />
                      )}
                  </View>
              <Text style={styles.subtitle}> QUANTITY </Text>
                  <TextInput style={styles.input3} placeholder={'Quantity'} value={quantity} onChangeText={(value) => setQuantity(value)}/>
              

          </View>
          
          <View style={styles.btnWrapper}>
              <TouchableOpacity
                  style={[styles.btn3]}
                  onPress={() => navigation.goBack()}>
                      <Text style={[styles.label2]}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={
                  setPill
              }
                  style={[styles.btn]}>
                      <Text style={[styles.label]}>DONE</Text>
              </TouchableOpacity>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: Platform.OS === 'ios' ? 200 : 100,
  },
  imgContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  img: {
    width: 80,
    height: 80,
  },
  imgChoose: {
    marginVertical: 10,
  },
  imgChooseT: {
    marginVertical: 10,
    borderColor: colors.turq,
    borderWidth: 2,
  },
  contWrapper: {
    paddingTop: 10,
    marginLeft: 30,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textGray,
    paddingBottom: 15,
    paddingTop: 15,
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: 300,
    backgroundColor: colors.lightgray,
    borderRadius: 10,
    fontSize: 16,
    left: 30,
  },
  input2: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: 150,
    backgroundColor: colors.lightgray,
    borderRadius: 10,
    fontSize: 16,
    left: 30,
  },
  input3: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: 150,
    backgroundColor: colors.lightgray,
    borderRadius: 10,
    fontSize: 16,
    left: 30,
    marginBottom: 15,
  },
  doseWrapper: {
    flexDirection: 'row',
  },
  addText: {
    color: colors.textBlack,
    fontWeight: "700",
    fontSize: 18,
    left: 40,
    top: 10,
  },
  timeWrapper: {

  },
  button: {
    color: colors.turq,
    fontSize: 20,
    padding: 10,
    paddingLeft: 50,
    fontWeight: 'bold',
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btnWrapper2: {
    marginLeft: 25,
    marginBottom: 10,
  },
  btn: {
    borderRadius: 15,
    backgroundColor: colors.turq,
    marginBottom: 10,
    width: 150,
  },
  btn2: {
    borderRadius: 15,
    backgroundColor: colors.orange,
    marginTop: 10,
    marginBottom: 20,
    width: 200,
  },
  btn3: {
    borderRadius: 15,
    borderWidth: 3,
    borderColor: colors.turq,
    backgroundColor: colors.white,
    marginBottom: 10,
    width: 150,
  },
  pick: {
    width: '80%',
    marginTop: Platform.OS === 'ios' ? -55 : -25,
  },
  label: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    padding: 15,
    color: colors.white,
  },
  label2: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    padding: 15,
    color: colors.turq,
  },
  delLabel: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',
    padding: 10,
    color: colors.white,
  },
  colorSelect: {
    flexDirection: 'row',
    height: 25,
    width: 120,
    marginVertical: 5,
    marginLeft: 270,
  },
  selectG: {
    flex: 1,
    backgroundColor: colors.gray,
    borderRadius: 20,
    marginRight: 5,
  },
  selectG2: {
    flex: 1,
    backgroundColor: colors.gray,
    borderRadius: 25,
    marginRight: 5,
    borderColor: colors.turq,
    borderWidth: 2,
  },
  selectY: {
    flex: 1,
    backgroundColor: colors.yellow,
    borderRadius: 25,
    marginRight: 5,
  },
  selectY2: {
    flex: 1,
    backgroundColor: colors.yellow,
    borderRadius: 20,
    marginRight: 5,
    borderColor: colors.turq,
    borderWidth: 2,
  },
  selectP: {
    flex: 1,
    backgroundColor: colors.purple,
    borderRadius: 25,
    marginRight: 5,
  },
  selectP2: {
    flex: 1,
    backgroundColor: colors.purple,
    borderRadius: 20,
    marginRight: 5,
    borderColor: colors.turq,
    borderWidth: 2,
  },
  selectO: {
    flex: 1,
    backgroundColor: colors.orange,
    borderRadius: 25,
    marginRight: 5,
  },
  selectO2: {
    flex: 1,
    backgroundColor: colors.orange,
    borderRadius: 20,
    marginRight: 5,
    borderColor: colors.turq,
    borderWidth: 2,
  },
  imgModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  chooseImgWrapper: {
    width: 300,
    height: 400,
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: 'center',
  },
  chooseImgText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textGray,
    paddingTop: 15,
  },
  savebtn: {
    borderRadius: 15,
    backgroundColor: colors.turq,
    marginBottom: 10,
    width: 130,
  },
  saveLabel: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    padding: 10,
    color: colors.white,
  },
});
