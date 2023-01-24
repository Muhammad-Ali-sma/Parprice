import React, { useState } from 'react'
import { View, StyleSheet, Text, Dimensions, Platform, } from 'react-native'
import Button from './Button'
import { useTheme, Portal, Dialog, Paragraph, TouchableRipple } from 'react-native-paper';
import { AntDesign, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import * as Update from 'expo-updates';
import InputField from './InputField';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JobService from '../Services/JobService';
import { loadQuoteDetailsObject } from '../Actions/JobActions';
import UserService from '../Services/UserService';
import Rating from './Rating';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Popup = ({ updateBtn, show, showCancel = false, onPress, description, connectBtn, title, clientDetails, onPressOk, continueBtn, contractPopup, handleOnRow3Click, handleOnRow5Click, handleOnRow2Click, handleOnRow1Click, userId, handleOnRow4Click, handleOnRow6Click, handleOnRow7Click, handleOnRow8Click, showForm, reviewPopup }) => {

    const user = useSelector((state) => state.UserReducer.user);
    const { colors } = useTheme();
    const [name, setName] = useState('');
    const [property, setProperty] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(1);
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const quote = useSelector(state => state.JobReducer.quote);
    const dispatch = useDispatch();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [clientName, setClientName] = useState('');

    const handleOnUpdateBtnPress = () => {
        JobService.UpdateJobCustomer(quote?.client?.id, quote?.jobId, name, jobTitle, property)
            .then(res => {
                if (res?.success) {
                    var fullname = name.split(" ")
                    dispatch(loadQuoteDetailsObject({ ...quote, title: jobTitle, client: { firstname: fullname[0], lastname: fullname[1], address: property } }));
                    onPress(false)
                }
            })
            .catch(err => console.log(err))
    }
    const createReview = () => {
        setIsSubmitted(true);
        if (review && clientName) {
            UserService.CreateReview(userId, review, rating, clientName)
                .then(res => {
                    if (res.success) {
                        setClientName('');
                        setRating('');
                        setReview('');
                        onPress()
                        setIsSubmitted(false);
                    }
                })
                .catch(err => setIsSubmitted(false))
        }
    }

    useEffect(() => {
        setName(quote?.client?.firstname + " " + quote?.client?.lastname);
        setJobTitle(quote?.title);
        setProperty(quote?.client?.address);
    }, [])

    return (
        <>
            {show &&
                <View style={styles.mainContainer}>
                    <Portal>
                        <Dialog visible={show} onDismiss={onPress} style={[clientDetails && { marginTop: height * 0.80, width: '100%', alignItems: 'center', marginHorizontal: 0, marginBottom: 0, }]}>
                            {clientDetails ?
                                <View style={{ width: '100%' }}>
                                    {handleOnRow1Click && <TouchableRipple rippleColor={colors.rippleColor} onPress={handleOnRow1Click} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginVertical: 10, padding: 2, paddingHorizontal: 10, marginBottom: 0 }}>
                                        <>
                                            <Feather name="save" size={height * 0.03} color={colors.primary} />
                                            <Text style={{ fontWeight: '500', fontWeight: '600', fontSize: height * 0.022, marginLeft: 15, }}>Save and Close</Text>
                                        </>
                                    </TouchableRipple>}
                                    {(user?.parpricenumber != "" && handleOnRow2Click) && <TouchableRipple rippleColor={colors.rippleColor} onPress={handleOnRow2Click} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginVertical: 10, padding: 2, paddingHorizontal: 10, marginBottom: 0 }}>
                                        <>
                                            <FontAwesome5 name="slack-hash" size={height * 0.03} color={colors.primary} />
                                            <Text style={{ fontWeight: '500', fontWeight: '600', fontSize: height * 0.022, marginLeft: 19 }}>Send by Text Message</Text>
                                        </>
                                    </TouchableRipple>}
                                    {handleOnRow7Click && <TouchableRipple rippleColor={colors.rippleColor} onPress={handleOnRow7Click} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginVertical: 10, padding: 2, paddingHorizontal: 10, marginBottom: 0 }}>
                                        <>
                                            <MaterialIcons name="grid-view" size={height * 0.03} color={colors.primary} />
                                            <Text style={{ fontWeight: '500', fontWeight: '600', fontSize: height * 0.022, marginLeft: 19 }}>View Quote</Text>
                                        </>
                                    </TouchableRipple>}
                                    {handleOnRow5Click && <TouchableRipple rippleColor={colors.rippleColor} onPress={handleOnRow5Click} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginVertical: 10, padding: 2, paddingHorizontal: 10, marginBottom: 0 }}>
                                        <>
                                            <FontAwesome size={height * 0.03} color={colors.primary} name="envelope-o" />
                                            <Text style={{ fontWeight: '500', fontWeight: '600', fontSize: height * 0.022, marginLeft: 15 }}>Send by Email</Text>
                                        </>
                                    </TouchableRipple>}
                                    {handleOnRow3Click && <TouchableRipple rippleColor={colors.rippleColor} onPress={handleOnRow3Click} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, padding: 2, paddingHorizontal: 10, marginBottom: 0 }}>
                                        <>
                                            <AntDesign name="tago" size={height * 0.03} color={colors.primary} />
                                            <Text style={{ fontWeight: '500', fontWeight: '600', fontSize: height * 0.022, marginLeft: 15 }}>Convert to Job</Text>
                                        </>
                                    </TouchableRipple>}
                                    {(handleOnRow6Click && quote?.status === 'job') && <TouchableRipple rippleColor={colors.rippleColor} onPress={handleOnRow6Click} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, padding: 2, paddingHorizontal: 10, marginBottom: 0 }}>
                                        <>
                                            <Ionicons name="contract" size={height * 0.03} color={colors.primary} />
                                            <Text style={{ fontWeight: '500', fontWeight: '600', fontSize: height * 0.022, marginLeft: 15 }}>View Contract</Text>
                                        </>
                                    </TouchableRipple>}
                                    {(handleOnRow8Click && quote?.status === 'job' && !quote?.contractSigned) && <TouchableRipple rippleColor={colors.rippleColor} onPress={handleOnRow8Click} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, padding: 2, paddingHorizontal: 10, marginBottom: 0 }}>
                                        <>
                                            <SimpleLineIcons name="refresh" size={height * 0.03} color={colors.primary} />
                                            <Text style={{ fontWeight: '500', fontWeight: '600', fontSize: height * 0.022, marginLeft: 15 }}>Convert Back To Quote</Text>
                                        </>
                                    </TouchableRipple>}
                                    {handleOnRow4Click && <TouchableRipple rippleColor={colors.rippleColor} onPress={handleOnRow4Click} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, padding: 2, paddingHorizontal: 10, marginBottom: 170 }}>
                                        <>
                                            <AntDesign name="tago" size={height * 0.03} color={colors.primary} />
                                            <Text style={{ fontWeight: '500', fontWeight: '600', fontSize: height * 0.022, marginLeft: 15 }}>Print PDF</Text>
                                        </>
                                    </TouchableRipple>}

                                    <View style={{ marginBottom: Platform.OS === 'ios' ? handleOnRow5Click ? height * 0.18 : 60 : 30 }} />
                                </View>
                                :
                                showForm ?
                                    <View style={{ padding: 5, paddingHorizontal: 20 }}>
                                        <InputField
                                            inputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25 }}
                                            returnKeyType="next"
                                            label={"Name"}
                                            value={name}
                                            onChangeText={(text) => {
                                                setName(text);
                                            }}
                                            placeholder="Name"
                                            placeholdercolor='#8A8D9F'
                                            autoCapitalize="none"
                                            blurOnSubmit={false}
                                            ref={null}
                                        />
                                        <InputField
                                            inputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25 }}
                                            returnKeyType="next"
                                            label={"Property"}
                                            value={property}
                                            onChangeText={(text) => {
                                                setProperty(text);
                                            }}
                                            placeholder="Property"
                                            placeholdercolor='#8A8D9F'
                                            autoCapitalize="none"
                                            blurOnSubmit={false}
                                            ref={null}
                                        />
                                        <InputField
                                            inputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25 }}
                                            returnKeyType="done"
                                            label={"Job Title"}
                                            value={jobTitle}
                                            onChangeText={(text) => {
                                                setJobTitle(text);
                                            }}
                                            placeholder="Job Title"
                                            placeholdercolor='#8A8D9F'
                                            autoCapitalize="none"
                                            blurOnSubmit={false}
                                            ref={null}
                                        />
                                        <Button
                                            title={'Update'}
                                            btnstyle={{ backgroundColor: colors.primary, marginVertical: 10, height: 35 }}
                                            btntextstyle={{ fontWeight: '700', color: colors.secondary }}
                                            onPress={() => handleOnUpdateBtnPress()}
                                        />
                                    </View>
                                    :
                                    reviewPopup ?
                                        <>
                                            <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
                                                <View style={{ padding: 20, backgroundColor: '#F9F9FF' }}>
                                                    <Text style={{ fontWeight: '700', textAlign: 'center', color: colors.tertiary, fontSize: width * 0.05, marginTop: 10, marginBottom: 20 }}>Please rate the quality of service you have received.</Text>
                                                    <InputField
                                                        inputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25, height: 40, padding: 10 }}
                                                        returnKeyType="done"
                                                        required={true}
                                                        value={clientName}
                                                        onChangeText={(text) => {
                                                            setClientName(text);
                                                        }}
                                                        isDirty={isSubmitted}
                                                        placeholder="Your Name"
                                                        placeholdercolor='#8A8D9F'
                                                        autoCapitalize="none"
                                                        blurOnSubmit={false}
                                                        ref={null}
                                                        showLabel={false}
                                                        elevationShadowStyle={elevationShadowStyle(5)}
                                                        label='Name'
                                                    />
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                                                        <Rating
                                                            count={5}
                                                            defaultRating={rating}
                                                            size={25}
                                                            isDisabled={false}
                                                            onFinishRating={(e) => setRating(e)}
                                                        />
                                                    </View>
                                                    <Text style={{ textAlign: 'center', fontSize: width * 0.035, color: '#8A8D9F', marginTop: height * 0.02 }}>Your comments and suggestions help us improve our service  we provide.</Text>
                                                    <InputField
                                                        inputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25, height: 100, padding: 10 }}
                                                        returnKeyType="done"
                                                        required={true}
                                                        value={review}
                                                        onChangeText={(text) => {
                                                            setReview(text);
                                                        }}
                                                        isDirty={isSubmitted}
                                                        placeholder="Enter Your comments here"
                                                        placeholdercolor='#8A8D9F'
                                                        autoCapitalize="none"
                                                        blurOnSubmit={false}
                                                        ref={null}
                                                        multiline={true}
                                                        maxLength={1000}
                                                        label='Review'
                                                        showLabel={false}
                                                        elevationShadowStyle={elevationShadowStyle(5)}
                                                    />
                                                    <View style={{ marginVertical: 20 }}>
                                                        <Button title='Submit' btntextstyle={{ color: colors.secondary }} btnstyle={{ height: 40, backgroundColor: colors.primary, }} onPress={() => createReview()} />
                                                    </View>
                                                </View>
                                            </KeyboardAwareScrollView>

                                        </> :
                                        contractPopup ?
                                            <>
                                                <View style={[styles.child1, { backgroundColor: 'green' }]}>
                                                    <Dialog.Title style={[styles.child1Text, { color: colors.secondary }]}>Signing Completed</Dialog.Title>
                                                </View>
                                                <Dialog.Content style={[styles.child2, { backgroundColor: colors.secondary }]}>
                                                    <Paragraph style={[styles.child2Text, { color: colors.tertiary }]}>Thank You! A copy of your paper work has been emailed to you.</Paragraph>
                                                </Dialog.Content>
                                                <Dialog.Actions style={{ alignItems: 'center', width: '100%', justifyContent: 'space-evenly', flexDirection: 'row' }}>
                                                    <View style={{ width: '45%', }}>
                                                        <Button title={'Close'} btntextstyle={{ color: colors.secondary }} btnstyle={{ height: 40, backgroundColor: 'green' }} onPress={onPress} />
                                                    </View>
                                                </Dialog.Actions>
                                            </>
                                            :
                                            <>
                                                <View style={[styles.child1, { backgroundColor: colors.primary }]}>
                                                    <Dialog.Title style={[styles.child1Text, { color: colors.secondary }]}>{title}</Dialog.Title>
                                                </View>
                                                <Dialog.Content style={[styles.child2, { backgroundColor: colors.secondary }]}>
                                                    <Paragraph style={[styles.child2Text, { color: colors.tertiary }]}>{description}</Paragraph>
                                                </Dialog.Content>
                                                <Dialog.Actions style={{ alignItems: 'center', width: '100%', justifyContent: 'space-evenly', flexDirection: 'row' }}>
                                                    {updateBtn === true ?
                                                        <View style={{ width: '50%' }}>
                                                            {connectBtn ? <Button title='Try Again' btntextstyle={{ color: colors.secondary }} btnstyle={{ height: 40, backgroundColor: colors.primary }} onPress={onPress} />
                                                                :
                                                                <Button title='Update' btntextstyle={{ color: colors.secondary }} btnstyle={{ height: 40, backgroundColor: colors.primary }} onPress={() => Update.reloadAsync()} />}
                                                        </View>
                                                        :
                                                        <>
                                                            {showCancel && <View style={{ width: '45%' }}>
                                                                <Button title='Cancel' btntextstyle={{ color: colors.secondary }} btnstyle={{ height: 40, backgroundColor: 'black' }} onPress={onPress} />
                                                            </View>
                                                            }
                                                            <View style={{ width: '45%', }}>
                                                                <Button title={showCancel ? continueBtn ? 'Continue' : 'Yes' : 'Ok'} btntextstyle={{ color: colors.secondary }} btnstyle={{ height: 40, backgroundColor: colors.primary, }} onPress={onPressOk || onPress} />
                                                            </View>
                                                        </>
                                                    }
                                                </Dialog.Actions>
                                            </>}
                        </Dialog>
                    </Portal>
                </View>
            }
        </>
    )
}

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
    mainContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: "center",
    },
    child1: {
        width: '100%',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5
    },
    child1Text: {
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 23,
        textAlign: 'center'
    },
    child2: {
        padding: 20,
        justifyContent: 'space-around',
    },
    child2Text: {
        textAlign: 'center',
        lineHeight: 18,
        fontSize: 16,
        fontWeight: '400',
    },
    button: {
        height: 41,
        width: '50%',
        alignSelf: 'center'
    }
})
export default Popup