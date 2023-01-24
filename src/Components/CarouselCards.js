import React from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Platform } from "react-native";
import { TouchableRipple, useTheme } from 'react-native-paper';

import { demoImgUrl, imgUrl } from "../Utils/Host";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const CarouselCards = ({ item, containerStyle, imageStyle, onPress, elevationShadowStyle }) => {
  const { colors } = useTheme();
  return (
    <View style={{ marginRight: (width > 767 ? width * 0.031 : width * 0.03), borderRadius: 10 }}>
      <View style={[{ overflow: 'hidden', borderRadius: 10, width: (width > 767 ? width * 0.22 : width * 0.275),padding:2 }, containerStyle, ]}>
        <TouchableRipple rippleColor={colors.rippleColor} onPress={onPress} style={[styles.parent, { backgroundColor: colors.secondary },elevationShadowStyle]}>
          <>
            <Image resizeMode='cover' source={{ uri: (item?.demoProd == 0 ? imgUrl : demoImgUrl) + item.thumb }} style={[styles.image, imageStyle]} />
            <Text style={styles.Title}>{item.title}</Text>
          </>
        </TouchableRipple>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    paddingBottom: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden'
  },
  image: {
    width: (width > 767 ? width * 0.15 : width * 0.19),
    height: (width > 767 ? width * 0.15 : width * 0.19),
    borderRadius: 100
  },
  Title: {
    textAlign: 'center',
    fontSize: width > 767 ? height * 0.02 : width * 0.035,
    fontWeight: '700',
    paddingTop: 10,
    flexWrap: 'wrap',
  }
});
export default CarouselCards