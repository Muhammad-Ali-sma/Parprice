import { View, Text, ScrollView, Dimensions } from 'react-native'
import React from 'react'
import Header from '../Components/Header'
import { useTheme } from 'react-native-paper';
import ClientDetails from '../Components/ClientDetails';
import Button from '../Components/Button';

const JobDetailsScreen = ({ navigation, route }) => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const { colors } = useTheme()
    const data = route?.params;
    return (
        <>
            <Header title={'Job Details'} onPress={() => navigation.goBack()} />
            <ScrollView style={{ backgroundColor: '#F9F9FF' }} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1 }}>
                    <View style={{ paddingHorizontal: 20, marginTop: 15, backgroundColor: '#FAFAFA' }}>
                        <Text style={{ fontSize: width * 0.04 }}>replace windows door on house</Text>
                        <Text style={{ fontSize: width * 0.04, fontWeight: '700', marginBottom: 10, marginTop: 20, color: colors.tertiary }}>Windows</Text>
                        <ClientDetails
                            containerStyle={{ width: '100%' }}
                            showEmail={true}
                            client={data}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                            <Text style={{ fontSize: width * 0.035, fontWeight: '600', backgroundColor: colors.primary, color: colors.secondary, paddingHorizontal: 10, paddingVertical: 3 }}>Paid</Text>
                            <Text style={{ fontSize: width * 0.035, fontWeight: '600', marginHorizontal: width * 0.07, borderWidth: 1, borderColor: colors.primary, color: colors.tertiary, paddingHorizontal: 10, paddingVertical: 3 }}>From Lead Balance</Text>
                            <Text style={{ fontSize: width * 0.035, fontWeight: '600', color: colors.tertiary, paddingHorizontal: 10, paddingVertical: 3 }}>${data?.cost}</Text>
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                        <Text style={{ fontSize: width * 0.03 }}>
                            You selected to connect with this lead. All leads
                            come with phone numbers and email addresses
                            providing multiple channels to connect with
                            this homeowner.
                        </Text>
                        <Text style={{ fontSize: width * 0.03, marginTop: 20 }}>
                            <Text style={{ fontSize: width * 0.03, fontWeight: '900' }}>Tip: </Text>
                            Try messaging the customer to confirm a
                            time before you call.
                        </Text>
                        <Text style={{ fontSize: width * 0.03, marginTop: 20 }}>
                            <Text style={{ fontSize: width * 0.03, fontWeight: '900' }}>Note: </Text>
                            To add additional funds to your Lead Balance
                            speak with your territory manager.
                        </Text>
                        <View style={{ marginTop: 25 }}>
                            <Button
                                onPress={() => navigation.navigate('BrowseLeadsScreen')}
                                title='Browse Leads'
                                btnstyle={{ backgroundColor: colors.primary, height: 50 }}
                                btntextstyle={{ fontSize: width * 0.035, fontWeight: '900', color: colors.secondary }}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    )
}

export default JobDetailsScreen