import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import Button from "../Components/Button";
import InputField from "../Components/InputField";
import { useTheme } from 'react-native-paper';
import Header from "../Components/Header";
import CartRow from '../Components/CartRow';
import { useSelector, useDispatch } from 'react-redux';
import Popup from "../Components/Popup";
import { clearJobDetails, loadQuoteDetailsObject, updateClient, updateDeposit, updateJobId, updateManualDiscount, updateTitle } from "../Actions/JobActions";
import JobService from "../Services/JobService";
import ClientsList from "../Components/ClientsList";
import { ctf } from "../Utils/GlobalFunc";
import * as Notifications from 'expo-notifications';
import BoxCards from "../Components/BoxCards";
import ClientCards from "../Components/ClientCards";
import { changeBarColor } from "../Actions/UserActions";

const height = Dimensions.get('window').height;

const CheckoutScreen = ({ navigation, route }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();

    const job = useSelector(state => state.JobReducer.job);
    const user = useSelector(state => state.UserReducer.user);
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);

    const [showPopup, setShowPopup] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const onSelectClient = (item) => {
        dispatch(updateClient(item));
        setShowPopup(false)
    }

    const onSave = () => {
        if (job.client == null) {
            setTitle("Error");
            setMessage("Please Select Client");
            setShowModal(true);
        } else if (job.title === '') {
            setTitle("Error");
            setMessage("Please Enter Job Title");
            setShowModal(true);
        } else if (job.cart.length <= 0) {
            setTitle("Error");
            setMessage("Please Add Some Products");
            setShowModal(true);
        } else {
            setLoading(true);
            let pid = [];
            job.cart.forEach(item => pid.push(item.id + ":" + item.quantity));
            if (job.jobId == null) {
                JobService.CreateJob(user.id, job.client.id, pid.toString(), job.title, subtotal, discount, job.manualDiscount, job.deposit)
                    .then(async res => {
                        if (res.success) {
                            navigation.navigate('QuoteScreen', { fromCheckout: true });
                            dispatch(updateJobId(res.result.id));
                            dispatch(loadQuoteDetailsObject({ ...job, jobId: res?.result?.id, status: 'quote' }));
                            await Notifications.scheduleNotificationAsync({
                                content: {
                                    title: `${user?.firstname} ${user?.lastname} created a quote`,
                                    body: `${res?.result?.id}# ${job.title} ${job.client?.firstname} ${job.client?.lastname}`,
                                    data: { jobId: res.result.id },
                                    sound: true
                                },
                                trigger: { seconds: 2 },
                            });
                            dispatch(clearJobDetails());
                        }
                        setLoading(false)
                    }).catch(err => { console.log(err); setLoading(false) })
            } else {
                JobService.UpdateJob(job.jobId, user.id, job.client.id, pid.toString(), job.title, subtotal, discount, job.manualDiscount, job.deposit)
                    .then(async res => {
                        if (res.success) {
                            dispatch(loadQuoteDetailsObject(job));
                            await Notifications.scheduleNotificationAsync({
                                content: {
                                    title: `Quote updated successfully`,
                                    body: '',
                                    data: { jobId: job.jobId },
                                    sound: true
                                },
                                trigger: { seconds: 2 },
                            });
                            dispatch(clearJobDetails());
                            navigation.navigate('QuoteScreen', { fromCheckout: true });
                        }
                        setLoading(false)
                    }).catch(err => { console.log(err); setLoading(false) })
            }

        }
    }

    useEffect(() => {
        let SubTotal = 0;
        let Discount = 0;

        job.cart?.map(item => {
            SubTotal += item.quantity * item.price;
            Discount += item.quantity * item.discount;
        })
        setSubtotal(SubTotal);
        setDiscount(Discount);
    }, [job.cart]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : 'height'} style={{ flex: 1 }}>
            <Header handleOnPressClose={() => setShowPopup(false)} isLoading={loading} navigation={navigation} showPopup={showPopup} onPressActionBtn={onSave} showSaveTitle={!showPopup && (job?.jobId ? 'Update' : 'Save')} onPress={() => { if (route?.params?.fromQuote) { dispatch(clearJobDetails()); } dispatch(changeBarColor({ barColor: 'black', barContent: 'light-content' })); navigation.goBack() }} showSave={false} title={showPopup ? "Add Client" : job?.jobId ? 'Edit Quote' : "New Quote"} />
            <View style={[styles.maincontainer, { paddingHorizontal: showPopup ? 0 : 20 }]}>
                {!showPopup ?
                    <>
                        <ScrollView style={{ flexGrow: 1 }} keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                            <View style={styles.container1}>
                                <View style={{ paddingVertical: 10 }}>
                                    <Text style={styles.text}>Client</Text>
                                    {job.client !== null ?
                                        <View style={{ marginHorizontal: -15 }}>
                                            <BoxCards
                                                activescreen={"NewQuotes"}
                                                elevationShadowStyle={elevationShadowStyle(5)}
                                            >
                                                <ClientCards
                                                    activescreen={"NewQuotes"}
                                                    item={job.client}
                                                    removeClient={true}
                                                    onSelectClient={() => dispatch(updateClient(null))}
                                                />
                                            </BoxCards>
                                        </View>
                                        :
                                        <Button
                                            title={'Add Client'}
                                            onPress={() => { setShowPopup(true); }}
                                            btnstyle={{ backgroundColor: '#F4F5F7' }}
                                            btntextstyle={{ fontSize: height * 0.032, fontWeight: '700', color: colors.primary }}
                                        />
                                    }
                                </View>

                                <View style={{ paddingVertical: 10 }}>
                                    <Text style={{ fontSize: height * 0.022, fontWeight: '600' }}>Job Title</Text>
                                    <InputField
                                        ref={null}
                                        value={job.title}
                                        placeholder={'Title'}
                                        onChangeText={(val) => dispatch(updateTitle(val))}
                                        InputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25 }}
                                    />
                                </View>
                                <View style={{ paddingVertical: 10 }}>
                                    <Text style={styles.text}>Product / Services</Text>
                                    <Button
                                        title={'Add Products'}
                                        btntextstyle={{ fontSize: height * 0.032, fontWeight: '700', color: colors.primary }}
                                        onPress={() => { navigation.navigate('CategoriesScreen', { id: 0, title: "Categories", fromCheckout: true }) }}
                                        btnstyle={{ backgroundColor: '#F4F5F7' }}
                                    />
                                </View>
                            </View>
                            <View style={{ width: '100%' }}>
                                {job.cart != undefined && job.cart?.map((item, index) => (
                                    <View key={item?.id?.toString() + "_" + index.toString()}>
                                        {item?.quantity > 0 &&
                                            <CartRow
                                                item={item}
                                                index={index}
                                                data={job.cart}
                                                toRedux={true}
                                            />}
                                    </View>
                                ))}
                            </View>
                            <View style={styles.container2}>
                                <View style={[styles.row, { paddingTop: 10 }]}>
                                    <Text style={styles.text}>Subtotal</Text>
                                    <Text style={styles.text}>${parseFloat(ctf(subtotal)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                </View>
                                {/* <View style={styles.row}>
                                    <Text style={styles.text}>Current Offer</Text>
                                    <Text style={styles.text}>${parseFloat(ctf(discount)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                </View> */}
                                <View style={[styles.row, { width: '100%' }]}>
                                    <Text style={[styles.text, { width: '65%', paddingBottom: 0 }]}>Optional Discount</Text>
                                    <InputField
                                        InputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25, width: '35%', marginRight: 10, marginTop: 5 }}
                                        returnKeyType="done"
                                        value={String(job.manualDiscount == "0" ? "" : job.manualDiscount)}
                                        onChangeText={(text) => {
                                            if (text < subtotal) {
                                                dispatch(updateManualDiscount(text));
                                            }
                                        }}
                                        placeholder="$0.00"
                                        placeholdercolor='#8A8D9F'
                                        autoCapitalize="none"
                                        blurOnSubmit={true}
                                        ref={null}
                                        editable={subtotal > discount ? true : false}
                                        keyboardType='numeric'
                                    />
                                </View>
                                <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: '#CCC' }]}>
                                    <Text style={[styles.text, { fontWeight: '700' }]}>Total</Text>
                                    <Text style={[styles.text, { fontWeight: '700' }]}>${parseFloat(ctf(subtotal) - ctf(discount) - ctf(job.manualDiscount)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                </View>
                                <View style={[styles.row, { width: '100%' }]}>
                                    <Text style={[styles.text, { width: '65%', paddingBottom: 0 }]}>Required Deposit</Text>
                                    <InputField
                                        InputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25, width: '35%', marginRight: 10 }}
                                        returnKeyType="done"
                                        value={String(job.deposit == "0" ? "" : job.deposit)}
                                        onChangeText={(text) => {
                                            if (text < subtotal) {
                                                dispatch(updateDeposit(text));
                                            }
                                        }}
                                        placeholder="$0.00"
                                        placeholdercolor='#8A8D9F'
                                        autoCapitalize="none"
                                        blurOnSubmit={true}
                                        ref={null}
                                        keyboardType='numeric'
                                    />
                                </View>
                                <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: '#CCC' }]}>
                                    <Text style={[styles.text, { fontWeight: '700' }]}>Balance Due</Text>
                                    <Text style={[styles.text, { fontWeight: '700' }]}>${parseFloat(ctf(subtotal) - ctf(discount) - ctf(job.manualDiscount) - ctf(job.deposit)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                </View>
                            </View>
                        </ScrollView>
                        <Popup title={title} onPress={() => setShowModal(false)} show={showModal} description={message} />
                    </>
                    :
                    <ClientsList
                        title='Create New Client'
                        activescreen={'NewQuotes'}
                        navigation={navigation}
                        onSelectClient={onSelectClient}
                    />
                }
            </View>

        </KeyboardAvoidingView>
    );

}


export default CheckoutScreen

const elevationShadowStyle = (elevation) => {
    return {
        elevation,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0.5 * elevation },
        shadowOpacity: 0.3,
        shadowRadius: 0.8 * elevation,
    };
};

const styles = StyleSheet.create({

    maincontainer: {
        width: '100%',
        flex: 1,
        // paddingBottom: 10,
        backgroundColor: 'white'
    },
    container1: {
        width: '100%',
        flex: 6,
        justifyContent: 'center'
    },
    container2: {
        width: '100%',
        flex: 4,
        marginBottom: height * 0.02
    },
    container3: {
        width: '100%',
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },
    btn: {
        fontSize: 24,
        fontWeight: '700'
    },
    text: {
        fontSize: height * 0.022,
        color: '#333333',
        fontWeight: '500',
        fontWeight: '600',
        paddingBottom: 10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5
    },
})