import { View, Text, Dimensions, Pressable } from 'react-native'
import React from 'react'
import { Avatar } from 'react-native-paper'
import { imgUrl } from '../Utils/Host';

const ProfleImage = ({ item,onPress }) => {
    const width = Dimensions.get('window').width;

    return (
        <Pressable onPress={onPress} style={{marginLeft:width*0.04,alignItems:'center'}}>
            {
                item?.avatar != null && item?.avatar != "" ?
                    <Avatar.Image size={width * 0.15} style={{ backgroundColor: 'transparent' }} source={{ uri: imgUrl + item?.avatar }} />
                    :
                    <Avatar.Text size={width * 0.15} label={`${item?.firstname ? Array.from(item?.firstname)[0].toUpperCase() : item?.lastname && Array.from(item?.lastname)[0].toUpperCase()}`} />
            }
                    <Text>{item?.firstname} {item?.lastname.substring(0,1)}</Text>

        </Pressable>
    )
}

export default ProfleImage