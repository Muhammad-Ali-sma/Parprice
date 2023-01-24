import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { imgUrl } from '../Utils/Host'
import { Avatar, useTheme } from 'react-native-paper';
import moment from 'moment';

const NotesCards = ({item}) => {
    const { colors } = useTheme();
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    return (
        <>
            {
                (item?.user?.avatar != null && item?.user?.avatar != "") ?
                    <Avatar.Image size={width * 0.13} style={{ backgroundColor: 'transparent' }} source={{ uri: imgUrl + item?.user?.avatar }} />
                    :
                    <Avatar.Text size={width * 0.15} label={`${item?.user?.firstname ? Array.from(item?.user?.firstname)[0].toUpperCase() : Array.from(item?.user?.lastname)[0].toUpperCase()}`} />                
            }
            <View style={{ marginLeft: 10, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    <Text style={{ fontSize: height * 0.022, fontWeight: '700', textTransform: 'capitalize' }}><Text style={{fontWeight:'400'}}>Posted by: </Text>{item?.user?.firstname} {item?.user?.lastname} </Text>
                     <Text style={{ fontSize: height * 0.017, fontWeight: '600', color: colors.tertiary }}>{moment(item?.created_at).format('LT')}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '600', color: '#A19898' }}>
                        {item?.note}
                    </Text>

                </View>
            </View>
        </>
    )
}

export default NotesCards