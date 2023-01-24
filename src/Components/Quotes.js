import React from 'react'
import { TouchableRipple, useTheme } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { View, Text, FlatList, Dimensions, RefreshControl } from 'react-native'
import { useDispatch } from 'react-redux';
import { clearJobDetails, updateClient } from '../Actions/JobActions';
import BoxCards from './BoxCards';
import JobsCard from './JobsCard';

const Quotes = ({ data, navigation,client,getQuotes,isLoaded }) => {

    const { colors } = useTheme();
    const dispatch = useDispatch();
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    return (
        <>
            {data?.length > 0 && <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, width: '100%' }}>
                <Text style={{ color: colors.tertiary, fontSize: width / 24, fontWeight: '700' }}>Quotes</Text>
                <TouchableRipple rippleColor={colors.rippleColor} onPress={() => { dispatch(clearJobDetails()); dispatch(updateClient(client)); navigation.navigate('CheckoutScreen') }} style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                    <>
                        <Feather name="edit" size={24} style={{ marginRight: width * 0.02 }} color={`${colors.primary}`} />
                        <Text style={{ color: colors.primary }}>New Quote</Text>
                    </>
                </TouchableRipple>
            </View>}
            <View style={{ width: '100%' }}>
                <FlatList
                    data={data}
                    ListEmptyComponent={() => <>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 20, width: '100%' }}>
                            <TouchableRipple rippleColor={colors.rippleColor} onPress={() => { dispatch(clearJobDetails()); dispatch(updateClient(client)); navigation.navigate('CheckoutScreen'); }} style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                                <>
                                    <Feather name="edit" size={height * 0.025} style={{ marginRight: width * 0.02 }} color={`${colors.primary}`} />
                                    <Text style={{ color: colors.primary }}>New Quote</Text>
                                </>
                            </TouchableRipple>
                        </View>
                        <View style={{ alignItems: 'center', marginTop: height * 0.1 }}>
                            <Text style={{ color: colors.tertiary, fontSize: width * 0.045, fontWeight: '700' }}>This client has no quotes!</Text>
                            <Text style={{ color: colors.tertiary, fontSize: width * 0.035, }}>This section will list the quotes created for this client</Text>

                        </View>
                    </>
                    }
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: height * 0.4 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={!isLoaded}
                            onRefresh={getQuotes}
                        />
                    }
                    renderItem={({ item }) => (
                        <BoxCards
                            onPress={() => navigation.navigate('QuoteScreen', { id: item.id, fromClientInfo: true })}
                            key={item.id}
                            elevationShadowStyle={elevationShadowStyle(5)}
                            containerStyle={{ marginHorizontal: 1 }}
                        >
                            <JobsCard sign={false} item={item} />
                        </BoxCards>
                    )}
                    keyExtractor={item => item.id}
                />
            </View>

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
export default Quotes