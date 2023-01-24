import React, { useState } from 'react'
import { View, KeyboardAvoidingView, ScrollView, Keyboard, Text, Dimensions, TouchableOpacity, Pressable } from 'react-native'
import Header from '../Components/Header'
import { Avatar, useTheme } from 'react-native-paper';
import InputField from '../Components/InputField';
import Button from '../Components/Button';
import Card from '../Components/Card';
import Popup from '../Components/Popup';
import { AntDesign, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import CommonServices from '../Services/CommonServices';
import { useDispatch, useSelector } from 'react-redux';
import LocalStorage from '../Utils/LocalStorage';
import { UserLogout } from '../Actions/AuthActions';
import InfoPopup from '../Components/InfoPopup';
import { imgUrl } from '../Utils/Host';
import ImageView from "react-native-image-viewing";
import UserService from '../Services/UserService';
import { userData } from '../Actions/UserActions';
import SnackBar from '../Components/SnackBar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ChangePassScreen = ({ navigation }) => {

    const { colors } = useTheme();
    const user = useSelector(state => state.UserReducer.user);
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [title, setTitle] = useState('Error');
    const [message, setMessage] = useState('sdsd');
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showInfoBox, setShowInfoBox] = useState(false);
    const [phNumber, setphNumber] = useState(`${user?.phonenumber}`);
    const [email, setEmail] = useState(`${user?.email}`);
    const [infoMsg, setInfoMsg] = useState('This is your Parprice assigned number and cannot be changed. All SMS notifications will be sent from this number.');
    const [image, setImage] = useState(null);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [detailsPopup, setDetailsPopup] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);




    const dispatch = useDispatch();

    const logOut = () => {
        dispatch(UserLogout());
        LocalStorage.ClearData();
    }

    const UpdateDetails = () => {

        UserService.UpdateUserInfo(user?.id, email, phNumber, image)
            .then(res => {
                if (res?.success) {
                    let filename = image?.uri?.split('/')?.pop();
                    const newUser = user;
                    newUser.phonenumber = phNumber;
                    newUser.email = email;
                    newUser.avatar = filename;

                    dispatch(userData({
                        user: newUser,
                    }));
                    setMessage(res?.message)
                    setShowSnackbar(true);
                } else {
                    setMessage(res?.message.join(", "))
                    setDetailsPopup(true);
                }
            })
            .catch(err => console.log(err))
    }

    const ChangePassword = () => {
        setLoading(true)
        if (oldPass !== '' && newPass !== '' && confirmPass !== '') {
            if (newPass == confirmPass) {
                CommonServices.changePassword(oldPass, user?.password, confirmPass)
                    .then(res => {
                        if (res.success) {
                            setTitle("Success")
                            setMessage(res.message + ' Please login again.')
                            setShowPopup(true)
                            setConfirmPass('');
                            setOldPass('');
                            setNewPass('');
                        } else {
                            setMessage(res.message)
                            setShowPopup(true)
                        }
                    })
                    .catch(err => console.log(err))
            } else {
                setMessage("Password does not match!")
                setShowPopup(true)
            }
        } else {
            setMessage("All Fields are Required!")
            setShowPopup(true)
        }
        Keyboard.dismiss();
        setLoading(false)
    }

    return (
        <>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
                <Header hideActionBtn={true} onPress={() => navigation.goBack()} title={'Settings'} />
                <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#F9F9FF' }} keyboardShouldPersistTaps='handled'>
                    <View style={{ flex: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Card>
                            <View style={{ alignItems: 'center', justifyContent: "center", marginBottom: 20 }}>
                                <Pressable onPress={() => setShowImagePopup(true)}>
                                    {image ? <Avatar.Image style={{ position: "relative", backgroundColor: colors.secondary }} size={width * 0.28} source={{ uri: image?.uri }} /> : (user?.avatar ? <Avatar.Image style={{ position: "relative", backgroundColor: colors.secondary }} size={width * 0.28} source={{ uri: imgUrl + user.avatar }} /> : <Avatar.Text style={{ backgroundColor: colors.tertiary }} size={width * 0.2} label={`${Array.from(user?.firstname)[0].toUpperCase()}`} />)}
                                </Pressable>
                                <TouchableOpacity style={{ position: 'absolute', right: '35%', bottom: '0%' }} onPress={() => { setInfoMsg('showImage'); setShowInfoBox(true) }}>
                                    <Avatar.Icon size={width * 0.08} icon={() => <AntDesign name="edit" size={width * 0.04} color={`${colors.secondary}`} />} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                <InputField
                                    returnKeyType={'next'}
                                    placeholder={`${user?.parpricenumber ? '(' + user?.parpricenumber?.substring(0, 3) + ') ' + user?.parpricenumber?.substring(3, 6) + "-" + user?.parpricenumber?.substring(6, user?.parpricenumber?.length) : 'Parprice Number'}`}
                                    inputStyle={{ backgroundColor: '#F4F5F7', width: '90%' }}
                                    IconRight={<MaterialIcons name="info-outline" size={24} color={`${colors.primary}`} />}
                                    iconPress={() => { setInfoMsg('This is your Parprice assigned number and cannot be changed. All SMS notifications will be sent from this number.'); setShowInfoBox(true) }}
                                    editable={false}
                                    labelStyle={{ fontSize: width * 0.04, marginLeft: 20 }}
                                    label={"Parprice Number"}
                                />
                                <InputField
                                    value={phNumber}
                                    onChangeText={(text) => setphNumber(text)}
                                    returnKeyType={'next'}
                                    inputStyle={{ backgroundColor: '#F4F5F7', width: '90%' }}
                                    placeholder='Phone Number'
                                    IconRight={<MaterialIcons name="info-outline" size={24} color={`${colors.primary}`} />}
                                    iconPress={() => { setInfoMsg('This is your preferred number to receive phone calls. All incoming calls to your Parprice povided number will automatically be forwarded to this number.'); setShowInfoBox(true) }}
                                    labelStyle={{ fontSize: width * 0.04, marginLeft: 20 }}
                                    label={"Phone Number"}
                                />
                                <InputField
                                    value={email}
                                    onChangeText={(text) => setEmail(text)}
                                    returnKeyType={'next'}
                                    inputStyle={{ backgroundColor: '#F4F5F7', width: '90%' }}
                                    placeholder='Email'
                                    labelStyle={{ fontSize: width * 0.04, marginLeft: 20 }}
                                    label={"Email"}
                                />
                                <View style={{ width: '90%', marginTop: 20, marginBottom: 20 }}>
                                    <Button isLoading={loading} onPress={() => UpdateDetails()} title={'Update Details'} btnstyle={{ backgroundColor: colors.primary, height: 50 }} btntextstyle={{ color: colors.secondary }} />
                                </View>
                                <InputField
                                    label={"Old Password"}
                                    value={oldPass}
                                    onChangeText={(text) => setOldPass(text)}
                                    returnKeyType={'next'}
                                    inputStyle={{ backgroundColor: '#F4F5F7', width: '90%' }}
                                    placeholder='Old Password'
                                    IconRight={<Ionicons name="ios-eye" size={24} color={'grey'} />}
                                    defaultEntry={true}
                                    labelStyle={{ fontSize: width * 0.04, marginLeft: 20 }}
                                />
                                <InputField
                                    label={"New Password"}
                                    value={newPass}
                                    onChangeText={(text) => setNewPass(text)}
                                    returnKeyType={'next'}
                                    inputStyle={{ backgroundColor: '#F4F5F7', width: '90%' }}
                                    placeholder='New Password'
                                    IconRight={<Ionicons name="ios-eye" size={24} color={'grey'} />}
                                    defaultEntry={true}
                                    labelStyle={{ fontSize: width * 0.04, marginLeft: 20 }}
                                />
                                <InputField
                                    label={"Confirm Password"}
                                    value={confirmPass}
                                    onChangeText={(text) => setConfirmPass(text)}
                                    returnKeyType={'done'}
                                    inputStyle={{ backgroundColor: '#F4F5F7', width: '90%' }}
                                    placeholder='Confirm Password'
                                    IconRight={<Ionicons name="ios-eye" size={24} color={'grey'} />}
                                    onSubmitEditing={ChangePassword}
                                    defaultEntry={true}
                                    labelStyle={{ fontSize: width * 0.04, marginLeft: 20 }}
                                />
                            </View>
                            <View style={{ paddingHorizontal: 20, paddingTop: 10, marginTop: 20, alignItems: 'center' }}>
                                <Button isLoading={loading} onPress={() => ChangePassword()} title={'Update Password'} btnstyle={{ backgroundColor: colors.primary, height: 50 }} btntextstyle={{ color: colors.secondary }} />
                            </View>
                        </Card>
                    </View>
                </ScrollView>
                <Popup
                    show={showPopup}
                    title={title}
                    description={message}
                    showBtn={true}
                    onPress={() => { title == 'Success' ? logOut() : setShowPopup(false) }}
                />
            </KeyboardAwareScrollView>
            <InfoPopup
                info={infoMsg}
                show={showInfoBox}
                hideDialog={() => setShowInfoBox(false)}
                setImage={setImage}
            />
            <ImageView
                images={[{ uri: image ? image?.uri : imgUrl + user.avatar }]}
                imageIndex={0}
                visible={showImagePopup}
                onRequestClose={() => setShowImagePopup(false)}
            />
            <Popup
                show={detailsPopup}
                title="Error"
                description={message}
                onPress={() => setDetailsPopup(false)}
            />
            <SnackBar
                show={showSnackbar}
                onDismiss={() => setShowSnackbar(false)}
                message={message}
            />
        </>
    )
}
export default ChangePassScreen