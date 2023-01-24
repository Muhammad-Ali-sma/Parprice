import { View, Text } from 'react-native'
import React, { useRef } from 'react'
import WebView from 'react-native-webview'
import Loader from '../Components/Loader'
import Header from '../Components/Header'

const CustomWebView = ({navigation}) => {
    const webviewRef = useRef(null);
    const jsCode = `var css = 'header, footer, .sequoia_title { display: none; } #content section {  padding: 10px; }';   
    var head = document.head || document.getElementsByTagName('head')[0];    
    var style = document.createElement('style');    head.appendChild(style);    style.type = 'text/css';    if (style.styleSheet){ style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); }`
    return (
        <>
            <Header navigation={navigation} onPress={() => navigation.goBack()} title={'Documents'} />
            <WebView
                ref={webviewRef}
                originWhitelist={['*']}
                source={{ uri: 'https://www.parprice.io/docs/' }}
                startInLoadingState={true}
                renderLoading={() => <Loader />}
                injectedJavaScript={jsCode}
                onMessage={(event) => { }}
                onNavigationStateChange={(event) => {
                    if (!event.url.includes("parprice.io")) {
                      webviewRef.stopLoading();
                      alert('Loading failed, please try again!');
                    }
                }}
            />
        </>
    )
}

export default CustomWebView