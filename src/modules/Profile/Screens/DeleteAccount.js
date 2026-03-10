import React,{ useEffect, useState } from 'react'
import { StyleSheet, View} from 'react-native'
import { Head, ImageProfile, Card, Title, ButtonApp } from '../../../components';
import { font, fontPercent } from '../../../utils/Responsive';
import { useTranslation } from "react-i18next";

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { deleteProfileAction } from '../State/actions/ProfileAction';

const DeleteAccount = ({navigation}) => {

     const dispatch = useDispatch();
     const { deleteProfile } = useSelector(state=>state.profile)

     const handleDelete = () => {
          dispatch(deleteProfileAction())
     }

     useEffect(() => {
          if(deleteProfile)
          {
               navigation.navigate("Home")
          }
     },[deleteProfile])

     return (
          <View style={styles.root}>
               <Head 
                    handlePress={() => navigation.goBack()}
                    handlePressEnd={() => navigation.navigate('EditProfile') }
                    title={ useTranslation().i18n.language === "english" ? "Delete Account Confirmation" : "تاكيد حذف الحساب" }
               />
               <View style={styles.screen}>
                    <Card pushUp="3">
                         <Title 
                              style={{ textAlign : "center" }}
                              text={ 
                                   useTranslation().i18n.language === "english" 
                                   ? 
                                        `Notice! All your previous requests and all your personal data will be permanently deleted, and you cannot undo or recover any data related to this account after completing this process Are you sure to permanently delete your account?`
                                   : 
                                        `تنوية! سيتم حذف جميع طلباتك السابقة و جميع بياناتك الشخصية بشكل نهائي، و لا يمكنك التراجع او استرداد اي بيانات متعلقة بهذا الحساب بعد اتمام هذة العملية`
                              }  
                              size="2" 
                              color="#3D3644"
                              letterSpacingText={1}
                              lineHeight={25}
                         />
                    </Card>
                    <View style={styles.button}>
                         <Card>
                              <ButtonApp 
                                   title={ useTranslation().i18n.language === "english" ? "Cancel" : "الفاء" }
                                   onPress={ () => navigation.goBack() }
                                   lite
                              />
                         </Card>
                         <Card pushUp="2">
                              <ButtonApp 
                                   title={ useTranslation().i18n.language === "english" ? "Delete" : "حذف" }
                                   onPress={ () => handleDelete() }
                              />
                         </Card>
                    </View>
               </View>
          </View>
     )
}

const styles = StyleSheet.create({
     root : {
          flex : 1,
          backgroundColor : '#fff',
     },
     screen : {
          paddingHorizontal : "5%",
          height : "100%"
     },
     center : {
          alignItems : 'center' ,
          textAlign : 'center' 
     },
     button : {
          top : "50%",
          width : "100%",
          justifyContent : "center",
     }
})

export default DeleteAccount
