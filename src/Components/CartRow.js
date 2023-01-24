import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { demoImgUrl, imgUrl } from '../Utils/Host';
import { addProductToCart, updateProductQty, removeProductFromCart } from '../Actions/JobActions';
import { useSelector, useDispatch } from 'react-redux';
import InputField from './InputField';
import { ctf } from '../Utils/GlobalFunc';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


const CartRow = ({ item, index = 0, data = [], setData = () => { }, toRedux = false, }) => {
    const cart = useSelector(state => state.JobReducer.job).cart;
    const { colors } = useTheme();
    const dispatch = useDispatch();

    const updateTotal = (quantity, method) => {
        if (!toRedux) {
            data[index].quantity = quantity;
        }
        data[index].index = index;
        if (toRedux && quantity <= 0) {
            dispatch(removeProductFromCart(item));
        } else if (cart.filter(x => x.id == item.id).length > 0) {
            if (method == 'manual') {
                dispatch(updateProductQty({ id: item.id, quantity: parseFloat(quantity) }));
            } else {
                var currentQty = ctf(cart.filter(x => x.id == item.id)[0].quantity);
                dispatch(updateProductQty({ id: item.id, quantity: (method == 'add' ? currentQty + 1 : currentQty - 1) }));
            }
        } else {
            dispatch(addProductToCart(item));
        }
        setData(JSON.parse(JSON.stringify(data)));
    }
    return (
        <>
            {item.thumb &&
                <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: (index === (data.length - 1) && data.length != 1) ? 0 : 1, borderBottomColor: '#707070', paddingHorizontal: 10 }}>
                    <View style={{ flex: 0, paddingVertical: 10, paddingLeft: 0 }}>
                        <Image style={{ width: width * 0.2, borderRadius: 100, aspectRatio: 1 }} resizeMode={"contain"} source={{ uri: (item.demoProd == 0 ? imgUrl : demoImgUrl) + item.thumb }} />
                    </View>
                    <View style={{ flex: 1, padding: 5 }}>
                        <Text style={{ fontWeight: '600', color: colors.tertiary, fontSize: width * 0.036, flexWrap: 'wrap' }}>{item.title}</Text>
                        {item?.description != '' && <Text style={{ fontWeight: '400', color: colors.tertiary, fontSize: width * 0.036, flexWrap: 'wrap' }}>{item.description}</Text>}
                        <Text style={{ fontWeight: '700', color: colors.primary, fontSize: width * 0.036, flexWrap: 'wrap' }}>${item.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <Text style={{ fontSize: width * 0.025, color: colors.tertiary }}>{item?.type != "" && item?.type}</Text> </Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 10, paddingLeft: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ overflow: 'hidden', borderRadius: 10 }}>
                            <TouchableRipple rippleColor={colors.rippleColor}
                                onPress={() => {
                                    updateTotal(item.quantity - 1, 'subtract')
                                }}
                                disabled={item.quantity <= 0 && true}
                                style={styles.btn}>
                                <MaterialCommunityIcons name="minus-thick" size={width * 0.035} color="black" />
                            </TouchableRipple>
                        </View>
                        <InputField
                            InputStyle={{ textAlign: 'center', backgroundColor: '#F4F5F7', borderRadius: 10, margin: 0, padding: 0, width: width * 0.1, marginBottom: 15 }}
                            inputStyle={{ textAlign: 'center', backgroundColor: '#F4F5F7', paddingLeft: 0, paddingRight: 0, height: width * 0.1, width: width * 0.1, }}
                            returnKeyType="done"
                            value={String(item?.quantity)}
                            onChangeText={(text) => {
                                updateTotal(Number(text), 'manual')
                            }}
                            autoCapitalize="none"
                            blurOnSubmit={true}
                            keyboardType='numeric'
                        />
                        <View style={{ overflow: 'hidden', borderRadius: 10, }}>
                            <TouchableRipple rippleColor={colors.rippleColor}
                                onPress={() => {
                                    updateTotal(item.quantity + 1, 'add')
                                }}
                                style={[styles.btn, { backgroundColor: '#e8f7f2' }]}>
                                <MaterialCommunityIcons name="plus-thick" size={width * 0.035} color="black" />
                            </TouchableRipple>
                        </View>
                    </View>
                </View>}
        </>
    )
}
const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#feeae9',
        borderRadius: 10,
        width: width * 0.08,
        height: width * 0.08,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default CartRow