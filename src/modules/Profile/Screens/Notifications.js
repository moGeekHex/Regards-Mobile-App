import React, { useState } from 'react'
import { StyleSheet, Text, ScrollView, View } from 'react-native'
import { Head, Card } from '../../../components';
import ToggleSwitch from 'toggle-switch-react-native'
import { font } from '../../../utils/Responsive';
import { useTranslation } from "react-i18next";

const Notifications = ({navigation}) => {

     const [toggleOne, setToggleOne] = useState(1);
     const [toggleTow, setToggleTwo] = useState(2);
     const { t, i18n } = useTranslation();
     const lang = i18n.language

     return (
          <View style={styles.root}>
               <Head 
                    handlePress={() => navigation.goBack()}
                    handlePressEnd={() => navigation.navigate('EditProfile') }
                    title={ lang === "english" ? "Notifications settings" : "اعدادات الاشعارات" }
               />
               <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                    <Card pushUp="3" pushDown="1">
                         <ToggleSwitch
                              isOn={toggleOne}
                              onColor="#4F008E"
                              offColor="#999"
                              label={ lang === "english" ? "Notification 1" : "الاشعار ١" }
                              style={{   flexDirection : lang === "english" ? 'row' : "row-reverse",  justifyContent : 'space-between' }}
                              labelStyle={{ color: "#352E3C", fontWeight: "400", fontSize : font('13'), top : font('3') }}
                              size="large"
                              trackOffStyle={{ height : font('14'), width : font('50'), padding : font('13') }}
                              trackOnStyle={{ height : font('14'), width : font('50'), padding : font('13') }}
                              thumbOffStyle={{ height : font('20'), width : font('20') }}
                              thumbOnStyle={{ height : font('20'), width : font('20') }}
                              onToggle={isOn => setToggleOne(!toggleOne)}
                         />
                    </Card>
                    <Card pushUp="1" pushDown="1">
                         <ToggleSwitch
                              isOn={toggleTow}
                              onColor="#4F008E"
                              offColor="#999"
                              label={ lang === "english" ? "Notification 2" : "الاشعار ٢" }
                              style={{   flexDirection : lang === "english" ? 'row' : "row-reverse",  justifyContent : 'space-between' }}
                              labelStyle={{ color: "#352E3C", fontWeight: "400", fontSize : font('13') }}
                              size="large"
                              trackOffStyle={{ height : font('14'), width : font('50'), padding : font('13') }}
                              trackOnStyle={{ height : font('14'), width : font('50'), padding : font('13') }}
                              thumbOffStyle={{ height : font('20'), width : font('20') }}
                              thumbOnStyle={{ height : font('20'), width : font('20') }}
                              onToggle={isOn => setToggleTwo(!toggleTow)}                         />
                    </Card>
               </ScrollView>
          </View>
     )
}

const styles = StyleSheet.create({
     root : {
          flex : 1,
          backgroundColor : '#fff',
     },
     screen : {
          paddingHorizontal : '4%'
     }
})

export default Notifications