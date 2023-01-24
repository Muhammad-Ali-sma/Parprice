import React, { useCallback, useEffect, useState } from 'react'
import { Dimensions, Platform, Text, TouchableOpacity, View, BackHandler } from "react-native";
import { ActivityIndicator, Appbar, TouchableRipple, useTheme } from 'react-native-paper';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { changeBarColor, handleActive } from '../Actions/UserActions';
import { useFocusEffect } from '@react-navigation/native';
import Popup from './Popup';
const Header = ({ title, onPress, disabled, navigation, isLoading, onGoBack, showSaveTitle = "", onPressCancelBtn = () => { }, showCancelBtn, handleOnPressClose, blackHead, showHeading = true, leftAction, onPressActionBtn, showPopup, showBackIcon = false, headerStyle, centerTitle, showBell, rightAction = false, onPressName = () => { } }) => {

  const { colors } = useTheme();
  const dispatch = useDispatch();
  const notification = useSelector(state => state.UserReducer.notifications);

  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const [show, setShowPopup] = useState(false);
  useFocusEffect(() => {
    const onBackPress = () => {
      if (!blackHead && showPopup) {
        handleOnPressClose();
        return true;
      } else if (!blackHead) {
        if (showCancelBtn) {
          onPressCancelBtn();
        } else {
          onPress();
        }
        return true;
      } else if (blackHead) {
        if (onGoBack !== undefined) {
          onGoBack();
        } else {
          try {
            onPress();
          } catch {
            setShowPopup(true);
            return true;
          }
        }
        return true;
      } else {
        return false;
      }
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  });
  return (
    <>
      <Appbar.Header statusBarHeight={width > 767 ? 15 : 5} style={[{ width: '100%', backgroundColor: !blackHead ? colors.secondary : 'black', justifyContent: 'space-between', paddingHorizontal: 5, marginVertical: width > 767 ? 15 : 0 }, headerStyle]}>

        <View style={{ width: '25%', alignItems: 'flex-start' }}>
          {(!blackHead || showBackIcon) ?
            <>
              {
                showPopup ?
                  <Appbar.Action size={height * 0.045} icon={() => <FontAwesome name="remove" size={24} color="black" />} onPress={handleOnPressClose} />
                  :
                  showCancelBtn ?
                    <View style={{ display: 'flex', flexDirection: 'row', borderRadius: 10, overflow: 'hidden', marginLeft: width * 0.02 }}>
                      <TouchableRipple style={{ padding: 10 }} rippleColor={colors.rippleColor} onPress={() => navigation.goBack()}>
                        <FontAwesome name="chevron-left" size={20} color="black" />
                      </TouchableRipple>
                      <TouchableRipple style={{ padding: 10 }} rippleColor={colors.rippleColor} onPress={onPressCancelBtn}>
                        <Text style={{ fontWeight: '500', fontSize: height * 0.020, color: colors.primary }}>Cancel</Text>
                      </TouchableRipple>
                    </View>
                    :
                    <Appbar.Action size={height * 0.045} color={showBackIcon ? 'white' : 'black'} icon='chevron-left' onPress={leftAction || onPress} />
              }
            </>
            :
            (
              <View style={{ marginLeft: 15, justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableRipple rippleColor={colors.rippleColor} style={{ justifyContent: 'space-between', height: height * 0.036 }} onPress={() => { dispatch(changeBarColor({ barColor: 'white', barContent: 'dark-content' })); navigation.navigate('SettingsScreen'); }}>
                  <>
                    <View style={{ backgroundColor: 'white', width: width > 767 ? 25 : 20, height: 2, borderRadius: 10 }}></View>
                    <View style={{ backgroundColor: 'white', width: width > 767 ? 40 : 35, height: 2, borderRadius: 10 }}></View>
                    <View style={{ backgroundColor: 'white', width: width > 767 ? 30 : 25, height: 2, borderRadius: 10 }}></View>
                  </>
                </TouchableRipple>
              </View>
            )
          }
        </View>
        <View style={{ width: '50%', alignItems: 'center' }}>
          {showHeading &&
            <Appbar.Content onPress={onPressName} title={title} style={{ justifyContent: 'center' }} titleStyle={{ fontWeight: '700', color: blackHead ? 'white' : 'black', textTransform: 'capitalize', fontSize: height * 0.026 }} />
          }
        </View>
        <View style={{ width: '25%', alignItems: 'flex-end' }}>
          {((blackHead && showBell) || showSaveTitle !== "") &&
            <View style={{ marginRight: 15, justifyContent: 'space-between', alignItems: 'center' }}>
              {
                (blackHead && showBell) &&
                <TouchableRipple rippleColor={colors.rippleColor} style={{ position: 'relative' }} >
                  <>
                    <FontAwesome onPress={() => navigation.navigate('NotificationsScreen')} name="bell-o" size={height * 0.045} color={`${colors.secondary}`} />
                    {notification?.length > 0 && <View style={{ backgroundColor: colors.primary, height: width * 0.035, width: width * 0.035, borderRadius: 50, position: 'absolute', alignItems: 'center', justifyContent: 'center', borderWidth: 1, right: width * 0 }}>
                    </View>}
                  </>
                </TouchableRipple>
              }

              {showSaveTitle !== "" && (
                !isLoading ?
                  <View style={{ borderRadius: 10, overflow: 'hidden', }}>
                    <TouchableRipple style={{ padding: 5 }} rippleColor={colors.rippleColor} disabled={disabled} onPress={onPressActionBtn}>
                      <Text style={{ fontWeight: '500', fontSize: height * 0.023, color: colors.primary }}>{showSaveTitle && showSaveTitle}</Text>
                    </TouchableRipple>
                  </View>
                  : <ActivityIndicator animating={true} size={width * 0.06} color={`${colors.primary}`} />)
              }
            </View>
          }

          {rightAction &&
            <Appbar.Action size={height * 0.045} color={'black'} icon='chevron-right' onPress={rightAction} />
          }
        </View>


      </Appbar.Header>
      <Popup
        title={"Exit App"}
        showCancel={true}
        onPress={() => setShowPopup(false)}
        description={'Are you sure you want to exit the application?'}
        show={show}
        onPressOk={() => { setShowPopup(false); BackHandler.exitApp() }}
      />
    </>
  )
};

export default Header