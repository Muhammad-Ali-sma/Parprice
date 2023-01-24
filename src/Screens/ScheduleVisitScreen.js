import { View, Text, Pressable, Dimensions, Keyboard, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Components/Header';
import { useTheme } from 'react-native-paper';
import ClientDetails from '../Components/ClientDetails';
import { Calendar } from 'react-native-calendars';
import Button from '../Components/Button';
import ClientsList from '../Components/ClientsList';
import ScheduleService from '../Services/ScheduleService';
import InputField from '../Components/InputField';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { changeBarColor, SetScheduleCount } from '../Actions/UserActions';
import * as Notifications from 'expo-notifications';
import SelectDropDown from '../Components/SelectDropDown';
import SnackBar from '../Components/SnackBar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ScheduleVisitScreen = ({ navigation, route }) => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const { colors } = useTheme();
    const [active, setActive] = useState('AM');
    const [title, setTitle] = useState('');
    const [activeClient, setActiveClient] = useState({});
    const [clientList, setClientList] = useState(false);
    const [description, setDescription] = useState('');
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false)
    const [showSnackbar, setShowSnackBar] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState("")
    const scheduleCount = useSelector(state => state.UserReducer.scheduleCount);
    const dispatch = useDispatch();
    const [selectedDate, setSelectedDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const user = useSelector(state => state.UserReducer.user)

    useEffect(() => {
        if (route?.params?.dateStr) {
            setSelectedDate(moment(route?.params?.dateStr).format('YYYY-MM-DD'));
        }
    }, [route]);


    const onSelectClient = (item) => {
        setActiveClient(item);
        setClientList(false)
    }
    const createAppointment = () => {
        if (Object.keys(activeClient).length > 0 && description != "" && title != "") {
            Keyboard.dismiss();
            setLoading(true);
            ScheduleService.CreateAppointment(user.id, activeClient.id, selectedDate, moment(hours + ":" + minutes + " " + active, "hh:mm:a").format("HH:mm:ss"), title, description)
                .then(async res => {
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: `${user?.firstname} ${user?.lastname} scheduled an appointment ${moment(hours + ":" + minutes + " " + active, "hh:mm:a").format("HH:mm:ss")}`,
                            body: `${activeClient?.firstname} ${activeClient?.lastname}`,
                            data: {},
                            sound: true
                        },
                        trigger: { seconds: 2 },
                    });
                    setActiveClient({});
                    setDescription('');
                    setTitle('');
                    setHours('');
                    setMinutes('');
                    setActive('AM');
                    dispatch(SetScheduleCount(scheduleCount + 1))
                    navigation.navigate('CalendarsScreen')
                    setLoading(false)
                })
                .catch(err => setLoading(false))
        } else {
            if (Object.keys(activeClient).length == 0) {
                setSnackbarMsg("Please select client");
            } else if (description == "") {
                setSnackbarMsg("Please fill description");
            } else if (title != "") {
                setSnackbarMsg("Please fill title");
            }
            setShowSnackBar(true);

        }
    }

    return (
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always" style={{ backgroundColor: '#F9F9FF' }}>
            <Header navigation={navigation} showPopup={clientList} handleOnPressClose={() => setClientList(false)} showHeading={true} onPress={() => { dispatch(changeBarColor({ barColor: 'black', barContent: 'light-content' })); navigation.goBack() }} title={'Schedule Visit'} />
            <View style={{ flex: 1, backgroundColor: '#F9F9FF' }}>
                {!clientList ?
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
                        <View style={{ alignItems: 'center' }}>
                            {Object.keys(activeClient).length > 0 ?
                                <ClientDetails
                                    onDeSelect={() => setActiveClient({})}
                                    client={activeClient}
                                    containerStyle={{ backgroundColor: '#e6e1e5', marginTop: 20, borderLeftColor: colors.primary, borderLeftWidth: 5, borderRadius: 4 }}
                                /> :
                                <View style={{ width: '90%', marginTop: 20 }}>

                                    <Button
                                        title={'Select Client'}
                                        onPress={() => { setClientList(true); }}
                                        btnstyle={{ backgroundColor: colors.primary, }}
                                        btntextstyle={{ fontWeight: '700', color: colors.secondary }}
                                    />

                                </View>
                            }

                            <View style={{ width: '100%', marginTop: 20, backgroundColor: colors.secondary }}>
                                <Calendar
                                    selected={moment(selectedDate).format('YYYY-MM-DD')}
                                    markedDates={{ [moment(selectedDate).format('YYYY-MM-DD')]: { selected: true, selectedDotColor: 'orange' } }}
                                    hideExtraDays={true}
                                    enableSwipeMonths={true}
                                    onDayPress={day => {
                                        setSelectedDate(day.dateString)
                                    }}
                                    theme={{
                                        backgroundColor: '#ffffff',
                                        calendarBackground: '#ffffff',
                                        textSectionTitleColor: '#b6c1cd',
                                        textSectionTitleDisabledColor: '#d9e1e8',
                                        selectedDayBackgroundColor: colors.primary,
                                        selectedDayTextColor: 'white',
                                        todayTextColor: colors.primary,
                                        dayTextColor: '#2d4150',
                                        textDisabledColor: '#d9e1e8',
                                        dotColor: colors.primary,
                                        selectedDotColor: '#ffffff',
                                        arrowColor: colors.primary,
                                        disabledArrowColor: '#d9e1e8',
                                        monthTextColor: colors.primary,
                                        indicatorColor: colors.primary,
                                        textDayFontWeight: '300',
                                        textMonthFontWeight: 'bold',
                                        textDayHeaderFontWeight: '300',
                                        textDayFontSize: 16,
                                        textMonthFontSize: 16,
                                        textDayHeaderFontSize: 16,
                                    }}
                                />
                                <DateTimePickerModal
                                    onConfirm={(e) => {
                                        setActive((moment(e).format('LT')).split(' ')[1].toUpperCase())
                                        setHours((moment(e).format('LT')).split(' ')[0].split(':')[0]);
                                        setMinutes((moment(e).format('LT')).split(' ')[0].split(':')[1])
                                        setOpen(false)
                                    }}
                                    onCancel={() => setOpen(false)}
                                    isVisible={open}
                                    mode="time"
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', marginHorizontal: 20, paddingBottom: 20 }}>
                                    <Text style={{ fontSize: height * 0.023, fontWeight: '700' }}>Appointment Time</Text>
                                    <Pressable onPress={() => setOpen(true)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#efefef', paddingHorizontal: width * 0.02, borderRadius: 10, zIndex: 1 }}>
                                        <View style={{ adding: 5, width: width * 0.075, color: 'black', borderTopRightRadius: 5, borderBottomRightRadius: 5, borderRadius: 0 }}>
                                            <Text style={{ fontSize: height * 0.02, textAlign: 'center', }}>{moment(hours, 'h').format('hh')}</Text>
                                        </View>
                                        <View style={{ paddingVertical: height * 0.01 }}>
                                            <Text style={{ fontSize: height * 0.025 }}>:</Text>
                                        </View>
                                        <View style={{ adding: 5, width: width * 0.075, color: 'black', borderTopRightRadius: 5, borderBottomRightRadius: 5, borderRadius: 0 }}>
                                            <Text style={{ fontSize: height * 0.02, textAlign: 'center', }}>{moment(minutes, 'm').format('mm')}</Text>
                                        </View>
                                    </Pressable>

                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 6, backgroundColor: "#efefef", width: width * 0.2 }}>
                                        <Pressable onPress={() => setActive("AM")} style={{ backgroundColor: active == 'AM' ? colors.primary : '#efefef', paddingHorizontal: 13, paddingVertical: 7, borderRadius: 6, }}>
                                            <Text style={{ fontSize: height * 0.02, color: active == 'AM' ? colors.secondary : colors.tertiary }}>AM</Text>
                                        </Pressable>
                                        <Pressable onPress={() => setActive("PM")} style={{ backgroundColor: active == 'PM' ? colors.primary : '#efefef', paddingHorizontal: 13, paddingVertical: 7, borderRadius: 6, }}>
                                            <Text style={{ fontSize: height * 0.02, color: active == 'PM' ? colors.secondary : colors.tertiary }}>PM</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                            <SelectDropDown
                                data={['Sales Visit', 'Follow Up', 'Sign Paperwork', 'Site Inspection', 'Rehash']}
                                dropDownStyle={{ backgroundColor: '#F4F5F7', marginTop: 10, borderRadius: 25, padding: 10, width: '90%' }}
                                onSelect={(text) => {
                                    setTitle(text);
                                }}
                                value={title}
                                defaultButtonText='Appointment Type'
                            />

                            <InputField
                                inputStyle={{ backgroundColor: '#F4F5F7', marginTop: 10, borderRadius: 25, height: 80, padding: 10, width: '90%' }}
                                returnKeyType="done"
                                value={description}
                                onChangeText={(text) => {
                                    setDescription(text);
                                }}
                                placeholder="Description..."
                                placeholdercolor='#8A8D9F'
                                autoCapitalize="none"
                                blurOnSubmit={false}
                                ref={null}
                                multiline={true}
                                maxLength={1000}
                                elevationShadowStyle={elevationShadowStyle(5)}
                            />
                            <View style={{ width: '90%', marginTop: 20, alignItems: 'center' }}>
                                <Button
                                    isLoading={loading}
                                    title={'Schedule Visit'}
                                    onPress={() => createAppointment()}
                                    btnstyle={{ backgroundColor: colors.primary }}
                                    btntextstyle={{ fontWeight: '700', color: colors.secondary }}
                                />
                            </View>
                        </View>
                        <View style={{ height: 40 }} />
                    </ScrollView>
                    :
                    <ClientsList
                        title='Create New Client'
                        activescreen={'NewQuotes'}
                        navigation={navigation}
                        onSelectClient={onSelectClient}
                    />
                }
            </View>
            <SnackBar
                show={showSnackbar}
                onDismiss={() => setShowSnackBar(false)}
                message={snackbarMsg}
            />
        </KeyboardAwareScrollView>
    )
}

const elevationShadowStyle = (elevation) => {
    return {
        elevation,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0.5 * elevation },
        shadowOpacity: 0.3,
        shadowRadius: 0.8 * elevation,
    };
};

export default ScheduleVisitScreen