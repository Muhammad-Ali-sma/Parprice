import { View, Text, StyleSheet, Dimensions, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ShadeLines from '../Components/ShadeLines';
import Header from '../Components/Header';
import { Ionicons } from '@expo/vector-icons';
import BoxCards from '../Components/BoxCards';
import { useTheme } from 'react-native-paper';
import EmptyScreen from '../Components/EmptyScreen';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../Components/Loader';
import { AddNotification, removeNotification } from '../Actions/UserActions';
import CommonServices from '../Services/CommonServices';
import NotificationBox from '../Components/NotificationBox';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const NotificationsScreen = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);
    const user = useSelector(state => state.UserReducer.user)
    const { colors } = useTheme();
    const [notifications, setNotifications] = useState([]);
    const dispatch = useDispatch();

    const getNotifications = () => {
        setRefreshing(true);
        dispatch(removeNotification())
        CommonServices.UserNotifications(user?.id)
            .then(res => {
                if (res != null) {
                    setNotifications(res);
                }
                setRefreshing(false);
            }).catch(err => { console.log(err); setRefreshing(false); })
    }
    useFocusEffect(
        useCallback(
            () => {
                getNotifications();
            },
            []
        )
    )

    return (
        <>
            <View style={{ flex: 1 }}>
                <View style={styles.parent1}>
                    <Header showHeading={true} showBackIcon={true} onPress={() => navigation.goBack()} navigation={navigation} title={'Notifications'} blackHead={true} />
                    <ShadeLines container2={{ left: '82%', bottom: '40%' }} container={{ left: '65%', bottom: '40%' }} />
                </View>
                <View style={styles.parent2}>
                    <View style={styles.container}>
                        {!refreshing ?
                            <View style={{ marginTop: height * 0.025 }}>
                                <FlatList
                                    data={notifications}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={() => getNotifications()}
                                        />
                                    }
                                    ListEmptyComponent={() => <EmptyScreen
                                        icon={<Ionicons name='md-notifications-off-sharp' size={width * 0.2} color={`${colors.primary}`} />}
                                        title={"Notifications Empty"}
                                        bodyStyle={{ paddingTop: height * 0.15 }}
                                    />}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: height * 0.2 }}
                                    renderItem={({ item }) => {
                                        if (item?.notification.includes('appointment is created')) {
                                            console.log('ITEM', item)
                                        }
                                        return (
                                            <NotificationBox
                                                onPress={() => {
                                                    if (item?.data?.trim()) {
                                                        navigation.navigate(JSON.parse(item?.data)?.screen, JSON.parse(item?.data)?.screen == "ClientContactInfoScreen" ? { data: JSON.parse(item?.data) } : JSON.parse(item?.data)?.screen == "QuoteScreen" ? { id: JSON.parse(item?.data)?.id } : { id: JSON.parse(item?.data)?.sent_from })
                                                    }
                                                }}
                                                item={item}
                                            />
                                        )
                                    }}
                                    keyExtractor={item => item?.id}
                                />
                            </View>
                            :
                            <Loader />
                        }
                    </View>
                </View>
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
        shadowRadius: 0.8 * elevation,
    };
};
const styles = StyleSheet.create({
    parent1: {
        backgroundColor: 'black',
        flex: 1,
        paddingTop: 20,
        paddingBottom: 60,

        height: '100%',
        width: '100%'
    },
    parent2: {
        position: 'absolute',
        top: height * 0.175,
        width: '100%',
        height: '100%',
        flex: 11,
        marginTop: -25,
        backgroundColor: '#F9F9FF',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
    container: {
        flex: 11,
    },
})
export default NotificationsScreen