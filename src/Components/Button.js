import { Entypo } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { ActivityIndicator, TouchableRipple, useTheme } from 'react-native-paper';

const height = Dimensions.get('window').height;

const Button = ({ navigation, ...props }) => {

    const { btnstyle, btntextstyle, onPress, title, isLoading, icon = false } = props
    const { colors } = useTheme();
    return (
        <>
            {!isLoading ?
                <View style={[styles.button, { alignItems: icon ? 'flex-end' : 'center', }]}>
                    <TouchableRipple rippleColor={colors.rippleColor} disabled={props.disabled} activeOpacity={0.5} style={[styles.button2, { backgroundColor: colors.secondary }, btnstyle]} onPress={onPress}>
                        {icon ? <Entypo name="upload" size={height * 0.04} color={colors.primary} /> :
                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.text, { color: colors.tertiary }, btntextstyle]}> {title}</Text>
                            </View>}
                    </TouchableRipple>
                </View>
                :
                <View style={[styles.circleloader, { backgroundColor: colors.primary }]}>
                    <ActivityIndicator size={30} color="#fff" />
                </View>
            }
        </>
    );
}

export default Button


const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: height * 0.06,
        borderRadius: height * 0.06,
        justifyContent: 'center',
        overflow: "hidden"
    },
    button2: {
        width: '100%',
        height: height * 0.06,
        borderRadius: height * 0.06,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: "hidden"
    },
    text: {
        fontSize: height * 0.02,
        textAlign: 'center',
        fontWeight: '700',
    },
    circleloader: {
        height: 45,
        width: 45,
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 45 / 2,
        shadowColor: "#233e86",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
})