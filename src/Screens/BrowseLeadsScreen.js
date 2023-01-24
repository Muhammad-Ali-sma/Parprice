import { View, Text, FlatList, Dimensions, RefreshControl, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import Pills from '../Components/Pills'
import { useTheme } from 'react-native-paper'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import LeadsCards from '../Components/LeadsCards'
import { useIsFocused } from '@react-navigation/native'
import Loader from '../Components/Loader'
import LeadService from '../Services/LeadService'
import { changeBarColor } from '../Actions/UserActions'

const BrowseLeadsScreen = ({ navigation }) => {
    const IsFocused = useIsFocused();
    const [pill, setPill] = useState('View All');
    const [pillId, setPillId] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [Leads, setLeads] = useState([]);
    const dispatch = useDispatch();

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const categories = useSelector(state => state.CategoryReducer?.categories?.filter(x => x?.parentid === 0));

    const getLeads = () => {
        setIsLoaded(false);
        LeadService.getAllLeads()
            .then(res => {
                setLeads(res);
                setIsLoaded(true);
            })
            .catch(err => console.log(err))
    }
    useEffect(() => {
        getLeads();
    }, [IsFocused])

    return (
        <>
            <Header title={'Browse Leads'} onPress={() => { dispatch(changeBarColor({ barColor: 'black', barContent: 'light-content' })); navigation.goBack() }} />
            <View style={{ flex: 1, backgroundColor: '#F9F9FF' }}>
                <View style={{ paddingHorizontal: 20 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{ paddingVertical: height * 0.02, flexDirection: 'row', }}>
                            <Pills pill={pill} onPress={() => { setPill('View All'); setPillId(0); }} title={'View All'} />
                            {categories?.map((item, index) => (
                                <Pills key={index.toString()} pill={pill} onPress={() => { setPill(item.title); setPillId(item.id); }} title={item.title} />
                            ))}
                        </View>
                    </ScrollView>
                </View>
                <View style={{ marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    {isLoaded ?
                        <FlatList
                            data={pillId == 0 ? Leads : Leads.filter(x => x.service == pillId)}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={() => <Text style={{ fontSize: height * 0.03, color: '#343434', fontWeight: '800', paddingTop: height * 0.04 }}>Coming Soon</Text>}
                            refreshControl={
                                <RefreshControl
                                    refreshing={!isLoaded}
                                    onRefresh={() => getLeads()}
                                />
                            }
                            numColumns={2}
                            contentContainerStyle={{ paddingBottom: height * 0.2 }}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            renderItem={({ item }) => (
                                <LeadsCards elevationShadowStyle={elevationShadowStyle(7)} onPress={() => navigation.navigate('LeadConnectScreen', item)} item={item} />
                            )}
                            keyExtractor={item => item.id}
                        />
                        :
                        <View style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <Loader />
                        </View>
                    }
                </View>
            </View>
        </>
    )
}

export default BrowseLeadsScreen
const elevationShadowStyle = (elevation) => {
    return {
        elevation,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0.5 * elevation },
        shadowOpacity: 0.3,
        shadowRadius: 0.8 * elevation,
    };
};