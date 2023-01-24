import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react'
import { Dimensions, View, Text, TouchableOpacity, StatusBar } from 'react-native'
import { Agenda, Calendar } from 'react-native-calendars'
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { changeBarColor } from '../Actions/UserActions';
import Button from '../Components/Button';
import ClientDetails from '../Components/ClientDetails';
import Header from '../Components/Header';
import ScheduleService from '../Services/ScheduleService';

const CalendarsScreen = ({ navigation, route }) => {
    const height = Dimensions.get('window').height;

    const [selectedDate, setSelectedDate] = useState(moment(new Date()));
    const [appointmentsLoaded, setAppointmentLoaded] = useState(false);
    const [calendarLoaded, setCalendarLoaded] = useState(false);
    const user = useSelector(state => state.UserReducer.user)
    const [agendaSchedule, setAgendaSchedule] = useState({});
    const [appointments, setAppointments] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const { colors } = useTheme();
    const dispatch = useDispatch();

    const getAppointments = () => {
        setAppointmentLoaded(false);
        setAppointments([]);

        if (user.type == 2 || user.type == 3) {
            ScheduleService.GetAppointmentList()
                .then(res => {
                    if (res?.success == undefined) {
                        setAppointments(res);
                    }
                    setAppointmentLoaded(true);
                })
                .catch(err => console.log(err))
        } else {
            if (user.type == 1) {
                ScheduleService.GetAppointmentByClientId(user.id)
                    .then(res => {
                        if (res?.success == undefined) {
                            setAppointments(res);
                        }
                        setAppointmentLoaded(true);
                    })
                    .catch(err => console.log(err))
            } else {
                ScheduleService.GetAppointmentByUserId(user.id)
                    .then(res => {
                        if (res.success == undefined) {
                            setAppointments(res);
                        }
                        setAppointmentLoaded(true);
                    })
                    .catch(err => console.log(err))
            }
        }
    }

    const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
    }

    useFocusEffect(
        useCallback(() => {
            dispatch(changeBarColor({ barColor: 'white', barContent: 'dark-content' }))
            if (route?.params) {
                setSelectedDate(moment(route?.params))
            }
            setCalendarLoaded(false);
            getAppointments();
        }, [])
    );

    useEffect(() => {
        if (appointmentsLoaded) {
            let dateJson = {};
            let dates = []
            let markedJson = {};
            appointments.filter(e => e?.user?.success == undefined).forEach(e => {
                dates.push(moment(e.date).format('YYYY-MM-DD'))
            })
            let uniQueDates = dates.filter(onlyUnique);
            uniQueDates.forEach((item, dindex) => {
                markedJson[item] = { marked: true }
                let daysDiff = 0;
                if (uniQueDates[dindex + 1]) {
                    daysDiff = moment(item).diff(moment(uniQueDates[dindex + 1]), 'days');
                }
                if (dindex < (uniQueDates.length - 1) && daysDiff > 0) {
                    for (let di = 1; di < daysDiff; di++) {
                        dateJson[moment(uniQueDates[dindex + 1]).add(di, 'd').format("YYYY-MM-DD")] = [];
                    }
                }
                dateJson[item] = [...appointments.filter(e => moment(e.date).format('YYYY-MM-DD') === item && e?.user?.success == undefined)];
            });

            setMarkedDates(markedJson);
            setAgendaSchedule(dateJson);
            setTimeout(() => {
                setCalendarLoaded(true);
            }, 100);
        }
    }, [appointmentsLoaded])

    return (
        <>
            <Header title={selectedDate.format('MMM')} onPress={() => { dispatch(changeBarColor('black')); navigation.goBack() }} leftAction={() => setSelectedDate(moment(selectedDate).subtract(1, 'month'))} rightAction={() => setSelectedDate(moment(selectedDate).add(1, 'month'))} navigation={navigation} />
            <View style={{ flex: 1, backgroundColor: '#F9F9FF', }}>
                {!calendarLoaded ?
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <ActivityIndicator style={{ marginVertical: 20 }} size={40} color={`${colors.primary}`} />
                    </View>
                    :
                    <>
                        <Agenda
                            items={agendaSchedule}
                            onDayPress={(day) => {
                                setSelectedDate(moment(day.dateString))
                            }}
                            selected={moment(selectedDate).format('YYYY-MM-DD')}
                            pastScrollRange={5}
                            enableSwipeMonths={true}
                            futureScrollRange={5}
                            renderItem={(item, firstItemInDay) => {
                                return (
                                    <>
                                        {item?.user != undefined &&
                                            <ClientDetails
                                                onPress={() => navigation.navigate('ClientContactInfoScreen', { data: { ...item.user, id: item.createdfor } })}
                                                containerStyle={{ backgroundColor: '#e6e1e5', marginTop: 20, borderLeftColor: colors.primary, borderLeftWidth: 5, borderRadius: 4 }}
                                                client={item?.user}
                                                data={item}
                                                navigation={navigation}
                                            />
                                        }
                                    </>
                                );
                            }}
                            renderEmptyData={() => {
                                return (<View style={{ flex: 1, width: '100%', backgroundColor: '#F9F9FF', alignItems: 'center' }}>
                                    <View style={{ width: '85%', marginTop: 20 }}>

                                    </View>
                                    <View style={{ backgroundColor: 'white', padding: 10, paddingVertical: 20, alignItems: 'center', justifyContent: 'center', width: '85%', marginTop: height * 0.04 }}>
                                        <Text style={{ fontWeight: '700', color: colors.tertiary, fontSize: height * 0.03 }}>No scheduled visits today</Text>
                                        <Text style={{ marginTop: 10, marginBottom: height * 0.06, textAlign: 'center', width: '70%', color: '#8A8D9F', fontSize: height * 0.02 }}>Nothing has been scheduled for you today.</Text>
                                        <View style={{ width: '85%' }}>
                                            <Button
                                                title={'Schedule Visit'}
                                                onPress={() => { navigation.navigate('ScheduleVisitScreen', { dateStr: moment(selectedDate).format('YYYY-MM-DD') }) }}
                                                btnstyle={{ backgroundColor: colors.primary, height: 35 }}
                                                btntextstyle={{ fontWeight: '700', color: colors.secondary }}
                                            />
                                        </View>
                                    </View>
                                </View>);
                            }}
                            rowHasChanged={(r1, r2) => {
                                return r1.text !== r2.text;
                            }}
                            hideKnob={false}
                            showClosingKnob={true}
                            markedDates={markedDates}
                            disabledByDefault={true}
                            theme={{
                                calendarBackground: '#ffffff',
                                textSectionTitleColor: '#b6c1cd',
                                textSectionTitleDisabledColor: '#d9e1e8',
                                selectedDayBackgroundColor: colors.primary,
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: colors.primary,
                                dayTextColor: '#2d4150',
                                textDisabledColor: '#d9e1e8',
                                dotColor: colors.primary,
                                selectedDotColor: '#ffffff',
                                arrowColor: 'orange',
                                disabledArrowColor: '#d9e1e8',
                                monthTextColor: colors.primary,
                                indicatorColor: colors.primary,
                                backgroundColor: "#F9F9FF",
                                textDayFontWeight: '300',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: '300',
                                textDayFontSize: 16,
                                textMonthFontSize: 16,
                                textDayHeaderFontSize: 16,
                                agendaTodayColor: colors.primary,
                                agendaKnobColor: colors.primary
                            }}
                        />

                        <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: height * 0.045, minHeight: 50, backgroundColor: "#F9F9FF" }}>
                            {markedDates[moment(selectedDate).format('YYYY-MM-DD')]?.marked &&
                                <View style={{ width: '90%' }}>
                                    <Button
                                        title={'Schedule Visit'}
                                        onPress={() => { navigation.navigate('ScheduleVisitScreen', { dateStr: moment(selectedDate).format('YYYY-MM-DD') }) }}
                                        btnstyle={{ backgroundColor: colors.primary, height: 35 }}
                                        btntextstyle={{ fontWeight: '700', color: colors.secondary }}
                                    />
                                </View>
                            }
                        </View>

                    </>
                }

            </View>
        </>
    )
}
export default CalendarsScreen