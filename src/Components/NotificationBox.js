import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { TouchableRipple, useTheme } from 'react-native-paper';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import { useSelector } from 'react-redux';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const NotificationBox = ({ item, onPress }) => {
    const { colors } = useTheme();
    let msg = item?.notification.split('\\n');

    return (
        <TouchableRipple rippleColor={colors.rippleColor} onPress={onPress} style={{ borderBottomWidth: 1, borderBottomColor: '#CCCDD4', marginHorizontal: 20, flexDirection: 'row', paddingVertical: 20, padding: 10 }}>
            <>
                {msg[0]?.includes('created a client') && <FontAwesome name="user" size={width * 0.07} color="#1CAE81" />}
                {(msg[0]?.includes('created a quote') || msg[0]?.includes('viewed a quote')|| msg[0]?.includes('appointment is created') || msg[0]?.includes('approved a quote') || msg[0]?.includes('converted to job') || msg[0]?.includes('sent a quote') || msg[0]?.includes('sent a contract') || msg[0]?.includes('signs contract paperwork')) && <FontAwesome5 name="edit" size={width * 0.06} color="#FE830D" />}
                {(msg[0]?.includes('requested changes') || msg[0]?.includes('quote is sent')) && <MaterialCommunityIcons name="email-outline" size={width * 0.07} color="#FD6F4C" />}

                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: '600', fontSize: height * 0.025, paddingBottom: 10 }}>{msg[0]}</Text>
                    {msg[1] && <Text numberOfLines={1} style={{ fontWeight: '300', fontSize: height * 0.02, paddingBottom: 10 }}>{msg[1]}</Text>}
                    <Text style={{ fontWeight: '300', fontSize: height * 0.015 }}>{moment(item?.created_at).calendar(null, {
                        sameDay: 'hh:mm A',
                        nextDay: '[Tomorrow]',
                        nextWeek: 'dddd',
                        lastDay: '[Yesterday]',
                        lastWeek: 'MMM Do YYYY',
                        sameElse: 'MMM Do YYYY'
                    })}
                    </Text>
                </View>
            </>
        </TouchableRipple>
    )
}

export default NotificationBox