import React from 'react'
import Header from '../Components/Header'
import { View, StyleSheet,  KeyboardAvoidingView,  Dimensions, } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { handleActive } from '../Actions/UserActions';
import ClientsList from '../Components/ClientsList';
import ShadeLines from '../Components/ShadeLines';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ClientsScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.UserReducer.user)

    const onBack = () => {
        dispatch(handleActive('Home'));
       navigation.goBack()
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'height' : 'height'} style={{ flex: 1 }}>
            <View style={styles.parent1}>
                <Header showHeading={true} navigation={navigation} title={user.type == 1 ? 'Employees' : 'Clients'}  onPress={() => {onBack()}} blackHead={true}  />
                <ShadeLines container2={{ left:'82%',bottom:'40%'}} container={{ left:'64%',bottom:'40%' }} />

            </View>
            <View style={styles.parent2}>
                <View style={styles.container}>
                    <ClientsList navigation={navigation} />
                </View>
            </View>
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
        width:'100%',
        height: '100%',
    },
    container: {
        flex: 11,
    },
});
export default ClientsScreen