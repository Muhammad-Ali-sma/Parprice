import { View, Text, ImageBackground, Dimensions, StyleSheet, Image, ScrollView, ActivityIndicator, FlatList, RefreshControl, Platform } from 'react-native'
import React from 'react'
import Header from '../Components/Header'
import { TouchableRipple, useTheme } from 'react-native-paper'
import { useSelector } from 'react-redux';
import { imgUrl } from '../Utils/Host';
import { useState } from 'react';
import SalesCards from '../Components/SalesCards';
import moment from 'moment';
import JobService from '../Services/JobService';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useCallback } from 'react';
import Loader from '../Components/Loader';


const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const SalesLeaderBoardScreen = ({ navigation }) => {

    const { colors } = useTheme();
    const user = useSelector(state => state.UserReducer.user);
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [active, setActive] = useState('2');
    const date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear();
    const IsFocused = useIsFocused();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const getLeaderData = () => {
        setRefreshing(false);
        JobService.GetLeaderBoards(month, year)
            .then(res => { setData(res); setRefreshing(true) })
            .catch(err => { console.log(err); setRefreshing(true) })
    }
    useFocusEffect(
        useCallback(
            () => {
                getLeaderData();
            },
            []
        )

    )

    return (
        <>
            <Header navigation={navigation} onPress={() => navigation.goBack()} title={'Sales Leaderboard'} />
            <View style={{ backgroundColor: colors.secondary, flex: 1 }}>
                <ImageBackground style={{ width: '100%', height: width > 767 ? height * 0.4 : width * 0.63, position: 'relative', alignItems: 'center', justifyContent: 'center' }} source={require('../../assets/images/Rectangle1.png')}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        {data[0]?.avatar ? <Image resizeMode='cover' source={{ uri: imgUrl + data[0]?.avatar }} style={[styles.image]} /> :
                            <Image resizeMode='cover' source={require('../../assets/images/user.png')} style={[styles.image]} />}

                        <ImageBackground style={{ width: width > 767 ? width * 0.11 : width * 0.19, height: width > 767 ? width * 0.11 : width * 0.15, marginTop: width > 767 ? -height * 0.02 : -height * 0.02, alignItems: 'center', justifyContent: 'center' }} source={require('../../assets/images/triangle.png')}>
                            <Text style={{ fontWeight: '700', fontSize: height * 0.035, color: colors.secondary, paddingTop: width > 767 ? 0 : height * 0.015 }}>1</Text>
                        </ImageBackground>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute' }}>
                        <View style={{ alignItems: 'center', width: '50%' }}>
                            {data[1]?.avatar ? <Image resizeMode='cover' source={{ uri: imgUrl + data[1]?.avatar }} style={[styles.image]} /> :
                                <Image resizeMode='cover' source={require('../../assets/images/user.png')} style={[styles.image]} />}
                            <ImageBackground style={{ width: width > 767 ? width * 0.1 : width * 0.17, height: width > 767 ? width * 0.1 : width * 0.13, marginTop: -height * 0.02, alignItems: 'center', justifyContent: 'space-around' }} source={require('../../assets/images/triangle.png')}>
                                <Text style={{ fontWeight: '700', fontSize: height * 0.025, color: colors.secondary, paddingTop: width > 767 ? 0 : height * 0.015 }}>2</Text>
                            </ImageBackground>
                        </View>
                        <View style={{ alignItems: 'center', width: '50%' }}>
                            {data[2]?.avatar ? <Image resizeMode='cover' source={{ uri: imgUrl + data[2]?.avatar }} style={[styles.image]} /> :
                                <Image resizeMode='cover' source={require('../../assets/images/user.png')} style={[styles.image]} />}
                            <ImageBackground style={{ width: width > 767 ? width * 0.1 : width * 0.17, height: width > 767 ? width * 0.1 : width * 0.13, marginTop: -height * 0.02, alignItems: 'center', justifyContent: 'space-around' }} source={require('../../assets/images/triangle.png')}>
                                <Text style={{ fontWeight: '700', fontSize: height * 0.025, color: colors.secondary, paddingTop: width > 767 ? 0 : height * 0.015 }}>3</Text>
                            </ImageBackground>
                        </View>
                    </View>
                    {data.length > 0 &&
                        <View style={{ flexDirection: 'row', alignItems: 'center', top: '5%', width: '100%' }}>
                            <View style={{ alignItems: 'center', width: '25%', justifyContent: 'center', right: Platform.OS === 'ios' ? '-75%' : width > 767 ? '-100%' : -width * 0.09 }}>
                                <View style={[styles.triangle]} />
                                <Text numberOfLines={1} style={{ fontWeight: '700', fontSize: width > 767 ? height * 0.025 : height * 0.02, color: colors.secondary }}>{data[1] && data[1]?.firstname} {data[1] && data[1]?.lastname}</Text>
                            </View>
                            <View style={{ zIndex: 1, width: '50%', alignItems: 'center', justifyContent: 'center', }}>
                                <View style={styles.trapezoid} />
                                <Text numberOfLines={1} style={{ fontWeight: '700', fontSize: width > 767 ? height * 0.025 : 16, color: colors.secondary }}>{data[0] && data[0]?.firstname} {data[0] && data[0]?.lastname}</Text>
                                <Text numberOfLines={1} style={{ fontWeight: '700', fontSize: width > 767 ? height * 0.03 : 18, color: '#FFBC00' }}>${data[0]?.sales?.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                            </View>
                            <View style={{ alignItems: 'center', width: '25%', justifyContent: 'center', left: Platform.OS === 'ios' ? '-75%' : width > 767 ? '-100%' : -width * 0.09 }}>
                                <View style={[styles.triangle, { borderBottomColor: '#Fc9f5a' }]} />
                                <Text numberOfLines={1} style={{ fontWeight: '700', fontSize: width > 767 ? height * 0.025 : height * 0.02, color: colors.secondary }}>{data[2] && data[2]?.firstname} {data[2] && data[2]?.lastname}</Text>
                            </View>
                        </View>
                    }
                </ImageBackground>
                <View style={{ backgroundColor: '#e4dfe5', flexDirection: 'row', marginTop: height * 0.04, overflow: 'hidden', alignItems: 'center', justifyContent: 'space-evenly', marginHorizontal: 20, borderRadius: 20 }}>
                    <TouchableRipple rippleColor={colors.rippleColor} onPress={() => { setActive(1); month = date.getMonth() - 1; year = date.getFullYear(); getLeaderData(); }} style={{ backgroundColor: active == 1 ? colors.primary : '#e4dfe5', zIndex: active == 1 ? 1 : 0, width: width / 3, paddingVertical: width * 0.02, borderRadius: 20 }}>
                        <Text style={{ fontWeight: '700', textAlign: 'center', color: active == 1 ? colors.secondary : 'black' }}>{months[date.getMonth() - 1]} {moment(date).format('YYYY')}</Text>
                    </TouchableRipple>
                    <TouchableRipple rippleColor={colors.rippleColor} onPress={() => { setActive(2); month = date.getMonth(); year = date.getFullYear(); getLeaderData(); }} style={{ backgroundColor: active == 2 ? colors.primary : '#e4dfe5', zIndex: active == 2 ? 1 : 0, paddingVertical: width * 0.02, width: width / 3, overflow: 'hidden', borderRadius: 20 }}>
                        <Text style={{ fontWeight: '700', textAlign: 'center', color: active == 2 ? colors.secondary : 'black' }}>{moment(date).format('MMM YYYY')}</Text>
                    </TouchableRipple>
                    <TouchableRipple rippleColor={colors.rippleColor} onPress={() => { setActive(3); month = ''; year = date.getFullYear(); getLeaderData(); }} style={{ backgroundColor: active == 3 ? colors.primary : '#e4dfe5', zIndex: active == 3 ? 1 : 0, width: width / 3, paddingVertical: width * 0.02, borderRadius: 20 }}>
                        <Text style={{ fontWeight: '700', textAlign: 'center', color: active == 3 ? colors.secondary : 'black' }}>{moment(date).format('YYYY')}</Text>
                    </TouchableRipple>
                </View>
                {refreshing ?
                    <View style={{ marginTop: height * 0.03 }}>
                        <FlatList
                            data={[...data].splice(2, data.length)}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: height * 0.2 }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={!refreshing}
                                    onRefresh={() => getLeaderData()}
                                />
                            }
                            renderItem={({ item, index }) => (
                                <SalesCards index={index} onPress={() => { }} item={item} elevationShadowStyle={elevationShadowStyle(5)} />
                            )}
                            keyExtractor={item => item.id}
                        />
                    </View> :
                    <Loader />
                }
            </View>
        </>
    )
}
const elevationShadowStyle = (elevation) => {
    return {
        elevation,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0.5 * elevation },
        shadowOpacity: 0.3,
        shadowBottomRadius: 0.8 * elevation,
    };
};
const styles = StyleSheet.create({
    image: {
        width: (width > 767 ? width * 0.15 : width * 0.22),
        height: (width > 767 ? width * 0.15 : width * 0.22),
        borderRadius: 100,
        zIndex: 1,
    },
    trapezoid: {
        borderTopWidth: width > 767 ? width * 0.12 : width * 0.15,
        borderTopColor: '#fc2300',
        borderLeftWidth: width * 0.06,
        borderLeftColor: 'transparent',
        borderRightWidth: width * 0.06,
        borderRightColor: 'transparent',
        width: width * 0.4,
        position: 'absolute',
    },
    triangle: {
        borderBottomWidth: width > 767 ? width * 0.055 : width * 0.07,
        borderBottomColor: '#FFce4b',
        borderLeftWidth: width * 0.06,
        borderLeftColor: 'transparent',
        borderRightWidth: width * 0.06,
        borderRightColor: 'transparent',
        width: width > 767 ? width * 0.33 : width * 0.33,
        position: 'absolute',
    }
})
export default SalesLeaderBoardScreen