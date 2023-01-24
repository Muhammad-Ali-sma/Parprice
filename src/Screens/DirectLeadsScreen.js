import { View, Text, KeyboardAvoidingView, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import Header from '../Components/Header'
import ShadeLines from '../Components/ShadeLines'
import ClientsList from '../Components/ClientsList'
import { useDispatch } from 'react-redux'
import { changeBarColor } from '../Actions/UserActions'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const DirectLeadsScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : 'height'} style={{ flex: 1 }}>
                <Header showHeading={true} navigation={navigation} title={'Credits and Packages'} onPress={() => { dispatch(changeBarColor({ barColor: 'black', barContent: 'light-content' })); navigation.goBack() }} blackHead={false} />
                    <ClientsList navigation={navigation} creditsScreen={true} />
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    parent1: {
        backgroundColor: 'black',
        flex: 1,
        paddingTop: 20,
        paddingBottom: 60,

        height: '100%',
        width: '100%'
    },
    parent2: {
        flex: 11,
        marginTop: -25,
        backgroundColor: '#F9F9FF',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: height * 0.175,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 11,
    },

});

export default DirectLeadsScreen