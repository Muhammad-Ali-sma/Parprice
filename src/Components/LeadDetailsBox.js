import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import { useTheme } from 'react-native-paper';

const LeadDetailsBox = ({ item }) => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const { colors } = useTheme();
    return (
        <View style={{ flexDirection: "row", alignItems: 'center', width: '50%', marginBottom: height * 0.02 }}>
            <View style={[{ backgroundColor: '#fae6e5', borderRadius: 10, padding: 10 },elevationShadowStyle(5)]}>
                {item?.icon}
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'center',width:'60%', marginLeft: width * 0.025 }}>
                <Text style={{ fontSize: width * 0.035, fontWeight: '600', color: colors.tertiary, textTransform: 'capitalize' }}>{item?.value}</Text>
                <Text style={{ fontSize: width * 0.025, color: colors.tertiary, textTransform: 'capitalize' }}>{item?.key}</Text>
            </View>
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
export default LeadDetailsBox