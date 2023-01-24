import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { View, StyleSheet, Text, KeyboardAvoidingView, ScrollView, Dimensions, Pressable, FlatList, RefreshControl } from 'react-native'
import InputField from '../Components/InputField'
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import { useTheme, Avatar, ActivityIndicator } from 'react-native-paper';
import Button from '../Components/Button';
import { useDispatch, useSelector } from 'react-redux';
import ClientService from '../Services/ClientService';
import { useIsFocused } from '@react-navigation/native';
import UserService from '../Services/UserService';
import EmptyScreen from './EmptyScreen';
import ClientCards from './ClientCards';
import BoxCards from './BoxCards';
import { changeBarColor } from '../Actions/UserActions';

const ClientsList = ({ title, activescreen, navigation, onSelectClient, creditsScreen = false }) => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [budget, setBudget] = useState(0);
    const [searchedClients, setSearchedClients] = useState([]);
    const [clients, setClients] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const isFocused = useIsFocused();
    const { colors } = useTheme()
    const user = useSelector(state => state.UserReducer.user)

    const filterClients = (txt) => {
        if (txt != '') {
            const filterdClients = JSON.parse(JSON.stringify(clients))
                .filter(item => item.firstname.toLowerCase().indexOf(txt.toLowerCase()) !== -1 || item.lastname.toLowerCase().indexOf(txt.toLowerCase()) !== -1)
            setSearchedClients(filterdClients);
        } else {
            setSearchedClients(clients);
        }
    }
    const getData = () => {
        setRefreshing(true);
        if (user.type == 1) {
            UserService.GetUserByClientId(user.uid).then(res => {
                setClients(res);
                setSearchedClients(res);
                setIsLoaded(true);
            }).catch(err => console.log(err))
        } else if (user.type === 2 || user.type === 3) {
            ClientService.GetClientsList().then(res => {
                if (res.success != undefined && !res.success) {

                } else {
                    setClients(res);
                    setSearchedClients(res);
                }
                setIsLoaded(true);
            }).catch(err => console.log(err))
        }
        else {
            ClientService.GetClientsByUserId(user.id).then(res => {

                if (res.success != undefined && !res.success) {

                } else {
                    setClients(res);
                    setSearchedClients(res);
                }
                setIsLoaded(true);
            }).catch(err => console.log(err))
        }
        setRefreshing(false);
    }

    const getBudget = () => {
        UserService.getUserBudget(user.id).then(res => {
            if (res.success) {
                setBudget(res.budget);
            }
        }).catch(err => console.log(err))
    }

    useEffect(() => {
        getData();
        if (creditsScreen) {
            getBudget();
        }
    }, [isFocused, creditsScreen])
    return (
        <View style={{ flex: 1, backgroundColor: '#F9F9FF' }}>
            {creditsScreen &&
                <View style={{ padding: 20, borderBottomWidth: 1, marginHorizontal: width * 0.15, marginBottom: 10, }}>
                    <Text style={{ fontSize: width * 0.045, paddingBottom: 10, fontWeight: '700', textAlign: 'center', color: 'grey' }}>Current Balance</Text>
                    <Text style={{ fontSize: width * 0.045, fontWeight: '900', textAlign: 'center' }}>${budget}</Text>

                </View>}

            <View style={{ flexDirection: 'row', padding: 20, paddingBottom: 0, alignItems: 'center', justifyContent: 'space-between' }}>
                <InputField
                    IconLeft={<AntDesign name="search1" size={20} color={`${colors.tertiary}`} />}
                    value={search}
                    onChangeText={(text) => { setSearch(text); filterClients(text) }}
                    returnKeyType={'next'}
                    placeholderTextColor={`${colors.tertiary}`}
                    placeholder="Search Clients..."
                    InputStyle={{ backgroundColor: '#F6F6F6', width: '85%', borderRadius: height * 0.06, height: height * 0.07, borderColor: "#ccc", borderWidth: 1, marginTop: 0, marginBottom: 0 }}
                />
                <Pressable onPress={() => {
                    if (search != null && search !== "") {
                        setSearch("");
                        filterClients("");
                    }
                }}>
                    <Avatar.Icon style={{ backgroundColor: '#f8e5ea' }} size={height * 0.05} icon={() => <Entypo name="cross" style={{ fontWeight: '100' }} size={30} color={`${colors.primary}`} />} />
                </Pressable>

            </View>
            {!creditsScreen && <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                {user.type != 1 &&
                    <Button onPress={() => {
                        activescreen != "NewQuotes" ? navigation.navigate('Form') :
                            navigation.navigate('Form', onSelectClient)
                    }}
                        btnstyle={{ backgroundColor: colors.primary }} btntextstyle={{ color: colors.secondary }} title={title || "Add New Client"}
                    />
                }
            </View>}

            {isLoaded ?
                <FlatList
                    data={searchedClients}
                    style={{ marginTop: 15 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='always'
                    contentContainerStyle={{ paddingBottom: height * 0.2 }}
                    ListEmptyComponent={() => <EmptyScreen
                        icon={<Feather name={'users'} size={width * 0.2} color={`${colors.primary}`} />}
                        title={'You have no clients'}
                    />}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => getData()}
                        />
                    }
                    renderItem={({ item }) => (
                        <BoxCards
                            onPress={() => {
                                dispatch(changeBarColor({ barColor: 'white', barContent: 'dark-content' }))
                                if (user.type == 1) {
                                    activescreen != "NewQuotes" &&
                                        navigation.navigate('UserProfileScreen');
                                }
                                else {
                                    activescreen != "NewQuotes" &&
                                        navigation.navigate('ClientContactInfoScreen', { data: item });
                                }
                                setSearch("");
                                filterClients("");
                            }}
                            activescreen={activescreen}
                            key={item.id}
                            elevationShadowStyle={elevationShadowStyle(7)}
                        >
                            <ClientCards
                                activescreen={activescreen}
                                item={item}
                                creditsScreen={creditsScreen}
                                onSelectClient={() => onSelectClient(item)}
                            />
                        </BoxCards>
                    )}
                    keyExtractor={item => item.id}
                />
                :
                <ActivityIndicator style={{ marginVertical: 20 }} size={40} color={`${colors.primary}`} />
            }
        </View>
    )
}

export default ClientsList
const elevationShadowStyle = (elevation) => {
    return {
        elevation,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0.5 * elevation },
        shadowOpacity: 0.3,
        shadowRadius: 0.8 * elevation,
    };
};
