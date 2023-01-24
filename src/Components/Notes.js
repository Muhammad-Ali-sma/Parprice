import { View, Text, Dimensions, Pressable, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { ActivityIndicator, useTheme } from 'react-native-paper'
import { AntDesign } from '@expo/vector-icons'
import Popup from './Popup'
import Button from './Button'
import InputField from './InputField'
import JobService from '../Services/JobService'
import { useIsFocused } from '@react-navigation/native'
import { useEffect } from 'react'
import BoxCards from './BoxCards'
import NotesCards from './NotesCards'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const Notes = ({ client, jobtitle, type, jobId }) => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const quote = useSelector(state => state.JobReducer.quote);
    const user = useSelector(state => state.UserReducer.user);

    const IsFocused = useIsFocused();
    const [showForm, setShowForm] = useState(false)
    const [notes, setNotes] = useState('')
    const [jobNotes, setJobNotes] = useState([])

    const [isLoaded, setIsLoaded] = useState(false);

    const { colors } = useTheme();

    const handleOnAddBtnPress = () => {
        JobService.CreateJobNote(quote?.jobId, notes, user.id)
            .then(res => {
                if (res.success) {

                    GetJobNote();
                    setShowForm(false)
                }

            })
            .catch(err => console.log(err))
    }
    const GetJobNote = () => {
        JobService.GetJobNote(quote?.jobId)
            .then(res => { setJobNotes(res); setIsLoaded(true) })
            .catch(err => console.log(err))
    }
    useEffect(() => {
        GetJobNote()
    }, [IsFocused])

    return (
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
            <ScrollView>
                {type == 'Customer' ? <>

                    <Pressable onPress={() => setShowForm(true)} style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <AntDesign name="edit" size={width * 0.043} color={`${colors.primary}`} />
                        <Text style={{ fontSize: width * 0.043, marginLeft: 5, color: colors.tertiary, textTransform: 'capitalize', fontWeight: '500' }}>Edit</Text>
                    </Pressable>
                    <View style={{ borderBottomWidth: 2, paddingBottom: 10 }}>
                        <Text style={{ fontSize: width * 0.043, color: colors.tertiary, textTransform: 'capitalize', fontWeight: '700' }}>Client</Text>
                        <Text style={{ fontSize: width * 0.040, color: '#8A8D9F', textTransform: 'capitalize', }}>{quote?.client?.firstname + " " + quote?.client?.lastname}</Text>
                    </View>
                    <View style={{ borderBottomWidth: 2, paddingBottom: 10, marginVertical: 20 }}>
                        <Text style={{ fontSize: width * 0.043, color: colors.tertiary, textTransform: 'capitalize', fontWeight: '500' }}>Property</Text>
                        <Text style={{ fontSize: width * 0.040, color: '#8A8D9F', textTransform: 'capitalize', }}>{quote?.client?.address}</Text>
                    </View>
                    <View style={{ paddingBottom: 10 }}>
                        <Text style={{ fontSize: width * 0.043, color: colors.tertiary, textTransform: 'capitalize', fontWeight: '500' }}>Job Title</Text>
                        <Text style={{ fontSize: width * 0.040, color: '#8A8D9F', textTransform: 'capitalize', }}>{quote?.title}</Text>
                    </View>
                    <Popup
                        show={showForm}
                        showForm={true}
                        onPress={() => setShowForm(false)}
                    />
                </> :
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, height: 35, width: "100%", justifyContent: 'center' }}>
                            <View style={{ width: '30%' }}>
                                <Button
                                    title={'+ Add Note'}
                                    btnstyle={{ backgroundColor: colors.secondary, borderWidth: 1, borderColor: "#ccc" }}
                                    btntextstyle={{ fontWeight: '700', color: colors.primary }}
                                    onPress={() => setShowForm(!showForm)}
                                />
                            </View>
                        </View>
                        {showForm && <View >
                            <InputField
                                inputStyle={{ backgroundColor: '#F4F5F7', borderRadius: 25, height: 100, padding: 10 }}
                                returnKeyType="done"
                                value={notes}
                                onChangeText={(text) => {
                                    setNotes(text);

                                }}
                                placeholder="Type Something..."
                                placeholdercolor='#8A8D9F'
                                autoCapitalize="none"
                                blurOnSubmit={false}
                                ref={null}
                                multiline={true}
                                maxLength={1000}
                            />
                            <Button
                                title={'Add'}
                                btnstyle={{ backgroundColor: colors.primary, marginVertical: 10, height: 35, }}
                                btntextstyle={{ fontWeight: '700', color: colors.secondary }}
                                onPress={() => handleOnAddBtnPress()}
                            />
                        </View>}
                        {isLoaded ? jobNotes.length > 0 &&
                            jobNotes?.map((item, index) => (
                                <BoxCards
                                    onPress={() => navigation.navigate('MessageBoxScreen', item)}
                                    key={item.id.toString() + "_" + index}
                                    elevationShadowStyle={elevationShadowStyle(5)}
                                    containerStyle={{ marginHorizontal: 1, marginTop: 20 }}
                                >
                                    <NotesCards item={item} />
                                </BoxCards>
                            ))
                            :
                            <ActivityIndicator style={{ marginVertical: 20 }} size={40} color={`${colors.primary}`} />}
                    </>
                }
            </ScrollView>
        </KeyboardAwareScrollView>
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
export default Notes