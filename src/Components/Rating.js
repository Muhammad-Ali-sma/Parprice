import { AirbnbRating } from 'react-native-ratings';
import React from 'react'

const Rating = (props) => {
    return (
        <AirbnbRating
            count={props?.count}
            showRating={false}
            defaultRating={props?.defaultRating}
            size={props?.size}
            // reviewSize={props?.reviewSize}
            isDisabled={props?.isDisabled}
            onFinishRating={props?.onFinishRating}
        />
    )
}

export default Rating