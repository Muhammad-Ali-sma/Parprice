import { View, Text, StyleSheet, Dimensions, ScrollView, RefreshControl, StatusBar } from 'react-native'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import Header from '../Components/Header'
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { List, TouchableRipple, useTheme } from 'react-native-paper';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import SkeletonLoader from "expo-skeleton-loader";
import JobService from '../Services/JobService';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { changeBarColor, changePrimaryColor, handleActive, SetScheduleCount, userData } from '../Actions/UserActions';
import * as Update from 'expo-updates';
import * as Notifications from 'expo-notifications';
import UserService from "../Services/UserService";
import { setChatCount, setClientMsgCount, setUserLastMessage, setSeenClientMsgCount, setSeenUserMsgCount, setUserMsgCount, updateChats, updateSeenClientMsgCount, updateSeenUserMsgCount, setClientLastMessage } from "../Actions/ChatActions";
import Pusher from 'pusher-js/react-native';
import Popup from '../Components/Popup';
import LocalStorage from '../Utils/LocalStorage';
import { UserLogout } from '../Actions/AuthActions';
import NetInfo from '@react-native-community/netinfo';
import { getUrl } from '../Utils/Host';
import ClientService from '../Services/ClientService';
import ScheduleService from '../Services/ScheduleService';
import { allCategories } from '../Actions/CategoryAction';
import Circle from '../../assets/images/Circle.js'


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const SecondHomeScreen = ({ navigation }) => {

    const [changesRequested, setChangesRequested] = useState(width < 767 ? height * 0.065 : height * 0.05);
    const msgCount = useSelector(state => state.ChatReducer.msgCount);
    const barContent = useSelector(state => state.UserReducer.barContent);

    const [completed, setCompleted] = useState(width < 767 ? height * 0.065 : height * 0.05);
    const user = useSelector(state => state.UserReducer.user);
    const [updatevisible, setUpdateVisible] = useState(false);
    const [assigned, setAssigned] = useState(width < 767 ? height * 0.065 : height * 0.05);
    const [provided, setProvided] = useState(width < 767 ? height * 0.065 : height * 0.05);
    const seenClientMsgCount = useSelector(state => state.ChatReducer.seenClientMsgCount);
    const seenUserMsgCount = useSelector(state => state.ChatReducer.seenUserMsgCount);
    const clientMsgCount = useSelector(state => state.ChatReducer.clientMsgCount);
    const userMsgCount = useSelector(state => state.ChatReducer.userMsgCount);
    const [notification, setNotification] = useState(false);
    const [connectionPopup, setConnectionPopup] = useState(false);
    const [expoPushToken, setExpoPushToken] = useState('');
    const [listItem, setListItem] = useState('Monthly');
    const [selected, setSelected] = useState('Weekly');
    const [quoteLength, setQuoteLength] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [signedTotal, setSignedTotal] = useState(0);
    const [unSignedTotal, setUnSignedTotal] = useState(0);
    const [jobLength, setJobLength] = useState(0);
    const notificationListener = useRef();
    const hours = (new Date()).getHours();
    const [data, setData] = useState([]);
    const [msg, setMsg] = useState(null);
    const responseListener = useRef();
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const { colors } = useTheme();

    const registerForPushNotificationsAsync = async () => {
        let token;
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        try {
            token = (await Notifications.getExpoPushTokenAsync())?.data;
        } catch (error) {
            token = null;
        }
        UserService.updateExpoToken(user?.id, token).then(res => {
            if (!res?.success) {
                LocalStorage.ClearData();
                dispatch(UserLogout());
                return false;
            }
            LocalStorage.RemoveData('User');
            dispatch(userData({
                user: res?.user,
                company: res?.company
            }));
            LocalStorage.SetData("User", JSON.stringify(res?.user));
            LocalStorage.SetData("Company", JSON.stringify(res?.company));
            LocalStorage.SetData("CompanyId", res?.user?.company.toString());
            getUrl();
            dispatch(changePrimaryColor({ color: res?.company?.colorScheme }));
            dispatch(setChatCount(res?.data?.chatCount))
            checkAppointmentDate();
        });
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    }

    const connectToPusher = async () => {
        try {
            const pusher = new Pusher("5a53bb1bcf48df09a181", {
                cluster: "ap2",
            });
            var channel = pusher.subscribe("headirct-app-development");
            channel.bind("chat-event", (data) => {
                if (data.sent_to == user?.id) {
                    const chat = {
                        ...data,
                        seen: 1,
                        created_at: moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')
                    }
                    dispatch(updateChats(chat));
                    setMsg(data);
                }
            });
        } catch (e) {
            console.log('ERROR: ' + e);
        }
    }
    const getBoardData = (item) => {
        setIsLoaded(false);
        setUnSignedTotal(0);
        setSignedTotal(0);
        JobService.GetStatusBoard(item === 'Monthly' ? (moment().get('months') + 1) : '', user?.id)
            .then(res => {
                setData(res);
                setIsLoaded(true);
            })
            .catch(err => setIsLoaded(true))
    }

    const getClientDetails = (id) => {

        ClientService.GetClientById(id).then(res => {
            if (res?.success == undefined) {
                navigation.navigate('ClientContactInfoScreen', { data: res })
            } else {
                console.log('Error', res.message)
            }
        }).catch(err => console.log(err))
    }

    const checkupdate = async () => {
        if (__DEV__) return;
        const updateCheck = await Update.checkForUpdateAsync();
        if (updateCheck.isAvailable) {
            await Update.fetchUpdateAsync();
            setUpdateVisible(true);
        }
    }

    const checkAppointmentDate = () => {
        if (user?.type == 1) {
            ScheduleService.GetAppointmentByClientId(user?.id)
                .then(res => {
                    if (res?.success == undefined) {
                        let currentDate = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
                        const newData = res?.filter(item => {
                            if (!moment(item.date + ' ' + item.time).isBefore(currentDate)) {
                                return item
                            }
                        })
                        dispatch(SetScheduleCount(newData?.length))
                    }
                })
                .catch(err => console.log(err))
        } else {
            ScheduleService.GetAppointmentByUserId(user?.id)
                .then(res => {
                    if (res?.success == undefined) {
                        let currentDate = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
                        const newData = res?.filter(item => {
                            if (!moment(item.date + ' ' + item.time).isBefore(currentDate)) {
                                return item
                            }
                        })
                        dispatch(SetScheduleCount(newData?.length))
                    }
                })
                .catch(err => console.log(err))
        }
    }

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            if (!state.isConnected) {
                setConnectionPopup(true);
            } else {
                setConnectionPopup(false);
            }
        });
        checkupdate();
        connectToPusher();
        return unsubscribe;
    }, [])

    useEffect(() => {
        if (msg?.message) {
            dispatch(setChatCount(msgCount + 1));
            if (userMsgCount?.ids.includes(msg?.sent_from)) {
                dispatch(setUserMsgCount({ ...userMsgCount, count: userMsgCount?.userCount + 1 }));
            }
            if (clientMsgCount?.ids.includes(msg?.sent_from)) {
                dispatch(setClientMsgCount({ ...clientMsgCount, count: clientMsgCount?.clientCount + 1 }));
            }
            if (seenUserMsgCount?.filter(x => x.id === msg?.sent_from).length == 0) {
                dispatch(setSeenUserMsgCount({ count: 1, id: msg.sent_from }));
                dispatch(setUserLastMessage({ message: msg?.message, id: msg.sent_from }));
            }
            else {
                dispatch(updateSeenUserMsgCount({ id: msg.sent_from }));
                dispatch(setUserLastMessage({ message: msg?.message, id: msg.sent_from }));
            }
            if (seenClientMsgCount?.filter(x => x.id === msg?.sent_from).length == 0) {
                dispatch(setSeenClientMsgCount({ count: 1, id: msg.sent_from }));
                dispatch(setClientLastMessage({ message: msg?.message, id: msg.sent_from }));
            }
            else {
                dispatch(updateSeenClientMsgCount({ id: msg.sent_from }));
                dispatch(setClientLastMessage({ message: msg?.message, id: msg.sent_from }));
            }
        }
    }, [msg])

    useEffect(() => {

        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            setNotification(notification);
            response?.notification?.request?.content?.data?.screen !== undefined && navigation.navigate(response?.notification?.request?.content?.data?.screen, { id: response?.notification?.request?.content?.data?.screen == "MessageBoxScreen" ? response?.notification?.request?.content?.data?.sent_from : response.notification.request?.content?.data?.id })
        });
        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, [])

    useFocusEffect(
        useCallback(() => {
            dispatch(changeBarColor({ barColor: 'black', barContent: 'light-content' }));
            getBoardData(selected);
            setChangesRequested(width < 767 ? height * 0.065 : height * 0.05);
            setCompleted(width < 767 ? height * 0.065 : height * 0.05);
            setAssigned(width < 767 ? height * 0.065 : height * 0.05);
            setProvided(width < 767 ? height * 0.065 : height * 0.05);
            dispatch(allCategories());
        }, [isFocused])
    )

    useEffect(() => {
        if (data) {
            let signTotal = 0;
            let unSignTotal = 0;
            setQuoteLength(data['quote']?.length);
            setJobLength(data['job']?.filter(x => (x.contract_status === "signed" || x.contract_status === "unsigned"))?.length);
            
            if (data['job']?.length) {
                data['job']?.filter(x => x.contract_status === "signed")?.map(x => signTotal += x?.subtotal ?? 0)
                setSignedTotal(signTotal);
                data['job']?.filter(x => x.contract_status === "unsigned")?.map(x => unSignTotal += x?.subtotal ?? 0)
                setUnSignedTotal(unSignTotal);
            }
        }
    }, [data])

    useEffect(() => {
        checkAppointmentDate();
    }, [isFocused])

    return (
        <>
            <StatusBar barStyle={Platform.OS === 'ios' ? barContent : 'light-content'} backgroundColor={'black'} />

            <Header navigation={navigation} blackHead={true} styledMenuIcon={true} showBell={true} showHeading={false} />
            <LinearGradient style={{ flex: 1 }} colors={['black', '#CEC6C6', '#FFFBFB']}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={!isLoaded}
                            onRefresh={() => getBoardData(selected)}
                        />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: width < 767 ? height * 0.065 : height * 0.05 }}
                >
                    <View style={styles.wrapper}>
                        <View style={styles.box}>
                            <View style={{ width: '50%' }}>
                                <Text style={[styles.parent1Text1, { color: colors.secondary }]}>Hi {user?.firstname} {user?.lastname}</Text>
                                <Text style={[styles.parent1Text2, { color: colors.primary }]}>Good {hours < 12 ? "Morning" : (hours >= 12 && hours <= 17 ? "Afternoon" : (hours >= 17 && hours <= 24 ? "Evening" : "Night"))}</Text>
                            </View>
                            <View style={{ width: '30%' }}>
                                <Text style={[styles.parent1Text1, { color: colors.secondary, }]}>Net Sales</Text>
                                {isLoaded ? <Text style={[styles.parent1Text2, { color: colors.secondary, }]}>{(data && data['totalsales'][0]?.sales) ? '$' + data['totalsales'][0]?.sales?.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '$' + 0}</Text>
                                    :
                                    <SkeletonLoader boneColor='#DDDBDD' highlightColor='#ccc' style={{ alignSelf: 'flex-start', paddingVertical: 10 }}>
                                        <SkeletonLoader.Container>
                                            <SkeletonLoader.Item style={{ width: width * 0.15, height: height * 0.02, borderRadius: 5 }} />
                                        </SkeletonLoader.Container>
                                    </SkeletonLoader>}
                            </View>
                            <View style={styles.accordionContainer}>
                                <TouchableRipple rippleColor={colors.rippleColor} style={styles.accordion} onPress={() => { setExpanded(!expanded) }}>
                                    <View style={styles.accordionHeader}>
                                        <Text style={[styles.parent1SmallText, { color: colors.secondary, textAlign: 'left' }]}>{selected}</Text>
                                        <MaterialIcons name={`keyboard-arrow-${expanded ? 'up' : 'down'}`} size={width * 0.05} color={colors.secondary} />
                                    </View>
                                </TouchableRipple>
                                {expanded &&
                                    <TouchableRipple onPress={() => { getBoardData(listItem); setListItem(selected); setSelected(listItem); setExpanded(false); }} rippleColor={colors.rippleColor} style={styles.accordionDescription}>
                                        <Text style={[styles.parent1SmallText, { color: colors.secondary, fontSize: 10 }]}>{listItem}</Text>
                                    </TouchableRipple>}
                            </View>
                        </View>
                        <Text style={[styles.parent1Text2, { color: colors.secondary }]}>Week at a glance</Text>
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%', justifyContent: 'flex-start' }}>
                                <LinearGradient
                                    colors={['#FDF7F7', colors.primary, '#FDF7F7', '#FDF7F7', colors.primary]}
                                    style={{ height: width * 0.12, width: width * 0.12, alignItems: 'center', justifyContent: 'center', borderRadius: 100 }}
                                >
                                    <View style={{ width: width * 0.105, height: width * 0.105, alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey', borderRadius: 100 }}>
                                        {isLoaded ?
                                            <Text style={[styles.parent1Text2, { color: colors.secondary, fontSize: width * 0.035 }]}>{data ?
                                                (quoteLength) + '/' + data['appoinments']?.length : 0 + '/' + 0}</Text>
                                            :
                                            <SkeletonLoader boneColor='#DDDBDD' highlightColor='#ccc'>
                                                <SkeletonLoader.Container>
                                                    <SkeletonLoader.Item style={{ width: width * 0.105, height: width * 0.105, borderRadius: 100 }} />
                                                </SkeletonLoader.Container>
                                            </SkeletonLoader>}
                                    </View>
                                </LinearGradient>

                                <View style={{ flexDirection: 'row' }}>
                                    <Circle
                                    />
                                    <View style={{ marginLeft: 6, marginTop: 5 }}>
                                        <Text style={{ fontSize: height * 0.016, color: colors.secondary, fontWeight: '600' }}>Appointments</Text>
                                        <Text style={{ fontSize: height * 0.014, color: colors.secondary, marginTop: 2, flexWrap: 'wrap' }}>Demos / Scheduled</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', width: '40%', alignItems: 'center', justifyContent: 'flex-start' }}>
                                <LinearGradient
                                    colors={['#FDF7F7', colors.primary, '#FDF7F7', '#FDF7F7', colors.primary]}
                                    style={{ height: width * 0.12, width: width * 0.12, alignItems: 'center', justifyContent: 'center', borderRadius: 100 }}
                                >
                                    <View style={{ width: width * 0.105, height: width * 0.105, alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey', borderRadius: 100 }}>
                                        {isLoaded ?
                                            <Text style={[styles.parent1Text2, { color: colors.secondary, fontSize: width * 0.035, textAlign: 'center' }]}>
                                                {data ? jobLength : 0}</Text>
                                            :
                                            <SkeletonLoader boneColor='#DDDBDD' highlightColor='#ccc'>
                                                <SkeletonLoader.Container>
                                                    <SkeletonLoader.Item style={{ width: width * 0.105, height: width * 0.105, borderRadius: 100 }} />
                                                </SkeletonLoader.Container>
                                            </SkeletonLoader>}
                                    </View>
                                </LinearGradient>
                                <View style={{ flexDirection: 'row' }}>
                                    <Circle
                                    />
                                    <View style={{ marginLeft: 6, marginTop: 5 }}>
                                        <Text style={{ fontSize: height * 0.016, color: colors.secondary, fontWeight: '600' }}>Total </Text>
                                        <Text style={{ fontSize: height * 0.014, color: colors.secondary, marginTop: 2 }}>Jobs</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginTop: height * 0.05, height: '100%', }}>
                            {isLoaded ?
                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'flex-start', marginBottom: -height * 0.01, marginTop: 5 }}>
                                    <View>
                                        <View style={{ backgroundColor: colors.primary, borderRadius: 5, width: width * 0.12, height: width * 0.12, alignItems: 'center', marginRight: 20, justifyContent: 'center', opacity: 0.75 }}>
                                            <Feather name="calendar" size={width * 0.08} color={colors.secondary} />
                                        </View>
                                        <View style={{ backgroundColor: colors.primary, height: assigned + completed, width: width / 100, marginLeft: width * 0.055, opacity: 0.75 }} />
                                    </View>
                                    <View style={{ width: '80%' }}>
                                        <Text style={{ fontSize: 18, fontWeight: '700' }}>Appointments</Text>
                                        <List.Accordion
                                            theme={{ colors: 'white' }}
                                            title={`${data ? data['appoinments']?.filter(x => x.status == 0)?.length : 0} Assigned`}
                                            titleStyle={{ fontWeight: '700' }}
                                            titleNumberOfLines={1}
                                            onPress={() => assigned == (width < 767 ? height * 0.065 : height * 0.05) ? setAssigned(assigned + (height * 0.051 * (data ? data['appoinments']?.filter(x => x.status == 0)?.length : 0))) : setAssigned(width < 767 ? height * 0.065 : height * 0.05)}
                                        >
                                            {data && data['appoinments']?.filter(x => x.status == 0)?.map((item, index) => (
                                                <TouchableRipple onPress={() => getClientDetails(item?.clientId)} rippleColor={colors.rippleColor} key={item?.created_at?.toString() + index?.toString()} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#C8C8D3', width: '100%' }}>
                                                    <>
                                                        <Text style={{ fontSize: height * 0.015, width: '30%' }}>{moment(item?.date).format('MMM DD')}</Text>
                                                        <Text style={{ fontSize: height * 0.015, width: '40%', }}>{item?.clientFirstName} {item?.clientLastName}</Text>
                                                        <Text style={{ fontSize: height * 0.015, width: '30%', textAlign: 'right' }}>{moment(item?.time, 'h:mm a').format('h:mm a')}</Text>
                                                    </>
                                                </TouchableRipple>
                                            ))}

                                        </List.Accordion>
                                        <List.Accordion
                                            theme={{ colors: 'white' }}
                                            title={`${data ? data['appoinments']?.filter(x => x.status == 1)?.length : 0} Completed`}
                                            titleStyle={{ fontWeight: '700' }}
                                            titleNumberOfLines={1}
                                            onPress={() => completed == (width < 767 ? height * 0.065 : height * 0.05) ? setCompleted(completed + (height * 0.051 * (data ? data['appoinments']?.filter(x => x.status == 1)?.length : 0))) : setCompleted(width < 767 ? height * 0.065 : height * 0.05)}
                                        >
                                            {data && data['appoinments']?.filter(x => x.status == 1)?.map((item, index) => (
                                                <TouchableRipple onPress={() => { navigation.navigate('CalendarsScreen', item?.date); dispatch(handleActive('Calendars')) }} rippleColor={colors.rippleColor} key={item?.created_at?.toString() + index?.toString()} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#C8C8D3', width: '100%' }}>
                                                    <>
                                                        <Text style={{ fontSize: height * 0.015, width: '30%' }}>{moment(item?.date).format('MMM DD')}</Text>
                                                        <Text style={{ fontSize: height * 0.015, width: '40%' }}>{item?.clientFirstName} {item?.clientLastName}</Text>
                                                        <Text style={{ fontSize: height * 0.015, width: '30%', textAlign: 'right' }}>${((data['quote']?.filter(x => x.client_id == item?.createdfor)[0]?.subtotal ?? 0) + (data['job']?.filter(x => x.client_id == item?.createdfor)[0]?.subtotal ?? 0)).toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                                    </>
                                                </TouchableRipple>
                                            ))}

                                        </List.Accordion>
                                    </View>
                                </View>
                                :
                                <SkeletonLoader boneColor='#DDDBDD' highlightColor='#ccc'>
                                    <SkeletonLoader.Container style={{ flexDirection: "row" }}>
                                        <SkeletonLoader.Item
                                            style={{
                                                width: height * 0.09,
                                                height: height * 0.09,
                                                marginRight: 20,
                                                borderRadius: 10,
                                            }}
                                        />
                                        <SkeletonLoader.Container style={{ paddingVertical: 10 }}>
                                            <SkeletonLoader.Item style={{ width: width * 0.3, height: height * 0.02, borderRadius: 5, marginBottom: 5 }} />
                                            <SkeletonLoader.Item style={{ width: width * 0.55, height: height * 0.02, borderRadius: 5, marginBottom: 5 }}
                                            />
                                        </SkeletonLoader.Container>
                                    </SkeletonLoader.Container>
                                </SkeletonLoader>
                            }
                            {isLoaded ?
                                <>
                                    <View style={{ flexDirection: 'row', width: '100%', alignItems: 'flex-start', marginBottom: -height * 0.01, marginTop: 5 }}>
                                        <View>
                                            <View style={{ backgroundColor: colors.primary, borderRadius: 5, width: width * 0.12, height: width * 0.12, alignItems: 'center', marginRight: 20, justifyContent: 'center',opacity:0.85 }}>
                                                <Ionicons name="md-document-text-outline" size={width * 0.08} color={colors.secondary} />
                                            </View>
                                            <View style={{ backgroundColor: colors.primary, height: provided + changesRequested, width: width / 100, marginLeft: width * 0.055,opacity:0.85 }} />
                                        </View>

                                        <View style={{ width: '80%' }}>
                                            <Text style={{ fontSize: 18, fontWeight: '700' }}>Quotes</Text>
                                            <View>
                                                <List.Accordion
                                                    theme={{ colors: 'white' }}
                                                    title={`${data ? data['quote']?.filter(x => x.requestChange == 0)?.length : 0} Provided`}
                                                    titleStyle={{ fontWeight: '700' }}
                                                    titleNumberOfLines={1}
                                                    onPress={() => provided == (width < 767 ? height * 0.065 : height * 0.05) ? setProvided(provided + (height * 0.051 * (data ? data['quote']?.filter(x => x.requestChange == 0)?.length : 0))) : setProvided(width < 767 ? height * 0.065 : height * 0.05)}
                                                >
                                                    {data && data['quote']?.filter(x => x.requestChange == 0)?.map((item, index) => (
                                                        <TouchableRipple onPress={() => navigation.navigate('QuoteScreen', { id: item?.id })} rippleColor={colors.rippleColor} key={item?.created_at?.toString() + index?.toString()} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#C8C8D3', width: '100%' }}>
                                                            <>
                                                                <Text style={{ fontSize: height * 0.015, width: '30%' }}>{moment(item?.created_at).format('MMM DD')}</Text>
                                                                <Text style={{ fontSize: height * 0.015, width: '40%' }}>{item?.clientFirstName} {item?.clientLasttName}</Text>
                                                                <Text style={{ fontSize: height * 0.015, width: '30%', textAlign: 'right' }}>${item?.subtotal.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                                            </>
                                                        </TouchableRipple>
                                                    ))}
                                                </List.Accordion>
                                            </View>

                                            <List.Accordion
                                                theme={{ colors: 'white' }}
                                                title={`${data ? data['quote']?.filter(x => x.requestChange == 1)?.length : 0} Changes Requested`}
                                                titleStyle={{ fontWeight: '700' }}
                                                titleNumberOfLines={1}
                                                onPress={() => changesRequested == (width < 767 ? height * 0.065 : height * 0.05) ? setChangesRequested(changesRequested + (height * 0.051 * (data ? data['quote']?.filter(x => x.requestChange == 1)?.length : 0))) : setChangesRequested(width < 767 ? height * 0.065 : height * 0.05)}
                                            >
                                                {data && data['quote']?.filter(x => x.requestChange == 1)?.map((item, index) => (
                                                    <TouchableRipple onPress={() => navigation.navigate('MessageBoxScreen', { id: item?.client_id })} rippleColor={colors.rippleColor} key={item?.created_at?.toString() + index?.toString()} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#C8C8D3' }}>
                                                        <>
                                                            <Text style={{ fontSize: height * 0.015 }}>{moment(item?.created_at).format('MMM DD')}</Text>
                                                            <Text style={{ fontSize: height * 0.015 }}>{item?.clientFirstName} {item?.clientLasttName}</Text>
                                                        </>
                                                    </TouchableRipple>
                                                ))}
                                            </List.Accordion>
                                        </View>
                                    </View>
                                </>
                                :
                                <SkeletonLoader boneColor='#DDDBDD' highlightColor='#ccc' style={{ marginVertical: 20 }}>
                                    <SkeletonLoader.Container style={{ flexDirection: "row" }}>
                                        <SkeletonLoader.Item
                                            style={{
                                                width: height * 0.09,
                                                height: height * 0.09,
                                                marginRight: 20,
                                                borderRadius: 10,
                                            }}
                                        />
                                        <SkeletonLoader.Container style={{ paddingVertical: 10 }}>
                                            <SkeletonLoader.Item style={{ width: width * 0.3, height: height * 0.02, borderRadius: 5, marginBottom: 5 }} />
                                            <SkeletonLoader.Item
                                                style={{ width: width * 0.55, height: height * 0.02, borderRadius: 5, marginBottom: 5 }}
                                            />
                                        </SkeletonLoader.Container>
                                    </SkeletonLoader.Container>
                                </SkeletonLoader>
                            }
                            {isLoaded ?
                                <>
                                    <View style={{ flexDirection: 'row', width: '100%', alignItems: 'flex-start', marginBottom: -height * 0.01, marginTop: 5 }}>
                                        <View>
                                            <View style={{ backgroundColor: colors.primary, borderRadius: 5, width: width * 0.12, height: width * 0.12, alignItems: 'center', marginRight: 20, justifyContent: 'center' }}>
                                                <Feather name="edit" size={width * 0.07} color={colors.secondary} />
                                            </View>
                                        </View>
                                        <View style={{ width: '80%' }}>
                                            <Text style={{ fontSize: 18, fontWeight: '700' }}>Deals</Text>
                                            <List.Accordion
                                                theme={{ colors: 'white' }}
                                                title={`${data ? data['job']?.filter(x => x.contract_status === "signed").length : 0} Signed`}
                                                description={`Worth $${signedTotal?.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                                                descriptionNumberOfLines={1}
                                                descriptionStyle={{ color: 'black', marginTop: 5 }}
                                                titleStyle={{ fontWeight: '700' }}
                                                titleNumberOfLines={1}
                                            >
                                                {data && data['job']?.filter(x => x.contract_status === "signed")?.map((item, index) => (
                                                    <TouchableRipple onPress={() => navigation.navigate('PresentQuoteScreen', { id: item?.id })} rippleColor={colors.rippleColor} key={item?.created_at?.toString() + index?.toString()} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#C8C8D3', width: '100%' }}>
                                                        <>
                                                            <Text style={{ fontSize: height * 0.015, width: '30%' }}>{moment(item?.created_at).format('MMM DD')}</Text>
                                                            <Text style={{ fontSize: height * 0.015, width: '40%' }}>{item?.clientFirstName} {item?.clientLasttName}</Text>
                                                            <Text style={{ fontSize: height * 0.015, width: '30%', textAlign: 'right' }}>${item?.subtotal.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                                        </>
                                                    </TouchableRipple>
                                                ))}
                                            </List.Accordion>
                                            <List.Accordion
                                                theme={{ colors: 'white' }}
                                                title={`${data ? data['job']?.filter(x => x.contract_status === "unsigned")?.length : 0} Unsigned`}
                                                description={`Worth ${unSignedTotal?.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                                                descriptionNumberOfLines={1}
                                                descriptionStyle={{ color: 'black', marginTop: 5 }}
                                                titleStyle={{ fontWeight: '700' }}
                                                titleNumberOfLines={1}
                                            >
                                                {data && data['job']?.filter(x => x.contract_status === "unsigned")?.map((item, index) => (
                                                    <TouchableRipple onPress={() => navigation.navigate('PresentQuoteScreen', { id: item?.id })} rippleColor={colors.rippleColor} key={item?.created_at?.toString() + index?.toString()} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#C8C8D3', width: '100%' }}>
                                                        <>
                                                            <Text style={{ fontSize: height * 0.015, width: '30%' }}>{moment(item?.created_at).format('MMM DD')}</Text>
                                                            <Text style={{ fontSize: height * 0.015, width: '40%' }}>{item?.clientFirstName} {item?.clientLasttName}</Text>
                                                            <Text style={{ fontSize: height * 0.015, width: '30%', textAlign: 'right' }}>${item?.subtotal.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                                        </>
                                                    </TouchableRipple>
                                                ))}
                                            </List.Accordion>
                                        </View>
                                    </View>
                                </>
                                :
                                <SkeletonLoader boneColor='#DDDBDD' highlightColor='#ccc'>
                                    <SkeletonLoader.Container style={{ flexDirection: "row" }}>
                                        <SkeletonLoader.Item
                                            style={{
                                                width: height * 0.09,
                                                height: height * 0.09,
                                                marginRight: 20,
                                                borderRadius: 10,
                                            }}
                                        />
                                        <SkeletonLoader.Container style={{ paddingVertical: 10 }}>
                                            <SkeletonLoader.Item style={{ width: width * 0.3, height: height * 0.02, borderRadius: 5, marginBottom: 5 }} />
                                            <SkeletonLoader.Item
                                                style={{ width: width * 0.55, height: height * 0.02, borderRadius: 5, marginBottom: 5 }}
                                            />
                                        </SkeletonLoader.Container>
                                    </SkeletonLoader.Container>
                                </SkeletonLoader>
                            }
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
            <Popup
                show={updatevisible}
                description={'New Updates Are Available'}
                updateBtn={true}
                btnText='Update'
            />
            <Popup
                show={connectionPopup}
                title='Connection Error!'
                description={'Please turn on your internet connection!'}
                connectBtn={true}
                updateBtn={true}
                btnText='Try Again'
                onPress={() => { getBoardData('week'); }}
            />
        </>
    )
}


const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingHorizontal: width * 0.08,
        marginTop: 20
    },
    parent1Text1: {
        fontWeight: '500',
        fontSize: 14,
        textTransform: 'capitalize'
    },
    parent1Text2: {
        fontWeight: '700',
        fontSize: 18,
        paddingVertical: 10
    },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        borderBottomColor: '#C8C8D3',
        paddingBottom: 10,
        borderBottomWidth: 2
    },
    parent1SmallText: {
        fontSize: 12,
        textAlignVertical: 'center',
        marginLeft: 10,
    },
    halfCircle: {
        width: width * 0.13,
        height: width * 0.13
    },
    accordionContainer: {
        width: '20%',
        alignSelf: 'flex-start',
        marginBottom: height * 0.05
    },
    accordion: {
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    accordionDescription: {
        width: '100%',
        flexDirection: 'column',
        padding: 5,
        alignSelf: 'center'

    }
})
export default SecondHomeScreen