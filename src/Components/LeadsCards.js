import { View, Text, Image, Dimensions, Pressable } from 'react-native'
import React from 'react'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableRipple, useTheme } from 'react-native-paper';
import { imgUrl } from '../Utils/Host';

const LeadsCards = ({ item,onPress,containerStyle,elevationShadowStyle }) => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const { colors } = useTheme()
    return (
        <View style={[{overflow:'hidden',borderRadius: 10, width: '48%',marginBottom: 15,padding:2},containerStyle]}>
        <TouchableRipple rippleColor={colors.rippleColor} onPress={onPress} style={[{ backgroundColor: 'white', borderRadius: 10 },elevationShadowStyle]}>
            <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingHorizontal: 15 }}>
                <Text numberOfLines={1} style={{ fontSize: width * 0.035, fontWeight: '700', flex: 1, color: colors.tertiary, marginRight:10, maxWidth: '80%' }}>{item?.title}</Text>
                <Text style={{ color: colors.primary, fontSize: width * 0.035, fontWeight: '700' }}>${item?.cost}</Text>
            </View>
            <Image style={{ width: '100%', height: height * 0.15, marginBottom: 10 }} resizeMode='stretch' source={{ uri: imgUrl + item?.thumb }} />
            <View style={{ paddingHorizontal: 15 }}>
                <Text style={{ fontSize: width * 0.035, fontWeight: '700', color: colors.tertiary }}>Lead Details</Text>
            </View>
            <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="ios-location-outline" size={width * 0.035} color={colors.primary} />
                    <Text style={{ fontSize: width * 0.027, marginLeft: width * 0.03, color: colors.tertiary }}>{item?.locality} / {item?.arealvl} </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                    <MaterialCommunityIcons name="clipboard-outline" size={width * 0.035} color={colors.primary} />
                    <Text style={{ fontSize: width * 0.027, marginLeft: width * 0.03, color: colors.tertiary }}>{item?.servicename}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Ionicons name="timer-outline" size={width * 0.035} color={colors.primary} />
                    <Text style={{ fontSize: width * 0.027, marginLeft: width * 0.03, color: colors.tertiary }}>{item?.status === 1 && 'Verified' || item?.status === 2 && 'Confirmed' || item?.status === 3 && 'Scheduled'}</Text>
                </View>
            </View>
            <View style={{ backgroundColor: '#ccc', height: 2, marginHorizontal: 15 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15 }}>
                <Ionicons name="eye-outline" size={width * 0.035} color={colors.primary} />
                <Text style={{ fontSize: width * 0.027, marginLeft: width * 0.03, color: colors.tertiary }}>View Lead</Text>
            </View>
            </>
        </TouchableRipple>
        </View>
    )
}

export default LeadsCards