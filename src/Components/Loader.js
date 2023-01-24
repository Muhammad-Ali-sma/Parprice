import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import LocalStorage from '../Utils/LocalStorage';

const Loader = () => {
    const { colors } = useTheme();
    const [primaryColor, setPrimaryColor] = useState('');

    useEffect(() => {
        (() => {
            LocalStorage.GetData("Company")
                .then(res => setPrimaryColor(JSON.parse(res)?.colorScheme))
                .catch(err => console.log(err))
        })();
    }, [])


    return (
        <View style={styles.view}>
            <View style={[styles.circleloader, { backgroundColor: primaryColor ? primaryColor : colors.primary }]}>
                <ActivityIndicator size={40} color='#ffffff' />
            </View>
        </View>
    );
};

export default Loader;

const styles = StyleSheet.create({
    view: {
        flex: 0,
        zIndex: 9,
        width: '100%',
        position: 'absolute',
        height: '100%',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleloader: {
        height: 45,
        width: 45,
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 45 / 2,
        shadowColor: "green",
        shadowOffset: {
            width: 0,
            height: 3,
        },
    }
});