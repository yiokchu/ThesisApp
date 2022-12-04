import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, FlatList} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {setPills, setPillID} from '../../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../config/colors';
import * as Notifications from 'expo-notifications';

export default function MyPillsPage({navigation}) {

  //Pills
  //gets pills stored and displays them 
  const {pills} = useSelector(state => state.pillReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        getPills();
    }, [])

    const getPills = () => {
        AsyncStorage.getItem('Pills')
        .then(pills=>{
            const parsedPills = JSON.parse(pills);
            if(parsedPills && typeof parsedPills === 'object') {
                 dispatch(setPills(parsedPills));
            }
        })
        .catch(err => console.log(err))
    }

    //Delete pill
    const deletePill = (id) => {
        const filteredPills = pills.filter(pill => pill.ID !== id);
        AsyncStorage.setItem('Pills', JSON.stringify(filteredPills))
        .then(() => {
            dispatch(setPills(filteredPills));
        }).catch(err => console.log(err))
    }
    //removePushNotification();
    /*
    async function removePushNotification() {
      let token = (await Notifications.getExpoPushTokenAsync()).data;
      //Notifications.removeDeliveredNotificationAsync(token);
      //Notification.cancelLocalNotifications(token);
      await Notifications.cancelScheduledNotificationAsync(identifier);
      console.log("Notification Removed")
      token.remove();
    }*/
    
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.pillContainer}>
                    <FlatList 
                        data={pills}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.items} 
                            onPress={() => {
                                dispatch(setPillID(item.ID));
                                navigation.navigate('AddPage');
                            }}>
                                <View style={[{borderColor: 
                                    item.ColorS === 'yellow' ? '#E7D617':
                                    item.ColorS === 'purple' ? '#DFB2F4':
                                    item.ColorS === 'orange' ? '#F4B24F':'#D9D9D9'
                                }, styles.pillWrap]}>
                                <TouchableOpacity style={styles.deleteImage}
                                    onPress={() => {
                                        deletePill(item.ID)
                                }}>
                                    <Ionicons name={'trash-outline'} size={30} color={'#45B3CB'}/>
                                </TouchableOpacity>
                                    <View style={styles.infoContainer}>
                                        <Text style={styles.nameText}>
                                            {item.Name}
                                        </Text>
                                        <Image 
                                            style={styles.remImg}
                                            source= { item.Image === 'Image1' ? require('../../../assets/pill1.png') :
                                            item.Image === 'Image2' ? require('../../../assets/pill2.png') :
                                            item.Image === 'Image3' ? require('../../../assets/pill3.png') : require('../../../assets/pill1.png')
                                            }
                                        />
                                        <Text style={styles.doseText}>
                                            {item.Dose} CAPSULES(S)
                                        </Text>
                                        <Text style={styles.quantityText}>
                                            LEFT: {item.Quantity}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
           
            <TouchableOpacity style={styles.btn} onPress={() => {
                    dispatch(setPillID(pills.length + 1));
                    navigation.navigate('AddPage');
                }}>
                    <Text style={styles.add}> + </Text> 
            </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pillWrap: {
    backgroundColor: colors.white,
    borderWidth: 3.5,
    borderRadius: 15,
    marginBottom: 20,
    width: '50%',
    height: 230,
  },
  pillContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  infoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  nameText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textBlack,
  },
  doseText: {
      fontSize: 14,
      color: colors.textGray,
  },
  quantityText: {
    fontSize: 16,
    color: colors.turq,
    fontWeight: 'bold',
  },
  remImg: {
    width: 60,
    height: 60,
    marginVertical: 15,
  },
  btn: {
    backgroundColor: colors.turq,
    borderRadius: 60,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    bottom: 20,
    left: 320,
  },
  add: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
  },
  deleteImage: {
    paddingLeft: 10,
    paddingTop: 10,
  },
});
