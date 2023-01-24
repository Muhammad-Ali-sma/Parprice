import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, Text } from 'react-native';
import { Feather, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import { FAB, useTheme, TouchableRipple, Avatar } from 'react-native-paper';
import { changeBarColor, handleActive } from '../Actions/UserActions';


const BottomTabs = ({ navigation }) => {

  const dispatch = useDispatch();
  const { colors } = useTheme();
  const active = useSelector(state => state.UserReducer.active);
  const msgCount = useSelector(state => state.ChatReducer.msgCount);
  const scheduleCount = useSelector(state => state.UserReducer.scheduleCount);
  const [show, setShow] = useState(false);
  
  const handleOnMenuBtnClick = (type) => {
    if (type == 'home') {
      dispatch(handleActive('Home'));
      dispatch(changeBarColor({ barColor: 'black', barContent: 'light-content' }))
      navigation.navigate('Home')
    } else if (type == 'Clients') {
      dispatch(handleActive('Clients'));
      dispatch(changeBarColor({ barColor: 'black', barContent: 'light-content' }))
      navigation.navigate('ClientsScreen')
    } else if (type == 'Message') {
      dispatch(handleActive('Message'))
      dispatch(changeBarColor({ barColor: 'black', barContent: 'light-content' }))
      navigation.navigate('MessagesScreen');
    } else if (type == 'Calendars') {
      dispatch(handleActive('Calendars'))
      dispatch(changeBarColor({ barColor: 'white', barContent: 'dark-content' }));
      navigation.navigate('CalendarsScreen')
    }
  }
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  return (
    <>
      <View style={{ height: width > 767 ? height * 0.075 : width * 0.14 }}>
        <Image resizeMode='stretch' source={require('../../assets/images/tab.png')} style={{ width: '100%', position: 'absolute', height: width > 767 ? height * 0.12 : 55, top: -width * 0.08 }} />
        <View style={[styles.container]}>
          <View style={styles.row}>
            <TouchableOpacity style={styles.col} onPress={() => handleOnMenuBtnClick('home')} >
              <Feather name="home" size={width > 767 ? width * 0.045 : width * 0.065} color={`${active === 'Home' ? colors.primary : 'black'}`} />
              <Text style={{ fontSize: height * 0.018, color: 'black' }}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.col} onPress={() => handleOnMenuBtnClick('Clients')} >
              <Feather name={`users`} size={width > 767 ? width * 0.045 : width * 0.065} color={`${active === 'Clients' ? colors.primary : 'black'}`} />
              <Text style={{ fontSize: height * 0.018, color: 'black' }}>Clients</Text>
            </TouchableOpacity>


            <View style={[styles.col]}>
              <View style={{ position: 'absolute', top: width > 767 ? -height * 0.04 : -25, borderRadius: 250, backgroundColor: 'blue', overflow: 'hidden', width: width > 767 ? height * 0.09 : width * 0.14, height: width > 767 ? height * 0.09 : width * 0.14 }}>
                <TouchableRipple rippleColor={colors.secondary} underlayColor={'grey'} style={[{ width: width > 767 ? height * 0.09 : width * 0.14, height: width > 767 ? height * 0.09 : width * 0.14, borderRadius: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }, elevationShadowStyle(4)]} onPress={() => { setShow(!show) }} >
                  <FontAwesome5 name="plus" size={width > 767 ? width * 0.046 : width * 0.065} color={`${colors.primary}`} />
                </TouchableRipple>
              </View>
            </View>
            <TouchableOpacity style={styles.col} onPress={() => handleOnMenuBtnClick('Message')} >
              <FontAwesome size={width > 767 ? width * 0.045 : width * 0.065} color={`${active === 'Message' ? colors.primary : 'black'}`} name="envelope-o" />
              <Text style={{ fontSize: height * 0.018, color: 'black' }}>Messages</Text>
              {msgCount > 0 && <Avatar.Text style={{ position: 'absolute', right: width * 0.050, top: height * 0.015 }} labelStyle={{ fontWeight: '700' }} size={width * 0.04} label={msgCount} />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.col} onPress={() => handleOnMenuBtnClick('Calendars')} >
              <Feather name="calendar" size={width > 767 ? width * 0.045 : width * 0.065} color={`${active === 'Calendars' ? colors.primary : 'black'}`} />
              <Text style={{ fontSize: height * 0.018, color: 'black' }}>Calendar</Text>
              {scheduleCount > 0 && <Avatar.Text style={{ position: 'absolute', right: width * 0.050, top: height * 0.015 }} labelStyle={{ fontWeight: '700' }} size={width * 0.04} label={scheduleCount} />}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <FAB.Group
        open={show}
        visible={false}
        icon={'plus'}
        color={colors.primary}
        actions={[
          {
            icon: 'home',
            label: 'Leads',
            color: colors.primary,
            labelTextColor: colors.primary,
            onPress: () => { dispatch(changeBarColor({ barColor: 'white', barContent: 'dark-content' })); navigation.navigate('BrowseLeadsScreen') },
            style: { borderWidth: 1, borderColor: colors.primary, },
            labelStyle: { borderRadius: 20, borderWidth: 1, borderColor: colors.primary }
          },

          {
            icon: () => <Feather color={colors.primary} name="users" size={width > 767 ? width * 0.03 : width * 0.06} />,
            label: 'Client',
            color: colors.primary,
            labelTextColor: colors.primary,
            onPress: () => { dispatch(changeBarColor({ barColor: 'white', barContent: 'dark-content' })); navigation.navigate('Form') },
            style: { borderWidth: 1, borderColor: colors.primary },
            labelStyle: { borderRadius: 20, borderWidth: 1, borderColor: colors.primary }
          },
          {
            icon: 'calendar',
            label: 'Appointment',
            color: colors.primary,
            labelTextColor: colors.primary,
            onPress: () => { dispatch(changeBarColor({ barColor: 'white', barContent: 'dark-content' })); navigation.navigate('ScheduleVisitScreen') },
            style: { borderWidth: 1, borderColor: colors.primary },
            labelStyle: { borderRadius: 20, borderWidth: 1, borderColor: colors.primary }
          },
          {
            icon: () => <Feather name="edit" size={width > 767 ? width * 0.03 : width * 0.06} color={colors.primary} />,
            label: 'Quote',
            color: colors.primary,
            labelTextColor: colors.primary,
            onPress: () => { dispatch(changeBarColor({ barColor: 'white', barContent: 'dark-content' })); navigation.navigate('CheckoutScreen') },
            style: { borderWidth: 1, borderColor: colors.primary, },
            labelStyle: { borderRadius: 20, borderWidth: 1, borderColor: colors.primary }
          },

        ]}
        onStateChange={() => setShow(!show)}
        onPress={() => {
          setShow(!show)
        }}
      />
    </>
  );
}

export default BottomTabs;

const elevationShadowStyle = (elevation) => {
  return {
    elevation,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 * elevation },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
};

const styles = StyleSheet.create({
  maincontainer: {
    width: '100%',
    justifyContent: 'flex-end',
    position: 'relative',
    backgroundColor: '#000'
  },
  container: {
    height: '100%',
    width: '100%',
    paddingVertical: 5,
    position: 'relative',
    backgroundColor: 'white'
  },
  row: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
  },
  col: {
    width: '20%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
    position: 'relative',
  },
})