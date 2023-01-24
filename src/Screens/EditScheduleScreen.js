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
import ClientService from '../Services/ClientService';
import UserService from '../Services/UserService';

const EditScheduleScreen = ({ navigation, route }) => {
    const data = route?.params?.data;
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
    const [open, setOpen] = useState(false);
    const [showSnackbar, setShowSnackBar] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [user1, setUser1] = useState("");
    const [user2, setUser2] = useState("");
    const dispatch = useDispatch();
    const [selectedDate, setSelectedDate] = useState(moment(data?.date, 'YYYY-MM-DD').format('YYYY-MM-DD'));
    const user = useSelector(state => state.UserReducer.user)
    const [users, setUsers] = useState([]);


    const getData = () => {
        UserService.GetUsers().then(res => {
            if (res.success != undefined && !res.success) {
                console.log('Error', res)
            } else {
                res = [...[{ id: "-1", firstname: "Unassigned", lastname: "" }], ...res];
                setUsers(res);
            }
        }).catch(err => console.log(err))
    }

    const onSelectClient = (item) => {
        setActiveClient(item);
        setClientList(false)
    }
    const updateAppointment = () => {
        if (Object.keys(activeClient).length > 0 && description != "" && title != "") {
            Keyboard.dismiss();
            setLoading(true);
            ScheduleService.UpdateAppointment(data?.id, (user.type == 2 || user.type == 3) ? user1 : user.id, activeClient.id, selectedDate, moment(hours + ":" + minutes + " " + active, "hh:mm:a").format("HH:mm:ss"), title, description, (user.type == 2 || user.type == 3) ? user2 : '')
                .then(res => {
                    if (res?.success) {
                        setActiveClient({});
                        setDescription('');
                        setTitle('');
                        setHours('');
                        setMinutes('');
                        setActive('AM');
                        setUser1('');
                        setUser2('');
                        navigation.navigate('CalendarsScreen');
                    }
                    setLoading(false)
                })
                .catch(err => setLoading(false))
        } else {
            if (Object.keys(activeClient).length == 0) {
                setSnackbarMsg("Please select client");
            }
            setShowSnackBar(true);
        }
    }

    useEffect(() => {
        if (data) {
            setActiveClient(data?.user)
            setSelectedDate(moment(data?.date, 'YYYY-MM-DD').format('YYYY-MM-DD'));
            setHours(moment(data?.time, 'HH').format('HH'))
            setMinutes(moment(data?.time, 'hh:mm a').format('mm'))
            setActive(moment(data?.time, 'h:m a').format('a').toUpperCase())
            setDescription(data?.description);
            setTitle(data?.title);
            setUser1(data?.rep?.id);
            setUser2(data?.rep2?.id);
        }
        if (user.type == 2 || user.type == 3) {
            getData();
        }
    }, [route]);

    return (

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'height' : 'height'} style={{ flex: 1 }}>
            <Header navigation={navigation} showPopup={clientList} handleOnPressClose={() => setClientList(false)} showHeading={true} onPress={() => { dispatch(changeBarColor({ barColor: 'black', barContent: 'light-content' })); navigation.goBack() }} title={'Update Schedule'} />
            <View style={{ flex: 1, backgroundColor: '#F9F9FF' }}>
                {!clientList ?
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
                        <View style={{ alignItems: 'center' }}>
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
                                            <Text style={{ fontSize: height * 0.02, textAlign: 'center', }}>{moment(minutes, 'mm').format('mm').length === 1 ? "0" + moment(minutes, 'mm').format('mm') : moment(minutes, 'mm').format('mm')}</Text>
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
                            {(user.type == 2 || user.type == 3) &&
                                <>
                                    <View style={{ marginTop: 10, position: 'relative' }}>
                                        <Text style={{ fontSize: height * 0.02, color: colors.tertiary, position: 'absolute', fontWeight: '700', left: '3%' }}>Assigned to: <Text style={{ color: colors.primary }}>Rep#1</Text></Text>
                                        <SelectDropDown
                                            data={users?.map(x => x?.firstname + " " + x?.lastname)}
                                            dropDownStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25, padding: 10, width: '90%' }}
                                            onSelect={(text, index) => {
                                                setUser1(users[index]?.id);
                                            }}
                                            defaultButtonText={data?.rep?.id ? data?.rep?.firstname + " " + data?.rep?.lastname : 'Select User'}
                                        />
                                    </View>

                                    <View style={{ marginTop: 10, position: 'relative' }}>
                                        <Text style={{ fontSize: height * 0.02, color: colors.tertiary, position: 'absolute', fontWeight: '700', left: '3%' }}>Assigned to: <Text style={{ color: colors.primary }}>Rep#2</Text></Text>
                                        <SelectDropDown
                                            data={users?.map(x => x?.firstname + " " + x?.lastname)}
                                            dropDownStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25, padding: 10, width: '90%' }}
                                            onSelect={(text, index) => {
                                                setUser2(users[index]?.id);
                                            }}
                                            defaultButtonText={data?.rep2?.id ? data?.rep2?.firstname + " " + data?.rep2?.lastname : 'Select User'}
                                        />
                                    </View>
                                </>
                            }
                            <View style={{ width: '90%', marginTop: 20, alignItems: 'center' }}>
                                <Button
                                    isLoading={loading}
                                    title={'Update Schedule'}
                                    onPress={() => updateAppointment()}
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
        </KeyboardAvoidingView>
    )
}

export default EditScheduleScreen