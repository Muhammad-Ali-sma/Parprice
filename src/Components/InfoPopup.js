import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Dialog, Paragraph } from 'react-native-paper'
import Popup from './Popup';
import * as ImagePicker from 'expo-image-picker';

const InfoPopup = ({ show, hideDialog, info, setImage }) => {

    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const takePhoto = async () => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            setMessage("Permission to access camera roll is required!");
            setShowPopup(true);
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,

        });

        if (!result.cancelled) {
            hideDialog();
            setImage(result);
        }
    };
    const choosePhoto = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            setMessage("Permission to access media is required!");
            setShowPopup(true);
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,

        });

        if (!result.cancelled) {
            hideDialog();
            setImage(result);
        }

    }

    return (
        <>
            <Dialog visible={show} onDismiss={hideDialog}>
                <Dialog.Content>
                    {info === 'showImage' ?
                        <View style={styles.cemaraImageContainer}>
                            <TouchableOpacity onPress={() => takePhoto()} style={{ alignItems: "center", paddingLeft: 35 }}>
                                <Image resizeMode='contain' style={{ height: 36, width: 36, }} source={require('../../assets/images/photo_camera_black.png')} />
                                <Text style={styles.takePhotoText}>Take Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => choosePhoto()} style={{ alignItems: 'center', paddingRight: 35 }}>
                                <Image resizeMode='contain' style={{ height: 36, width: 36, }} source={require('../../assets/images/Gallary.png')} />
                                <Text style={styles.takePhotoText}>From Gallary</Text>
                            </TouchableOpacity>
                        </View> :
                        <Paragraph>{info}</Paragraph>}
                </Dialog.Content>
            </Dialog>
            <Popup show={showPopup} onPress={() => setShowPopup(false)} title={'Error'} description={message} />
        </>
    )
}

const styles = StyleSheet.create({
    addPhotoText: {
        color: '#000000',
        fontSize: 24,
        textAlign: 'center',
        fontWeight: '500'
    },
    cemaraImageContainer: {
        flexDirection: 'row',
        padding: 15, justifyContent: 'space-between',
        paddingTop: 20,
    },
    takePhotoText: {
        textAlign: 'center',
        marginTop: 4,
        color: '#7a7a7a',
        fontSize: 10
    },
});

export default InfoPopup;