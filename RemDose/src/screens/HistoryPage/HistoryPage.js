import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useMemo} from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useSelector, useDispatch } from 'react-redux';
import {setPills, setPillID} from '../../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CheckBox} from 'react-native-elements';
import {CalendarList} from 'react-native-calendars';
import {colors} from '../../config/colors';

//RESOURCES
/***************************************************************************************
*    
*    Title: react-native-circular-progress-indicator
*    Author: npm
*    Date: 2021
*    Code Version: 4.4.0
*    Availability: https://www.npmjs.com/package/react-native-circular-progress-indicator
*
***************************************************************************************/

export default function HistoryPage({navigation}) {
  //Progress Bar
  global.val = 0;
  const [value, setValue] = useState(0);

  //Checkbox
  const setV = (v) => {
      if(v === true ){
          return true;
      }else {
          return false;
      }
  }

  //If pill has been taken and checked it appears, else it does not appear
  const filterData = () => {
      const filteredMeds = pills.filter(pill => pill.Done === true);
      console.log(filteredMeds.length);
      val = filteredMeds.length;
      console.log("value: " + val);
      return filteredMeds;
    }

  //CURRENT DATE
  const [date, setDate] = useState(null);

  useEffect(() => {
      let today = new Date();
      var days = ['SUN','MON','TUES','WED','THU','FRI','SAT'];
      var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      var day = days[ today.getDay() ];
      var month = months[ today.getMonth() ];
      let date = day + ', ' + today.getDate() + ' ' + month;
      setDate(date);
  }, []);

  //PILL
  //Gets and displays the pills
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

  //count for the progress bar
  const[count] = useState((pills.filter(pill => pill.Done === true).length / pills.length) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.topContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}> TODAY</Text>
                    <Text style={styles.currentDate}> {date} </Text>
                </View>

                <CircularProgress 
                    radius = {100}
                    value = {count}
                    textColor = '#3F414E'
                    fontSize = {20}
                    valueSuffix={'%'}
                    activeStrokeColor = {'#45B3CB'}
                    inActiveStrokeOpacity = {0.2}
                    inActiveStrokeWidth={7}
                />
            </View>
            <View style={styles.pillContainer}>
                <FlatList 
                    data={filterData()}
                    renderItem={({ item }) => (
                        <View >
                            <View style={styles.wrapper}>
                                <Text style={styles.pillText}> {item.Name} </Text>
                                
                                <CheckBox
                                    checked={setV(item.Done)}
                                    checkedColor={'#45B3CB'}
                                />
                            </View>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
          
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topContainer: {
    marginTop: 30,
    marginHorizontal: 10,
    flexDirection: 'row',
  },
  titleContainer: {
    marginRight: 40,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: colors.textBlack,
    marginTop: 25,
  },
  currentDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textGray,
    paddingLeft: 10,
  },
  pillContainer: {
    marginHorizontal: 10,
    height: 450,
    marginTop: -40,
  },
  wrapper: {
    flexDirection: 'row',
    padding: 15,
  },
  pillText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textBlack,
    marginTop: 10,
  },
  monthlyContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 15,
  },
});
