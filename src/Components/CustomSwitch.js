import React, { useState } from 'react';
import { Switch, useTheme } from 'react-native-paper';

const CustomSwitch = ({on,onPress}) => {
  const { colors } = useTheme();
  return <Switch style={{marginVertical:-20}} color={colors.primary} value={on} onValueChange={onPress} />;
};

export default CustomSwitch;