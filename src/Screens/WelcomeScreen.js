import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions,StatusBar } from "react-native";
import Button from "../Components/Button";
import ShadeLines from "../Components/ShadeLines";
import { useTheme } from 'react-native-paper';
const headerImage = require('../../assets/images/Rectangle_5383.png');
const Logo = require('../../assets/logo.png');
import Popup from "../Components/Popup";
import * as Update from 'expo-updates';
import { useDispatch, useSelector } from "react-redux";
import { changeBarColor } from "../Actions/UserActions";
const WelcomeScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [updatevisible, setUpdateVisible] = useState(false);
    const barColor = useSelector(state => state.UserReducer.statusbarColor);
    const barContent = useSelector(state => state.UserReducer.barContent);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(changeBarColor({ barColor: 'black', barContent: 'light-content' }));
        const checkupdate = async () => {
            if (__DEV__) return;
            const updateCheck = await Update.checkForUpdateAsync();
            if (updateCheck.isAvailable) {
                await Update.fetchUpdateAsync();
                setUpdateVisible(true);

            }
        }

        checkupdate();
    }, [])

    return (
        <>
              <StatusBar barStyle={Platform.OS === 'ios' ?barContent : 'light-content'} backgroundColor={barColor} />

            <Popup
                show={updatevisible}
                description={'New Updates Are Available'}
                updateBtn={true}
            />
            <View style={styles.mainContainer}>

                <View style={styles.container1}>
                    <View style={styles.welcome}>
                        <Image
                            resizeMode="cover"
                            style={styles.headerImage}
                            source={headerImage}
                        />
                    </View>
                </View>
                <View style={styles.container2}>
                    <View style={styles.box}>
                        <View style={styles.heading}>
                            <Text style={[styles.text1, { color: colors.secondary }]}>Welcome to </Text>
                            <View style={{ width: '100%', alignItems: 'center', marginTop: 5 }}>
                                <Image resizeMode="cover"
                                    source={Logo}
                                    style={{ marginLeft: Dimensions.get('window').width * 0.08, width: Dimensions.get('window').width * 0.45, alignItems: 'center', height: Dimensions.get('window').width * 0.1 }}
                                />
                            </View>
                        </View>
                        <View style={styles.button}>
                            <Button
                                title={'Continue with Email'}
                                onPress={() => { dispatch(changeBarColor({ barColor: 'white', barContent: 'dark-content' })); navigation.navigate('SignInScreen') }}
                            />
                            <View style={{ marginTop: 15 }}>
                                <Button
                                    title={'Continue with Phone'}
                                    btnstyle={[styles.btnstyle, { backgroundColor: colors.primary }]}
                                    btntextstyle={{ color: colors.secondary }}
                                    onPress={() => { dispatch(changeBarColor({ barColor: 'white', barContent: 'dark-content' })); navigation.navigate('SignInScreen') }}
                                />
                            </View>
                        </View>
                        <ShadeLines />
                    </View>
                </View>
            </View>
        </>

    );
}

export default WelcomeScreen

const styles = StyleSheet.create({

    mainContainer: {
        width: '100%',
        flex: 1,
    },
    container1: {
        width: '100%',
        flex: 3,
        marginBottom: -30
    },
    welcome: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerImage: {
        width: '100%',
        height: '100%',

    },
    text: {
        width: '100%',
        textAlign: 'center',
        fontSize: 50,
        color: '#fff',
        fontFamily: 'OpenSans_700Bold'
    },
    container2: {
        width: '100%',
        flex: 2,
        flexBasis: '3%',
    },
    box: {
        width: '100%',
        padding: 25,
        position: "relative",
        height: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: 'black',
    },
    heading: {
        justifyContent: 'center',
        width: '100%',
        marginVertical: 5,
        marginTop: Dimensions.get('window').height * 0.03
    },
    para: {
        justifyContent: 'center',
        width: '100%',
        marginVertical: 10
    },
    text1: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '500',
        lineHeight: 28.13
    },
    button: {
        width: '100%',
        marginTop: 15
    },
    btnstyle: {

        zIndex: 1
    },
})