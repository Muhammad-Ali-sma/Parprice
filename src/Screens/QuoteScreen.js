import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, Dimensions, Pressable, ImageBackground } from 'react-native';
import Header from "../Components/Header";
import { TouchableRipple, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { demoImgUrl, imgUrl } from "../Utils/Host";
import Button from "../Components/Button";
import Popup from "../Components/Popup";
import JobService from "../Services/JobService";
import { loadJobDetailsObject, loadQuoteDetailsObject } from "../Actions/JobActions";
import moment from "moment";
import Notes from "../Components/Notes";
import { Feather } from "@expo/vector-icons";
import { ctf } from "../Utils/GlobalFunc";
import Loader from "../Components/Loader";
import * as Notifications from 'expo-notifications';
import SnackBar from "../Components/SnackBar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const QuoteScreen = ({ navigation, route }) => {

    const { colors } = useTheme();
    const [showPopup, setShowPopup] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [pill, setPill] = useState('Line Items');
    const [isLoaded, setIsLoaded] = useState(false);
    const [showSnack, setShowSnack] = useState(false);


    const quote = useSelector(state => state.JobReducer.quote);
    const dispatch = useDispatch();
    const paramsData = route?.params;

    const changeJobStatus = () => {
        let pid = [];
        quote.cart?.forEach(item => pid.push(item.id + ":" + item.quantity));
        JobService.ChangeJobStatus(quote.jobId, pid.toString(), 'job')
            .then(async res => {
                if (res.success) {
                    dispatch(loadQuoteDetailsObject({ ...quote, status: 'job' }));
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: `Quote #${quote.jobId} converted to job`,
                            body: '',
                            data: { jobId: quote.jobId },
                            sound: true
                        },
                        trigger: { seconds: 2 },
                    });
                    setShowPopup('2');
                }
            })
            .catch(err => console.log(err))
    }

    const handleOnModalBtnPress = () => {
        navigation.navigate('PresentQuoteScreen', { fromQuote: true });
        setShowPopup(false);
    }

    const handleOnEditQuotePress = () => {
        dispatch(loadJobDetailsObject(quote));
        navigation.navigate('CheckoutScreen', { fromQuote: true });
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
                        sign: res?.sign,
                        approved_at: res?.approved_at,
                        status: 'quote',
                    }));
                    setIsLoaded(true);
                })
                .catch(err => console.log(err))
        } else {
            setIsLoaded(true);
        }

    }

    useEffect(() => {
        setPill('Line Items');
        getJob();
    }, [route.params]);

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
            {isLoaded ?
                <KeyboardAwareScrollView keyboardShouldPersistTaps="always" style={{ backgroundColor: colors.secondary }}>
                    <Header navigation={navigation} onPress={() => navigation.goBack()} showSave={false} title={`Quote ${isLoaded ? (quote?.client?.firstname + " " + quote?.client?.lastname + " " + " #" + quote.jobId) : ""}`} />
                    <View style={styles.mainContainer}>
                        <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                            <View style={styles.row}>
                                <Text style={{ fontSize: width * 0.035, fontWeight: '700' }}>${parseFloat(ctf(subtotal) - ctf(discount) - ctf(quote?.manualDiscount)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                <TouchableRipple rippleColor={colors.rippleColor} onPress={() => handleOnEditQuotePress()} style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                                    <>
                                        <Feather name="edit" size={width * 0.035} style={{ marginRight: width * 0.02 }} color={`${colors.primary}`} />
                                        <Text style={{ color: colors.primary }}>Edit Quote</Text>
                                    </>
                                </TouchableRipple>
                            </View>
                            <View style={[styles.row, { paddingVertical: 10 }]}>
                                <View style={{ width: '50%' }}>
                                    <Text style={{ fontSize: width * 0.03, paddingTop: 2, color: '#8A8D9F' }}>Created</Text>
                                    <Text style={{ fontSize: width * 0.03, paddingTop: 2, fontWeight: '500', fontWeight: '600', color: '#8A8D9F' }}>{moment(Date.now()).format('l')}</Text>
                                </View>
                                <View style={{ width: '50%', alignItems: 'flex-start', paddingLeft: 20, borderLeftWidth: 1, borderLeftColor: '#CCC' }}>
                                    <Text style={{ fontSize: width * 0.03, paddingTop: 2, color: '#8A8D9F' }}>Status</Text>
                                    <Text style={{ fontSize: width * 0.03, paddingTop: 2, fontWeight: '500', fontWeight: '600', color: '#8A8D9F' }}>Quote</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginVertical: 10 }}>
                                <View style={{ width: '45%', overflow: 'hidden' }}>
                                    <Button
                                        title={'Review And Send'}
                                        onPress={() => { handleOnModalBtnPress() }}
                                        btnstyle={{ backgroundColor: colors.primary, height: height * 0.05 }}
                                        btntextstyle={{ fontWeight: '700', color: colors.secondary, fontSize: width * 0.034 }}
                                    />
                                </View>
                                <View style={{ width: '45%', overflow: 'hidden' }}>

                                    <Button
                                        title={'... More Actions'}
                                        onPress={() => { setShowPopup('1') }}
                                        btnstyle={{ borderWidth: 1, borderColor: '#ccc', height: height * 0.05 }}
                                        btntextstyle={{ fontWeight: '700', fontSize: width * 0.034 }}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>

                                <TouchableRipple rippleColor={colors.rippleColor} onPress={() => setPill('Line Items')} style={{ borderTopWidth: 1, borderBottomWidth: pill === 'Line Items' ? 0 : 1, borderColor: '#8A8D9F', borderRightWidth: 1, borderTopColor: pill === 'Line Items' ? colors.primary : '#8A8D9F', width: width * 0.35, padding: 10 }}>
                                    <Text style={{ fontSize: width * 0.034, textAlign: 'center', color: pill === 'Line Items' ? colors.primary : 'black', fontWeight: '700' }}>Line Items</Text>
                                </TouchableRipple>
                                <TouchableRipple rippleColor={colors.rippleColor} onPress={() => setPill('Customer')} style={{ borderTopWidth: 1, borderBottomWidth: pill === 'Customer' ? 0 : 1, borderColor: '#8A8D9F', borderTopColor: pill === 'Customer' ? colors.primary : '#8A8D9F', borderRightWidth: 1, width: width * 0.35, padding: 10 }}>
                                    <Text style={{ fontSize: width * 0.034, textAlign: 'center', color: pill === 'Customer' ? colors.primary : 'black', fontWeight: '700' }}>Customer</Text>
                                </TouchableRipple>
                                <TouchableRipple rippleColor={colors.rippleColor} onPress={() => setPill('Notes')} style={{ borderTopWidth: 1, borderBottomWidth: pill === 'Notes' ? 0 : 1, borderColor: '#8A8D9F', borderTopColor: pill === 'Notes' ? colors.primary : '#8A8D9F', width: width * 0.35, padding: 10 }}>
                                    <Text style={{ fontSize: width * 0.034, textAlign: 'center', color: pill === 'Notes' ? colors.primary : 'black', fontWeight: '700' }}>Notes</Text>
                                </TouchableRipple>

                            </View>
                            {pill === 'Line Items' &&
                                <>
                                    <View style={{ paddingVertical: 10, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#e3e3e3', }}>
                                        <Text style={{ fontSize: width * 0.043, fontWeight: '700' }}>Product / Service</Text>
                                    </View>
                                    {quote?.cart?.map((item, index) => (
                                        <View key={"cart_" + index.toString()} style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20 }}>
                                            <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingVertical: 10 }}>
                                                <View style={{ width: '70%' }}>
                                                    <Text numberOfLines={1} style={{ fontWeight: '500', color: '#324253', fontWeight: '800', fontSize: width * 0.038 }}>{item.title}</Text>
                                                    {item.catname === "Miscellaneous" ? <Text numberOfLines={1} style={{ color: '#324253', fontSize: width * 0.038 }}>{item?.description ?? ""}</Text> : <Text numberOfLines={1} style={{ color: '#324253', fontSize: width * 0.038 }}>{item?.catname ?? ""}</Text>}
                                                </View>
                                                <View style={{ width: '30%', alignItems: 'flex-end' }}>
                                                    <Image source={{ uri: (item.demoProd == 0 ? imgUrl : demoImgUrl) + item.thumb }} resizeMode="contain" style={{ aspectRatio: 1, width: width * 0.14, height: width * 0.14, borderRadius: 100 }} />
                                                </View>
                                            </View>
                                            <View style={[styles.cloumn3, { borderRightWidth: 1, width: '26%' }]}>
                                                <Text style={styles.text}>QTY</Text>
                                                <Text style={[styles.text, { fontSize: width * 0.038 }]}>{item.quantity}</Text>
                                            </View>
                                            <View style={[styles.cloumn3, { paddingLeft: width * 0.04, borderRightWidth: 1 }]}>
                                                <Text style={styles.text}>Unit Price</Text>
                                                <Text style={[styles.text, { fontSize: width * 0.038 }]}>${ctf(item.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                            </View>
                                            <View style={[styles.cloumn3]}>
                                                <Text style={[styles.text,]}>Total</Text>
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
                                        <View style={[styles.total, { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e3e3e3', }]}>
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
                                        <View style={[styles.total, { borderTopWidth: 4, borderColor: '#e3e3e3' }]}>
                                            <Text style={{ fontSize: width * 0.038, color: '#324253', fontWeight: '700' }}>Balance Due</Text>
                                            <Text style={{ fontSize: width * 0.038, color: '#324253', fontWeight: '700' }}>${parseFloat(ctf(subtotal) - ctf(discount) - ctf(quote?.manualDiscount) - ctf(quote?.deposit)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                        </View>
                                        {quote?.approved_at &&
                                            <View style={{ marginBottom: 10 }}>
                                                <Text style={{ fontSize: width * 0.038, color: '#324253', paddingBottom: 5 }}>This quote is valid for the next 30 days, after which values may be subject to change.</Text>
                                                <ImageBackground source={{ uri: quote?.sign }} style={{ width: width * 0.5, height: width * 0.2, }} resizeMode='contain'>
                                                    <Text style={{ fontSize: width * 0.038, color: '#324253', fontWeight: '700' }}>Approved By:</Text>

                                                </ImageBackground>
                                                <Text style={{ fontSize: width * 0.038, color: '#324253' }}>{quote?.approved_at}</Text>
                                            </View>
                                        }
                                    </View>
                                </>
                            }
                            {pill === 'Customer' &&
                                <View style={{ paddingHorizontal: 20 }}>
                                    <Notes type="Customer" />
                                </View>
                            }
                            {pill === 'Notes' &&
                                <View style={{ paddingHorizontal: 20 }}>
                                    <Notes />
                                </View>
                            }
                        </ScrollView>
                        <Popup
                            show={showPopup === '1' ? true : false}
                            handleOnRow1Click={() => { navigation.navigate('ClientContactInfoScreen', { data: quote.client, status: "Quotes" }); setShowPopup('') }}
                            handleOnRow3Click={() => { quote?.status == 'quote' ? changeJobStatus() : setShowSnack(true); setShowPopup('') }}
                            clientDetails={true}
                            onPress={() => setShowPopup('')}
                        />
                    </View>
                    <Popup
                        title={"Congratulations"}
                        showCancel={true}
                        onPress={() => { navigation.navigate('PresentQuoteScreen', { showContract: false }); setShowPopup('') }}
                        description={'Do you want to create sales contracts to sign?'}
                        show={showPopup === '2' ? true : false}
                        onPressOk={() => { navigation.navigate('PresentQuoteScreen', { showContract: true }); setShowPopup('') }}
                    />
                    <SnackBar
                        show={showSnack}
                        onDismiss={() => setShowSnack(false)}
                        message='Already converted to job!'
                    />
                </KeyboardAwareScrollView>
                :
                <Loader />
            }
        </>
    );
}
export default QuoteScreen

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
        borderColor: "#e3e3e3",
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