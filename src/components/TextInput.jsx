//import liraries
import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native'; 
import { font, fontValue, fontPercent, height, width } from '../utils/Responsive';
import { Input } from '@rneui/themed';
import Icon from '@react-native-vector-icons/evil-icons';

// create a component 
const TextInput = ({
    placeholder,
    label,
    rightIconName,
    rightIconPress,
    leftIconName, 
    leftIconPress,
    iconSize,
    iconColor,
    rootStyle,
    inputStyle,
    containerStyle,
    inputContainerStyle,
    handleChange,
    returnKeyType,
    value,
    multiline,
    onSubmitEditing,
    errorMessage,
    onPressSearch,
    onPressLeftIcon,
    borderColor = '#aaa',
    ref,
    ...restProps
}) => {

    return (
        <View style={[styles.root,rootStyle]}>
            <Input
                label={label}
                labelStyle={styles.labelStyle}
                style={[styles.inputStyle,inputStyle]}
                containerStyle={[styles.containerStyle]}
                inputContainerStyle={[styles.inputContainerStyle, inputContainerStyle,{ borderColor : borderColor }]}
                placeholder={placeholder}
                onSubmitEditing={onSubmitEditing}
                value={value}
                onChangeText={handleChange}
                returnKeyType={returnKeyType}
                multiline={multiline}
                errorMessage={errorMessage}
                errorStyle={styles.errorStyle}
                rightIcon={rightIconName ? 
                    (
                        <Icon
                            name={rightIconName}
                            onPress={rightIconPress}
                            size={fontPercent(iconSize)}
                            color={iconColor}
                            light
                            style={{ width : "100%", paddingVertical : fontValue("8"), height : "100%" }}
                        /> 
                    ) : null
                }

                leftIcon={leftIconName ? 
                    (
                        <TouchableOpacity onPress={onPressSearch}>
                            <Icon
                                name={leftIconName}
                                onPress={leftIconPress}
                                size={fontPercent(iconSize)}
                                color={iconColor}
                                style={{ width : "100%", paddingVertical : fontValue("8"), height : "100%"}}
                            /> 
                        </TouchableOpacity>
                    ) : null
                }
                ref={ref}
                {...restProps}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    root :{
        width : '100%',
        height : Platform.OS === 'ios' ? height('3.2') : height('3.2'),        
    },
    inputStyle : {
        fontSize : Platform.OS === 'ios' ? fontValue('10.5') : fontValue('11'),
        height :  Platform.OS === 'ios' ? fontValue('26') : fontValue('26'),
    },
    containerStyle : {
        paddingHorizontal : 0,
    },
    inputContainerStyle : {
        height :  Platform.OS === 'ios' ? height('6.6') : height('6.6'),
        backgroundColor : '#fff', 
        // paddingHorizontal: fontPercent('2'),
        paddingVertical: Platform.OS === 'ios' ? fontValue('4.5') : fontValue('4.5'),
        borderRadius:  fontPercent('1.5'),
        borderWidth : 1,
        borderBottomWidth:0,
        borderColor : '#707070',
    },
    errorStyle : {
        fontSize : font('11'),
        width : '100%',
        paddingHorizontal: width('2'),
        textAlign : 'right'
    }
})

//make this component available to the app
export default TextInput;