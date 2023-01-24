import React from 'react'
import { Snackbar } from 'react-native-paper'

const SnackBar = ({show, onDismiss, message}) => {
    return (
        <Snackbar
            visible={show}
            onDismiss={onDismiss}
            duration={1000}
        >
            {message}
        </Snackbar>
    )
}

export default SnackBar