import React, { useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Entypo } from '@expo/vector-icons';
import Popup from './Popup';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const CustomImagePicker = ({ image, setImage }) => {
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
            setImage(result);
        }

    }
    
    return (
        <>
        <View style={{ flex: 1, marginTop: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Pressable onPress={() => choosePhoto()} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                    <Entypo name="upload" size={height / 20} color="black" />
                    <Text style={styles.label}>Choose Photo</Text>
                </Pressable>
                <Pressable onPress={() => takePhoto()} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                    <Entypo name="camera" size={height / 20} color="black" />
                    <Text style={styles.label}>Take Photo</Text>
                </Pressable>
            </View>
            {image &&
                <View style={{ marginLeft: 10, marginTop: 20, flexDirection: 'column' }}>
                    <Image source={{ uri: image?.uri }} style={styles.imageStyle} />
                </View>
            }
        </View>
        <Popup show={showPopup} onPress={()=>setShowPopup(false)} title={'Error'} description={message}/>
        </>
    );

}
const styles = StyleSheet.create({
    label: {
        textAlign: 'left',
        fontSize: width * 0.04,
        color: '#707375',
        fontWeight: '600',
        marginLeft: 10
    },
    imageStyle: {
        width: (width > 767 ? width * 0.15 : width * 0.19),
        height: (width > 767 ? width * 0.15 : width * 0.19),
        borderRadius: 100
        
    }
})

export default CustomImagePicker