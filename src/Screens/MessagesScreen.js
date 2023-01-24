import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, Dimensions, RefreshControl } from "react-native";
import { ActivityIndicator, Badge, useTheme } from 'react-native-paper';
import Header from "../Components/Header";
import ShadeLines from "../Components/ShadeLines";
import InputField from "../Components/InputField";
import { AntDesign, Feather } from '@expo/vector-icons';
import ClientService from '../Services/ClientService';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import UserService from '../Services/UserService';
import EmptyScreen from '../Components/EmptyScreen';
import ProfleImage from '../Components/ProfleImage';
import * as Notifications from 'expo-notifications';
import BoxCards from '../Components/BoxCards';
import MessageCards from '../Components/MessageCards';
import ChatService from '../Services/ChatService';
import { clearChats, removeSeenClientMsgCount, removeSeenUserMsgCount, setChatCount, setClientMsgCount, setUserLastMessage, setSeenClientMsgCount, setSeenUserMsgCount, setUserMsgCount, setClientLastMessage } from '../Actions/ChatActions';
import moment from 'moment';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const MessagesScreen = ({ navigation }) => {

    const seenClientMsgCount = useSelector(state => state.ChatReducer.seenClientMsgCount);
    const seenUserMsgCount = useSelector(state => state.ChatReducer.seenUserMsgCount);
    const lastUserMessage = useSelector(state => state.ChatReducer.lastUserMessage);
    const clientMsgCount = useSelector(state => state.ChatReducer.clientMsgCount);
    const userMsgCount = useSelector(state => state.ChatReducer.userMsgCount);
    const [notificationStatus, setNotificationStatus] = useState('');
    const [searchedClients, setSearchedClients] = useState([]);
    const user = useSelector(state => state.UserReducer.user);
    const chat = useSelector(state => state.ChatReducer.chat);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [title, setTitle] = useState('Empty Inbox');
    const [active, setActive] = useState('My Team');
    const [isLoaded, setIsLoaded] = useState(false);
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const { colors } = useTheme()
    let tempCount = 0;

    const filterClients = (txt) => {
        if (active === 'My Team') {
            if (txt != '') {
                const filterdClients = JSON.parse(JSON.stringify(users)).filter(item => item.firstname.toLowerCase().indexOf(txt.toLowerCase()) !== -1 || item.lastname.toLowerCase().indexOf(txt.toLowerCase()) !== -1)
                setSearchedUsers(filterdClients);
            } else {
                setSearchedUsers(users);
            }
        } else {
            if (txt != '') {
                const filterdClients = JSON.parse(JSON.stringify(clients)).filter(item => item.firstname.toLowerCase().indexOf(txt.toLowerCase()) !== -1 || item.lastname.toLowerCase().indexOf(txt.toLowerCase()) !== -1)
                setSearchedClients(filterdClients);
            } else {
                setSearchedClients(clients);
            }
        }
    }
    const getData = () => {
        setRefreshing(true);
        if (user?.type == 1) {
            UserService.GetUserByClientId(user?.uid).then(res => {
                let count = 0;
                let tempIds = [];
                res?.map(item => {
                    count += item.seenCount;
                    if (item.id != user.id) {
                        tempIds.push(item.id);
                    }
                    if (!item.lastmessagetime) {
                        item.lastmessagetime = '1970-01-01 00:00:00'
                    }
                    if (item.lastmessage) {
                        dispatch(setClientLastMessage({ message: item.lastmessage, id: item.id }));
                    }
                    if (item.seenCount > 0 && seenClientMsgCount?.filter(x => x.id === item.id).length == 0) {
                        dispatch(setSeenClientMsgCount({ count: item.seenCount, id: item.id }));
                    }
                })
                tempCount += count;
                dispatch(setClientMsgCount({ count, ids: tempIds }))
                dispatch(setChatCount(tempCount));
                setClients(res);
                setSearchedClients(res);
                setIsLoaded(true);
            }).catch(err => console.log(err))
        } else {
            UserService.GetUsers().then(res => {
                if (res.success != undefined && !res.success) {
                    console.log('Error', res)
                } else {
                    let count = 0;
                    let tempIds = [];
                    res?.map(item => {
                        count += item.seenCount;
                        if (item.id != user.id) {
                            tempIds.push(item.id);
                        }
                        if (!item.lastmessagetime) {
                            item.lastmessagetime = '1970-01-01 00:00:00'
                        }
                        if (item.lastmessage) {
                            dispatch(setUserLastMessage({ message: item.lastmessage, id: item.id }));
                        }
                        if (item.seenCount > 0 && seenUserMsgCount?.filter(x => x.id === item.id).length == 0) {
                            dispatch(setSeenUserMsgCount({ count: item.seenCount, id: item.id }));
                        }
                    })
                    tempCount += count;
                    dispatch(setUserMsgCount({ count, ids: tempIds }))
                    dispatch(setChatCount(tempCount));
                    setSearchedUsers(res?.filter(x => x.id != user.id))
                    setUsers(res?.filter(x => x.id != user.id));
                }
                setIsLoaded(true);
            }).catch(err => console.log(err))


            if (user.type === 2 || user.type === 3) {
                ClientService.GetClientsList().then(res => {
                    if (res.success != undefined && !res.success) {
                        console.log('Error', res)
                    } else {
                        let count = 0;
                        let tempIds = [];
                        res?.map(item => {
                            count += item.seenCount;
                            if (item.id != user.id) {
                                tempIds.push(item.id);
                            }
                            if (item.lastmessage) {
                                dispatch(setClientLastMessage({ message: item.lastmessage, id: item.id }));
                            }
                            if (!item.lastmessagetime) {
                                item.lastmessagetime = '1970-01-01 00:00:00'
                            }
                            if (item.seenCount > 0 && seenClientMsgCount?.filter(x => x.id === item.id).length == 0) {
                                dispatch(setSeenClientMsgCount({ count: item.seenCount, id: item.id }));
                            }
                        })
                        tempCount += count;
                        dispatch(setClientMsgCount({ count, ids: tempIds }))
                        dispatch(setChatCount(tempCount));
                        setClients(res);
                        setSearchedClients(res);
                    }
                    setIsLoaded(true);
                }).catch(err => console.log(err))
            }
            else {
                ClientService.GetClientsByUserId(user?.id).then(res => {
                    if (res.success != undefined && !res.success) {
                        console.log('Error', res)
                    } else {
                        let count = 0;
                        let tempIds = [];
                        res?.map(item => {
                            count += item.seenCount;
                            if (item.id != user.id) {
                                tempIds.push(item.id);
                            }
                            if (item.lastmessage) {
                                dispatch(setClientLastMessage({ message: item.lastmessage, id: item.id }));
                            }
                            if (!item.lastmessagetime) {
                                item.lastmessagetime = '1970-01-01 00:00:00'
                            }
                            if (item.seenCount > 0 && seenClientMsgCount?.filter(x => x.id === item.id).length == 0) {
                                dispatch(setSeenClientMsgCount({ count: item.seenCount, id: item.id }));
                            }
                        })
                        tempCount += count;
                        dispatch(setClientMsgCount({ count, ids: tempIds }))
                        dispatch(setChatCount(tempCount));
                        setClients(res);
                        setSearchedClients(res);
                    }
                    setIsLoaded(true);
                }).catch(err => console.log(err))
            }
        }
        setRefreshing(false);
    }

    const checkPermission = async () => {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
            setNotificationStatus(status)
        }
        if (finalStatus !== 'granted') {
            setTitle('Please allow notification permissions to access this option.')
            setNotificationStatus('notallowed')
            return;
        }
    }

    const navigateToChat = (item) => {
        ChatService.seenChats(item?.id, user?.id)
            .then(res => {
                if (active === "My Team") {
                    setSearchedUsers(searchedUsers.filter(x => {
                        if (x.id === item?.id) {
                            tempCount -= x.seenCount
                            dispatch(setChatCount(tempCount));
                            dispatch(setUserMsgCount({ count: 0, ids: userMsgCount?.ids.filter(x => x.id !== item?.id) }))
                            x.seenCount = 0;
                        }
                        if (seenUserMsgCount?.filter(x => x.id === item.id).length > 0) {
                            dispatch(removeSeenUserMsgCount({ id: item.id }));
                        }
                        return x;
                    }));
                    setUsers(users.filter(x => {
                        if (x.id === item?.id) {
                            x.seenCount = 0;
                        }
                        return x;
                    }));
                } else {
                    setSearchedClients(searchedClients.filter(x => {
                        if (x.id === item?.id) {
                            tempCount -= x.seenCount
                            dispatch(setChatCount(tempCount));
                            dispatch(setClientMsgCount({ count: 0, ids: clientMsgCount?.ids.filter(x => x.id !== item?.id) }))
                            x.seenCount = 0;
                        }
                        if (seenClientMsgCount?.filter(x => x.id === item.id).length > 0) {
                            dispatch(removeSeenClientMsgCount({ id: item.id }));
                        }
                        return x;
                    }));
                    setClients(clients.filter(x => {
                        if (x.id === item?.id) {
                            x.seenCount = 0;
                        }
                        return x;
                    }));
                }

                dispatch(clearChats());
                setIsLoaded(false);
                navigation.navigate('MessageBoxScreen', item);
            })
            .catch(err => console.log('err', err))
    }

    useFocusEffect(
        useCallback(() => {
            checkPermission();
            getData();
        }, [isFocused])
    );
    useFocusEffect(
        useCallback(() => {
            if (seenUserMsgCount > 0) {
                chat?.filter(x => {
                    if (x.sent_from == item.id) {
                        item.lastmessage = x.message;
                    }
                })
            }
        }, [seenClientMsgCount, seenUserMsgCount])
    )

    return (
        <>
            <View style={{ flex: 1 }}>
                <View style={styles.parent1}>
                    <Header showHeading={true} onGoBack={() => navigation.goBack()} navigation={navigation} title={'Messages'} blackHead={true} />
                    <ShadeLines container2={{ left: '82%', bottom: '40%' }} container={{ left: '65%', bottom: '40%' }} />
                </View>
                <View style={styles.parent2}>
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row', marginHorizontal: 20, paddingVertical: width * 0.04, paddingHorizontal: width * 0.02 }}>
                            <Text onPress={() => setActive('My Team')} style={{ fontSize: height * 0.025, fontWeight: '700', width: width * 0.25, borderBottomWidth: active === 'My Team' ? 1 : 0, paddingBottom: 10, textAlign: 'center', borderBottomColor: colors.primary, color: active === 'My Team' ? colors.primary : colors.tertiary }}>My Team</Text>
                            {(isLoaded && userMsgCount?.userCount > 0) &&
                                // <View style={{ backgroundColor: colors.primary, width: width * 0.06, height: width * 0.06, marginLeft: -5, borderRadius: 100, alignSelf: 'center', justifyContent: 'center', marginTop: -10, alignItems: 'center' }}>
                                //     <Text style={{ fontSize: height * 0.02, fontWeight: '700', textAlign: 'center', color: colors.secondary }}>{userMsgCount?.userCount > 99 ? '99+' : userMsgCount?.userCount}</Text>
                                // </View>
                                <Badge style={{backgroundColor:colors.primary,fontSize:height * 0.02}}>{userMsgCount?.userCount > 99 ? '99+' : userMsgCount?.userCount}</Badge>
                            }
                            <Text onPress={() => setActive('Clients')} style={{ fontSize: height * 0.025, fontWeight: '700', marginLeft: 5, width: width * 0.21, borderBottomWidth: active === 'Clients' ? 1 : 0, paddingBottom: 10, textAlign: 'center', color: active === 'Clients' ? colors.primary : colors.tertiary, borderBottomColor: colors.primary }}>Clients</Text>
                            {(clientMsgCount?.clientCount > 0 && isLoaded) &&
                            <Badge style={{backgroundColor:colors.primary,fontSize:height * 0.02}}>{clientMsgCount?.clientCount > 99 ? '99+' : clientMsgCount?.clientCount}</Badge>
                                // <View style={{ backgroundColor: colors.primary, width: width * 0.06, height: width * 0.06, marginLeft: -5, borderRadius: 100, alignSelf: 'center', justifyContent: 'center', marginTop: -10, alignItems: 'center' }}>
                                //     <Text style={{ fontSize: height * 0.02, fontWeight: '700', textAlign: 'center', color: colors.secondary }}>{clientMsgCount?.clientCount > 99 ? '99+' : clientMsgCount?.clientCount}</Text>
                                // </View>
                            }
                        </View>
                        <View style={{ marginHorizontal: 20, marginBottom: 0 }}>
                            <InputField
                                IconLeft={<AntDesign name="search1" size={20} color={`${colors.tertiary}`} />}
                                value={search}
                                onChangeText={(text) => { setSearch(text); filterClients(text) }}
                                returnKeyType={'next'}
                                placeholderTextColor={'#8A959E'}
                                placeholder="Search"
                                InputStyle={[{ backgroundColor: colors.secondary, width: '100%', borderWidth: 1, borderColor: '#ccc', marginBottom: 15, marginTop: 0 }]}
                            />
                        </View>

                        {isLoaded && active === 'My Team' && notificationStatus != 'notallowed' &&
                            <View style={{ flexDirection: 'row', marginHorizontal: 20 }}>
                                <FlatList
                                    horizontal
                                    data={users}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: height * 0.04, paddingTop: height * 0.02 }}
                                    renderItem={({ item }) => (
                                        <ProfleImage onPress={() => { setIsLoaded(false); navigation.navigate('MessageBoxScreen', item) }} item={item} key={item.id.toString()} />
                                    )}
                                    keyExtractor={item => item.id}
                                />
                            </View>
                        }
                        {isLoaded ? ((active !== 'My Team' && searchedClients.length > 0) || (active === 'My Team' && searchedUsers.length > 0)) && notificationStatus != 'notallowed' ?
                            <FlatList
                                data={(active === 'My Team' ? searchedUsers : searchedClients).sort((a, b) => moment(a.lastmessagetime).isSameOrBefore(b.lastmessagetime) ? 1 : -1)}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: height * 0.2 }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={getData}
                                    />
                                }
                                renderItem={({ item }) => (
                                    <BoxCards
                                        onPress={() => { navigateToChat(item) }}
                                        key={item.id}
                                        elevationShadowStyle={elevationShadowStyle(5)}
                                    >
                                        <MessageCards list={active} item={item} />
                                    </BoxCards>
                                )}
                                keyExtractor={item => item.id}
                            />
                            :
                            <EmptyScreen
                                icon={<Feather name={'inbox'} size={width * 0.2} color={`${colors.primary}`} />}
                                title={title}
                                bodyStyle={{ paddingTop: height * 0.15 }}
                            />
                            :
                            <ActivityIndicator style={{ marginVertical: 20 }} size={40} color={`${colors.primary}`} />}
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
});
export default MessagesScreen