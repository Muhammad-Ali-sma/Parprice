import 'react-native-gesture-handler';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { navigationRef } from './NavigationRef';
import WelcomeScreen from '../Screens/WelcomeScreen';
import HomeScreen from '../Screens/HomeScreen';
import SignInScreen from '../Screens/SignInScreen';
import ForgetPassScreen from '../Screens/ForgetPassScreen';
import BottomTabs from '../Components/BottomTabs';
import CategoriesScreen from '../Screens/CategoriesScreen';
import ProductScreen from '../Screens/ProductScreen';
import UserProfileScreen from '../Screens/UserProfileScreen';
import Form from '../Screens/FormScreen';
import ClientsScreen from '../Screens/ClientsScreen';
import ClientContactInfoScreen from '../Screens/ClientContactInfoScreen';
import CheckoutScreen from '../Screens/CheckoutScreen';
import MessagesScreen from '../Screens/MessagesScreen';
import MessageBoxScreen from '../Screens/MessageBoxScreen';
import QuoteScreen from '../Screens/QuoteScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import SmsQuote from '../Screens/SmsQuote';
import PresentQuoteScreen from '../Screens/PresentQuoteScreen';
import CalendarsScreen from '../Screens/CalendarsScreen';
import ScheduleVisitScreen from '../Screens/ScheduleVisitScreen';
import BrowseLeadsScreen from '../Screens/BrowseLeadsScreen';
import DirectLeadsScreen from '../Screens/DirectLeadsScreen';
import LeadConnectScreen from '../Screens/LeadConnectScreen';
import JobDetailsScreen from '../Screens/JobDetailsScreen';
import PlanDetailsScreen from '../Screens/PlanDetailsScreen';
import ChangePassScreen from '../Screens/ChangePassScreen';
import EmailQuote from '../Screens/EmailQuote';
import NotificationsScreen from '../Screens/NotificationsScreen';
import ContractScreen from '../Screens/ContractScreen';
import SecondHomeScreen from '../Screens/SecondHomeScreen';
import SalesLeaderBoardScreen from '../Screens/SalesLeaderBoardScreen';
import ViewQuoteScreen from '../Screens/ViewQuoteScreen';
import EditScheduleScreen from '../Screens/EditScheduleScreen';
import ClientProfileScreen from '../Screens/ClientProfileScreen';
import ShareProfile from '../Screens/ShareProfile';
import CustomWebView from '../Screens/CustomWebView';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const BottomTab = () => {
    return (
        <Tab.Navigator initialRouteName={'Home'} screenOptions={() => ({ tabBarHideOnKeyboard: true })} tabBar={props => <BottomTabs {...props} />} >
            <Tab.Screen name="Home" component={SecondHomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="ClientsScreen" component={ClientsScreen} options={{ headerShown: false }} />
            <Tab.Screen name="MessagesScreen" component={MessagesScreen} options={{ headerShown: false }} />
            <Tab.Screen name="CalendarsScreen" component={CalendarsScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}


const MainStackNavigator = () => {
    const Login = useSelector((state) => state.AuthReducer.login);    
    return (
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator options={{ headerShown: false }}>
                    {Login == 'login' ?
                        <>
                            <Stack.Screen name="Tab" component={BottomTab} options={{ headerShown: false }} />
                            <Stack.Screen name="ClientContactInfoScreen" component={ClientContactInfoScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="Form" component={Form} options={{ headerShown: false }} />
                            <Stack.Screen name="QuoteScreen" component={QuoteScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="PresentQuoteScreen" component={PresentQuoteScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="BrowseLeadsScreen" component={BrowseLeadsScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="DirectLeadsScreen" component={DirectLeadsScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="ProductScreen" component={ProductScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="MessageBoxScreen" component={MessageBoxScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="SmsQuote" component={SmsQuote} options={{ headerShown: false }} />
                            <Stack.Screen name="EmailQuote" component={EmailQuote} options={{ headerShown: false }} />
                            <Stack.Screen name="ScheduleVisitScreen" component={ScheduleVisitScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="LeadConnectScreen" component={LeadConnectScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="PlanDetailsScreen" component={PlanDetailsScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="ChangePassScreen" component={ChangePassScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="ContractScreen" component={ContractScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="SecondHomeScreen" component={HomeScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="SalesLeaderBoardScreen" component={SalesLeaderBoardScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="ViewQuoteScreen" component={ViewQuoteScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="EditScheduleScreen" component={EditScheduleScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="ClientProfileScreen" component={ClientProfileScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="ShareProfile" component={ShareProfile} options={{ headerShown: false }} />
                            <Stack.Screen name="CustomWebView" component={CustomWebView} options={{ headerShown: false }} />                            
                        </>
                        :
                        <>
                            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="ForgetPassScreen" component={ForgetPassScreen} options={{ headerShown: false }} />
                        </>
                    }
                </Stack.Navigator>
            </NavigationContainer>
    );
}

export default MainStackNavigator;
























