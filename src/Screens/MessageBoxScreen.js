import React, { useEffect, useState, useRef, useCallback } from 'react'
import { View, Text, StyleSheet, FlatList, Dimensions, KeyboardAvoidingView, RefreshControl, Keyboard, Pressable, SectionList, VirtualizedList } from "react-native";
import { ActivityIndicator, TouchableRipple, useTheme } from 'react-native-paper';
import Header from '../Components/Header';
import InputField from '../Components/InputField';
import Message from '../Components/Message';
import ShadeLines from '../Components/ShadeLines';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import ChatService from '../Services/ChatService';
import ClientService from '../Services/ClientService';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { addChats, appendChats, clearChats, setChatCount, updateChats } from '../Actions/ChatActions';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const MessageBoxScreen = ({ navigation, route }) => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const user = useSelector(state => state.UserReducer.user);
    const chat = useSelector(state => state.ChatReducer.chat);
    const [removeScroll, setRemoveScroll] = useState(false);
    const [client, setClient] = useState(route?.params);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [getDown, setGetDown] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [message, setMessage] = useState('');
    const [ref, setRef] = useState(null);
    const dispatch = useDispatch();
    const { colors } = useTheme();
    let date = '';

    const sendMessage = () => {
        let tempMessage = message;
        setMessage('');
        if (tempMessage.trim() != "") {
            let temp = {
                created_at: moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
                id: Date.now() + 1,
                is_deleted: 0,
                message: tempMessage,
                sent_from: user.id,
                sent_to: client.id,
            }
            dispatch(updateChats(temp))
            ChatService.createChat(client?.id, user.id, tempMessage)
                .then(res => {
                    if (res.success) {

                    }
                })
                .catch(err => console.log(err))
        }
    }

    const loadChat = (onLoad) => {
        if (onLoad === 'removeScroll') {
            setRemoveScroll(true);
        }
        setRefreshing(true);
        date = '';
        ChatService.getChats(route?.params?.id, user.id, onLoad === true ? 0 : pageIndex)
            .then(res => {
                setRefreshing(false);
                setIsLoaded(true);
                if (onLoad === true) {
                    dispatch(addChats(res));
                } else {
                    dispatch(appendChats(res))
                }
                setPageIndex((onLoad === true ? 0 : pageIndex) + 1);
            })
            .catch(err => { console.log(err); dispatch(clearChats()) })

    }
    const getClientById = () => {
        ClientService.GetClientById(route?.params?.id)
            .then(res => setClient(res))
            .catch(err => console.log(err))

    }
    useFocusEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    });

    const handleOnGoBack = () => {
        ChatService.seenChats(client?.id, user?.id)
            .then(res => { navigation.goBack() })
            .catch(err => console.log('err', err))
    }

    useFocusEffect(
        useCallback(
            () => {
                setIsLoaded(false);
                if (route?.params?.firstname != undefined) {
                    setClient(route?.params)
                } else {
                    getClientById()
                }
                loadChat(true);
            }, [])
    )

    return (
        <>
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <View style={styles.parent1}>
                        <Header onPress={handleOnGoBack} onPressName={() => navigation.navigate('ClientProfileScreen', route?.params )} showHeading={true} navigation={navigation} title={`${client?.firstname || client?.lastname ? client?.firstname + " " + client?.lastname.substring(0, 1) : ""}`} blackHead={true} showBackIcon={true} />
                        <ShadeLines container2={{ left: '90%', height: 400, bottom: '-90%' }} container={{ left: '110%', height: 400, bottom: '-60%' }} />
                    </View>

                    <View style={styles.parent2}>
                        {isLoaded ?
                            <FlatList
                                data={chat}
                                ref={(ref) => { setRef(ref) }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                    />
                                }
                                initialNumToRender={20}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                onScroll={(event, index) => { if (event.nativeEvent.contentOffset.y < 300) { setGetDown(true); } else { setGetDown(false); } event.nativeEvent.contentOffset.y == 0 && loadChat('removeScroll') }}
                                renderItem={({ item, index }) => {
                                    let timeTag = false;
                                    if (date == moment(item.created_at).format('YYYY-MM-DD')) {
                                        timeTag = false;
                                    } else {
                                        timeTag = true;
                                        date = moment(item.created_at).format('YYYY-MM-DD');
                                    }
                                    return (
                                        <View key={item?.id?.toString() + "_" + index.toString() +
                                            'chat'}>
                                            {timeTag && <View style={{ backgroundColor: 'lightgrey', alignItems: 'center', justifyContent: 'center', borderRadius: 20, marginHorizontal: width * 0.4, marginVertical: 10, padding: 5 }}>
                                                <Text style={{ color: colors.tertiary, fontWeight: '600', fontSize: width * 0.02 }}>
                                                    {moment(item.created_at).calendar(null, {
                                                        sameDay: '[Today]',
                                                        nextDay: '[Tomorrow]',
                                                        nextWeek: 'dddd',
                                                        lastDay: '[Yesterday]',
                                                        lastWeek: 'MMM Do YYYY',
                                                        sameElse: 'MMM Do YYYY'
                                                    })}
                                                </Text>
                                            </View>}
                                            {(item?.sent_from === client?.id || item?.sent_from === user?.id) && <Message onLayout={() => !removeScroll && ref.scrollToEnd({ animated: false })} profile={client} item={item} elevationShadowStyle={elevationShadowStyle(5)} />}
                                        </View>
                                    )
                                }}
                                keyExtractor={item => item.id}
                            />
                            : <ActivityIndicator animating={true} style={{ marginVertical: 20 }} size={40} color={`${colors.primary}`} />
                        }
                        {/* {getDown && <TouchableRipple onPress={() => ref.scrollToEnd()} rippleColor={colors.rippleColor} style={{ position: 'absolute', bottom: 10, right: 5, backgroundColor: colors.tertiary, borderRadius: 5, padding: 5 }}>
                            <AntDesign name="arrowdown" size={15} color={colors.secondary} />
                        </TouchableRipple>} */}
                    </View>
                    <View style={{ width: "100%", backgroundColor: colors.secondary }}>
                        <InputField
                            IconLeft={<FontAwesome style={{ padding: 8, zIndex: 1, backgroundColor: 'black', overflow: "hidden", borderRadius: 15 }} name="send" size={15} color={`${colors.secondary}`} />}
                            value={message}
                            onChangeText={(text) => setMessage(text)}
                            returnKeyType={'next'}
                            placeholderTextColor={`${colors.tertiary}`}
                            IconStyle={{ left: '100%' }}
                            placeholder="Type Something..."
                            inputStyle={{ paddingLeft: 20 }}
                            InputStyle={{ backgroundColor: 'white', width: width - 40, borderRadius: 0, height: 50, marginTop: 0, }}
                            onSubmitEditing={sendMessage}
                            iconPress={sendMessage}
                        />
                    </View>
                    {isKeyboardVisible && <View style={{ height: height * 0.04 }} />}
                </KeyboardAvoidingView>
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
        paddingTop: 20,
        width: '100%',
        paddingBottom: 60,
    },
    parent2: {
        marginTop: -40,
        flex: 1,
        overflow: 'hidden',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: '#F9F9FF',
        width: '100%',
        height: '100%',
    },

});


export default MessageBoxScreen