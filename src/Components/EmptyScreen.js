import React from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native'
import Button from './Button';
import { useTheme } from 'react-native-paper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const EmptyScreen = ({ description, title, bodyStyle, icon }) => {

    const colors=useTheme()

    return (
        <View style={[styles.cartBody,bodyStyle]}>
            {icon}
            <Text style={styles.cartBodyText}>{title}</Text>  
           {description && <Text style={styles.cartBodyPara}>Product pricing on its way</Text> }       
        </View>
    )
}
const styles = StyleSheet.create({
    cartBody: {
        alignItems: 'center',
        paddingTop:height*0.06,
        height: '100%',
        backgroundColor: '#F9F9FF',
        marginHorizontal:width*0.05
    },
    cartBodyText: {
        fontSize: height*0.03,
        color: '#343434',
        fontWeight:'800',        
        paddingTop:height*0.04,
        textAlign:'center'
    },
    cartBodyPara: {
        fontSize: height*0.035,
        color: '#343434',
        fontStyle:'italic',
    },       
});
export default EmptyScreen