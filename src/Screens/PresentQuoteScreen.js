import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import Header from "../Components/Header";
import { useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { demoImgUrl, imgUrl } from "../Utils/Host";
import Popup from "../Components/Popup";
import JobService from "../Services/JobService";
import { ctf } from "../Utils/GlobalFunc";
import { loadQuoteDetailsObject } from "../Actions/JobActions";
import Loader from "../Components/Loader";
import * as Print from 'expo-print';
import PDF from "../Components/PDF";
import { useIsFocused } from "@react-navigation/native";
import * as Notifications from 'expo-notifications';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const PresentQuoteScreen = ({ navigation, route }) => {

    const { colors } = useTheme();
    const [showPopup, setShowPopup] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const IsFocused = useIsFocused();

    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const user = useSelector((state) => state.UserReducer.user);
    const company = useSelector((state) => state.UserReducer.company);
    const quote = useSelector(state => state.JobReducer.quote);
    const paramsData = route?.params;

    const dispatch = useDispatch();

    const print = async () => {
        var temp = {
            total: ctf(subtotal) - ctf(discount) - ctf(quote?.manualDiscount) - ctf(quote?.deposit),
            discount,
            subtotal
        }
        const html = PDF(temp, quote, user, company);
        await Print.printAsync({
            html,
        });
    }

    const getJob = () => {
        setIsLoaded(false);
        if (paramsData?.id != undefined) {
            JobService.GetQuoteById(paramsData?.id)
                .then(res => {
                    dispatch(loadQuoteDetailsObject({
                        jobId: res.id,
                        title: res.title,
                        client: res.client,
                        manualDiscount: res.manualDiscount,
                        deposit: res.deposit,
                        cart: res.products,
                        startDate: res.startDate,
                        startTime: res.startTime,
                        status: 'job',
                        contract: res?.contract
                    }));
                    setIsLoaded(true);
                })
                .catch(err => console.log(err))
        } else {
            setIsLoaded(true);
        }
    }

    const changeJobStatus = () => {
        let pid = [];
        quote.cart?.forEach(item => pid.push(item.id + ":" + item.quantity));
        JobService.ChangeJobStatus(quote.jobId, pid.toString(), 'quote')
            .then(async res => {
                if (res.success) {
                    dispatch(loadQuoteDetailsObject({ ...quote, status: 'quote' }));
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: `Job #${quote.jobId} converted to quote`,
                            body: '',
                            data: { jobId: quote.jobId },
                            sound: true
                        },
                        trigger: { seconds: 2 },
                    });
                    navigation.setParams({ id: null });
                    navigation.navigate('QuoteScreen');
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if (route.params.showContract) {
            navigation.setParams({ showContract: false });
            navigation.navigate('ContractScreen');
        } else {
            getJob();
        }
    }, [route.params, IsFocused])

    useEffect(() => {
        let SubTotal = 0;
        let Discount = 0;
        quote.cart?.map(item => {
            SubTotal += (item.quantity ?? 0) * item.price;
            Discount += (item.quantity ?? 0) * item.discount
        })
        setSubtotal(SubTotal);
        setDiscount(Discount);
    }, [quote.cart])

    return (
        <>
            <Header onPressActionBtn={() => setShowPopup(true)} showSaveTitle={'Next'} navigation={navigation} onPress={() => navigation.goBack()} showSave={false} title={isLoaded && 'Review Quote'} />
            <View style={styles.mainContainer}>
                {isLoaded ?
                    <>
                        <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10 }}>
                                <Image style={{ width: width * 0.2, height: width * 0.15, }} source={{ uri: imgUrl + company?.thumb }} />
                                <Text style={{ fontWeight: '700', marginLeft: width * 0.1, fontSize: width * 0.043 }}>{company?.name}</Text>
                            </View>
                            <View style={{ padding: 20, backgroundColor: '#F5F3F3' }}>
                                <Text style={{ fontSize: width * 0.034, color: '#8A8D9F', textTransform: 'capitalize', fontWeight: '700' }}>Estimate {quote?.title} #{quote?.jobId}</Text>
                                <Text style={{ fontSize: width * 0.043, color: 'black', marginVertical: 5, textTransform: 'capitalize', fontWeight: '700' }}>{quote?.client?.firstname + " " + quote?.client?.lastname}</Text>
                                <Text style={{ fontSize: width * 0.034, color: '#8A8D9F', marginBottom: 2, textTransform: 'capitalize', }}>{quote?.client?.address}</Text>
                                <Text style={{ fontSize: width * 0.034, color: '#8A8D9F', textTransform: 'capitalize', fontWeight: '700' }}>{'(' + quote?.client?.phonenumber?.substring(0, 3) + ") " + quote?.client?.phonenumber?.substring(3, 6) + "-" + quote?.client?.phonenumber?.substring(6, quote?.client?.phonenumber?.length)}</Text>
                            </View>
                            <View style={[styles.row, { paddingVertical: 10, borderBottomWidth: 1, borderColor: '#e3e3e3' }]}>
                                <View style={{ width: '50%' }}>
                                    <Text style={{ fontSize: width * 0.038, paddingTop: 2, fontWeight: '600', color: '#324253' }}>Sent On</Text>
                                </View>
                                <View style={{ width: '50%', alignItems: 'flex-start', paddingLeft: 20, }}>
                                    <Text style={{ fontSize: width * 0.038, paddingTop: 2, fontWeight: '600', color: '#324253' }}>{quote?.startDate} {quote?.startTime}</Text>
                                </View>
                            </View>
                            {quote?.cart?.map((item, index) => (
                                <View key={"cart_" + index.toString()} style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginHorizontal: 20, alignItems: 'center', }}>
                                    <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingVertical: 10 }}>
                                        <View style={{ width: '70%' }}>
                                            <Text style={{ color: '#324253', fontWeight: '800', fontSize: width * 0.038 }}>{item.title}</Text>
                                            <Text style={{ paddingBottom: 5, color: '#324253', fontWeight: '400', fontSize: width * 0.038 }}>{item?.catname ?? ""}</Text>
                                        </View>
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <Image source={{ uri: (item.demoProd == 0 ? imgUrl : demoImgUrl) + item.thumb }} resizeMode="contain" style={{ aspectRatio: 1, width: width * 0.13, height: width * 0.13, borderRadius: 100, }} />
                                        </View>
                                    </View>
                                    <View style={[styles.cloumn3, { borderRightWidth: 1, borderColor: '#e3e3e3', width: '26%' }]}>
                                        <Text style={styles.text}>QTY</Text>
                                        <Text style={[styles.text, { fontSize: width * 0.038 }]}>{item.quantity}</Text>
                                    </View>
                                    <View style={[styles.cloumn3, { paddingLeft: width * 0.04, borderRightWidth: 1, borderColor: '#e3e3e3' }]}>
                                        <Text style={styles.text}>Unit Price</Text>
                                        <Text style={[styles.text, { fontSize: width * 0.038 }]}>${ctf(item.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                    </View>
                                    <View style={[styles.cloumn3]}>
                                        <Text style={[styles.text]}>Total</Text>
                                        <Text style={[styles.text, { fontSize: width * 0.038 }]}>${ctf(item.price * item.quantity).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                    </View>
                                </View>
                            ))}
                            <View style={{ marginHorizontal: 20 }}>
                                <View style={[styles.total, { borderTopWidth: 4, borderBottomWidth: 1, borderColor: '#e3e3e3', paddingTop: 20 }]}>
                                    <Text style={{ fontSize: width * 0.038, color: '#324253', }}>Subtotal</Text>
                                    <Text style={{ fontSize: width * 0.038, color: '#324253', }}>${ctf(subtotal).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                </View>
                                {/* <View style={[styles.total, { paddingBottom: 10 }]}>
                                    <Text style={{ fontSize: width * 0.038, color: '#324253', }}>Current Offer</Text>
                                    <Text style={{ fontSize: width * 0.038, color: '#324253', }}>${discount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                </View> */}
                                <View style={[styles.total, { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e3e3e3' }]}>
                                    <Text style={{ fontSize: width * 0.038, color: '#324253', }}>Discount</Text>
                                    <Text style={{ fontSize: width * 0.038, color: '#324253', }}>${ctf(quote?.manualDiscount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                </View>
                                <View style={[styles.total, { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e3e3e3', }]}>
                                    <Text style={{ fontSize: width * 0.038, color: '#324253', }}>Total</Text>
                                    <Text style={{ fontSize: width * 0.038, color: '#324253', }}>${ctf(subtotal - discount - quote?.manualDiscount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                </View>
                                <View style={[styles.total, { paddingBottom: 10 }]}>
                                    <Text style={{ fontSize: width * 0.038, color: '#324253', }}>Required Deposit</Text>
                                    <Text style={{ fontSize: width * 0.038, color: '#324253', }}>${ctf(quote?.deposit).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                </View>
                                <View style={[styles.total, { borderTopWidth: 4, borderColor: '#e3e3e3', marginBottom: 20 }]}>
                                    <Text style={{ fontSize: width * 0.038, color: '#324253', fontWeight: '700' }}>Balance Due</Text>
                                    <Text style={{ fontSize: width * 0.038, color: '#324253', fontWeight: '700' }}>${parseFloat(ctf(subtotal) - ctf(discount) - ctf(quote?.manualDiscount) - ctf(quote?.deposit)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                </View>
                            </View>
                        </ScrollView>
                        <Popup
                            handleOnRow1Click={() => { navigation.navigate('ClientContactInfoScreen', { data: quote.client, status: "Jobs" }); setShowPopup(false) }}
                            show={showPopup}
                            handleOnRow4Click={() => print()}
                            handleOnRow2Click={() => { navigation.navigate('SmsQuote'); setShowPopup(false) }}
                            handleOnRow5Click={() => { navigation.navigate('EmailQuote', ctf(subtotal) - ctf(discount) - ctf(quote?.manualDiscount) - ctf(quote?.deposit)); setShowPopup(false) }}
                            handleOnRow6Click={() => { navigation.navigate('ContractScreen'); setShowPopup(false) }}
                            clientDetails={true}
                            onPress={() => setShowPopup(false)}
                            handleOnRow7Click={() => { navigation.navigate('ViewQuoteScreen'); setShowPopup(false) }}
                            handleOnRow8Click={() => { changeJobStatus(); setShowPopup(false) }}
                        />
                    </>
                    :
                    <Loader />
                }


            </View>
        </>
    );
}
export default PresentQuoteScreen

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 10,
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    cloumn3: {
        width: '36%',
        minHeight: height * 0.07,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e3e3e3',
        marginTop: height * 0.02,
        alignItems: 'flex-end'
    },
    total: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 7,
    },
    text: {
        fontSize: width * 0.030,
        paddingVertical: 7,
        color: '#324253'
    },
})