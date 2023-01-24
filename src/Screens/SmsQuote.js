import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import Header from "../Components/Header";
import { Checkbox, TextInput } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import Popup from "../Components/Popup";
import { useSelector } from "react-redux";
import JobService from "../Services/JobService";
import Button from "../Components/Button";
import InputField from "../Components/InputField";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import Loader from '../Components/Loader';
import * as Notifications from 'expo-notifications';

const SmsQuote = ({ navigation }) => {

    const { colors } = useTheme();
    const height = Dimensions.get('window').height;
    const quote = useSelector(state => state.JobReducer.quote);
    const company = useSelector((state) => state.UserReducer.company);

    const [phoneChecked, setPhoneChecked] = useState(true);
    const [message, setMessage] = useState(`Hi ${quote?.client?.firstname} ${quote?.client?.lastname}, here's your quote from ${company?.name}.`);
    const [number, setNumber] = useState('');
    const [addNewNumber, setAddNewNumber] = useState(false);
    const [clientNumbers, setClientNumbers] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [description, setDescription] = useState('');


    const createQuoteMessage = () => {
        let tempArray = [];
        clientNumbers.filter(x => {
            if (x.checked) {
                tempArray.push(x.number)
            }
        })
        if (phoneChecked) {
            tempArray.push(quote?.client?.phonenumber)
        }
        if (tempArray.length > 0) {
            JobService.createQuoteMessage(quote.jobId, tempArray, [], message)
                .then(async (res) => {
                    setShowLoader(false);
                    if (res.success) {
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: `SMS Sent Successfully`,
                                body: '',
                                data: { jobId: quote.jobId },
                                sound: true
                            },
                            trigger: { seconds: 2 },
                        });
                        navigation.navigate('ClientContactInfoScreen',{data:quote?.client});
                    }
                }).catch(err => { console.log(err); setShowLoader(false); })
        } else {
            setDescription('Please select phone number.');
            setShowPopup(true);
        }
    }

    const handleOnAddNewNumber = () => {
        if (number.length >= 10) {
            setClientNumbers([...clientNumbers, { number: number, checked: true }])
            setAddNewNumber(false);
            setNumber('');
        } else {
            setDescription('Please enter atleast 10 numbers!');
            setShowPopup(true);
        }
    }
    const handleOnDeleteBtnPress = (item) => {
        setClientNumbers(clientNumbers.filter(x => x.number != item))
    }
    return (
        <>
            {showLoader ? <Loader /> :

                <>
                    <Header onPressActionBtn={() => createQuoteMessage()} navigation={navigation} onPress={() => navigation.goBack()} showSaveTitle={'Send'} title={'SMS Quote'} />
                    <View style={styles.container}>
                        <Text style={{ fontSize: height * 0.025, color: '#000', paddingLeft: 5 }}>Send To</Text>
                        <Pressable onPress={() => setPhoneChecked(!phoneChecked)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Checkbox.Android
                                status={phoneChecked ? 'checked' : 'unchecked'}
                                color={colors.primary}
                            />
                            <Text style={{ fontSize: height * 0.025, }}>{quote?.client?.phonenumber.substring(0, 3) + '-' + quote?.client?.phonenumber?.substring(3, 6) + "-" + quote?.client?.phonenumber?.substring(6, quote?.client?.phonenumber?.length)}</Text>
                        </Pressable>
                        {clientNumbers.length > 0 && clientNumbers.map((item, index) => (
                            <View key={index.toString()} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Pressable onPress={() => {
                                    let temp = [...clientNumbers];
                                    temp[index].checked = !item.checked;
                                    setClientNumbers(temp);
                                }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Checkbox.Android
                                        status={item.checked ? 'checked' : 'unchecked'}
                                        color={colors.primary}
                                    />
                                    <Text style={{ fontSize: height * 0.025, }}>{item?.number?.substring(0, 3) + '-' + item?.number?.substring(3, 6) + "-" + item?.number?.substring(6, item?.number?.length)}</Text>
                                </Pressable>
                                <FontAwesome5 onPress={() => handleOnDeleteBtnPress(item?.number)} name="trash-alt" size={height * 0.035} color={colors.primary} />
                            </View>
                        ))}
                        {addNewNumber ?
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15, marginBottom: 10 }}>
                                <InputField
                                    InputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25, width: '80%', alignSelf: 'flex-start', marginTop: 5 }}
                                    returnKeyType="done"
                                    value={number}
                                    onChangeText={(text) => {
                                        setNumber(text);
                                    }}
                                    placeholder="xxx-xxx-xxxx"
                                    placeholdercolor='#8A8D9F'
                                    autoCapitalize="none"
                                    blurOnSubmit={false}
                                    ref={null}
                                    keyboardType='numeric'
                                    onSubmitEditing={() => handleOnAddNewNumber()}
                                />
                                <AntDesign name="checkcircleo" onPress={() => handleOnAddNewNumber()} size={height * 0.035} color={colors.primary} />
                            </View>
                            :
                            <View style={{ width:'50%' , marginTop: 15, marginBottom: 5 }}>
                                <Button title='Add New Number' onPress={() => setAddNewNumber(true)} btntextstyle={{ color: colors.primary, fontSize: height * 0.023 }} />
                            </View>
                        }
                        <View style={{ borderBottomWidth: 1, borderColor: '#CCC' }} />
                        <View style={{ marginTop: 15, borderBottomWidth: 1, paddingBottom: 10, borderColor: '#CCC' }}>
                            <Text style={{ fontSize: height * 0.025, fontWeight: '700', color: colors.tertiary }}>Text Message</Text>
                        </View>
                        <View style={{ marginVertical: 15, borderBottomWidth: 1, marginHorizontal: 5, borderColor: '#CCC', paddingBottom: 30 }}>
                            <TextInput
                                underlineColorAndroid="transparent"
                                placeholder="Type something"
                                placeholderTextColor="grey"
                                numberOfLines={6}
                                style={{ borderWidth: 2, borderColor: '#CCC', borderBottomColor: colors.primary, fontSize: height * 0.02 }}
                                backgroundColor={'#fff'}
                                multiline={true}
                                value={message}
                                onChangeText={(text) => setMessage(text)}
                            />
                        </View>
                    </View>
                    <Popup show={showPopup} onPress={() => setShowPopup(false)} title={'Error'} description={description} />
                </>
            }
        </>
    );

}

export default SmsQuote


const styles = StyleSheet.create({

    container: {
        width: '100%',
        backgroundColor: '#fff',
        flex: 1,
        padding: 20
    },

})
