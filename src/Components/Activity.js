import React, { useEffect, useState } from 'react'
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { View, Text, Dimensions, FlatList } from 'react-native'
import JobService from '../Services/JobService';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Activity = ({ client }) => {
    const IsFocused = useIsFocused();
    const { colors } = useTheme();

    const [refreshing, setRefreshing] = useState(false);
    const [activity, setActivity] = useState([]);



    const GetActivityByUserId = () => {
        setRefreshing(true);

        JobService.GetActivityByUserId(client.id)
            .then(res => {
                setActivity(res);
                setRefreshing(false);
            })
            .catch(err => console.log(err))
    }
    useEffect(() => {
        GetActivityByUserId();
    }, [IsFocused])
    return (
        <>
            <View style={{ flex: 1 }}>
                {!refreshing ?
                    <FlatList
                        data={activity}
                        contentContainerStyle={{ paddingBottom: height * 0.4 }}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() => <View style={{ alignItems: 'center', marginTop: height * 0.1 }}>
                            <Text style={{ color: colors.tertiary, fontSize: width * 0.045, fontWeight: '700' }}>This client has no activity!</Text>
                            <Text style={{ color: colors.tertiary, fontSize: width * 0.035, fontStyle: 'italic' }}>This section will list the activities made for this client</Text>

                        </View>}
                        renderItem={({ item }) => (
                            <>
                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', marginBottom: -10, }}>
                                    <AntDesign style={{ marginRight: width * 0.02 }} name="checkcircle" size={width > 767 ?width*0.04 :24} color={`${colors.primary}`} />
                                    <View>
                                        <Text style={{ color: colors.tertiary, fontSize: 16, fontWeight: '700' }}>{item.log} #{item.jid}</Text>
                                        <Text style={{ color: '#A19898', fontSize: 14, }}>{moment(item.created_at).format('DD/MM/YYYY')} @ {moment(item.created_at).format('h:mm a')}</Text>
                                    </View>
                                </View>
                                <View style={{ backgroundColor: colors.primary, height: height * 0.06, width: width / 100, zIndex: -1, marginLeft: width > 767 ? width * 0.015 : width * 0.026, marginBottom: -12 }} />
                            </>
                        )}
                        keyExtractor={item => item.id}

                    />
                    :
                    <ActivityIndicator animating={true} style={{ marginVertical: 20 }} size={40} color={`${colors.primary}`} />
                }
            </View>
        </>
    )
}

export default Activity