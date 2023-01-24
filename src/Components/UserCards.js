import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { Avatar } from 'react-native-paper'
import { imgUrl } from '../Utils/Host';
import { AntDesign } from '@expo/vector-icons';

const UserCards = ({item}) => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    return (
        <>
            {
                item?.avatar ?
                    <Avatar.Image size={width * 0.13} style={{ backgroundColor: 'transparent' }} source={{ uri: imgUrl + item?.avatar }} />
                    :
                    <Avatar.Text size={width * 0.15} label={`${item?.firstname ? Array.from(item?.firstname)[0].toUpperCase() : item?.lastname && Array.from(item?.lastname)[0].toUpperCase()}`} />
            }
            <View style={{ marginLeft:  10 , flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    <Text style={{ fontSize: height * 0.022, fontWeight: '700', textTransform: 'capitalize' }}>{item?.firstname} {item?.lastname} </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '600', color: '#A19898' }}>
                        {item?.type === 0 && "Employee" || item?.type === 1 && "Client" || item?.type === 2 && "Manager" || item?.type === 3 && "Super Admin"}
                    </Text>
                </View>
            </View>
            <AntDesign name="right" size={20} color="rgba(0, 0, 0, 0.25)" />
        </>
    )
}

export default UserCards