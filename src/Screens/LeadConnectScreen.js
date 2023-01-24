import { View, Text, Dimensions, ScrollView, Image, SectionList } from 'react-native'
import React, { Fragment, useCallback, useState } from 'react'
import Header from '../Components/Header';
import { Checkbox, useTheme } from 'react-native-paper';
import { imgUrl } from '../Utils/Host';
import Button from '../Components/Button';
import Popup from '../Components/Popup';
import { useFocusEffect } from '@react-navigation/native';
import UserService from '../Services/UserService';
import { useSelector } from 'react-redux';
import { Feather, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons, SimpleLineIcons } from '@expo/vector-icons';
import LeadDetailsBox from '../Components/LeadDetailsBox';

const LeadConnectScreen = ({ navigation, route }) => {
    const data = route?.params;
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const { colors } = useTheme();
    const [checked, setChecked] = useState(false);
    const [show, setShow] = useState(false);
    const [budget, setBudget] = useState(0);
    const user = useSelector(state => state.UserReducer.user)
    let parsedData = JSON.parse(data?.property_details);
    const tempData = [
        {
            'title': 'PROPERTY DETAILS',
            'items': [
                {
                    'key': 'Ownership Match',
                    'value': parsedData?.owner?.owner_occupied != undefined ? parsedData?.owner?.owner_occupied : 'N/A',
                    'icon': <Feather name='users' size={width * 0.05} color={colors.primary} />
                },
                {
                    'key': 'Current Estimated Value',
                    'value': (parsedData?.estimatedValue != "N/A" && parsedData?.estimatedValue != '' && parsedData?.estimatedValue != undefined) ? '$' + parsedData?.estimatedValue?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "N/A",
                    'icon': <Feather name='home' size={width * 0.05} color={colors.primary} />
                },
                {
                    'key': 'Mortgage Amount',
                    'value': (parsedData?.mortgage != "N/A" && parsedData?.mortgage != undefined) ? '$' + parsedData?.mortgage?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "N/A",
                    'icon': <MaterialIcons name='show-chart' size={width * 0.05} color={colors.primary} />
                }
            ]
        },
        {
            'title': 'HOUSE DETAILS',
            'items': [
                {
                    'key': 'Bedrooms',
                    'value': parsedData?.structure?.beds_count != undefined ? parsedData?.structure?.beds_count : 'N/A',
                    'icon': <Ionicons name='bed-sharp' size={width * 0.05} color={colors.primary} />
                },
                {
                    'key': 'Baths',
                    'value': parsedData?.structure?.baths != undefined ? parsedData?.structure?.baths : 'N/A',
                    'icon': <MaterialCommunityIcons name='bathtub' size={width * 0.05} color={colors.primary} />
                },
                {
                    'key': 'Stories',
                    'value': parsedData?.structure?.stories != undefined ? parsedData?.structure?.stories : 'N/A',
                    'icon': <SimpleLineIcons name='chart' size={width * 0.05} color={colors.primary} />
                }
            ]
        },
        {
            'title': 'BUILDING MATERIALS',
            'items': [
                {
                    'key': 'Property Type',
                    'value': (parsedData?.propertyType != "N/A" && parsedData?.propertyType != undefined) ? parsedData?.propertyType : 'N/A',
                    'icon': <FontAwesome5 name='warehouse' size={width * 0.05} color={colors.primary} />
                },
                {
                    'key': 'Roof Material',
                    'value': parsedData?.structure?.roof_material_type != undefined ? parsedData?.structure?.roof_material_type : 'N/A',
                    'icon': <MaterialCommunityIcons name='home-roof' size={width * 0.05} color={colors.primary} />
                }
            ]
        },
        {
            'title': 'COUNTY & SIZE',
            'items': [
                {
                    'key': 'County Name',
                    'value': parsedData?.countyName,
                    'icon': <MaterialCommunityIcons name='home-switch-outline' size={width * 0.05} color={colors.primary} />
                },
                {
                    'key': 'Total sq. ft.',
                    'value': parsedData?.structure?.total_area_sq_ft != undefined ? parsedData?.structure?.total_area_sq_ft?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'N/A',
                    'icon': <Octicons name='code-square' size={width * 0.05} color={colors.primary} />
                },
                {
                    'key': 'Year Built',
                    'value': parsedData?.structure?.year_built != undefined ? parsedData?.structure?.year_built : 'N/A',
                    'icon': <FontAwesome name='simplybuilt' size={width * 0.05} color={colors.primary} />
                }
            ]
        }
    ]

    const handleOnConfirmBtnPress = () => {
        if (!checked) {
            setShow(true);
        } else {
            UserService.buyLead(data?.id, user.id, data?.cid, data?.cost).then(res => {
                if (res.success) {
                    navigation.navigate('JobDetailsScreen', data)
                } else {
                    setShow(true);
                }
            }).catch(err => console.log(err))

        }
    }
    const getBudget = () => {
        UserService.getUserBudget(user.id).then(res => {
            if (res.success) {
                setBudget(res.budget);
            }
        }).catch(err => console.log(err))
    }

    useFocusEffect(
        useCallback(() => {
            getBudget();
            setChecked(false);
        }, [])
    );

    return (
        <>
            <Header title={'Lead Connect'} onPress={() => navigation.goBack()} />
            <ScrollView style={{ backgroundColor: '#F9F9FF' }} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, paddingHorizontal: 20, }}>
                    <View style={{ paddingVertical: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: "100%" }}>
                            <Text style={{ fontSize: width * 0.045, fontWeight: '700' }}>{data?.title}</Text>
                            <Text style={{ fontSize: width * 0.07, color: colors.primary, fontWeight: '700' }}>${data?.cost}</Text>
                        </View>
                    </View>
                    <View>
                        <Image style={{ width: '100%', height: width * 0.6, borderRadius: 15 }} resizeMode='cover' source={{ uri: imgUrl + data?.thumb }} />
                    </View>
                    <View>
                        <Text style={{ fontSize: width * 0.04, paddingTop: height * 0.03, fontWeight: '700', color: colors.tertiary }}>Lead Details</Text>
                        <View style={{ paddingHorizontal: 5, marginTop: height * 0.015 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="ios-location-outline" size={width * 0.045} color={colors.primary} />
                                <Text style={{ fontSize: width * 0.035, marginLeft: width * 0.03, color: colors.tertiary }}>{data?.locality} / {data?.arealvl} </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                                <MaterialCommunityIcons name="clipboard-outline" size={width * 0.045} color={colors.primary} />
                                <Text style={{ fontSize: width * 0.035, marginLeft: width * 0.03, color: colors.tertiary }}>{data?.servicename}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Ionicons name="timer-outline" size={width * 0.045} color={'#1CAE81'} />
                                <Text style={{ fontSize: width * 0.035, marginLeft: width * 0.03, color: colors.tertiary }}>{data?.status === 1 && 'Verified' || data?.status === 2 && 'Confirmed' || data?.status === 3 && 'Scheduled'}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={{ fontSize: width * 0.04, paddingTop: height * 0.03, fontWeight: '700', color: colors.tertiary }}>Additional Details</Text>
                        <View style={{ marginTop: height * 0.015 }}>
                            <Text style={{ fontSize: width * 0.035, color: colors.tertiary }}>{data?.description !== '' ? data?.description : 'No additional information has been provided.'} </Text>
                        </View>
                    </View>
                    <View style={{ marginTop: height * 0.025 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: "100%" }}>
                            <Text style={{ fontSize: width * 0.035, }}>Remaining Balance</Text>
                            <Text style={{ fontSize: width * 0.035, marginTop: -7 }}>.............................................</Text>
                            <Text style={{ fontSize: width * 0.035, color: colors.primary, fontWeight: '500' }}>${((budget - data?.cost).toFixed(2))}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: height * 0.025 }}>
                        <Button
                            onPress={() => handleOnConfirmBtnPress()}
                            title='Connect Now'
                            btnstyle={{ backgroundColor: colors.primary }}
                            btntextstyle={{ fontSize: width * 0.035, fontWeight: '900', color: colors.secondary }}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: height * 0.03, marginHorizontal: width * 0.045 }}>
                        <Checkbox.Android
                            status={checked ? 'checked' : 'unchecked'}
                            color={colors.primary}
                            onPress={() => {
                                setChecked(!checked);
                            }}
                        />
                        <Text style={{ flexShrink: 1 }}>By clicking Confirm you agree to our<Text style={{ fontWeight: '700' }}> terms and conditions.</Text></Text>
                    </View>
                    <View style={{ marginTop: height * 0.02 }}>
                        <Text style={{ fontSize: width * 0.04, fontWeight: '700', color: colors.tertiary }}>Overview</Text>

                        {tempData?.length > 0 && tempData?.map((heading, index) => (
                            <Fragment key={`term_${index.toString()}`}>
                                <View style={{ paddingVertical: height * 0.015, marginBottom: height * 0.03, borderBottomWidth: 1, width: '70%', borderBottomColor: '#8A8D9F' }}>
                                    <Text style={{ fontSize: width * 0.025, color: colors.tertiary, textTransform: 'capitalize' }}>{heading?.title}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {heading?.items?.map((item, index) => (
                                        <LeadDetailsBox
                                            key={item.toString() + '_' + index.toString()}
                                            item={item}
                                        />
                                    ))}
                                </View>
                            </Fragment>
                        ))}
                    </View>
                </View>
            </ScrollView>
            <Popup
                show={show}
                title="Error"
                description={`${(budget - data?.cost) < 0 && checked ? "Out of budget" : "Please accept our terms & conditions"}`}
                onPress={() => setShow(false)}
            />
        </>
    )
}

export default LeadConnectScreen