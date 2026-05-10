import React,{ useEffect, useState } from 'react'
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native'
import { Head, ImageProfile, Card, Title, Input, InputPhone, ButtonApp } from '../../../components';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { font } from '../../../utils/Responsive';
import { useTranslation } from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage } from '../State/actions/ProfileImageAction';
import { getProfile, addProfile } from '../State/actions/ProfileAction';
import { useFocusEffect } from '@react-navigation/native';
import { appEvents } from '../../../events/appEvents';

const EditProfile = ({navigation}) => {

     const dispatch = useDispatch();
     const { imageUpdate } = useSelector(state=>state.updateImage)
     const { profile, update } = useSelector(state=>state.profile)

     const [firstName, setFirstName] = useState("");
     const [lastName, setLastName] = useState("");
     const [phone, setPhone] = useState("");
     const [email, setEmail] = useState("");
     const [disabled, setDisabled] = useState(false)
     const [myProfile, setMyProfile] = useState();
     const [userRole, setUserRole] = useState(null);

     const imagePicker = () => {
          ImagePicker.openPicker({
             width: 300,
             height: 400,
             cropping: true,
             multiple: false
         }).then(image => {
             dispatch(uploadImage(image))
         });
     }
     
     _handleGetUser = async () => {
          try {
              const user = await AsyncStorage.getItem('user')
              const userParse = JSON.parse(user)
              if(userParse)
                  setUserRole(userParse?.user?.role)
          } catch(e) {
          }
     }

     useFocusEffect(
          React.useCallback(() => {
               _handleGetUser()
               try { appEvents({ eventName: "edit_profile_started" }); } catch(e) {}
          }, [])
     );

     const addProfileItem = () => {
          setTimeout(() => {
               setDisabled(false)
          },3000)
          dispatch(addProfile(firstName, lastName, phone, email))
     }

     useEffect(() => {
          console.log(myProfile)
     },[myProfile])

     useEffect(() => {
         dispatch(getProfile())
     },[imageUpdate, update])

     useEffect(() => {
          setMyProfile(profile)
      },[profile])

     useEffect(() => {
          dispatch(getProfile())
     },[])

     useEffect(() => {
          setFirstName(profile?.firstName)
          setLastName(profile?.lastName)
          setPhone(profile?.phone)
          setEmail(profile?.email)
     },[profile])

     return (
     <View style={styles.root}>
               <Head 
                    handlePress={() => navigation.goBack()}
                    handlePressEnd={() => navigation.navigate('EditProfile') }
                    title={ useTranslation().i18n.language === "english" ? "Edit Profile Info" : "تعديل الملف الشخصي" }
               />
               <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "height" : "height"}
                    // keyboardVerticalOffset={font('100')}
               >
               <ScrollView style={styles.screen} showsVerticalScrollIndicator={false} keyboardDismissMode='on-drag'>

                    <View style={styles.containerImageProfileUpload}>
                         <ImageProfile
                              source={ myProfile?.thumbnail ? { uri : myProfile.thumbnail } : require('../../../assets/images/ph.png') }
                         />
                         {
                              myProfile && userRole === "client"
                              ? 
                                   <TouchableOpacity style={styles.containerUploadImage} onPress={() => imagePicker()}>
                                        <SimpleLineIcons name="camera" color="#222" size={font('17')}/>
                                   </TouchableOpacity>
                              :
                                   null
                         }
                    </View>
                         <Card 
                              style={styles.containerMultiInput} 
                              flexDirection={ useTranslation().i18n.language === "english" ? "row" : "row-reverse" } 
                              pushUp="5" 
                              pushDown="4"
                         >
                              <View style={styles.hafeInput}>
                                   <Card pushDown="1">
                                        <Title text={ useTranslation().i18n.language === "english" ? "First Name" : "الاسم الاول" } size="1.7" color="#3D3644"/>
                                   </Card>                         
                                   <Input 
                                        value={firstName}
                                        handleChange={value => setFirstName(value)}
                                        placeholder={ useTranslation().i18n.language === "english" ? "First Name" : "الاسم الاول" }
                                   />
                              </View>
                              <View style={styles.hafeInput}>
                                   <Card pushDown="1">
                                        <Title text={ useTranslation().i18n.language === "english" ? "Last Name" : "الاسم الاخير" } size="1.7" color="#3D3644"/>
                                   </Card>
                                   <Input 
                                        value={lastName}
                                        handleChange={value => setLastName(value)}
                                        placeholder={ useTranslation().i18n.language === "english" ? "Last Name" : "الاسم الاخير" }

                                   />
                              </View>                                   
                         </Card>
                         <Card pushUp="2">
                              <Title style={styles.center} text={ useTranslation().i18n.language === "english" ? "Phone Number" : "رقم الجوال" } size="1.7" color="#3D3644"/>
                         </Card>
                         <Card pushUp="1.25">
                              <InputPhone
                                   editable={false}
                                   value={phone}
                                   disapled={true}
                                   inputRootStyle={{ paddingRight : font('38') }}
                              />
                         </Card>
                         <Card pushUp="3">
                              <Title style={styles.center} text={ useTranslation().i18n.language === "english" ? "Email Address" : "عنوان البريد الالكتروني" }  size="1.7" color="#3D3644"/>
                         </Card>   
                         <Card pushUp="1.25">                      
                              <Input 
                                   value={email}     
                                   handleChange={value => setEmail(value)}
                                   placeholder={ useTranslation().i18n.language === "english" ? "Email Address" : "عنوان البريد الالكتروني" }
                              />
                         </Card>
                         <Card style={{ justifyContent :  'center', alignItems : 'center' }} pushUp="6">      
                              <TouchableOpacity onPress={() => navigation.navigate("DeleteAccount")}>
                                   <Title size="1.7" color="#352E3C" text={ useTranslation().i18n.language === "english" ? "Delete Account" : "حذف الحساب" }/>
                              </TouchableOpacity> 
                         </Card>
                         <Card pushUp="5">
                              <ButtonApp 
                                   title={ useTranslation().i18n.language === "english" ? "SAVE" : "حفظ" }
                                   onPress={ () =>  { setDisabled(true), addProfileItem() }}
                                   disabled={disabled}
                              />
                         </Card>
               </ScrollView>
               </KeyboardAvoidingView>
          </View>
     )
}
const styles = StyleSheet.create({
     root : {
          flex : 1,
          backgroundColor : '#fff',
     },
     screen : {
          paddingHorizontal : '5%',
          height : "100%"
          // alignItems : 'center'   
     },
     containerImageProfileUpload : {
          paddingTop : '10%',
          position : 'relative',
          alignItems : 'center' ,
     },
     containerUploadImage : {
          backgroundColor : '#F5F6F9',
          justifyContent : 'center',
          alignItems : 'center',
          width : font('35'),
          height : font('35'),
          borderRadius : font('40'),
          borderWidth: 2,
          borderColor : '#fff',
          position : 'absolute',
          top : '70%',
          right : '32%'
      },
     center : {
          alignItems : 'center' ,
          textAlign : 'center' 
     },
     containerUploadImage : {
          backgroundColor : '#F5F6F9',
          justifyContent : 'center',
          alignItems : 'center',
          width : font('35'),
          height : font('35'),
          borderRadius : font('40'),
          borderWidth: 2,
          borderColor : '#fff',
          position : 'absolute',
          top : '100%',
          right : '32%'
     },
     containerMultiInput : {
          justifyContent : 'space-between'
     },
     hafeInput : {
          width : '49%',
          justifyContent : 'center',
          alignItems : 'center'
     },
})

export default EditProfile