import React, { useState } from 'react'
import { View, StyleSheet, Text, KeyboardAvoidingView, ScrollView } from 'react-native'
import Header from '../Components/Header'
import { useTheme } from 'react-native-paper';
import InputField from '../Components/InputField';
import Button from '../Components/Button';
import Card from '../Components/Card';
import Popup from '../Components/Popup';
const ForgetPassScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [show, setShow] = useState(false);
  const [showPopup, setShowPopup] = useState(false);



  return (
    <>
      <KeyboardAvoidingView style={{ height: '100%', flex: 1, backgroundColor: '#F9F9FF' }}>
        <Header hideActionBtn={true} onPress={() => navigation.goBack()} title={'Forget Password'} />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
          <View style={{ flex: 10, justifyContent: 'flex-start', alignItems: 'center', marginTop: 20 }}>
            <Card>
              <View style={{ padding: 20, justifyContent: 'center' }}>
                <Text style={{ color: colors.tertiary, textAlign: 'center', fontSize: 16, lineHeight: 21, fontWeight: '400', paddingTop: 10 }}>We will send a mail to {'\n'} the email address you registered {'\n'}  to regain your password</Text>
              </View>
              <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <InputField
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  returnKeyType={'next'}
                  placeholderTextColor={`${colors.tertiary}`}
                  InputStyle={{ backgroundColor: '#F4F5F7', width: '80%' }}
                  placeholder='Email Address'
                />
                {(show && email != '') && <Text style={{ fontSize: 16, fontWeight: '400', lineHeight: 18, color: colors.tertiary }}>Email send to {email}</Text>}
              </View>

              <View style={{ paddingHorizontal: 40, paddingTop: 10 }}>
                <Button onPress={() => email != '' && setShowPopup(true)} title={'Send'} btnstyle={{ backgroundColor: colors.primary, height: 50 }} btntextstyle={{ color: colors.secondary }} />
              </View>
            </Card>
          </View>
        </ScrollView>
        <Popup show={showPopup} title='Password Reset Email Sent' description=" A verification code has been sent to your email address." showBtn={true} onPress={() => setShowPopup(false)} />
      </KeyboardAvoidingView>
    </>
  )
}
export default ForgetPassScreen