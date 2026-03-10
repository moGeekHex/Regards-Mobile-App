import React,{ useEffect, useState} from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Share } from 'react-native'
import { Head, ItemHistory, Card, Title, Hr, ButtonApp } from '../../../components';
import { font, height, width } from '../../../utils/Responsive';
import Modal from "react-native-modal";
import StepIndicator from 'react-native-step-indicator';
import { useTranslation } from "react-i18next"; 
import mement from "moment"
import AwesomeLoading from 'react-native-awesome-loading';
import Clipboard from '@react-native-clipboard/clipboard';

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { getOrder } from '../State/actions/OrderAction';

const History = ({navigation}) => {

    const [isModalVisible, setModalVisible] = useState(false);
    const [modelData, setModelData] = useState();
    const [currentSteps, setCurrentSteps] = useState(0);
    const { t, i18n } = useTranslation();
    const lang = i18n.language

    const labelsSMSEnglish = [
        ["Purchased Successfully", mement(modelData?.createdAt).format("DD-MM-YYYY (hh:mm a)") ]
        ,["Recipient Notified by WhatsApp",mement(modelData?.createdAt).add(75,"second").format("DD-MM-YYYY (hh:mm a)")]
        ,["Confirmed", mement(modelData?.updatedAt).format("DD-MM-YYYY (hh:mm a)")]
    ];

    const labelsSMSArabic =  [
        ["تم الشراء بنجاح", mement(modelData?.createdAt).format("(hh:mm a) DD-MM-YYYY")]
        ,[`تم إشعار المستلم WhatsApp`, mement(modelData?.createdAt).add(75,"second").format("(hh:mm a) DD-MM-YYYY")]
        ,["تم تأكيد الموعد", mement(modelData?.updatedAt).format("(hh:mm a) DD-MM-YYYY")]
    ];

    const labelsLinkEnglish = [
        ["Purchased Successfully", mement(modelData?.createdAt).format("DD-MM-YYYY (hh:mm a)") ]
        ,["Link Created",mement(modelData?.createdAt).add(75,"second").format("DD-MM-YYYY (hh:mm a)")]
        ,["Called and Confirmed", mement(modelData?.updatedAt).format("DD-MM-YYYY (hh:mm a)")]
    ];

    const labelsLinkArabic =  [
        ["تم الشراء بنجاح", mement(modelData?.createdAt).format("(hh:mm a) DD-MM-YYYY")]
        ,['تم انشاء رابط ', mement(modelData?.createdAt).add(75,"second").format("(hh:mm a) DD-MM-YYYY")]
        ,["تم تأكيد الموعد", mement(modelData?.updatedAt).format("(hh:mm a) DD-MM-YYYY")]
    ];
    
    const imageGroup=[
        [require("../../../assets/images/tracks/inplaced-on.png"),require("../../../assets/images/tracks/inplaced-off.png")],
        [require("../../../assets/images/tracks/processing-on.png"),require("../../../assets/images/tracks/processing-off.png")],
        [require("../../../assets/images/tracks/done-on.png"),require("../../../assets/images/tracks/done-off.png")]
    ];
    
    const customStyles = {
        separatorStrokeWidth: 1.5,
        currentStepStrokeWidth: 3,
        separatorFinishedColor: '#fff',
        separatorUnFinishedColor: '#fff',
        stepIndicatorFinishedColor: '#fff',
        stepIndicatorUnFinishedColor: '#ffffff',
        stepIndicatorCurrentColor: '#fff',
        currentStepIndicatorLabelFontSize: font('14'),
        stepIndicatorLabelCurrentColor: '#fff',
        stepIndicatorLabelFinishedColor: '#ffffff',
        stepIndicatorLabelUnFinishedColor: '#fff',
        stepStrokeCurrentColor: '#fff',
        currentStepLabelColor : '#fff',
        labelColor: "#fff",
        labelSize: font('13'),
    }

    //Redux 
    const dispatch = useDispatch();

    const { allOrder } = useSelector(state=>state.order)

    handleRepurchase = (order) => {
        navigation.push('Payment',{
            screen : "Payment",
            params : { 
                productName : lang === "english" ? order?.product?.nameEn : order?.product?.nameAr , 
                productId : order?.product?.id,
                quantity :  order?.quantity, 
                price : order?.product.price, 
                vat : order?.product?.vat
            }            
        });
    }

    handleStatueOrder = (order) => {
        if(order.status === "PROCESSING")
        {
            setCurrentSteps(1)
        }else if(order.status === "COMPLETED")
        {
            setCurrentSteps(2)
        }
    }

    const init = () => { 
        dispatch(getOrder())
    }

    useEffect(() => {
        init()
    },[])

    const copyToClipboard = () => {
        Clipboard.setString(`https://api.regards.sa/orders/enter-phone/${modelData?.linkToken}`);
    };

    const url = `https://api.regards.sa/orders/enter-phone/${modelData?.linkToken}`;
    const title = lang === "english" ? "get your gift": "احصل  علي هديتك";
    const message = lang === "english" 
        ? 
            `To complete your invitation contact : ${url}`
        : 
            `لإستكمال بيانات الدعوة الخاصة بك : ${url}`;

    const options = {
        url,
        title,
        message
   };

    const share = async (customOptions = options) => {
        try {
            await Share.share(customOptions);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <View style={styles.root}>
            <Head 
                handlePress={() => navigation.goBack()}
                title={ i18n.language === "english" ? "History" : "الطلبات السابقة" }
            />
            {
                allOrder
                ?
                <>
                    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                        {
                            allOrder?.map(order => {
                                return (
                                    <Card pushUp="2">
                                        <ItemHistory 
                                            data={order} 
                                            handleTrack={() => { setModalVisible(true), setModelData(order), handleStatueOrder(order) }}
                                            handleRepurchase={() => handleRepurchase(order)}
                                            handleInvoice={() => navigation.navigate("Invoice",{
                                                invoice : order.invoice
                                            })}
                                            disabledRepurchase={order.product.isActive && order.product.status === "ACCEPTED" && order.vendor.S_isBlocked === false ? false : true}
                                        />
                                    </Card>
                                )
                            })
                        }

                    </ScrollView>

            <Modal 
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}
                onSwipeComplete={() => setModalVisible(false)}
                swipeDirection="down"
                statusBarTranslucent
                style={{ width : width('100%'), paddingHorizontal : 0, marginHorizontal : 0 }}
            >
                <View style={styles.containerModel(modelData?.type === "Link")}>
                    <Card pushUp="2" style={styles.center}>
                        <Title text={ lang === "english" ? "TRACK ORDER" : "تتبع الطلب" } color="#3D3644" size="1.7"/>
                    </Card>
                    <Card pushUp="3" widthCard="100%">
                        <Hr pushUp="10"/>
                    </Card>
                    <Card pushUp="3" style={styles.center}>
                        <Title text={ lang === "english" ? "DETAILS" : "التفاصيل" } fontWeight="700" color="#3D3644" size="1.8"/>
                    </Card>
                    <Card pushUp="3" flexDirection={ lang === "english" ? "row" : "row-reverse" } style={styles.cardModelDetail}>
                        <Card style={[styles.center,{ width : "33.3333%" }]}>
                            <Title text={ lang === "english" ? "Order ID" : "رقم الطلب" } fontWeight="600" color="#352E3C" size="1.75"/>
                            <Card pushUp=".75">
                                <Title  text={`#`+ mement(modelData?.createdAt).format("DD")+`${modelData?.id}`+mement(modelData?.createdAt).format("MM")}fontWeight="400" color="#352E3C" size="1.75"/>
                            </Card>
                        </Card>
                        <Card style={[styles.center,{ width : "33.3333%" }]}>
                            <Title text={ lang === "english" ? "Date" : "التاريخ" } fontWeight="600" color="#352E3C" size="1.75"/>
                            <Card pushUp=".75" style={styles.center}> 
                                <Title 
                                    fontWeight="400" 
                                    color="#352E3C" 
                                    size="1.75"
                                    text={mement(modelData?.createdAt).format("DD-MM-YYYY")}
                                />
                            </Card>
                            <Card pushUp=".25">
                                <Title text={ mement(modelData?.createdAt).format('hh:mm A') } fontWeight="400" color="#352E3C" size="1.75"/>
                            </Card>
                        </Card>
                        <Card style={[styles.center,{ width : "33.3333%" }]}>
                            <Title text={ lang === "english" ? "Price" : "السعر " } fontWeight="600" color="#352E3C" size="1.75"/>
                            <Card pushUp=".75">
                                <Title 
                                    text={ 
                                        lang === "english" 
                                        ? 
                                            `${modelData?.cost * modelData?.quantity} SAR` 
                                        :   
                                            `${modelData?.cost * modelData?.quantity} ر.س` 
                                        }
                                        fontWeight="400" 
                                        color="#352E3C" 
                                        size="1.7"
                                />
                            </Card>
                        </Card>
                    </Card>
                    {
                        modelData?.type === "Link"
                        ?
                            <>
                                <Card pushUp="3" widthCard="100%">
                                    <Hr pushUp="10"/>
                                </Card>
                                <Card pushUp="3" style={styles.center}>
                                    <Title text={ lang === "english" ? "Mobile Phone Entry Link" : "رابط إدخال رقم الجوال" } fontWeight="700" color="#3D3644" size="1.8"/>
                                </Card>
                                <Card pushUp="3" flexDirection={ lang === "english" ? "row" : "row-reverse" } widthCard="100%" style={{  justifyContent : 'space-around' }}>
                                    <TouchableOpacity style={styles.Button} onPress={copyToClipboard}>
                                        <Title 
                                            size="1.55" 
                                            fontWeight="600" 
                                            letterSpacingText={1.6} 
                                            color="#4F008E" 
                                            text={ lang === "english" ? "COPY" : "نسخ" }
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.ButtonMauve}  
                                        onPress={async () => {
                                             await share();
                                        }}
                                    >
                                        <Title 
                                            size="1.5" 
                                            fontWeight="600" 
                                            letterSpacingText={1.6} 
                                            color="#fff" 
                                            text={ lang === "english" ? "SHARE LINK" : "مشاركة الرابط" }
                                        />
                                    </TouchableOpacity>
                                </Card>
                            </>
                        :
                            null
                    }
                    <Card pushUp="3" widthCard="100%">
                        <Hr pushUp="10"/>
                    </Card>
                    { 
                        modelData?.type === "SMS"
                        ?
                            <>
                                <Card pushUp="3" style={styles.center}>
                                    <Title text={ lang === "english" ? "Gift's Recipient Number" : "رقم مستلم الهدية" } fontWeight="700" color="#3D3644" size="1.7"/>
                                    <Card pushUp="1" style={styles.center}>
                                        <Title text={`+966${modelData?.receiverPhone}`} fontWeight="500" color="#3D3644" size="1.7"/>
                                    </Card>
                                </Card>
                                <Card pushUp="3" widthCard="100%">
                                    <Hr pushUp="10"/>
                                </Card>
                            </>
                        :
                            null
                    }
                    <Card pushUp="3" style={styles.center}>
                        <Title text={ lang === "english" ? "Order Updates" : "تحديثات الطلب" } fontWeight="700" color="#3D3644" size="1.7"/>
                    </Card>
                    <View style={{ height : '33%', width : "55%" }} pushUp="4">
                        <StepIndicator
                            customStyles={customStyles}
                            direction="vertical"
                            currentPosition={currentSteps}
                            labels={ 
                                        lang === "english" && modelData?.type === "SMS" 
                                        ? 
                                            labelsSMSEnglish 
                                        :
                                        lang === "arabic" && modelData?.type === "SMS" 
                                        ?
                                            labelsSMSArabic
                                        :
                                        lang === "english" && modelData?.type === "Link"    
                                        ?
                                            labelsLinkEnglish
                                        :
                                        lang === "arabic" && modelData?.type === "Link"    
                                        ?
                                            labelsLinkArabic
                                        :
                                            labelsSMSEnglish
                                    }
                            renderLabel={({position, stepStatus, label, currentPosition})=> (
                                <>
                                    <Card flexDirection={ lang === "english" ? "row" : "row-reverse" } style={styles.lableSteps(lang)}>
                                        <Card flexDirection={ lang === "english" ? "row" : "row-reverse" } style={{ alignItems : 'center' }}>
                                            <View style={{ width : 45, height : 45 }}>
                                                <Image 
                                                    style={{ width : '100%', height : '100%',  borderRadius : 100 }} 
                                                    source={ stepStatus === "finished" ? imageGroup[position][0] : stepStatus === "current" ? imageGroup[position][0] : imageGroup[position][1] }
                                                />
                                                {   
                                                    position < 2
                                                    ?
                                                        <View
                                                            style={{ 
                                                                left : '50%',
                                                                width : 1, 
                                                                height : '100%', 
                                                                backgroundColor :  stepStatus === "finished" ? "green" : stepStatus === "unfinished" ? null: stepStatus === "current" ? "#ddd" : position == 3 ? null : null , 
                                                                justifyContent : 'center', 
                                                                alignItems : 'center' 
                                                            }}
                                                        />
                                                    :
                                                        null
                                                }
                                            </View>
                                            <Card style={styles.lableStyle}>
                                                <Title 
                                                    text={label[0]} 
                                                    textAlign={ lang === "english" ? "left" : "right" }
                                                    fontWeight="600" 
                                                    color="#3D3644" 
                                                    style={{ textAlign : "center" }}
                                                    size="1.4"
                                                />
                                            </Card>
                                        </Card>
                                        <Card style={styles.descStyle} flexDirection={ lang === "english" ? "row" : "row-reverse" }>
                                            <Title text={ stepStatus === "finished" ? label[1] : null } fontWeight="400" color="#999" size="1.5"/>
                                            <Title text={ stepStatus === "current" ? label[1] : null } fontWeight="400" color="#999" size="1.5"/>
                                        </Card>
                                    </Card>
                                </>
                            )}
                        />
                    </View>
                    {/* <Card pushUp="5" widthCard="100%">
                        <ButtonApp 
                            onPress={() => { 
                                navigation.navigate('Report',{
                                    order : modelData
                                }), 
                                setModalVisible(false) 
                            }} 
                            title={ lang === "english" ? "REPORT" : "ابلاغ عن المشكلة" }
                        />
                    </Card> */}
                </View>
            </Modal>
            </>
                :
                    <AwesomeLoading indicatorId={7} size={50} isActive={true} text="loading" />
            }
        </View>
    )
}
const styles = StyleSheet.create({
    root : {
        flex : 1,
        backgroundColor : '#fff',
    },
    screen : {
        paddingHorizontal : '4%',
        // flex : 1,
        marginBottom : "20%"
    },
    containerModel : (checkLink) => ({
        flex : 1, 
        width : '100%',
        height : "100%", 
        top : checkLink ? '3%' : "15%",
        backgroundColor : '#fff', 
        borderTopEndRadius : font('18'),
        borderTopStartRadius : font('18'),
        paddingVertical : '5%',
        paddingHorizontal : '6%',
    }), 
    center : {
        alignItems : 'center',
        textAlign : 'center'
    },
    cardModelDetail : {
        justifyContent : 'space-around',
        width : '100%',
        // alignItems : "center"
    },
    Button : {
        borderWidth : 1,
        borderColor : '#ccc',
        borderRadius : font('20'),
        width : font('115'),
        paddingVertical : font('12'),
        backgroundColor : '#fff',
        justifyContent : 'center',
        alignItems : 'center'
    },
    ButtonMauve : {
        borderWidth : 1,
        borderColor : '#ccc',
        borderRadius : font('20'),
        width : font('115'),
        paddingVertical : font('13'),
        backgroundColor : '#4F008E',
        justifyContent : 'center',
        alignItems : 'center',
    },
    iconSteps : {
        // backgroundColor : '#ddd',
        // borderRadius : font('50'),
        // width : font('50'),
        // height : font('50'),
        // justifyContent : 'center',
        // alignItems : 'center',
    },
    lableSteps : (lang) => ({
        alignItems : 'center',
        width : '100%',
        // right : lang === "english" ? '50%' : '75%'
    }),
    lableStyle : {
        width : '45%',
        marginHorizontal : '5%',
        // textAlign : 'left'
    },
    descStyle : {
        width : '65%'
        // textAlign : 'right',
        // width : '50%'
    }
})

export default History