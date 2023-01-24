import React, { useRef, useState } from 'react'
import WebView from 'react-native-webview'
import Loader from '../Components/Loader'
import Header from '../Components/Header'
import { encode as btoa } from 'base-64'
import { useSelector } from 'react-redux'
import { pdfHost } from '../Utils/Host'
import Popup from '../Components/Popup'
import { Alert } from 'react-native'

const ContractScreen = ({ navigation, route }) => {
    const quote = useSelector(state => state.JobReducer.quote);
    const [showPopup, setShowPopup] = useState('');
    const webviewRef = useRef(null);
    return (
        <>
            <Header navigation={navigation} onPress={() => quote?.contract && JSON.parse(quote?.contract)?.contractStatus === 'signed' ? navigation.goBack() : setShowPopup('1')} title={'Sign Contract'} />
            <WebView
                ref={webviewRef}
                originWhitelist={['*']}
                source={{ uri: `${pdfHost}/contractview/?id=${btoa(btoa(btoa(btoa(quote?.jobId))))}&fromApp=true` }}
                startInLoadingState={true}
                onNavigationStateChange={(event) => {
                    if (!event.url.includes("parprice.io")) {
                      webviewRef.stopLoading();
                      alert('Contract loading failed, please try again!');
                    }
                }}
                renderLoading={() => <Loader />}
                onMessage={(event) => {
                    if(event.nativeEvent.data === "ContractDone"){
                        setShowPopup("ContractSigned");
                    }
                }}
            />
            <Popup
                show={showPopup === 'ContractSigned' ? true : false}
                onPress={() => { setShowPopup(''); navigation.goBack() }}
                contractPopup={true}
            />
            <Popup
                show={showPopup === '1' ? true : false}
                onPress={() => { setShowPopup(''); navigation.goBack() }}
                title={'Warning'}
                description="Are you sure you want to cancel?"
                showCancel={true}
                continueBtn={true}
                onPressOk={() => setShowPopup('')}
            />
        </>
    )
}

export default ContractScreen