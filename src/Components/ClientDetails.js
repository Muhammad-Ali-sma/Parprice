import { View, Text, Dimensions, Pressable, Linking } from 'react-native'
import React, { useState } from 'react'
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useTheme } from 'react-native-paper';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const ClientDetails = ({ client, containerStyle, data, showEmail, onPress, onDeSelect, navigation }) => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const { colors } = useTheme();

    const wrap = (word, n) => {
        return (word?.length > n) ? word.substr(0, n - 1) + '...' : word;
    }

    const editAppointment = () => {
        let newData = data;
        newData.user.id = data.createdfor;
        navigation.navigate('EditScheduleScreen', { data: newData })
    }

    return (
        <>
            <View style={[{ backgroundColor: colors.secondary, marginVertical: 10, width: '90%', padding: 10, overflow: 'hidden', paddingLeft: 20, borderRadius: 12 }, containerStyle]}>
                {onDeSelect != undefined &&
                    <Pressable onPress={onDeSelect} style={{ justifyContent: 'flex-end', position: 'absolute', right: '2%', top: '2%', padding: 5 }}>
                        <AntDesign name="minuscircle" size={width * 0.06} color={colors.primary} />
                    </Pressable>
                }
                <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ overflow: 'hidden', width: width * 0.08, height: width * 0.08, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderRadius: 100 }}>
                        <FontAwesome name="user" size={width * 0.04} color={"white"} />
                    </View>
                    <Text style={{ fontWeight: '500', fontSize: width * 0.04, marginLeft: 8, flex: 1, textTransform: 'capitalize' }}>{client?.fullname != undefined && client?.fullname} {client?.firstname} {client?.lastname}</Text>
                    {data != undefined && <Feather onPress={() => editAppointment()} name="edit" size={width * 0.04} color={colors.primary} />}
                </Pressable>
                <Pressable onPress={() => Linking.openURL(`tel:${client?.phonenumber}`)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                    <View style={{ overflow: 'hidden', width: width * 0.08, height: width * 0.08, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderRadius: 100 }}>
                        <FontAwesome name="phone" size={width * 0.04} color={"white"} />
                    </View>
                    <Text style={{ fontWeight: '500', fontSize: width * 0.04, marginLeft: 10 }}>{'(' + client?.phonenumber?.substring(0, 3) + ') ' + client?.phonenumber?.substring(3, 6) + "-" + client?.phonenumber?.substring(6, client?.phonenumber?.length)} <Text style={{ fontSize: width * 0.035 }}> {client?.extension && '(' + client?.extension + ')'}</Text></Text>
                </Pressable>
                <Pressable onPress={() => Linking.openURL(`https://maps.google.com/?q=${client?.address}`)} style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <View style={{ overflow: 'hidden', width: width * 0.08, height: width * 0.08, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderRadius: 100 }}>
                        <FontAwesome5 name="map-marker-alt" size={width * 0.04} color={`white`} />
                    </View>
                    <Text numberOfLines={1} style={{ textTransform: 'capitalize', fontWeight: '500', paddingRight: 8, fontSize: width * 0.04, marginLeft: 10 }}>
                        {client?.streetnumber != undefined && (wrap(client?.streetnumber + ' ' + client?.route + ',' + client?.arealvl + ',' + client?.country + ' ' + client?.postalcode, (width > 767 ? width * 0.05 : width * 0.08)))}
                        {wrap(client?.address, (width > 767 ? width * 0.05 : width * 0.08))}</Text>
                </Pressable>
                {data != undefined &&
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                            <View style={{ overflow: 'hidden', width: width * 0.08, height: width * 0.08, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderRadius: 100 }}>
                                <MaterialIcons name="description" size={width * 0.04} color={`white`} />
                            </View>
                            <Text numberOfLines={1} style={{ textTransform: 'capitalize', fontWeight: '500', paddingRight: 8, fontSize: width * 0.04, marginLeft: 10 }}>{data?.description}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                            <View style={{ overflow: 'hidden', width: width * 0.08, height: width * 0.08, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderRadius: 100 }}>
                                <Ionicons name="time-sharp" size={width * 0.04} color={`white`} />
                            </View>
                            <Text numberOfLines={1} style={{ fontWeight: '500', paddingRight: 8, fontSize: width * 0.04, marginLeft: 8 }}>{moment(data?.time, 'HH:mm:ss').format('hh:mm A')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', paddingTop: 10 }}>
                            <View style={{ overflow: 'hidden', width: width * 0.08, height: width * 0.08, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderRadius: 100 }}>
                                <Entypo name="users" size={width * 0.04} color="white" />
                            </View>
                            <Text numberOfLines={1} style={{ fontWeight: '900', paddingRight: 8, fontSize: width * 0.04, marginLeft: 8 }}>
                                {data?.createdby != "-1" ? `${data?.rep?.firstname} ${data?.rep?.lastname}` : "Unassigned" }
                                {(data?.createdbysecond != "-1" && data?.rep2) && ` / ${data?.rep2?.firstname} ${data?.rep2?.lastname}`}
                            </Text>
                        </View>
                    </>
                }
                {showEmail && <Pressable onPress={() => Linking.openURL(`mailto:${client?.email}`)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                    <MaterialIcons name="email" style={{ overflow: 'hidden', backgroundColor: colors.primary, paddingVertical: 6, paddingHorizontal: 7, borderRadius: 100 }} size={width * 0.04} color={`white`} />
                    <Text numberOfLines={1} style={{ fontWeight: '500', paddingRight: 8, fontSize: width * 0.04, marginLeft: 8 }}>{client?.email}</Text>
                </Pressable>}
            </View>
        </>
    )
}

export default ClientDetails