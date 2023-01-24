import React, { useEffect, useState } from 'react'
import SelectDropdown from 'react-native-select-dropdown'
import { Dimensions, StyleSheet, Text } from 'react-native'
import { Entypo } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

const width = Dimensions.get('window').width;

const SelectDropDown = (props) => {
    const [error, setError] = useState(false);
    const { colors } = useTheme();
    useEffect(() => {
        if (props?.required && props?.isDirty) {
            if (props?.value?.length === 0) {
                setError(true);
            } else {
                setError(false)
            }
        }
    }, [props?.isDirty])
    return (
        <>
            <Text style={styles.label}>{props.label}</Text>
            <SelectDropdown
                ref={props?.ref}
                defaultButtonText={props.defaultButtonText}
                renderDropdownIcon={() => <Entypo style={{ paddingRight: 10 }} name="chevron-thin-down" size={17} color="#777777" />}
                selectedRowStyle={{ backgroundColor: colors.primary }}
                selectedRowTextStyle={{ color: colors.secondary, fontWeight: '600' }}
                data={props?.data}
                value={props?.value}
                rowStyle={styles.selectRowStyle}
                buttonStyle={props?.dropDownStyle}
                buttonTextStyle={styles.selectButtonTextStyle}
                rowTextStyle={styles.selectRowTextStyle}
                dropdownStyle={styles.selectDropdownStyle}
                onSelect={(selectedItem, index) => {
                    if (props?.required) {
                        if (selectedItem.length === 0) {
                            setError(true)
                        } else {
                            setError(false)
                        }
                    }
                    props.onSelect(selectedItem,index);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                    return item
                }}
            />
            {error && <Text style={styles.error}>Error : {props.label} is Required!</Text>}

        </>
    )
}
const styles = StyleSheet.create({
    label: {
        textAlign: 'left',
        fontSize: width * 0.05,
        paddingTop: 5,
        color: '#707375',
        fontWeight: '600'
    },
    error: {
        color: 'red'
    },
    selectField: {
        backgroundColor: '#f6f6f6',
        width: '100%',
        padding: 5,
        borderRadius: 5,
        paddingVertical: 8,
        marginTop: 15,
        borderRadius: 25,
    },
    selectRowStyle: {
        borderBottomColor: 'transparent',
        overflow: 'scroll',
        backgroundColor: 'white',
    },
    selectButtonTextStyle: {
        fontSize: 15,
        textAlign: 'left',
        width: '100%',
    },
    selectRowTextStyle: {
        textAlign: 'left',
        width: '100%',
        fontSize: 15,
    },
    selectDropdownStyle: {
        borderRadius: 5,
    },
})

export default SelectDropDown