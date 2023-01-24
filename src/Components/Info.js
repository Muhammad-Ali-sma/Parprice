import React from 'react'
import { TouchableRipple, useTheme } from 'react-native-paper';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, Pressable, Linking, Dimensions } from 'react-native'

const Info = ({ client }) => {
    const { colors } = useTheme();
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    return (
        <>
            <Text style={{ color: colors.tertiary, fontSize: 16, fontWeight: '700' }}>Contact Information</Text>
            <TouchableRipple rippleColor={colors.rippleColor} style={{ padding: 5 }} onPress={() => Linking.openURL(`tel:${client?.phonenumber}`)}>
                <>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#6C6B6B', fontSize: 12, flex: 1, fontWeight: '600' }}>Phone</Text>
                        <Feather name="phone-call" size={height * 0.035} color={`${colors.primary}`} />
                    </View>
                    <Text style={{ color: '#6C6B6B', fontSize: 12 }}>{'(' + client?.phonenumber?.substring(0, 3) + ') ' + client?.phonenumber?.substring(3, 6) + "-" + client?.phonenumber?.substring(6, client?.phonenumber?.length)} <Text style={{ fontSize: width * 0.025 }}> {client?.extension !== '' && '(' + client?.extension + ')'}</Text></Text>
                </>
            </TouchableRipple>
            <TouchableRipple rippleColor={colors.rippleColor} onPress={() => Linking.openURL(`mailto:${client?.email}`)} style={{ marginTop: 10, padding: 5 }}>
                <>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#6C6B6B', fontSize: 12, flex: 1, fontWeight: '600' }}>Email</Text>
                        <MaterialCommunityIcons name="email-outline" size={height * 0.038} color={`${colors.primary}`} />
                    </View>
                    <Text style={{ color: '#6C6B6B', fontSize: 12 }}>{client?.email}</Text>
                </>
            </TouchableRipple>
            {client?.notes ? <TouchableRipple rippleColor={colors.rippleColor} style={{ marginTop: 10, padding: 5 }}>
                <>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#6C6B6B', fontSize: 12, flex: 1, fontWeight: '600' }}>Notes</Text>
                    </View>
                    <Text style={{ color: '#6C6B6B', fontSize: 12 }}>{client?.notes}</Text>
                </>
            </TouchableRipple> : <View></View>

            }
        </>
    )
}

export default Info