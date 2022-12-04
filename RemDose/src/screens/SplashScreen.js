import {View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, LogBox} from 'react-native';
import {colors} from '../config/colors';

export default function SplashScreen({navigation}){
  //Supressing this warning because React Native got ride of the AsyncStorage and it has to be downloaded separately
  LogBox.ignoreLogs(["AsyncStorage", "extracted"])

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.imgContainer}>
            <Image 
                style={styles.remImg}
                source={require('../../assets/RemDoseLogo.png')}
            />
        </View>
        <View style={styles.titlecontainer}>
            <Text style={styles.title}> REM</Text> 
            <Text style={styles.title2}> DOSE</Text>
        </View>

        <TouchableOpacity
        style={[styles.btn]}
        onPress={() => {
            navigation.navigate('SigninScreen');
        }}>
            <Text style={[styles.label]}>NEXT</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    titlecontainer: {
      flexDirection: 'row',
      textAlign: 'center',
      left: 30,
      marginBottom: 150,
    },
    title:{
      fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue' : '' ,
      fontSize: 60,
      fontWeight: '700',
      marginTop: 10,
      color: colors.textBlack,
    },
    title2:{
      fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue' : '' ,
      fontSize: 60,
      fontWeight: '700',
      marginTop: 10,
      color: colors.orange,
    },
    btn: {
      borderRadius: 20,
      backgroundColor: colors.turq,
      marginBottom: 10,
      width: 300,
      left: 50,
    },
    label: {
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '600',
      fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue' : '' ,
      padding: 15,
      color: colors.white,
    },
    imgContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 150,
    },
    remImg: {
      width: 150,
      height: 150,
    },
  });