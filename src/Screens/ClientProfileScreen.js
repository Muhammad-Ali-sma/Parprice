import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Dimensions, ActivityIndicator, RefreshControl, KeyboardAvoidingView, Platform, Linking } from "react-native";
import { useTheme, Avatar } from 'react-native-paper';
import Header from '../Components/Header';
import Button from '../Components/Button';
import UserReviews from '../Components/UserReviews';
import { useDispatch, useSelector } from 'react-redux';
import { imgUrl } from '../Utils/Host';
import UserService from '../Services/UserService';
import { useIsFocused } from '@react-navigation/native';
import Popup from '../Components/Popup';
import Rating from '../Components/Rating';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ClientProfileScreen = ({ navigation, route }) => {

    const { colors } = useTheme();
    const dispatch = useDispatch();

    const company = useSelector(state => state.UserReducer.company);
    const IsFocused = useIsFocused();
    const [showPopup, setShowPopup] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [data, setData] = useState([]);
    const [totalNoOfStars, setTotalNoOfStars] = useState(0);
    const [user, setUser] = useState(route?.params);

    const getReviews = () => {
        setIsLoaded(false);
        UserService.GetReviews(user.id)
            .then(res => {
                setData(res);
                let tempRating = 0;

                res?.map(item => {
                    tempRating += Number(item?.rating);
                })

                setTotalNoOfStars(tempRating);
                setIsLoaded(true);
            })
            .catch(err => setIsLoaded(true))
    }

    useEffect(() => {
        setUser(route?.params);
        getReviews();
    }, [IsFocused])

    return (
        <>
            <Header title={"About Me"} navigation={navigation} onPress={() => { navigation.goBack() }} />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#F9F9FF', width: '100%' }}>
                <View style={{ backgroundColor: colors.secondary, borderRadius: 20, marginTop: 20, paddingVertical: 20 }}>
                    <View style={{ backgroundColor: colors.secondary, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ alignItems: 'flex-end', justifyContent: "center", width: '43%', marginRight: width * 0.03 }}>
                            {user?.avatar ? <Avatar.Image style={{ position: "relative", backgroundColor: colors.secondary }} size={width * 0.25} source={{ uri: imgUrl + user.avatar }} /> : <Avatar.Text style={{ backgroundColor: colors.tertiary }} size={width * 0.25} label={`${Array.from(user?.firstname)[0].toUpperCase()}`} />}
                        </View>
                        <View style={{ alignItems: 'flex-start', justifyContent: "center", width: '50%' }}>
                            <Text style={{ position: 'relative', color: '#2D2E49', fontSize: width * 0.04, fontWeight: '700', textTransform: 'capitalize' }}>{user.firstname + " " + user.lastname}
                            </Text>
                            <Text style={{ fontSize: width * 0.035, textTransform: 'capitalize' }}>{company?.name} </Text>
                            <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                                <Rating
                                    count={5}
                                    defaultRating={Math.round(totalNoOfStars / data?.length)}
                                    size={16}
                                    isDisabled={true}
                                />
                                <Text style={{ fontWeight: '900', marginLeft: 10, color: colors.tertiary }}>{Math.round(totalNoOfStars / data?.length)}</Text>
                            </View>
                            <Text style={{ fontSize: width * 0.03, fontWeight: '600' }}>{data?.length ? data?.length + ` Review${data?.length > 1 ? 's' : ''}` : 'Not Rated yet'}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 20 }}>
                        <View style={{ width: '45%' }}>
                            <Button btntextstyle={{ color: colors.secondary }} onPress={() => { Linking.openURL(`tel:${user?.phonenumber}`) }} btnstyle={{ backgroundColor: 'black', height: 50 }} title="Click To Call" />
                        </View>
                        <View style={{ width: '45%' }}>
                            <Button btntextstyle={{ color: colors.secondary }} onPress={() => { setShowPopup(true) }} btnstyle={{ backgroundColor: colors.primary, height: 50 }} title="Leave Review" />
                        </View>
                    </View>
                </View>
                <View style={{ width: '100%', backgroundColor: colors.secondary, paddingHorizontal: 20, alignItems: 'flex-start', paddingBottom: 10 }}>
                    <Text style={{ fontSize: 18, color: colors.tertiary, fontWeight: '700' }}>My Reviews</Text>
                    <Text style={{ fontSize: 14, color: colors.tertiary, marginTop: 10 }}>Personal reviews given to <Text style={{ fontWeight: '700' }}>{user?.firstname}</Text> based on <Text style={{ fontWeight: '700' }}>customer experiences</Text>.</Text>
                </View>
                {isLoaded ? <FlatList
                    data={data}
                    showsHorizontalScrollIndicator={false}
                    initialNumToRender={2}
                    refreshControl={
                        <RefreshControl
                            refreshing={!isLoaded}
                            onRefresh={getReviews}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <UserReviews item={item} key={item.id} />
                    )}
                    keyExtractor={item => item.id}
                    ListFooterComponent={() => (
                        <View style={{ width: '90%', alignSelf: 'center', marginVertical: 10 }}>
                            <Button btntextstyle={{ color: colors.secondary }} onPress={() => { }} btnstyle={{ backgroundColor: colors.primary, height: 50 }} title="+ Read More" />
                        </View>
                    )}
                /> : <ActivityIndicator animating={true} style={{ marginVertical: 20 }} size={40} color={`${colors.primary}`} />}
                <Popup
                    show={showPopup}
                    onPress={() => { getReviews(); setShowPopup(false) }}
                    reviewPopup={true}
                    userId={user?.id}
                />
            </KeyboardAvoidingView>
        </>
    )
}

export default ClientProfileScreen