import React, { useCallback, useState } from 'react'
import { View, ScrollView, Pressable, Text, Dimensions, StyleSheet, KeyboardAvoidingView } from "react-native";
import { ActivityIndicator, useTheme } from 'react-native-paper';
import InputField from '../Components/InputField';
import Header from '../Components/Header'
import Button from '../Components/Button'
import Popup from '../Components/Popup'
import ClientService from '../Services/ClientService';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../Components/Loader'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { changeBarColor } from '../Actions/UserActions';
import { useDispatch, useSelector } from 'react-redux';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native-web';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const Form = ({ navigation, route }) => {

    const { colors } = useTheme()
    const clientId = route?.params?.id;
    const onSelectClient = route?.params;
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [addressEdit, setAddressEdit] = useState(false);
    const user = useSelector((state) => state.UserReducer.user);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [notes, setNotes] = useState('');
    const dispatch = useDispatch();

    const handleOnPressSubmitBtn = () => {
        setLoading(true)
        setIsSubmitted(true);

        if (firstName === "" || lastName === "" || address === "" || email === "" || number === "" || notes === "") {
            setTitle('Error');
            setMessage('Please fill in the required fields!');
            setShowPopup(true);

        } else {

            if (clientId != undefined) {
                ClientService.EditClient(firstName, lastName, address, email, number, notes, clientId).then(res => {
                    if (res.success) {
                        setIsSubmitted(false);
                        setFirstName('');
                        setLastName('');
                        setAddress('');
                        setEmail('');
                        setNotes('');
                        setNumber('');
                        navigation.navigate('ClientsScreen');
                    } else {
                        setMessage(res.message)
                        setShowPopup(true);
                    }
                    setLoading(false)
                }).catch(err => { console.log(err); setLoading(false) })
            } else {
                ClientService.AddNewClient(firstName, lastName, address, email, number, notes).then(async res => {
                    if (res.success) {
                        setIsSubmitted(false);
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: `${user?.firstname} ${user?.lastname} created a client`,
                                body: `${firstName + " " + lastName}`,
                                data: {},
                                sound: true
                            },
                            trigger: { seconds: 2 },
                        });
                        setFirstName('');
                        setLastName('');
                        setAddress('');
                        setEmail('');
                        setNotes('');
                        setNumber('');
                        if (onSelectClient != undefined) {
                            onSelectClient(res.result);
                            navigation.navigate('CheckoutScreen')
                        } else {
                            navigation.navigate('ClientsScreen')
                        }
                    } else {
                        setTitle('Error');
                        setMessage(res.message)
                        setShowPopup(true);
                    }
                    setLoading(false)
                }).catch(err => { console.log(err); setLoading(false) })
            }
        }
    }
    const getClientData = () => {
        setIsLoaded(false)
        if (clientId != undefined) {
            ClientService.GetClientById(clientId).then(res => {
                if (res && res.success == undefined) {
                    setFirstName(res?.firstname);
                    setLastName(res?.lastname);
                    setAddress(res?.address);
                    setEmail(res?.email);
                    setNumber(res?.phonenumber.toString());
                    setNotes(res?.notes);
                    setIsLoaded(true)
                } else {
                    console.log('Error', res.message)
                    setIsLoaded(true)
                }
            }).catch(err => console.log(err))
        } else {
            setIsSubmitted(false);
            setFirstName('');
            setLastName('');
            setAddress('');
            setEmail('');
            setNotes('');
            setNumber('');
            setIsLoaded(true)
        }
    }

    useFocusEffect(
        useCallback(() => {
            getClientData();
        }, [])
    );

    return (
        <>
            {isLoaded ?
                <KeyboardAwareScrollView keyboardShouldPersistTaps="always" style={{ flex: 1, backgroundColor: colors.secondary, height: '100%' }}>
                    <Header title={`${clientId != undefined ? 'Edit' : "New"} Client`} onPress={() => { dispatch(changeBarColor({ barColor: 'black', barContent: 'light-content' })); navigation.goBack() }} navigation={navigation} />
                    <View style={{ flex: 1, backgroundColor: colors.secondary }}>
                        <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
                            <View style={{ marginHorizontal: 30, marginVertical: 10 }}>
                                <InputField
                                    inputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25 }}
                                    returnKeyType="next"
                                    label={"First Name"}
                                    required={true}
                                    value={firstName}
                                    isDirty={isSubmitted}
                                    onChangeText={(text) => {
                                        setFirstName(text);
                                    }}
                                    placeholder="First Name"
                                    placeholdercolor='#8A8D9F'
                                    autoCapitalize="none"
                                    blurOnSubmit={false}
                                    ref={null}
                                />
                                <InputField
                                    inputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25 }}
                                    returnKeyType="next"
                                    label={"Last Name"}
                                    required={true}
                                    value={lastName}
                                    isDirty={isSubmitted}
                                    onChangeText={(text) => {
                                        setLastName(text);
                                    }}
                                    placeholder="Last Name"
                                    placeholdercolor='#8A8D9F'
                                    autoCapitalize="none"
                                    blurOnSubmit={false}
                                    ref={null}
                                />
                                <Text style={[styles.label, { color: colors.tertiary }]}>Address</Text>
                                <GooglePlacesAutocomplete
                                    placeholder='Address'
                                    textInputProps={{
                                        value: address,
                                        onFocus: () => { setAddressEdit(true) },
                                        onChangeText: (e) => {
                                            if (addressEdit) {
                                                setAddress(e);
                                            }
                                        }
                                    }}
                                    styles={{
                                        textInputContainer: {
                                            backgroundColor: '#F4F5F7',
                                            borderRadius: 25,
                                            padding: 10,
                                            paddingLeft: 30,
                                            fontWeight: '700'
                                        },
                                        textInput: {
                                            fontWeight: '700',
                                            fontSize: 15,
                                            color: '#000'
                                        },
                                        row: {
                                            backgroundColor: '#FFFFFF',
                                            padding: 13,
                                            height: 44,
                                            flexDirection: 'row',
                                        },
                                        separator: {
                                            height: 0.5,
                                            backgroundColor: '#c8c7cc',
                                        },
                                        powered: { display: 'none' },
                                        loader: {
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            height: 20,
                                        },
                                    }}
                                    getDefaultValue={() => {
                                        return address;
                                    }}
                                    onPress={(data, details = null) => {
                                        setAddress(data.description)
                                    }}
                                    suppressDefaultStyles
                                    query={{
                                        key: 'AIzaSyCkizO0GBC3bbtKKdoWpTnNNyuF9p1qJnM',
                                        language: 'en',
                                    }}
                                />
                                <InputField
                                    inputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25 }}
                                    returnKeyType="next"
                                    label={"Email"}
                                    required={true}
                                    value={email}
                                    isDirty={isSubmitted}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                    }}
                                    placeholder="Email"
                                    placeholdercolor='#8A8D9F'
                                    autoCapitalize="none"
                                    blurOnSubmit={false}
                                    ref={null}
                                />
                                <InputField
                                    inputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25 }}
                                    returnKeyType="next"
                                    label={"Phone Number"}
                                    required={true}
                                    value={number}
                                    isDirty={isSubmitted}
                                    onChangeText={(text) => {
                                        setNumber(text);
                                    }}
                                    placeholder="xxx-xxx-xxxx"
                                    placeholdercolor='#8A8D9F'
                                    autoCapitalize="none"
                                    blurOnSubmit={false}
                                    ref={null}
                                    keyboardType='numeric'
                                />
                                <InputField
                                    inputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25, height: 100, padding: 10 }}
                                    returnKeyType="done"
                                    label={"Notes"}
                                    required={true}
                                    value={notes}
                                    isDirty={isSubmitted}
                                    onChangeText={(text) => {
                                        setNotes(text);

                                    }}
                                    placeholder="Additional Info..."
                                    placeholdercolor='#8A8D9F'
                                    autoCapitalize="none"
                                    blurOnSubmit={false}
                                    ref={null}
                                    multiline={true}
                                    maxLength={1000}
                                />
                                <View style={{ alignItems: 'center', marginTop: 10 }}>
                                    <Button isLoading={loading} onPress={handleOnPressSubmitBtn} btntextstyle={{ color: colors.secondary }} btnstyle={{ marginVertical: 20, backgroundColor: colors.primary }} title="Save Client" />
                                </View>
                            </View>
                        </ScrollView>

                        <Popup show={showPopup} onPress={() => { setShowPopup(false); setLoading(false); }} title={title} description={message} />
                    </View>
                </KeyboardAwareScrollView>
                :
                <Loader />
            }
        </>
    )
}

const styles = StyleSheet.create({
    view: {
        width: '100%',
        position: 'absolute',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleloader: {
        height: 45,
        width: 45,
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 45 / 2,
        shadowColor: "#233e86",
        shadowOffset: {
            width: 0,
            height: 3,
        },
    },
    label: {
        textAlign: 'left',
        fontSize: width * 0.05,
        paddingVertical: 5,
        color: '#707375',
        fontWeight: '600',
    },
});

export default Form