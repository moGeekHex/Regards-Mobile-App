import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Head, ItemMyGift, Card, Title, Hr, ButtonApp } from '../../../components';
import { useTranslation } from "react-i18next"; 

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { getGift } from '../State/actions/MyGiftAction';

const MyGift = ({navigation}) => {

    //Redux 
    const dispatch = useDispatch();

    const { t, i18n } = useTranslation();
    const lang = i18n.language

    const { allGifts } = useSelector(state=>state.myGift)


    const init = () => { 
        dispatch(getGift())
    }

    useEffect(() => {
        init()
    },[])


    return (
        <View style={styles.root}>
            <Head 
                handlePress={() => navigation.goBack()}
                title={ i18n.language === "english" ? "My Gift" : "الهدايا" }
            />

            {
                allGifts
                ?
                    <>
                        <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                            {
                                allGifts?.map(order => {
                                    return (
                                        <Card pushUp="2">
                                            <ItemMyGift 
                                                data={order} 
                                                handleTrack={() => { setModalVisible(true), setModelData(order), handleStatueOrder(order) }}
                                                handleRepurchase={() => handleRepurchase(order)}
                                                handleInvoice={() => navigation.navigate("Invoice",{
                                                    invoice : order.invoice
                                                })}
                                                disabledRepurchase={order.product.isActive && order.product.status === "ACCEPTED"  ? false : true}
                                            />
                                        </Card>
                                    )
                                })
                            }

                        </ScrollView>
                    </>
                :
                    null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    root : {
        flex : 1,
        backgroundColor : '#fff',
    },
    screen : {
        paddingHorizontal : '4%',
        marginBottom : "5%"
    },
});

export default MyGift;
