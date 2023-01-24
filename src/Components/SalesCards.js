import { View, Text, Dimensions, ImageBackground, Platform } from 'react-native'
import React from 'react'
import { Avatar, TouchableRipple, useTheme } from 'react-native-paper'
import { imgUrl } from '../Utils/Host';

const SalesCards = ({ item, elevationShadowStyle, index, onPress }) => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const { colors } = useTheme();
    return (
        <>
            <View style={[{ marginHorizontal: 20, }]}>
                <View style={[{ overflow: "hidden", borderRadius: 10, borderTopLeftRadius: Platform.OS === 'android' ? width > 767 ?  width * 0.1  : width * 0.8 : 0, borderBottomLeftRadius: Platform.OS === 'android' ? width > 767 ? width * 0.1 : width * 0.8 : 0, borderColor: "#CCC", marginVertical: 5, padding: Platform.OS === 'ios' ? 5 : 0 }, elevationShadowStyle]}>
                    <TouchableRipple rippleColor={colors.rippleColor} onPress={onPress} style={[{ backgroundColor: colors.secondary, flexDirection: 'row', position: 'relative', alignItems: 'center', padding: width * 0.057, borderRadius: 10, borderTopLeftRadius: width > 767 ?  width * 0.1  : width * 0.8, borderBottomLeftRadius: width > 767 ? width * 0.1 : width * 0.8, }]}>
                        <>
                            {(item?.avatar != null && item?.avatar != "") ?
                                <Avatar.Image size={width > 767 ? width * 0.17 : width * 0.2} style={{ position: 'absolute', backgroundColor: colors.secondary, zIndex: 1 }} source={{ uri: imgUrl + item?.avatar }} />
                                :
                                <Avatar.Text size={width > 767 ? width * 0.17 : width * 0.2} style={{ position: 'absolute', backgroundColor: colors.primary, zIndex: 1, }} label={`${item?.firstname ? Array.from(item?.firstname)[0].toUpperCase() : item?.lastname && Array.from(item?.lastname)[0].toUpperCase()}`} />
                            }
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ width: '70%', paddingLeft: width > 767 ? width * 0.13 : width * 0.18 }}>
                                    <Text style={{ fontSize: height * 0.020, fontWeight: '700', textTransform: 'capitalize' }}>{item?.firstname} {item?.lastname} </Text>
                                    <Text style={{ fontSize: height * 0.015, fontWeight: '600', color: colors.tertiary }}>{item?.totalJob} Sold Projects</Text>
                                </View>
                                <View style={{ width: '30%' }}>
                                    <ImageBackground style={{ width: width > 767 ? width * 0.06 : width * 0.08, height: width > 767 ? width * 0.06 : width * 0.08, alignItems: 'center', position: 'absolute', top: -height * 0.03, right: 0, padding: 3 }} source={require('../../assets/images/triangle.png')}>
                                        <Text style={{ fontWeight: '700', fontSize: height * 0.015, color: colors.secondary }}>#{index + 1}</Text>
                                    </ImageBackground>
                                    <Text style={{ fontSize: height * 0.020, textAlign: 'center', fontWeight: '900', color: colors.tertiary, }}>${item?.sales?.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                </View>
                            </View>
                        </>
                    </TouchableRipple>
                </View>
            </View>
        </>
    )
}

export default SalesCards