import {colors} from '../config/colors';

//import navigation from libraries
import {NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createStackNavigator } from '@react-navigation/stack';

//import screens
import SplashScreen from './SplashScreen';
import RemindersPage from './RemindersPage/RemindersPage';
import HistoryPage from './HistoryPage/HistoryPage';
import MyPillsPage from './MyPillsPage/MyPillsPage';
import ProfilePage from './ProfilePage/ProfilePage';
import AddPage from './addPage/addPage';
import SigninScreen from './SigninScreen';

//Screen Pages Names
const remName = 'Reminder';
const historyName = 'History';
const pillsName = 'My Pills';
const profileName = 'Profile';
const addPage = 'AddPage';
const signinScreen = 'SigninScreen';

//creates nav
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

//RESOURCES
/***************************************************************************************
*
*    Title: Navigating Between Screens
*    Author: React Native 
*    Date: 2022
*    Code version: 0.70
*    Availability: https://reactnative.dev/docs/navigation
*
***************************************************************************************/

function HomeTabs(){
    
    return (
        <Tab.Navigator
            initialRouteName={remName}
            screenOptions={({route}) => ({
                tabBarActiveTintColor: colors.turq,
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === remName) {
                        iconName = focused? 'home':'home-outline';
                    }else if (rn === historyName) {
                        iconName = focused? 'calendar':'calendar-outline';
                    }else if (rn === pillsName) {
                        iconName = focused? 'medical':'medical-outline';
                    }else if (rn === profileName) {
                        iconName = focused? 'person':'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={colors.turq}/>
                },
            })}>

            <Tab.Screen name={remName} component={RemindersPage}/>
            <Tab.Screen name={historyName} component={HistoryPage}/>
            <Tab.Screen name={pillsName} component={MyPillsPage}/>
            <Tab.Screen name={profileName} component={ProfilePage}/>

            </Tab.Navigator>
    );
}
export default function MainContainer(){
    return(        
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="SplashScreen"
                screenOptions={{
                    headerTitleAlign: 'center',
                }}
            >

            <Stack.Screen 
                name="SplashScreen"
                component={SplashScreen}
                options={{
                    headerBackTitle: '',
                    headerShown: false,
                }}
            />

            <Stack.Screen 
                name="SigninScreen"
                component={SigninScreen}
                options={{
                    headerBackTitle: '',
                    headerShown: false,
                }}
            />
            
            <Stack.Screen 
                name="Reminders"
                component={HomeTabs}
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="AddPage"
                component={AddPage}
                options={{
                    title: 'Add Medication',
                    headerBackTitle: '',
                    headerTintColor: colors.turq,
                }}
            />
            </Stack.Navigator> 
        </NavigationContainer>
    );
}

