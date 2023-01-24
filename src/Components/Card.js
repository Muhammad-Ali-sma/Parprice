import React from 'react'
import { View } from 'react-native'

const Card = ({children}) => {
  return (
    <View style={{backgroundColor:'white',paddingVertical:30,width:'90%',borderRadius:10}}>
        {children}
    </View>
  )
}

export default Card