import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Header from '../Components/Header'
import { useTheme } from 'react-native-paper';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import Button from '../Components/Button';
import { useDispatch, useSelector } from 'react-redux'
import { imgUrl } from '../Utils/Host';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import LeadService from '../Services/LeadService';
import moment from 'moment';
import UserService from '../Services/UserService';
import { changeBarColor } from '../Actions/UserActions';


const PlanDetailsScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const [plan, setPlan] = useState([]);
    const [manager, setManager] = useState([]);
    const user = useSelector(state => state.UserReducer.user);
    const IsFocused = useIsFocused();
    const dispatch = useDispatch();
    var currentMonth = (new Date).getMonth() + 1;
    currentMonth -= plan?.planmonth;

    const getData = () => {
        LeadService.getPlanById(user?.plan)
            .then(res => setPlan(res))
            .catch(err => console.log(err));
        if (user?.type !== 2) {
            UserService.GetManagers()
                .then(res => setManager(res))
                .catch(err => console.log(err));
        }
    }

    useFocusEffect(
        useCallback(() => {
            dispatch(changeBarColor({ barColor: 'white', barContent: 'dark-content' }));
            getData();
        }, [])
    );
    return (
        <>
            <Header title={'Plan Details'} onPress={() => navigation.goBack()} />
            <ScrollView style={{ backgroundColor: '#F9F9FF' }} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, marginHorizontal: 20 }}>
                    <View style={{ backgroundColor: colors.secondary, marginVertical: 10, width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', paddingLeft: 20, borderRadius: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontWeight: '900', fontSize: width * 0.04 }}>Selected Plan</Text>
                            <TouchableOpacity onPress={() => { }} style={{ backgroundColor: colors.primary, padding: 5, borderRadius: 100 }}>
                                <Feather name="users" size={width * 0.08} color={"white"} />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: width * 0.035, color: colors.primary }}>{plan?.planname}</Text>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: width * 0.035 }}>{plan?.description}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: width * 0.035, fontWeight: '700', color: colors.primary, marginTop: 20, paddingBottom: 15 }}>${plan?.planprice?.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Renews on {moment().add(currentMonth + plan?.planmonth, 'month').format('01-MM-YYYY')}</Text>
                        </View>
                    </View>
                    {user?.type !== 2 && manager?.map((item, index) => (
                        <View key={item.toString() + index.toString()}>
                            <View style={{ backgroundColor: colors.secondary, marginVertical: 20, width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', paddingLeft: 20, borderRadius: 12 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 15 }}>
                                    <Image style={{ borderRadius: 100, width: width * 0.17, height: width * 0.17 }} source={{ uri: imgUrl + item?.avatar }} />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ fontWeight: '600', color: '#2D2E49', fontSize: width * 0.035, textTransform: 'capitalize' }}>{item?.firstname} {item?.lastname.substring(0,1)}.</Text>
                                        <Text style={{ fontSize: width * 0.03 }}>{item?.type === 0 && "Employee" || item?.type === 1 && "Client" || item?.type === 2 && "Manager" || item?.type === 3 && "Super Admin"}</Text>
                                    </View>
                                </View>
                                <View style={{}}>
                                    <Text style={{ color: '#8A8D9F', fontSize: width * 0.033, fontWeight: '500' }}>Lead Credits must be configured through your
                                        territory manager. Please send them a message directly to select a lead package. </Text>
                                </View>
                            </View>
                            <Button
                                onPress={() => navigation.navigate('MessageBoxScreen', item)}
                                title='Send a Message'
                                btnstyle={{ backgroundColor: '#f9e5e5', height: 50 }}
                                btntextstyle={{ fontSize: width * 0.035, fontWeight: '900', color: colors.primary }}
                            />
                        </View>
                    ))

                    }
                    <View style={{ marginTop: height * 0.04 }}>
                        <Button
                            onPress={() => navigation.navigate('BrowseLeadsScreen')}
                            title='Browse Available Leads'
                            btnstyle={{ backgroundColor: colors.primary, height: 50 }}
                            btntextstyle={{ fontSize: width * 0.035, fontWeight: '900', color: colors.secondary }}
                        />
                    </View>
                    <View style={{ height: 20 }} />
                </View>
            </ScrollView>
        </>
    )
}

export default PlanDetailsScreen;