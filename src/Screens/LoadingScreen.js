import React, { useState, useEffect } from "react";
import { Platform, StyleSheet } from "react-native";
import MainStackNavigator from "../Navigations/MainStackNavigator";
import { useDispatch, useSelector } from "react-redux";
import LocalStorage from '../Utils/LocalStorage';
import Loader from "../Components/Loader";
import { View } from "react-native";
import { UserLogin, UserLogout } from "../Actions/AuthActions";
import { AddNotification, changeBarColor, changePrimaryColor, handleActive, userData } from "../Actions/UserActions";
import CommonServices from "../Services/CommonServices";
import { SafeAreaView } from "react-native-safe-area-context";
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const LoadingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const barColor = useSelector(state => state.UserReducer.statusbarColor);
  const color = useSelector((state) => state.UserReducer.primaryColor);

  const CheckStatus = async () => {
    try {
      const userLocal = await LocalStorage.GetData("User");
      const companyLocal = await LocalStorage.GetData("Company");
      const login = await LocalStorage.GetData("Login");
      // let companyParsed = JSON.parse(companyLocal);
      CommonServices.UserNotifications(JSON.parse(userLocal)?.id)
        .then(res => {
          dispatch(AddNotification(res));
        })
        .catch(err => console.log(err))
      if (companyLocal) {
        dispatch(changePrimaryColor({color: JSON.parse(companyLocal)?.colorScheme}))
      }
      dispatch(UserLogin(login));
      dispatch(userData({
        user: JSON.parse(userLocal),
        company: JSON.parse(companyLocal)
      }));
      dispatch(handleActive('Home'));
      setLoaded(true);
    } catch (ex) {
      setLoaded(true);
      dispatch(changeBarColor({ barColor: 'black', barContent: 'light-content' }));
      LocalStorage.RemoveData('Login');
      LocalStorage.RemoveData('Company');
      dispatch(UserLogout());
    }
  }

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: color,
      secondary: '#FFFFFF',
      tertiary: '#333333',
      rippleColor: "rgba(0, 0, 0, .32)"
    },
  };

  useEffect(() => {
    CheckStatus();
  }, [])

  return (
    <View style={styles.container}>
      <PaperProvider theme={theme}>
        {!loaded ?
          <Loader />
          :
          <>
            <SafeAreaView edges={Platform.OS === 'ios' ? ['right', 'top', 'left'] : ['right', 'top', 'left', 'bottom']} style={{ flex: 1, backgroundColor: barColor, paddingBottom: Platform.OS === 'ios' ? 6 : 0 }}>
              <MainStackNavigator navigation={navigation} />
            </SafeAreaView>
          </>
        }
      </PaperProvider>
    </View>

  );
}

export default LoadingScreen

const styles = StyleSheet.create({

  container: {
    width: '100%',
    flex: 1
  },

});