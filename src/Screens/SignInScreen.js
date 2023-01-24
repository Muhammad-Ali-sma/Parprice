import React, { createRef, useState } from 'react'
import { View, StyleSheet, Text, KeyboardAvoidingView, ScrollView, Dimensions, Pressable } from 'react-native'
import Header from '../Components/Header'
import { useTheme, Checkbox } from 'react-native-paper';
import InputField from '../Components/InputField';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import Button from '../Components/Button';
import Card from '../Components/Card';
import CommonServices from '../Services/CommonServices';
import { useDispatch } from "react-redux";
import LocalStorage from '../Utils/LocalStorage';
import { UserLogin } from '../Actions/AuthActions';
import Popup from '../Components/Popup';
import { changePrimaryColor, handleActive, userData } from '../Actions/UserActions';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const SignInScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [checked, setChecked] = useState(true);
  const [message, setMessage] = useState('');
  const [showPpopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const PasswordRef = createRef();

  const handleSignInBtnClick = async () => {
    setIsSubmitted(true);
    setLoading(true)

    if (email != '' && password != '') {
      await CommonServices.LoginUser(email, password)
        .then(async (res) => {
          if (res.success == false) {
            setMessage(res.message.join(", "));
            setShowPopup(true);
          } else {
            setEmail("");
            setPassword('');
            LocalStorage.SetData("Login", "login");
            LocalStorage.SetData("Token", res?.user?.token);
            LocalStorage.SetData("User", JSON.stringify(res?.user));
            LocalStorage.SetData("Company", JSON.stringify(res?.company));
            dispatch(userData({
              user: res?.user,
              company: res?.company
            }));
            dispatch(changePrimaryColor({ color: res?.company?.colorScheme }));
            dispatch(handleActive('Home'));
            dispatch(UserLogin('login'))
          }
        }).catch(err => console.log(err))
    } else {
      setMessage('All Fields are Required!');
      setShowPopup(true);
    }
    setLoading(false)
  }

  return (
    <>
      <Header hideActionBtn={true} onPress={() => navigation.navigate('WelcomeScreen')} title={'Sign In'} />
      <KeyboardAvoidingView style={{ height: '100%', flex: 1, backgroundColor: '#F9F9FF' }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'handled'}>
          <View style={{ flex: 10, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ padding: width * 0.05, alignSelf: 'flex-start' }}>
              <Text style={{ color: colors.primary, fontSize: height * 0.035, fontWeight: '700' }}>Welcome Back!</Text>
              <Text style={{ color: colors.tertiary, fontSize: height * 0.028, fontWeight: '400', paddingTop: 10 }}>Sign in to continue</Text>
            </View>
            <Card>
              <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <InputField
                  IconLeft={<MaterialCommunityIcons name="email-outline" size={24} color={`${colors.primary}`} />}
                  value={email}
                  requires={true}
                  onChangeText={(text) => setEmail(text)}
                  returnKeyType={'next'}
                  placeholderTextColor={`${colors.tertiary}`}
                  InputStyle={{ backgroundColor: '#F4F5F7', width: '90%' }}
                  isDirty={isSubmitted}
                  onSubmitEditing={() => { PasswordRef?.current?.focus(); }}
                />
                <InputField
                  IconLeft={<Entypo name="lock" size={24} color={`${colors.primary}`} />}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  returnKeyType={'done'}
                  requires={true}
                  ref={PasswordRef}
                  secureTextEntry={true}
                  placeholderTextColor={`${colors.tertiary}`}
                  InputStyle={{ backgroundColor: '#F4F5F7', width: '90%' }}
                  isDirty={isSubmitted}
                  blurOnSubmit={true}
                  onSubmitEditing={handleSignInBtnClick}
                />
              </View>
              <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Checkbox.Android
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => setChecked(!checked)}
                    color={`${colors.primary}`}
                  />
                  <Text style={[styles.mainContainer, { color: colors.tertiary }]}>
                    Remember Me
                  </Text>
                </View>
                <Pressable onPress={() => navigation.navigate('ForgetPassScreen')}>
                  <Text style={styles.mainContainer}>Forget Password ?</Text></Pressable>
              </View>
              <View style={{ paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
                <Button isLoading={loading} title={'Sign In'} onPress={handleSignInBtnClick} btnstyle={{ backgroundColor: colors.primary, height: 50 }} btntextstyle={{ color: colors.secondary }} />
              </View>
            </Card>
          </View>
        </ScrollView>
        <Popup title={"Error"} onPress={() => setShowPopup(false)} description={message} show={showPpopup} />

      </KeyboardAvoidingView>

    </>
  )
}
const styles = StyleSheet.create({
  mainContainer: {
    fontSize: height * 0.02,
  },
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 }
})
export default SignInScreen