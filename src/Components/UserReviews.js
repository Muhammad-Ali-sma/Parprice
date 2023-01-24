import React from 'react'
import { View, Text } from "react-native";
import { useTheme } from 'react-native-paper';
import moment from 'moment';
import Rating from './Rating';

const UserReviews = ({ item }) => {
    const { colors } = useTheme();
    for (let i = 0; i < item?.rating; i++) {


    }
    return (
        <View style={{ backgroundColor: colors.secondary, alignItems: 'center', borderRadius: 20, paddingVertical: 20, marginTop: 20 }}>
            <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 20, alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, color: '#2D2E49', fontWeight: '700' }}>{item?.name}</Text>
                    <Text style={{ fontSize: 13, color: '#ABABB7', fontWeight: '400', marginTop: -2 }}>{moment(item?.created_at).format('DD-MM-YYYY')}</Text>
                </View>
                <View>
                    <Rating
                        count={5}
                        defaultRating={item?.rating}
                        size={20}
                        isDisabled={true}
                     />                   
                </View>
            </View>

            <Text style={{ fontSize: 14, color: '#2D2E49', fontWeight: '400', alignSelf: 'flex-start', paddingHorizontal: 20, marginTop: 10 }}>{item?.review}</Text>
        </View>
    )
}

export default UserReviews