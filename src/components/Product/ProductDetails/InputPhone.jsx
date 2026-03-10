import React, { useRef } from 'react'
import { Platform, StyleSheet, Image } from 'react-native'
import Card from '../../Card'
import Title from '../../Title'
import TextInput from '../../TextInput'
import { font, fontPercent, fontValue, height, width } from '../../../utils/Responsive'
import Colors from '../../../constants/Colors'
import Icon from 'react-native-vector-icons/AntDesign'
import { Input } from '@rneui/themed';

const InputPhone = ({ 
     wide, 
     handleChange, 
     value, 
     inputRootStyle, 
     returnKeyType, 
     onSubmitEditing, 
     maxLength, 
     editable, 
     error,
     backgroundColor,
     autoFocus,
     errorMessage,
     borderColor,
     inputStyle,
     inputContainerStyle,
     disapled
}) => {

     return (
          <Card flexDirection="row" style={styles.root(error,backgroundColor)}>
               {/* <Card flexDirection="row" style={styles.containerCodeNumber}>
                    <Image source={require("../../../assets/images/Saudi_Arabia.png")} style={{ width : 22, height : 16 }}/>
                    <Title text="+966" size="1.5" color="#333" style={{ paddingLeft : font(3) }}/>
                    <Icon name="down" color="#333" size={font('10')} style={{ paddingLeft : font(3) }}/>
               </Card> */}
               <Input
                    value={value}
                    placeholder="5xxxxxxxx"
                    placeholderTextColor="#999"
                    labelStyle={styles.labelStyle}
                    style={[styles.inputStyle,inputStyle]}
                    containerStyle={[styles.containerStyle]}
                    inputContainerStyle={[styles.inputContainerStyle(backgroundColor),{ borderColor : borderColor }]}
                    onChangeText={handleChange}
                    keyboardType="numeric"
                    scrollEnabled={false}
                    multiline={false}
                    disabled={disapled}
                    leftIcon={
                         <Card flexDirection="row" style={styles.containerCodeNumber}>
                              <Image source={require("../../../assets/images/Saudi_Arabia.png")} style={{ width : 22, height : 16 }}/>
                              <Title fontWeight="bold" text="+966" size="1.5" color="#333" style={{ paddingLeft : font(3) }}/>
                              {/* <Icon name="down" color="#333" size={font('10')} style={{ paddingLeft : font(3) }}/> */}
                         </Card>
                    }
               />
               {/* <TextInput 
                    placeholder="5xxxxxxxx"
                    handleChange={handleChange}
                    value={value}
                    onSubmitEditing={onSubmitEditing}
                    rootStyle={[styles.rootStyle(wide),inputRootStyle]}
                    inputStyle={styles.inputStyle}
                    keyboardType='numeric'
                    returnKeyType={returnKeyType}
                    maxLength={maxLength}
                    editable={editable}
                    allowFontScaling={false}
                    autoFocus={autoFocus}
                    inputContainerStyle={styles.inputContainerStyle}
                    multiline={Platform.OS === "ios" ? false : true} 
                    errorMessage={errorMessage}
               /> */}
          </Card>
     )
}

const styles = StyleSheet.create({
     root : (error, backgroundColor) => ({
          // height : height('6'),
          backgroundColor : backgroundColor ? backgroundColor :  '#F6F6F6',
          width : '100%',
          borderColor : error ? "#f00" : "#F6F6F6",
          borderWidth : 1,
          borderRadius : font('18'),
     }),
     containerCodeNumber : {
          justifyContent : 'space-evenly',
          alignItems : 'center',
          marginLeft : font('15'),
          position: 'absolute',
          left : "10%"
     },
     labelStyle : {
          color : "#f00",
          backgroundColor : "#000",
          textAlign : "center"
     },
      inputStyle : {
          fontSize : Platform.OS === 'ios' ? fontValue('11') : fontValue('11'),
          height :  Platform.OS === 'ios' ? fontValue('26') : fontValue('26'),
          textAlign : "center",
      },
      containerStyle : {
          paddingHorizontal : 0,
          width : '95%',
          alignItems : "center",
          height :  Platform.OS === 'ios' ? height('5') : height('6.6'),

      },
      inputContainerStyle : (backgroundColor) => ({
          height :  Platform.OS === 'ios' ? height('5') : height('6.6'),
          // paddingHorizontal: fontPercent('2'),
          paddingVertical: Platform.OS === 'ios' ? fontValue('4.5') : fontValue('4.5'),
          borderRadius:  fontPercent('1.5'),
          borderWidth : 0,
          borderBottomWidth:0,
          backgroundColor : backgroundColor ? backgroundColor :  '#F6F6F6',
          width : '100%',
          borderRadius : font('18'),
          alignItems : "center"
     }),
      errorStyle : {
          fontSize : font('11'),
          width : '100%',
          paddingHorizontal: width('2'),
          textAlign : 'center'
      }
})

export default InputPhone