import React, { useState } from 'react'
import { Text, Dimensions, Pressable, View } from 'react-native'
import { TouchableRipple, useTheme } from 'react-native-paper'

const Pills = ({ title, onPress, pill, pillStyle, pillTextStyle }) => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const { colors } = useTheme();
    return (
        <View style={{ overflow: 'hidden', marginHorizontal: width / 100, marginBottom: 10, borderRadius: 18, padding: 2}}>
            <TouchableRipple rippleColor={colors.rippleColor} onPress={onPress} style={[{ backgroundColor: pill === title ? colors.primary : colors.secondary, paddingHorizontal: width / 20, paddingVertical: width / 50, borderRadius: 18, }, pillStyle, elevationShadowStyle(7)]}>
                <Text style={[{ color: pill === title ? colors.secondary : colors.tertiary, fontWeight: '700', fontSize: height * 0.02 }, pillTextStyle]}>{title}</Text>
            </TouchableRipple>
        </View>
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
export default Pills