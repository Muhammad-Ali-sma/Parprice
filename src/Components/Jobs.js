import React from 'react'
import { TouchableRipple, useTheme } from 'react-native-paper';
import { View, Text, FlatList, Dimensions, RefreshControl } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import BoxCards from './BoxCards';
import JobsCard from './JobsCard';
import { loadQuoteDetailsObject } from '../Actions/JobActions';
import { useDispatch, useSelector } from 'react-redux';

const Jobs = ({ data, navigation, onPress, getQuotes, isLoaded }) => {

    const { colors } = useTheme();
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const dispatch = useDispatch();
    const quote = useSelector(state => state.JobReducer.quote);
    return (
        <>
            {data?.length > 0 && <Text style={{ color: colors.tertiary, fontSize: width / 24, fontWeight: '700' }}>Sold Projects</Text>}
            <View style={{ marginTop: data?.length > 0 ? 20 : 0 }}>
                <FlatList
                    data={data}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: height * 0.4 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={!isLoaded}
                            onRefresh={() => getQuotes()}
                        />
                    }
                    ListEmptyComponent={() => <>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 20, width: '100%' }}>
                            <TouchableRipple rippleColor={colors.rippleColor} onPress={onPress} style={{ flexDirection: 'row', padding: 5, alignItems: 'center' }}>
                                <>
                                    <FontAwesome name="arrow-left" size={height * 0.025} style={{ marginRight: width * 0.02 }} color={`${colors.primary}`} />
                                    <Text style={{ color: colors.primary }}>Convert Quote to job</Text>
                                </>
                            </TouchableRipple>
                        </View>
                        <View style={{ alignItems: 'center', marginTop: height * 0.1 }}>
                            <Text style={{ color: colors.tertiary, fontSize: width * 0.045, fontWeight: '700' }}>This client has no jobs!</Text>
                            <Text style={{ color: colors.tertiary, fontSize: width * 0.035, fontStyle: 'italic' }}>This section will list the jobs created for this client</Text>
                        </View>
                    </>}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <BoxCards
                            onPress={() => { dispatch(loadQuoteDetailsObject({ ...quote, contractSigned: item?.contract_signed_at })); navigation.navigate('PresentQuoteScreen', { id: item?.id, fromClientInfo: true }) }}
                            key={item?.id}
                            elevationShadowStyle={elevationShadowStyle(5)}
                            containerStyle={{ marginHorizontal: 1 }}
                        >
                            <JobsCard item={item} />
                        </BoxCards>
                    )
                    }
                    keyExtractor={item => item?.id}

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
export default Jobs