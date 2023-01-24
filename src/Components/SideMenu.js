import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Drawer } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { handleActive } from "../Actions/UserActions";
import { useDispatch, useSelector } from "react-redux";
const SideMenu = ({ navigation }) => {

    const dispatch = useDispatch();
    const active = useSelector(state => state.UserReducer.active);
    const handleOnMenuBtnClick = (type) => {
        if (type == 'home') {
            dispatch(handleActive('Home'));
            navigation.navigate('Home')
        } else if (type == 'Profile') {
            navigation.navigate('UserProfileScreen')
        } else if (type == 'Settings') {
            navigation.navigate('SettingsScreen')
        }
    }
    return (
        <Drawer.Section>
            <View style={styles.closed}>
                <TouchableOpacity style={{ width: 100, alignItems: 'flex-end', marginHorizontal: 5 }} onPress={() => navigation.closeDrawer()}>
                    <Entypo name="cross" size={30} color="black" />
                </TouchableOpacity>
            </View>
            <Drawer.Item
                label="Home"
                active={active === 'Home'}
                onPress={() => handleOnMenuBtnClick('home')}
            />
            <Drawer.Item
                label="User Profile"
                onPress={() => handleOnMenuBtnClick('Profile')}
            />
            <Drawer.Item
                label="Settings"
                onPress={() => handleOnMenuBtnClick('Settings')}
            />
        </Drawer.Section>
    );
}

export default SideMenu

const styles = StyleSheet.create({

    conatiner: {

    },
    closed: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
});

