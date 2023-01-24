import { View, Platform } from 'react-native'
import React from 'react'
import { TouchableRipple, useTheme } from 'react-native-paper'

const BoxCards = ({ onPress, elevationShadowStyle, containerStyle, children, activescreen }) => {
    const { colors } = useTheme();

    return (
        <View style={[{ paddingTop: activescreen == "NewQuotes" ? 5 : 0, marginHorizontal: 20 }, containerStyle]}>
            <View style={[{ overflow: "hidden", borderRadius: 10, borderColor: "#CCC", marginVertical: 5, padding: Platform.OS === 'ios' ? 3 : 0 }, elevationShadowStyle]}>
                <TouchableRipple rippleColor={colors.rippleColor} underlayColor={'#f7f7f7'} onPress={onPress} style={[{ backgroundColor: colors.secondary, flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 10 }]}>
                    {children}
                </TouchableRipple>
            </View>
        </View>
    )
}

export default BoxCards