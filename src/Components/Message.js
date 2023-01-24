import React from 'react'
import moment from 'moment';
import { View, Text, Dimensions } from "react-native";
import { Avatar, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { imgUrl } from '../Utils/Host';

const Message = ({ item, elevationShadowStyle, profile, boxStyle, boxTextStyle, onLayout }) => {
    const { colors } = useTheme();
    const user = useSelector(state => state.UserReducer.user)
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    return (
        <>

            <View onLayout={onLayout} style={{ alignItems: item.sent_to === user.id ? 'flex-start' : 'flex-end', justifyContent: item.sent_to === user.id ? 'flex-start' : 'flex-end', paddingTop: 10, paddingBottom: 10 }}>
                <View style={{ marginHorizontal: 15 }}>
                    <View style={{ flexDirection: "row", alignItems: 'flex-end' }}>
                        {(item.sent_from !== user.id && user.type === 1) && profile?.avatar != null && (profile?.avatar != "" ?
                            <Avatar.Image style={{ marginRight: Dimensions.get("window").width * 0.04 }} size={height * 0.05} source={{ uri: imgUrl + profile.avatar }} />
                            :
                            <Avatar.Text size={60} label={`${profile?.firstname ? Array.from(profile?.firstname)[0].toUpperCase() : profile?.lastname && Array.from(profile?.lastname)[0].toUpperCase()}`} />)
                        }
                        {item.sent_from !== user.id &&
                            <View style={[{ backgroundColor: item.sent_to === user.id ? colors.secondary : '#C2BEBE', paddingHorizontal: width * 0.025, paddingVertical: height * 0.006, borderRadius: 20, marginLeft: item.sent_from === user.id ? width * 0.2 : 0 }, boxStyle, elevationShadowStyle]}>
                                <Text style={[{ color: colors.tertiary, fontSize: height * 0.02 }, boxTextStyle]}>{item.message}
                                    <Text style={{ alignSelf: item.sent_to === user.id ? 'flex-start' : 'flex-end', fontSize: height * 0.013, color: '#8A959E', }}>  {moment(item?.created_at).format('LT')}</Text>
                                </Text>
                            </View>}
                    </View>

                    {item.sent_from === user.id && <View style={[{ backgroundColor: item.sent_to === user.id ? colors.secondary : '#C2BEBE', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, width: '90%', marginLeft: item.sent_from === user.id ? width * 0.2 : 0 }, boxStyle, elevationShadowStyle]}>
                        <Text style={[{ color: colors.tertiary, fontSize: height * 0.02 }, boxTextStyle]}>{item.message}
                            <Text style={{ alignSelf: item.sent_to === user.id ? 'flex-start' : 'flex-end', fontSize: height * 0.013, color: 'black', }}>  {moment(item?.created_at).format('LT')}</Text>
                        </Text>
                    </View>}
                </View>
            </View>
        </>
    )
}

export default Message
