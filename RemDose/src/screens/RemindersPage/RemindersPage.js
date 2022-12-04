import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView,  TouchableOpacity, FlatList, Alert } from 'react-native';
import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {setPills, setPillID} from '../../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CheckBox} from 'react-native-elements';
import Pill from '../../components/Pill';
import {colors} from '../../config/colors';
import uuid from 'react-native-uuid';

//RESOURCES
/***************************************************************************************
*
*    Title: Async Storage
*    Author: React Native
*    Date: 2022
*    Code version: 0.70
*    Availability: https://reactnative.dev/docs/asyncstorage
*
*    Title: React Native Tutorial #24 (2021) - AsyncStorage
*    Author: Programming with Mash
*    Date: 2021
*    Availability: https://www.youtube.com/watch?v=CmQIMrGnBDs&t=566s
*
***************************************************************************************/

export default function RemindersPage({navigation}) {

  //Gets pills stored
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

  //create dates and time
  const [date, setDate] = useState(null);

  
  //display the time AM and PM of the pills
  const display = (t) => {
      const p =  JSON.stringify(t);
      const words = p.split(' ');
      //toString().
      const count = words.length;
      const length = 5;
      const elements = [];
      let position = 0;

      while (position < count) {
          const text = words.slice(position + 1, 2).join(' '); //Hour
          const text2 = words.slice(4, 5).join(' '); //Minutes
          const correctT = parseInt(text);
          const correctT2 = parseInt(text2);
          const result = " ";
          if(correctT > 12) {
              correctT = correctT - 12;
              if(correctT2 >= 30) {
                  result = correctT + ":30 PM";
              }
              else {
                  result = correctT + ":00 PM";
              }
          } else if (correctT = 12){
            if(correctT2 >= 30) {
              result = correctT + ":30 PM";
            }
            else {
                result = correctT + ":00 PM";
            }
          }
          else {
              if(correctT2 >= 30) {
                  result = correctT + ":30 AM";
              }
              else {
                  result = correctT + ":00 AM";
              }
          }
          position += length;
          elements.push((
              <Text key={uuid.v4()}>{result}</Text>
            ));
      }
      return elements;
  }

  const [currentDate, setCurrentDate] = useState('');
  const [savedDate, setsavedDate] = useState('');

  //Dispaly the current date at the top
  useEffect(() => {
      let today = new Date();
      var days = ['SUN','MON','TUES','WED','THU','FRI','SAT'];
      var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      var day = days[ today.getDay() ];
      var month = months[ today.getMonth() ];
      let date = day + ', ' + today.getDate() + ' ' + month;
      setDate(date);

      
      let current = new Date().getDate();
      var month = new Date().getMonth() + 1;
      var year = new Date().getFullYear();
      let CDate = current + "/" + month + "/" + year + " ";
        setCurrentDate(
          CDate
        )
      console.log("current Date " + currentDate)

      const retrieveDate = async () => {
          const value = await AsyncStorage.getItem('Sdate');
          let d = value + " ";
          console.log("save Date " + savedDate)
          setsavedDate(d)
      };

      retrieveDate()
      //console.log("retrieved Date " + retrieveDate())

      if (savedDate == currentDate){
        console.log("Same day: !Reset");
        console.log("Compare " + savedDate + 'and ' + currentDate);
      } else{
        checkPill(pills.ID, false)
        AsyncStorage.setItem('Sdate', currentDate);
        console.log("New Saved Date " + currentDate);
        console.log("End of the day: Reset checkbox");
      }

  }, []);

  
  //displays a flatlist containing the pills and navigates to add new medication page
  const checkPill = (id, newValue) => {
    let something = [];
    const index = pills.findIndex(pills=>pills.ID === id);
    if(index > -1) {
      let newPills = [...pills];
      newPills[index].Done = newValue;
      something = newPills;
      AsyncStorage.setItem("Pills", something.toString())
      //AsyncStorage.setItem("Pills", JSON.stringify(newPills, newPills))
      //AsyncStorage.setItem("Pills", JSON.stringify(newPills, pills))
      .then(() => {
        dispatch(setPills(newPills));
        Alert.alert('Success', 'Checked state changed');
    })
    .catch(err => console.log("problem" + err))
    }
  }

  /*
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };*/
 
  //<Text style={styles.timeSubtitle}> {display(item.Time)}</Text>

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.titleWrapper}>
                <Text style={styles.title}> TODAY</Text>
                <Text style={styles.currentDate}> {date} </Text>
            </View>
            
                <View style={styles.taskWrapper}>
                        <FlatList 
                            data={pills}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                  style={styles.items} 
                                  onPress={() => {
                                      dispatch(setPillID(item.ID));
                                      navigation.navigate('AddPage');
                                }}>
                                    <Text style={styles.timeSubtitle}> {display(item.Time)}</Text>
                                
                                    <View style={[{borderColor: 
                                        item.ColorS === 'yellow' ? '#E7D617':
                                        item.ColorS === 'purple' ? '#DFB2F4':
                                        item.ColorS === 'orange' ? '#F4B24F':'#D9D9D9'
                                    }, styles.pillWrap]}>
                                        <View>
                                            <Pill text={item.Name} value={item.Dose} value2={item.Image}/>
                                        </View>
                                        
                                        <CheckBox
                                            checked={item.Done}
                                            checkedColor={'#45B3CB'}
                                            onPress={(newValue) => {
                                               checkPill(item.ID, newValue)
                                            }}
                                        />
                                        
                                    </View>
                                </TouchableOpacity>
                            )}
                            /*
                            <CheckBox
                                            checked={item.Done}
                                            checkedColor={'#45B3CB'}
                                        />
                            */
                            //keyExtractor={item => item.ID}
                            //keyExtractor={item => item.id}
                            //keyExtractor={(item,index) => item.Name}
                            keyExtractor={(item, index) => index.toString()}
                            //keyExtractor={item => item.key}
                            //keyExtractor={(item) => item.Name}
                            //keyExtractor={(item, index) => item + index.toString()}
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
  titleWrapper: {
    backgroundColor: colors.lightblue,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.textBlack,
  },
  currentDate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textGray,
    paddingLeft: 10,
  },
  taskWrapper: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  timeSubtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textGray,
    paddingBottom: 15,
  },
  pillWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
});
