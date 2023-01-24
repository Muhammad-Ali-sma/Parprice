import React, { useEffect, useState } from 'react'
import { View, FlatList, Dimensions, ScrollView, Text } from "react-native";
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { allCategories } from '../Actions/CategoryAction';
import { addProductToCart } from '../Actions/JobActions';
import CarouselCards from '../Components/CarouselCards';
import CustomImagePicker from '../Components/CustomImagePicker';
import Header from '../Components/Header';
import InputField from '../Components/InputField';
import Popup from '../Components/Popup';
import ProductServices from '../Services/ProductServices';

const width = Dimensions.get('window').width;
const CategoriesScreen = ({ navigation, route }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const categories = useSelector(state => state.CategoryReducer.categories);
    const [currentId, setCurrentId] = useState(route?.params?.id ?? 0);
    const user = useSelector(state => state.UserReducer.user)
    const [title, setTitle] = useState(route?.params?.title);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [prevIds, setPrevIds] = useState([]);
    const [showPopup, setShowPopup] = useState(false);


    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [productDescription, setProductDescription] = useState('');


    const onDetail = (item) => {
        let prevTemps = [...prevIds];
        if (item.parentid == 0) {
            setTitle(item.title);
            prevTemps = [0];
        }
        if (categories.filter(x => x.parentid == item.cat_id).length > 0) {
            setPrevIds([...prevTemps, item.cat_id]);
            setCurrentId(item.cat_id);
        } else {
            if (item?.parentid === 0 && item?.title === 'Add Line') {
                setShowForm(true);
            } else {
                navigation.navigate('ProductScreen', { id: item.cat_id, title: title, revertId: currentId, fromCheckout: route?.params?.fromCheckout || route?.params?.forCheckout })
            }
        }
    }
    const onBack = () => {
        let tempPrev = prevIds;
        if (currentId === tempPrev[tempPrev.length - 1]) {
            tempPrev.pop();
        }
        let lastId = tempPrev.pop();
        setPrevIds(tempPrev);
        setCurrentId(lastId);
        if (lastId == 0) {
            setTitle("Categories");
        }
        if (lastId === undefined) {
            if (route?.params?.fromCheckout || route?.params?.forCheckout) {
                setLoading(true);
                navigation.navigate('CheckoutScreen');
            } else {
                setLoading(true);
                navigation.goBack();
            }
        }
    }
    const getCategories = () => {
        setLoading(true);
        dispatch(allCategories());
        setLoading(false);
    }
    const handleOnAddBtnPress = () => {
        if(!showForm){
            navigation.navigate('CheckoutScreen');
            return false;
        }
        setIsLoading(true)
        setIsSubmitted(true);

        if (productName === "" || price === "" || productDescription === "") {
            setShowPopup(true);
            setIsLoading(false)
        } else {
            ProductServices.addProduct(productName, image, user?.id, categories.filter(x => x.parentid === -1)[0].cat_id, price, productDescription)
                .then(res => {
                    if (res?.success) {
                        let temp = res.product;
                        temp.quantity = 1
                        dispatch(addProductToCart(temp))
                        setIsSubmitted(false);
                        setProductName('');
                        setPrice('');
                        setImage(null);
                        setProductDescription('');
                        setShowForm(false);
                        setIsLoading(false);
                        navigation.navigate('CheckoutScreen')
                    }
                })
                .catch(err => {console.log(err);setIsLoading(false)})
        }

    }

    useEffect(() => {
        if (categories.length <= 0) {
            getCategories();
        }
        let prevTemps = [...prevIds];
        if (route?.params?.fromHome) {
            if (route?.params?.title === 'Add Line') {
                setShowForm(true)
            } else {
                prevTemps = [...prevTemps, route?.params?.id];
            }
        } else if (route?.params?.fromCheckout) {
            setPrevIds([]);
            prevTemps = [0];
        } else if (route?.params?.forCheckout) {
            prevTemps = [0, ...prevIds];
        } else {
            if (route?.params?.id == 0) {
                prevTemps = [];
            }
        }
        setPrevIds(prevTemps);
        setTitle(route?.params?.title);
        setCurrentId(route?.params?.id);
        setTimeout(() => {
            setLoading(false);
        }, 0);

    }, [route])


    return (
        <>
            <Header hideActionBtn={true} isLoading={isLoading} showSaveTitle={showForm ? 'Save' : "Cancel"} onPressActionBtn={handleOnAddBtnPress} navigation={navigation} showHeading={true} onPress={() => onBack()} title={title} centerTitle={true}/>
            {showForm ?
                <View style={{ flex: 1, backgroundColor: colors.secondary }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
                        <View style={{ marginHorizontal: 30, marginVertical: 10 }}>
                            <InputField
                                inputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25 }}
                                returnKeyType="next"
                                required={true}
                                label='Title'
                                value={productName}
                                isDirty={isSubmitted}
                                showLabel={false}
                                onChangeText={(text) => {
                                    setProductName(text);
                                }}
                                placeholder="Product Name"
                                placeholdercolor='#8A8D9F'
                                autoCapitalize="none"
                                blurOnSubmit={false}
                                ref={null}
                            />
                            <InputField
                                inputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25 }}
                                returnKeyType="next"
                                value={price}
                                onChangeText={(text) => {
                                    setPrice(text);
                                }}
                                isDirty={isSubmitted}
                                required={true}
                                label='Price'
                                placeholder="Product Price"
                                placeholdercolor='#8A8D9F'
                                showLabel={false}
                                autoCapitalize="none"
                                blurOnSubmit={false}
                                ref={null}
                            />
                            <InputField
                                inputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25, height: 100, padding: 10 }}
                                returnKeyType="done"
                                required={true}
                                showLabel={false}
                                label='Description'
                                value={productDescription}
                                isDirty={isSubmitted}
                                onChangeText={(text) => {
                                    setProductDescription(text);

                                }}
                                placeholder="Product Description"
                                placeholdercolor='#8A8D9F'
                                autoCapitalize="none"
                                blurOnSubmit={false}
                                ref={null}
                                multiline={true}
                                maxLength={1000}
                            />
                            <CustomImagePicker
                                image={image}
                                setImage={setImage}
                            />
                        </View>
                    </ScrollView>
                </View>
                :
                <View style={{ flex: 1, backgroundColor: '#F9F9FF' }}>
                    <View style={{ width: '100%', alignItems: 'flex-start', marginLeft: (width > 767 ? 10 : 20) }}>
                        {loading ?
                            <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                <ActivityIndicator style={{ marginVertical: 20 }} size={40} color={`${colors.primary}`} />
                            </View>
                            :
                            <FlatList
                                data={categories?.filter(x => x.parentid == currentId)}
                                numColumns={(width > 767 ? 4 : 3)}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <CarouselCards
                                        item={item}
                                        onPress={() => { onDetail(item) }}
                                        key={item.id}
                                        containerStyle={{ marginTop: 20, marginHorizontal: (width > 767 ? 0 : 1) }}
                                        imageStyle={{ borderRadius: 0 }}
                                        elevationShadowStyle={elevationShadowStyle(7)}
                                    />
                                )}
                                keyExtractor={item => item.id}
                            />
                        }
                    </View>
                </View>
            }
            <Popup show={showPopup} onPress={() => { setShowPopup(false); setLoading(false); }} title={'Error'} description={'Please fill in the required fields!'} />
        </>
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


export default CategoriesScreen