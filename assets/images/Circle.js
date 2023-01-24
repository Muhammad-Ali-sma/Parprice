import React from 'react'
import { useTheme } from 'react-native-paper';
import Svg, { Path } from "react-native-svg"
const Circle = () => {
    const { colors } = useTheme();
    return (
        <Svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="20.000000pt" height="54.000000pt" viewBox="0 0 24.000000 54.000000" preserveAspectRatio="xMidYMid meet">
            <Path d="M50 515 c-10 -12 -6 -22 25 -56 20 -23 43 -56 51 -75 30 -73 8 -191
                -45 -238 -22 -20 -28 -51 -11 -61 21 -13 59 25 91 90 29 59 31 71 27 137 -5
                82 -28 137 -79 186 -37 36 -42 38 -59 17z" transform="translate(0.000000,54.000000) scale(0.100000,-0.100000)"
                fill={colors.primary} stroke="none" />
        </Svg>
    )
}

export default Circle