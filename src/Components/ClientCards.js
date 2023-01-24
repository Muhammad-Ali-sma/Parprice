import { View, Text, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { AntDesign, Feather } from '@expo/vector-icons'
import { TouchableRipple, useTheme } from 'react-native-paper';
import moment from 'moment';

const ClientCards = ({ creditsScreen,activescreen,onSelectClient, item,removeClient }) => {
    const { colors } = useTheme();
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const [active, setActive] = useState(false);

    return (
        <>
            {activescreen == "NewQuotes" &&
                <View style={{ width: '100%', zIndex: 9999, alignItems: 'flex-end', position: 'absolute', top: 20, right: 20 }}>
                    <View style={{ borderRadius: 100, overflow: "hidden" }}>
                        <TouchableRipple rippleColor={colors.rippleColor} onPress={() => { setActive(!active); onSelectClient() }} style={{ backgroundColor: colors.primary, padding: 5 }}>
                            {!active && removeClient ?
                                <AntDesign name="deleteuser" size={30} color={"white"} />
                                :
                                <AntDesign name="adduser" size={30} color={"white"} />
                            }
                        </TouchableRipple>
                    </View>
                </View>
            }
            <Feather name="users" size={width * 0.08} color={`${colors.primary}`} />
            <View style={{ marginLeft: 10, width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: height * 0.022, width: '60%', fontWeight: '700', textTransform: 'capitalize' }}>{item?.lastname}, {item?.firstname}</Text>
                    {creditsScreen && <Text style={{ fontSize: height * 0.022, width: '25%', textAlign: 'right', fontWeight: '700', textTransform: 'capitalize' }}>${item?.cost ?? 0}</Text>}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: height * 0.017, width:creditsScreen || activescreen == "NewQuotes"? '60%':'80%', fontWeight: '600', color: '#A19898' }}>{moment(item?.created_at).format("MMM Do YY")} | {item?.address}</Text>
                    {creditsScreen && <Text style={{ fontSize: height * 0.020, width: '25%', color: '#A19898', textAlign: 'right', fontWeight: '700', textTransform: 'capitalize' }}>{item?.cost === null ? "Client" : "Lead"}</Text>}
                </View>
            </View>
        </>
    )
}

export default ClientCards