import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView, Dimensions, RefreshControl } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";
import Header from "../Components/Header";
import CarouselCards from "../Components/CarouselCards";
import ShadeLines from "../Components/ShadeLines";
import { useSelector, useDispatch } from "react-redux";
import { allCategories } from "../Actions/CategoryAction";
import Popup from "../Components/Popup";
import * as Update from 'expo-updates';
import * as Notifications from 'expo-notifications';
import UserService from "../Services/UserService";
import LeadService from "../Services/LeadService";
import { setChatCount, updateChats } from "../Actions/ChatActions";
import { useRoute } from '@react-navigation/native';
import LeadsCards from '../Components/LeadsCards'
import { SetScheduleCount } from "../Actions/UserActions";
import Pusher from 'pusher-js/react-native';
import moment from "moment";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const HomeScreen = ({ navigation }) => {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const user = useSelector(state => state.UserReducer.user)
    const msgCount = useSelector(state => state.ChatReducer.msgCount);
    let tempCount = msgCount;
    const [refreshing, setRefreshing] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const [leads, setLeads] = useState([]);

    const [updatevisible, setUpdateVisible] = useState(false);

    const categories = useSelector(state => state.CategoryReducer?.categories?.filter(x => x?.parentid === 0));

    const currentDate = new Date();
    const hours = currentDate.getHours();

    const getCategories = () => {
        setRefreshing(true);
        dispatch(allCategories());
        setRefreshing(false);
    }

    const getLead = () => {
        LeadService.getLeads()
            .then(res => { setLeads(res); setIsLoaded(true) })
            .catch(err => console.log(err))
    }    

    useEffect(() => {
        getLead();
        getCategories();
    }, [])  


    return (
        <>           
            <View style={styles.grandParent}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.parent1}>
                        <Header navigation={navigation} onPress={() => navigation.goBack()} blackHead={true} styledMenuIcon={true} showBell={true} showHeading={false} />
                        <Text style={[styles.parent1Text1, { color: colors.secondary }]}>Hi {user?.firstname} {user?.lastname}</Text>
                        <Text style={[styles.parent1Text2, { color: colors.primary }]}>Good {hours < 12 ? "Morning" : (hours >= 12 && hours <= 17 ? "Afternoon" : (hours >= 17 && hours <= 24 ? "Evening" : "Night"))}</Text>
                        <ShadeLines container2={{ bottom: '-10%', left: '94%' }} container={{ bottom:'-2%',left:'78%', zIndex: -1 }} />
                    </View>
                    <View style={styles.parent2}>
                        <View style={styles.container}>
                            <Text style={[styles.parent2Heading, { color: colors.tertiary }]}>Start a Quote</Text>
                            {categories?.length > 0 ?
                                <View style={styles.carousel}>
                                    <FlatList
                                        data={categories}
                                        horizontal
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={refreshing}
                                                onRefresh={() => getCategories()}
                                            />
                                        }
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item }) => (
                                            <CarouselCards
                                                item={item}
                                                onPress={() => navigation.navigate('CategoriesScreen', { id: item.id, title: item.title, fromHome: true })}
                                                key={item.id}
                                                elevationShadowStyle={elevationShadowStyle(7)}
                                            />
                                        )}
                                        keyExtractor={item => item.id}
                                    />
                                </View>
                                :
                                <ActivityIndicator animating={true} style={{ marginVertical: 20 }} size={40} color={`${colors.primary}`} />}

                            <View style={styles.containerChild}>
                                <Text style={[styles.parent2Heading, { color: colors.tertiary, width: '50%' }]}>Available Leads</Text>
                                <Text style={styles.containerChildText2} onPress={() => { navigation.navigate("BrowseLeadsScreen"); }}>See more</Text>
                            </View>
                            {isLoaded ?
                                <>
                                    <View style={styles.carousel}>
                                        <FlatList
                                            data={[...leads].splice(0, 4)}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item }) => (
                                                <LeadsCards elevationShadowStyle={elevationShadowStyle(7)} containerStyle={{ marginRight: (width > 767 ? width * 0.031 : width * 0.03), marginBottom: 0, width: width > 767 ? width * 0.3 : width * 0.425 }} onPress={() => navigation.navigate('LeadConnectScreen', item)} key={item.id} item={item} />
                                            )}
                                            keyExtractor={item => item.id}

                                        />
                                    </View>
                                    {
                                        leads.length > 4 &&
                                        <View style={styles.carousel}>
                                            <FlatList
                                                data={[...leads].splice(4, leads.length)}
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                                showsVerticalScrollIndicator={false}
                                                renderItem={({ item }) => (
                                                    <LeadsCards elevationShadowStyle={elevationShadowStyle(7)} containerStyle={{ marginRight: (width > 767 ? width * 0.031 : width * 0.03), marginBottom: 0, width: width > 767 ? width * 0.3 : width * 0.425 }} onPress={() => navigation.navigate('LeadConnectScreen', item)} key={item.id} item={item} />
                                                )}
                                                keyExtractor={item => item.id}

                                            />
                                        </View>
                                    }
                                </>
                                :
                                <ActivityIndicator animating={true} style={{ marginVertical: 20 }} size={40} color={`${colors.primary}`} />}
                        </View>
                    </View>
                </ScrollView>
            </View >
        </>
    );
}

export default HomeScreen

const elevationShadowStyle = (elevation) => {
    return {
        elevation,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0.5 * elevation },
        shadowOpacity: 0.3,
        shadowRadius: 0.8 * elevation,
    };
};

const styles = StyleSheet.create({

    grandParent: {
        flex: 1,
        backgroundColor: '#F9F9FF',
    },
    parent1: {
        backgroundColor: 'black',
        flex: 3,
        paddingBottom: 40,
        height: '100%'
    },
    parent1Text1: {
        marginTop: 20,
        fontWeight: '500',
        fontSize: width > 767 ? height * 0.025 : 20,
        paddingHorizontal: 20,
        textTransform: 'capitalize'
    },
    parent1Text2: {
        fontWeight: '700',
        fontSize: width > 767 ? height * 0.03 : 24,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    parent2: {
        flex: 9,
        marginTop: -25,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,

    },
    container: {
        flex: 9,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        padding: 25,
        backgroundColor: '#F9F9FF'
    },
    carousel: {
        width: '100%',
        marginVertical: 10,
        overflow: 'hidden',
        paddingBottom: 5
    },
    parent2Heading: {
        fontSize: width > 767 ? height * 0.025 : 18,
        fontWeight: '700',
    },
    containerChild: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center'
    },
    containerChildText2: {
        fontWeight: '500',
        fontSize: width > 767 ? height * 0.02 : 16,
        color: '#8A8D9F',
        width: '50%',
        textAlign: 'right'
    }

})