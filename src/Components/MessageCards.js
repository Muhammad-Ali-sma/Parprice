import { useFocusEffect } from '@react-navigation/native';
import { Avatar, Badge, useTheme } from 'react-native-paper';
import { View, Text, Dimensions } from 'react-native';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { imgUrl } from '../Utils/Host';
import { useState } from 'react';
import moment from 'moment';

const MessageCards = ({ item, list }) => {

    const seenClientMsgCount = useSelector(state => state.ChatReducer.seenClientMsgCount);
    const lastClientMessage = useSelector(state => state.ChatReducer.lastClientMessage);
    const seenUserMsgCount = useSelector(state => state.ChatReducer.seenUserMsgCount);
    const lastUserMessage = useSelector(state => state.ChatReducer.lastUserMessage);
    const [showClientCount, setShowClientCount] = useState(false);
    const [showUserCount, setShowUserCount] = useState(false);
    const height = Dimensions.get('window').height;
    const width = Dimensions.get('window').width;
    const { colors } = useTheme();

    useFocusEffect(
        useCallback(
            () => {
                if (seenUserMsgCount?.filter(x => x.id === item.id).length > 0) {
                    setShowUserCount(true);
                } else {
                    setShowUserCount(false);
                }
                if (seenClientMsgCount?.filter(x => x.id === item.id).length > 0) {
                    setShowClientCount(true);
                } else {
                    setShowClientCount(false);
                }
            },
            [seenClientMsgCount, seenUserMsgCount],
        )
    )

    return (
        <>
            {list === 'My Team' && (
                item?.avatar != null && item?.avatar != "" ?
                    <Avatar.Image size={width * 0.13} style={{ backgroundColor: 'transparent' }} source={{ uri: imgUrl + item?.avatar }} />
                    :
                    <Avatar.Text size={width * 0.15} label={`${item?.firstname ? Array.from(item?.firstname)[0].toUpperCase() : item?.lastname && Array.from(item?.lastname)[0].toUpperCase()}`} />
            )}
            <View style={{ marginLeft: list === 'My Team' ? 10 : 0, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    <Text style={{ fontSize: height * 0.022, fontWeight: '700', textTransform: 'capitalize' }}>{item?.firstname} {item?.lastname} </Text>
                    <Text style={{ fontSize: height * 0.017, fontWeight: '600', color: colors.tertiary }}>{(item?.lastmessagetime && item?.lastmessagetime !== '1970-01-01 00:00:00') && moment(item?.lastmessagetime).calendar(null, {
                        sameDay: '[Today]',
                        nextDay: '[Tomorrow]',
                        nextWeek: 'dddd',
                        lastDay: '[Yesterday]',
                        lastWeek: 'MMM Do YYYY',
                        sameElse: 'MMM Do YYYY'
                    })}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '600', color: '#A19898' }}>
                        {showUserCount ? lastUserMessage?.filter(x => x.id === item.id).pop()?.message : showClientCount ? lastClientMessage?.filter(x => x.id === item.id).pop()?.message : item?.lastmessage}
                    </Text>
                    {(list === 'My Team' && showUserCount) &&
                        <Badge style={{ backgroundColor: colors.primary, fontSize: height * 0.017 }}>{seenUserMsgCount?.filter(x => x.id === item.id)[0]?.count > 99 ? '99+' : seenUserMsgCount?.filter(x => x.id === item.id)[0]?.count}</Badge>
                        // <View style={{ backgroundColor: colors.primary, marginLeft: 10, alignItems: 'center', justifyContent: 'center', width: width * 0.06, height: width * 0.06, alignSelf: 'flex-end', borderRadius: 100, }}>
                        //     <Text style={{ fontSize: height * 0.017, fontWeight: '700', textAlign: 'center', color: colors.secondary }}>{seenUserMsgCount?.filter(x => x.id === item.id)[0]?.count}</Text>
                        // </View>
                    }
                    {(list !== 'My Team' && showClientCount) &&
                        <Badge style={{ backgroundColor: colors.primary, fontSize: height * 0.017 }}>{seenClientMsgCount?.filter(x => x.id === item.id)[0]?.count > 99 ? '99+' : seenClientMsgCount?.filter(x => x.id === item.id)[0]?.count}</Badge>
                        // <View style={{ backgroundColor: colors.primary, marginLeft: 10, alignItems: 'center', justifyContent: 'center', width: width * 0.06, height: width * 0.06, alignSelf: 'flex-end', borderRadius: 100, }}>
                        //     <Text style={{ fontSize: height * 0.017, fontWeight: '700', textAlign: 'center', color: colors.secondary }}>{seenClientMsgCount?.filter(x => x.id === item.id)[0]?.count}</Text>
                        // </View>
                    }
                </View>
            </View>

        </>
    )
}

export default MessageCards