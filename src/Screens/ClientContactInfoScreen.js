import React, { useCallback, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import Header from '../Components/Header'
import { useTheme } from 'react-native-paper';
import Info from '../Components/Info';
import Activity from '../Components/Activity';
import Quotes from '../Components/Quotes';
import Jobs from '../Components/Jobs';
import Pills from '../Components/Pills';
import JobService from '../Services/JobService';
import ClientDetails from '../Components/ClientDetails';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { changeBarColor } from '../Actions/UserActions';


const ClientContactInfoScreen = ({ navigation, route }) => {

    const client = route.params?.data;
    const { colors } = useTheme();
    const [pill, setPill] = useState('Info');
    const [quotes, setQuotes] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
console.log('client',client)
    const getQuotes = () => {
        setIsLoaded(false);
        setQuotes([]);
        setJobs([]);
        JobService.GetQuotes(client?.id).then(res => {
            if (res.success == undefined) {
                if (res.filter(x => x.status === "quote")) {
                    setIsLoaded(true);
                    setQuotes(res.filter(x => x.status === "quote"));
                }
                if (res.filter(x => x.status === "job")) {
                    setIsLoaded(true);
                    setJobs(res.filter(x => x.status === "job"));
                }

            }
            setIsLoaded(true);
        }).catch(err => { console.log(err); setIsLoaded(true); })
    }
    
    useFocusEffect(
        useCallback(() => {
            dispatch(changeBarColor({ barColor: 'white', barContent: 'dark-content' }));
            getQuotes();
        }, [isFocused])
    );

    return (
        <>
            <Header title={'Client'} hideActionBtn={true} navigation={navigation} onPressActionBtn={() => navigation.navigate('Form', { id: client.id })} onPress={() => { dispatch(changeBarColor({ barColor: 'black', barContent: 'light-content' })); navigation.goBack() }} showSave={true} showSaveTitle={'Edit'} />
            <View style={{ flex: 1, backgroundColor: '#F9F9FF', alignItems: 'center' }}>
                <ClientDetails
                    client={client}
                />
                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                    <Pills
                        title={'Info'}
                        onPress={() => setPill('Info')}
                        pill={pill}
                    />
                    <Pills
                        title={'Quotes'}
                        onPress={() => setPill('Quotes')}
                        pill={pill}
                    />
                    <Pills
                        title={'Jobs'}
                        pill={pill}
                        onPress={() => setPill('Jobs')}
                    />
                    <Pills
                        title={'Activity'}
                        pill={pill}
                        onPress={() => setPill('Activity')}
                    />
                </View>
                {isLoaded ?
                    <View style={{ backgroundColor: colors.secondary, width: '100%', padding: 20, marginTop: 10, height: '100%' }}>
                        {pill === 'Info' && <Info
                            client={client}
                        />}
                        {pill === 'Quotes' && <Quotes getQuotes={getQuotes} isLoaded={isLoaded} client={client} navigation={navigation} data={quotes} />}
                        {pill === 'Jobs' && <Jobs getQuotes={getQuotes} navigation={navigation} data={jobs} isLoaded={isLoaded} onPress={() => setPill("Quotes")} />}
                        {pill === 'Activity' && <Activity client={client} />}
                    </View>
                    :
                    <ActivityIndicator animating={true} style={{ marginVertical: '35%' }} size={40} color={`${colors.primary}`} />
                }
            </View>
        </>
    )
}

export default ClientContactInfoScreen