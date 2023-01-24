import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Header from "../Components/Header";
import { Checkbox, TextInput } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import Popup from "../Components/Popup";
import { useSelector } from "react-redux";
import JobService from "../Services/JobService";
import Button from "../Components/Button";
import InputField from "../Components/InputField";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import moment from "moment";
import Loader from '../Components/Loader';
import { ctf } from "../Utils/GlobalFunc";
import * as Notifications from 'expo-notifications';

const EmailQuote = ({ navigation, route }) => {

    const { colors } = useTheme();
    const total = route?.params;
    const height = Dimensions.get('window').height;
    const width = Dimensions.get('window').width;
    const quote = useSelector(state => state.JobReducer.quote);
    const user = useSelector((state) => state.UserReducer.user);
    const company = useSelector(state => state.UserReducer.company)

    const [emailChecked, setEmailChecked] = useState(true);
    const [email, setEmail] = useState('');
    const [addNewEmail, setAddNewEmail] = useState(false);
    const [clientEmails, setClientEmails] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [description, setDescription] = useState('');



    const createQuoteMessage = () => {
        let tempArray = [];
        clientEmails.filter(x => {
            if (x.checked) {
                tempArray.push(x.email)
            }
        })
        if (emailChecked) {
            tempArray.push(quote?.client?.email)
        }
        if (tempArray.length > 0) {
            setShowLoader(true);
            JobService.createQuoteMessage(quote.jobId, [], tempArray, '')
                .then(async (res) => {
                    setShowLoader(false);
                    if (res.success) {
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: `Email Sent Successfully`,
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
            setDescription('Please select email.');
            setShowPopup(true);
        }
    }
    const handleOnAddNewEmail = () => {
        if (email.includes('@') && email.includes('.com')) {
            setClientEmails([...clientEmails, { email: email, checked: true }])
            setAddNewEmail(false);
            setEmail('');
        } else {
            setDescription('Email is invalid!');
            setShowPopup(true);
        }
    }
    const handleOnDeleteBtnPress = (item) => {
        setClientEmails(clientEmails.filter(x => x.email != item))
    }
    return (

        <>
            {showLoader ? <Loader /> :

                <>
                    <Header onPressActionBtn={() => createQuoteMessage()} navigation={navigation} onPress={() => navigation.goBack()} showSaveTitle={'Send'} title={'Email Quote'} />
                    <View style={styles.container}>
                        <Text style={{ fontSize: height * 0.025, color: '#000', paddingLeft: 5 }}>Send To</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Checkbox.Android
                                status={emailChecked ? 'checked' : 'unchecked'}
                                color={colors.primary}
                                onPress={() => {
                                    setEmailChecked(!emailChecked);
                                }}
                            />
                            <Text style={{ fontSize: height * 0.025 }}>{quote?.client?.email}</Text>
                        </View>
                        {clientEmails.length > 0 && clientEmails.map((item, index) => (
                            <View key={index.toString()} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Checkbox.Android
                                        status={item.checked ? 'checked' : 'unchecked'}
                                        color={colors.primary}
                                        onPress={() => {
                                            let temp = [...clientEmails];
                                            temp[index].checked = !item.checked;
                                            setClientEmails(temp);
                                        }}
                                    />
                                    <Text style={{ fontSize: height * 0.025, }}>{item?.email}</Text>
                                </View>
                                <FontAwesome5 onPress={() => handleOnDeleteBtnPress(item?.email)} name="trash-alt" size={height * 0.035} color={colors.primary} />
                            </View>
                        ))}


                        {addNewEmail ?
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15, marginBottom: 10 }}>
                                <InputField
                                    InputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25, width: '80%', alignSelf: 'flex-start', marginTop: 5 }}
                                    returnKeyType="done"
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                    }}
                                    placeholder="Email"
                                    placeholdercolor='#8A8D9F'
                                    autoCapitalize="none"
                                    blurOnSubmit={false}
                                    ref={null}
                                    onSubmitEditing={() => handleOnAddNewEmail()}
                                />
                                <AntDesign name="checkcircleo" onPress={() => handleOnAddNewEmail()} size={height * 0.035} color={colors.primary} />
                            </View>
                            :
                            <View style={{ width:'50%', marginTop: 15, marginBottom: 5 }}>
                                <Button title='Add New Email' onPress={() => setAddNewEmail(true)} btntextstyle={{ color: colors.primary, fontSize: height * 0.023 }} />
                            </View>
                        }
                        <View style={{ borderBottomWidth: 1, borderColor: '#CCC' }} />

                        <View style={{ marginVertical: 15, borderWidth: 1, borderBottomColor: colors.primary, borderColor: '#CCC' }}>
                            <View style={{ alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#CCC', marginHorizontal: width * 0.045, }}>
                                <Text style={{ fontSize: height * 0.022 }}>Quote from {company?.name} - {`${moment(Date.now()).format('MMM DD,YYYY')}`}</Text>
                            </View>
                            <View style={{ paddingVertical: 10, marginHorizontal: width * 0.045, }}>
                                <Text style={{ marginVertical: 10, fontSize: height * 0.02 }}>Hi {quote?.client?.firstname} {quote?.client?.lastname},</Text>
                                <Text style={{ marginVertical: 10, fontSize: height * 0.02 }}>Thank you for asking us to quote your project.</Text>
                                <Text style={{ marginVertical: 10, fontSize: height * 0.02 }}>The quote total is ${total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} as of {`${moment(Date.now()).format('MMM DD,YYYY')}`}.</Text>
                                <Text style={{ marginVertical: 10, fontSize: height * 0.02 }}>If you have any questions or concerns regarding this quote, please don't hesitate to get in touch with me at {user?.email}.</Text>
                                <Text style={{ marginVertical: 10, fontSize: height * 0.02 }}>Sincerely,</Text>
                                <Text style={{ marginVertical: 10, fontSize: height * 0.02 }}>{company?.name}</Text>
                            </View>
                        </View>
                    </View>
                    <Popup show={showPopup} onPress={() => setShowPopup(false)} title={'Error'} description={description} />
                </>
            }
        </>
    );

}

export default EmailQuote


const styles = StyleSheet.create({

    container: {
        width: '100%',
        backgroundColor: '#fff',
        flex: 1,
        padding: 20
    },

})
