import React, { useState } from 'react'
import { View, StyleSheet, Text, ScrollView, Dimensions, Image, StatusBar, Pressable } from 'react-native'
import { useTheme, TouchableRipple } from 'react-native-paper'
import Header from '../Components/Header'
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux'
import { UserLogout } from '../Actions/AuthActions'
import CustomSwitch from '../Components/CustomSwitch'
import LocalStorage from '../Utils/LocalStorage'
import UserService from '../Services/UserService'
import { changeBarColor, handleActive, userData } from '../Actions/UserActions'
import BoxCards from '../Components/BoxCards'
import UserCards from '../Components/UserCards'
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useCallback } from 'react';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const SettingsScreen = ({ navigation }) => {

    const { colors } = useTheme();
    const dispatch = useDispatch();
    const user = useSelector(state => state.UserReducer.user);
    const [allowMessage, setAllowMessage] = useState(user?.msgstatus);
    const [allowPhoneCall, setAllowPhoneCall] = useState('');
    const [budget, setBudget] = useState(0);
    const IsFocused = useIsFocused();

    const wrap = (word, n) => {
        return (word?.length > n) ? word.substr(0, n - 1) + '...' : word;
    }
    const logOut = () => {
        dispatch(changeBarColor({ barColor: 'black', barContent: 'light-content' }));
        LocalStorage.RemoveData('Login');
        LocalStorage.RemoveData('Company');
        dispatch(UserLogout());
    }
    const updateTextMsgStatus = (e) => {
        let status = e ? 1 : 0;
        setAllowMessage(status)
        UserService.updateSettings(user?.id, status)
            .then(res => {
                if (res.success) {
                    const newUser = user;
                    newUser.msgstatus = status;
                    dispatch(userData({
                        user: newUser,
                        company: null
                    }));
                    LocalStorage.SetData("User", JSON.stringify(newUser));
                }
            })
            .catch(err => console.log(err))
    }
    const getBudget = () => {
        UserService.getUserBudget(user.id).then(res => {
            if (res.success) {
                setBudget(res.budget);
            }
        }).catch(err => console.log(err))
    }
    useFocusEffect(
        useCallback(() => {
            getBudget();
        }, [IsFocused])

    )
    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#F9F9FF' }}>
                <ScrollView>
                    <View style={styles.parent1}>
                        <Header blackHead={false} showBell={false} headerStyle={{ backgroundColor: colors.secondary }} showHeading={true} navigation={navigation} onPress={() => { dispatch(changeBarColor({ barColor: 'black', barContent: 'light-content' })); navigation.goBack(); }} title={'Settings'} />
                    </View>
                    <View style={styles.parent2}>
                        <View style={styles.container}>
                            <BoxCards
                                onPress={() => navigation.navigate('UserProfileScreen')}
                                elevationShadowStyle={elevationShadowStyle(5)}
                            >
                                <UserCards item={user} />
                            </BoxCards>
                            <View style={[{ backgroundColor: colors.secondary, borderRadius: 10, margin: 20, overflow: 'hidden' }, elevationShadowStyle(5)]}>
                                <View style={{ backgroundColor: colors.primary, borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 10, paddingLeft: 20, marginBottom: 10 }}>
                                    <Text style={{ fontWeight: '700', fontSize: width * 0.05, color: colors.secondary }}>Account</Text>
                                </View>
                                <TouchableRipple rippleColor={colors.rippleColor} onPress={() => { dispatch(changeBarColor({ barColor: 'white', barContent: 'light-content' })); navigation.navigate('ChangePassScreen'); }} style={{ padding: 10, }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <MaterialCommunityIcons name="lock-outline" size={width * 0.066} color={`${colors.tertiary}`} />
                                            <Text style={{ marginLeft: 10, fontWeight: '500', fontSize: width * 0.044, color: colors.tertiary }}>Settings</Text>
                                        </View>
                                        <AntDesign name="right" size={width * 0.045} color={`${colors.tertiary}`} />
                                    </View>
                                </TouchableRipple>
                                <TouchableRipple rippleColor={colors.rippleColor} onPress={() => navigation.navigate('SalesLeaderBoardScreen')} style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <MaterialCommunityIcons name="layers-outline" size={width * 0.066} color={`${colors.tertiary}`} />
                                            <Text style={{ marginLeft: 10, fontWeight: '500', fontSize: width * 0.044, color: colors.tertiary }}>Leaderboard</Text>
                                        </View>
                                        <AntDesign name="right" size={width * 0.045} color={`${colors.tertiary}`} />
                                    </View>
                                </TouchableRipple>
                                <TouchableRipple rippleColor={colors.rippleColor} onPress={() => { dispatch(changeBarColor({ barColor: 'black', barContent: 'light-content' })); navigation.navigate('CustomWebView') }} style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <Ionicons name="document-text-outline" size={width * 0.066} color={`${colors.tertiary}`} />
                                            <Text style={{ marginLeft: 10, fontWeight: '500', fontSize: width * 0.044, color: colors.tertiary }}>Document Management</Text>
                                        </View>
                                        <AntDesign name="right" size={width * 0.045} color={`${colors.tertiary}`} />
                                    </View>
                                </TouchableRipple>
                                <TouchableRipple onPress={() => { dispatch(changeBarColor({ barColor: 'black', barContent: 'light-content' })); navigation.navigate('DirectLeadsScreen') }} style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <MaterialIcons name="payment" size={width * 0.066} color={`${colors.tertiary}`} />
                                            <Text style={{ marginLeft: 10, fontWeight: '500', fontSize: width * 0.044, color: colors.tertiary }}>Direct Leads</Text>
                                        </View>
                                        <AntDesign name="right" size={width * 0.045} color={`${colors.tertiary}`} />
                                    </View>
                                </TouchableRipple>
                                <TouchableRipple rippleColor={colors.rippleColor} onPress={() => { }} style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <Entypo name="link" size={width * 0.066} color={`${colors.tertiary}`} />
                                            <Text style={{ marginLeft: 10, fontWeight: '500', fontSize: width * 0.044, color: colors.tertiary }}>Linked Accounts</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ color: '#B4C2CD', fontSize: width * 0.038, fontWeight: '500', }}>{wrap('Facebook, google', width * 0.038)}</Text>
                                            <AntDesign name="right" size={width * 0.045} color={`${colors.tertiary}`} />
                                        </View>
                                    </View>
                                </TouchableRipple>
                                <TouchableRipple onPress={() => navigation.navigate('PlanDetailsScreen')} style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <Image resizeMode='stretch' style={{ width: width * 0.066, height: width * 0.066 }} source={require('../../assets/images/budget.png')} />
                                            <Text style={{ marginLeft: 10, fontWeight: '500', fontSize: width * 0.044, color: colors.tertiary }}>Manage Lead Budget</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ color: '#B4C2CD', fontSize: width * 0.035, fontWeight: '500', }}>${budget} USD</Text>
                                            <AntDesign name="right" size={width * 0.045} color={`${colors.tertiary}`} />
                                        </View>
                                    </View>
                                </TouchableRipple>
                                <View style={{ backgroundColor: '#F9F9FF', marginTop: 10 }}>
                                    <Text style={{ fontWeight: '700', fontSize: width * 0.05, color: colors.primary, paddingVertical: 10, paddingLeft: 10 }}>More Options</Text>
                                </View>

                                <Pressable onPress={() => { }} style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <Image resizeMode='stretch' style={{ width: width * 0.066, height: width * 0.066 }} source={require('../../assets/images/number2.jpg')} />
                                            <Text style={{ marginLeft: 10, fontWeight: '500', fontSize: width * 0.044, color: colors.tertiary }}>Text Message</Text>
                                        </View>
                                        <CustomSwitch onPress={(e) => updateTextMsgStatus(e)} on={allowMessage == '1' ? true : false} />
                                    </View>
                                </Pressable>
                                <Pressable onPress={() => { }} style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <MaterialIcons name="phone-in-talk" size={width * 0.066} color={`${colors.tertiary}`} />
                                            <Text style={{ marginLeft: 10, fontWeight: '500', fontSize: width * 0.044, color: colors.tertiary }}>Phone Call</Text>
                                        </View>
                                        <CustomSwitch onPress={() => setAllowPhoneCall(!allowPhoneCall)} on={allowPhoneCall} />
                                    </View>
                                </Pressable>
                                <TouchableRipple onPress={logOut} style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <SimpleLineIcons name="logout" size={width * 0.066} color={`${colors.tertiary}`} />
                                            <Text style={{ marginLeft: 10, fontWeight: '500', fontSize: width * 0.044, color: colors.tertiary }}>Sign Out</Text>
                                        </View>
                                    </View>
                                </TouchableRipple>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </View>
        </>
    )
}
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
    parent1: {
        flex: 2,
        height: '100%',
        width: '100%'
    },
    parent2: {
        flex: 10,

    },
    container: {
        flex: 10,
        paddingTop: 20,
        paddingBottom: height * 0.04
    },
});
export default SettingsScreen