
import { Feather } from "@expo/vector-icons";
import React, { forwardRef, useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, Pressable } from 'react-native'
import { useTheme } from 'react-native-paper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const InputField = forwardRef((props, ref) => {
    const { colors } = useTheme();
    const [error, setError] = useState(false);
    const [showPass, setShowPass] = useState(true);

    useEffect(() => {
        if (props?.required && props?.isDirty) {
            if (props?.value.toString()?.length === 0) {
                setError(true);
            } else {
                setError(false);
            }
        }
    }, [props?.value, props?.isDirty])
    return (
        <>
            <View style={[styles.container, props.InputStyle]}>
                {props.IconLeft && <Pressable onPress={props.iconPress} style={[{ position: 'absolute', left: 20 }, props.IconStyle]}>{props.IconLeft}</Pressable>}
                {(props?.label && props.showLabel !== false) &&
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <Text style={[styles.label, { color: colors.tertiary },props.labelStyle]}>{props.label}</Text>
                        {props?.maxLength && <Text style={[styles.label, { color: colors.tertiary, fontSize: width * 0.04 }]}>{props?.value?.toString().length}/{props?.maxLength}</Text>}
                    </View>
                }
                <TextInput
                    ref={ref}
                    returnKeyType={props.returnKeyType}
                    secureTextEntry={props?.defaultEntry ? showPass : props.secureTextEntry}
                    autoCapitalize={props.autoCapitalize}
                    onSubmitEditing={props.onSubmitEditing}
                    value={props.value}
                    onChangeText={(val) => {
                        if (props?.required) {
                            if (val.length === 0) {
                                setError(true);
                            } else {
                                setError(false);
                            }
                        }
                        props.onChangeText(val);
                    }}

                    style={[styles.input, { borderColor: error ? 'red' : '#B1B1B1', borderWidth: error ? 1 : 0, paddingLeft: props.IconLeft !== undefined ? 60 : 30, paddingRight: props.IconRight !== undefined ? 60 : 30 }, props.inputStyle, props?.elevationShadowStyle]}
                    selectionColor={`${colors.primary}`}
                    underlineColor="transparent"
                    placeholder={props.placeholder}
                    placeholderTextColor={props.placeholdercolor}
                    blurOnSubmit={props.blurOnSubmit}
                    multiline={props.multiline}
                    maxLength={props.maxLength}
                    {...props}
                />
                {props.IconRight !== undefined ? <Pressable onPress={props.iconPress ? props?.iconPress : () => setShowPass(!showPass)} style={[{ position: 'absolute', right: 30, bottom: props?.label ? '9%' : '15%', zIndex: 1 }, props.IconStyle]}>{props?.defaultEntry ? !showPass ? <Feather name="eye-off" size={24} color="grey" /> : props.IconRight : props.IconRight}</Pressable> : null}
            </View>
            {error && <Text style={styles.error}>Error : {props.label} is Required!</Text>}

        </>
    );

});
export default InputField;

const styles = StyleSheet.create({

    input: {
        width: '100%',
        height: height * 0.06,
        borderRadius: height * 0.06,
        fontSize: height * 0.02,
        color: '#000',
        fontWeight: '500'
    },
    container: {
        marginBottom: 5,
        borderRadius: 25,
        width: '100%',
        marginVertical: 10,
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        textAlign: 'left',
        fontSize: width * 0.05,
        paddingVertical: 5,
        color: '#707375',
        fontWeight: '600'
    },
    error: {
        color: 'red'
    },

});
