import React, { useRef, useState } from 'react'
import WebView from 'react-native-webview'
import Loader from '../Components/Loader'
import Header from '../Components/Header'
import { encode as btoa } from 'base-64'
import { useSelector } from 'react-redux'
import { pdfHost } from '../Utils/Host'
import Popup from '../Components/Popup'

const ViewQuoteScreen = ({ navigation, route }) => {
    const quote = useSelector(state => state.JobReducer.quote);
    const [showPopup, setShowPopup] = useState('');
    const webviewRef = useRef(null);
    return (
        <>
            <Header navigation={navigation} onPress={() => navigation.goBack()} title={'View Quote'} />
            <WebView
                ref={webviewRef}
                originWhitelist={['*']}
                source={{ uri: `${pdfHost}/viewquote/?id=${btoa(btoa(btoa(quote?.jobId)))}` }}
                startInLoadingState={true}
                renderLoading={() => <Loader />}
                onNavigationStateChange={(event) => {
                    if (!event.url.includes("parprice.io")) {
                      webviewRef.stopLoading();
                      alert('Loading failed, please try again!');
                    }
                }}
            />
            {/* <Popup
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
            /> */}
        </>
    )
}

export default ViewQuoteScreen