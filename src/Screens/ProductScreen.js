import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView, Dimensions, ScrollView, } from "react-native";
import { useTheme, Divider, ActivityIndicator } from 'react-native-paper';
import Header from '../Components/Header';
import Button from '../Components/Button';
import CartRow from '../Components/CartRow';
import { useDispatch, useSelector } from 'react-redux';
import ProductServices from '../Services/ProductServices';
import EmptyScreen from '../Components/EmptyScreen';
import { Feather } from '@expo/vector-icons';
import Popup from '../Components/Popup';
import { clearCart } from '../Actions/JobActions';


const ProductScreen = ({ route, navigation }) => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);

    const cart = useSelector(state => state.JobReducer.job).cart;
    const user = useSelector(state => state.UserReducer.user);

    const getProductsByCategoryId = async () => {
        await ProductServices.getProductsByCategoryId(route?.params?.id).then(res => {
            if (res.success != undefined && !res.success) {
                setMessage("Coming Soon");
            } else {
                res = res.filter(x => { x.quantity = 0; return x });
                setData(res);
            }
            setLoading(false);
        }).catch(err => console.log(err))
    }

    useEffect(() => {
        setData([]);
        setLoading(true);
        getProductsByCategoryId();
    }, [])

    useEffect(() => {
        let SubTotal = 0;
        let Discount = 0;
        if (cart.length > 0) {
            cart?.map(item => {
                SubTotal += (item.quantity ?? 0) * item.price;
                Discount += (item.quantity ?? 0) * item.discount
            })
        } else {
            data?.map(item => {
                SubTotal += (item.quantity ?? 0) * item.price;
                Discount += (item.quantity ?? 0) * item.discount
            })
        }
        setSubtotal(SubTotal);
        setDiscount(Discount);
    }, [data, cart])

    const goBackToCategoryPage = (id, title) => {
        navigation.navigate("CategoriesScreen", { id: id, title: title, forCheckout: route?.params?.fromCheckout })
    }
    const discardOrder = () => {
        setShowPopup(false);
        dispatch(clearCart());
        navigation.navigate('Home')
    }

    return (
        <>
            <Header navigation={navigation} disabled={subtotal <= 0 && true} showCancelBtn={data.length > 0 ? true : false} onPressActionBtn={() => { navigation.navigate('CheckoutScreen') }} onPress={() => goBackToCategoryPage(route?.params?.revertId, route?.params?.title)} onPressCancelBtn={() => navigation.navigate('CheckoutScreen')} showSaveTitle={`${(!loading && data.length > 0) ? 'Next' : ""}`} title={route?.params?.title} />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#F9F9FF' }}>
                {!loading ?
                    <>
                        {data.length > 0 ?
                            <>
                                <View style={{ flex: 0.004 * height }}>
                                    <ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false} contentContainerStyle={{}}>
                                        <View style={{ paddingHorizontal: 20, paddingVertical: 20, }}>
                                            <View style={[styles.container, { backgroundColor: colors.secondary, }]}>
                                                <Text style={[styles.heading, { color: colors.tertiary }]}>Quantity</Text>
                                                <Divider style={{ backgroundColor: '#707070', height: 1 }} />
                                                <View style={{ minHeight: height * 0.5 }}>
                                                    {data?.map((item, index) => (
                                                        <CartRow
                                                            item={item}
                                                            index={index}
                                                            data={data}
                                                            setData={setData}
                                                            key={item.id.toString() + index}
                                                        />
                                                    ))}
                                                </View>
                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>
                                <View style={[styles.container, { backgroundColor: colors.secondary, flex: 1, marginHorizontal: 20, borderTopWidth: 1, borderTopColor: '#707070' }]}>
                                    <View style={{ backgroundColor: colors.secondary, }}>
                                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingBottom: 10 }}>
                                            <Text style={{ fontSize: 16, color: colors.tertiary, flex: 1 }}>Subtotal</Text>
                                            <Text style={{ fontSize: 16, color: colors.tertiary }}>${Number.parseFloat(subtotal).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingBottom: 10 }}>
                                            <Text style={{ fontSize: 16, color: colors.tertiary, flex: 1 }}>Discount</Text>
                                            <Text style={{ fontSize: 16, color: colors.tertiary }}>${Number.parseFloat(discount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingBottom: 10 }}>
                                            <Text style={{ fontSize: 16, fontWeight: '800', color: colors.tertiary, flex: 1 }}>Total</Text>
                                            <Text style={{ fontSize: 16, fontWeight: '800', color: colors.tertiary }}>${Number.parseFloat(subtotal - discount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 20 }}>
                                        {user.type != 1 &&
                                            <>
                                                <Button
                                                    title="Add More"
                                                    btnstyle={{ backgroundColor: colors.primary, }}
                                                    btntextstyle={{ color: colors.secondary }}
                                                    onPress={() => navigation.goBack()}
                                                />
                                                <View style={{ height: 10 }} />
                                            </>
                                        }
                                    </View>
                                </View>
                            </>
                            :
                            <EmptyScreen
                                icon={<Feather name={'grid'} size={width * 0.1} color={`${colors.primary}`} />}
                                title={message}
                                bodyStyle={{ paddingTop: height * 0.3 }}
                                description={true}
                            />
                        }
                    </>
                    :
                    <ActivityIndicator style={{ marginVertical: 20 }} size={40} color={`${colors.primary}`} />
                }
            </KeyboardAvoidingView>
            <Popup
                title={"Warning"}
                showCancel={true}
                onPress={() => setShowPopup(false)}
                description={'Are you sure you want to cancel?'}
                show={showPopup}
                onPressOk={discardOrder}
            />

        </>
    )
}
const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        padding: 10
    },
    heading: {
        fontWeight: '700',
        fontSize: 20,
        lineHeight: 19,
        padding: 10
    }
})
export default ProductScreen