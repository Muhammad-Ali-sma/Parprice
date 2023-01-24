import React from 'react'
import { View, StyleSheet } from "react-native";

const ShadeLines = (props) => {
  return (
    <>
    <View style={[styles.container,props.container]}>
    </View>
    <View style={[styles.container2,props.container2]}>
    </View>
    </>
  )
}

export default ShadeLines
const styles=StyleSheet.create({
    container:{
        backgroundColor:'#FFFFFF',
        width:'15%',
        height:'100%',
        position:'absolute',
        transform: [{rotate:'30deg'}],
        right:0,     
        bottom: '-15%',     
        opacity: 0.07
    },
    container2:{
        backgroundColor:'#FFFFFF',
        width:'15%',
        height:'100%',
        position:'absolute',
        transform: [{rotate:'30deg'}],
        right:'-17%',
        bottom: '-15%',
        opacity: 0.2
    }
});