import React,{ useCallback, useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Image, TextInput, Platform, TouchableOpacity, Switch, Text } from 'react-native'
import { Head, Input, Card, CardImage, Title, InputPhone, ButtonApp, Hr, CustomModel, UniversalImage } from '../../../components';
import { font, fontPercent, fontValue, height, width } from '../../../utils/Responsive'
import Colors from '../../../constants/Colors'
import { useTranslation } from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spinner from 'react-native-loading-spinner-overlay';
import emojiStrip from 'emoji-strip';
import Feather from '@react-native-vector-icons/feather'
import AntDesign from '@react-native-vector-icons/ant-design'
import Ionicons from '@react-native-vector-icons/ionicons'
import CheckBox from '@react-native-community/checkbox';
import ToggleSwitch from 'toggle-switch-react-native'
//Tap Payment
import RNGoSell from '@tap-payments/gosell-sdk-react-native';
import { craditConfigurations, applePayConfigurations, appCredentials } from '../../../utils/tappay';

//Tamara
import  * as TamaraPayment  from 'react-native-tamara-sdk'

//Events Firebase
import { appEvents } from '../../../events/appEvents';

//Snapchat CAPI
import { snapchatPurchaseEvent } from '../../../events/snapchatEvents';

//Adjust
import { Adjust, AdjustEvent } from "react-native-adjust";

//action
import { useDispatch, useSelector } from 'react-redux';
import { addOrder, cleanUpPayment, createOrderWithWallet } from "../State/action/PayAction"
import { createOrderWallet, cleanUpPayWallet } from "../State/action/PayWalletAction"
import { createOtpOrderWallet, cleanUpOtpPayWallet } from "../State/action/OtpPayWalletAction"
import { handleCheckPromo, handleCheckPromoReload } from "../State/action/PromoAction"
import { getMyWallet } from "../../../store/State/actions/MyWalletAction"
import { fonts } from '@rneui/base';
import WebView from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import SecretKey from '../../../utils/tamara/SecretKey.json';

const Payment = ({ route, navigation }) => {

     const navigationEffect = useNavigation();

     //Tamara init
     let API_URL = SecretKey.url
     let AUTH_TOKEN = `${"Bearer " + SecretKey.merchantKey}` 
     let NOTIFICATION_WEB_HOOK_URL = "www.regards.sa"
     let PUBLISH_KEY = SecretKey.publicKey
     let NOTIFICATION_TOKEN = SecretKey.notificationToken
     let isSandbox = false

     TamaraPayment.initSdk(AUTH_TOKEN, API_URL, NOTIFICATION_WEB_HOOK_URL, PUBLISH_KEY, NOTIFICATION_TOKEN, isSandbox)

     //
     const [clickButtonDisabled, setClickButtonDisabled] = useState(true);

     const [giftPhone, setGifPhone] = useState(true);
     const [giftShare, setGiftShare] = useState(false);
     const [payType, setPayType] = useState(false);
     const [tamaraCheckOutStatus, setTamaraCheckOutStatus] = useState(false);

     //params for user
     const [vat, setVat] = useState();
     const [giftHolderName, setGiftHolderName] = useState("");
     const [giftSenderName, setGiftSenderName] = useState("");
     const [giftHolderPhone, setGiftHolderPhone] = useState("");
     const [message, setMessage] = useState();

     //params for product
     const [quantity, setQuantity] = useState();
     const [price, setPrice] = useState();
     const [total, setTotal] = useState(0);
     const [productId, setProductId] = useState();
     const [productName, setProductName] = useState();
     const [sku, setSku] = useState();
     const [loading, setLoading] = useState(false);

     //apple pay
     const [applePayResult, setApplePayResult] = useState("")

     //data for tappay
     const [id,setId] = useState(null);
     const [email, setEmail] = useState(false);
     const [firstName, setFirstName] = useState("");
     const [lastName, setLastName] = useState("");
     const [phone, setPhone] = useState(false);
     const [userRole, setUserRole] = useState(null);
     const [contactPhone, setContactPhone] = useState(null);

     const [showAlert, setShowAlert] = useState(false);
     const [showAlertSDK, setShowAlertSDK] = useState(false);

     const [codeDiscound, onChangeCodeDiscound] = useState("")

     //wallet
     const [walletPrivateToggle, setWalletPrivateToggle] = useState(false);
     const [walletPrivateId, setWalletPrivateId] = useState(false);
     const [walletPrivateAmount, setWalletPrivateAmount] = useState(false);

     const [walletCorporateToggle, setWalletCorporateToggle] = useState(false);
     const [walletCorporateId, setWalletCorporateId] = useState(false);
     const [walletCorporateAmount, setWalletCorporateAmount] = useState(false);
     
     //redux
     const dispatch = useDispatch();

     const { order, payment, loadingData } = useSelector(state=>state.payment)
     const { loadingPromo, success, faild } = useSelector(state=>state.promo)
     const { myWallet } = useSelector(state=>state.myWallet)
     const { payWallet } = useSelector(state=>state.payWallet)
     const { otpPayWallet } = useSelector(state=>state.otpPayWallet)
     const { address } = useSelector(state=>state.location)

     const { t, i18n } = useTranslation();
     const lang = i18n.language === "english" ? "english" : "arabic"

     const _handleGetUser = async () => {
          try {
               const user = await AsyncStorage.getItem('user')
               const userParse = JSON.parse(user)
               if(userParse)
                    setId(userParse?.user?.id)
                    setEmail(userParse?.user?.email)
                    setPhone(userParse?.user?.phone)
                    setFirstName(userParse?.user?.firstName)
                    setLastName(userParse?.user?.lastName)
                    setUserRole(userParse?.user?.role)
                    setContactPhone(userParse?.user?.S_contactPhone)
                    if(userParse?.user?.role === "company")
                    {
                         setGiftSenderName(userParse?.user?.firstName + " " + userParse?.user?.lastName)
                    }
          } catch(e) {
          }
     }

     const removeEmojis = (string) => {
          // emoji regex from the emoji-regex library
          const emojiRegex = /©|®|‼|⁉|™|ℹ|[↔-↙]|↩|↪|⌚|⌛|⌨|⏏|[⏩-⏳]|[⏸-⏺]|Ⓜ|▪|▫|▶|◀|[◻-◾]|[☀-☄]|☎|☑|☔|☕|☘|☝|☠|☢|☣|☦|☪|☮|☯|[☸-☺]|♀|♂|[♈-♓]|♟|♠|♣|♥|♦|♨|♻|♾|♿|[⚒-⚔]|⚕|⚖|⚗|⚙|⚛|⚜|⚠|⚡|⚪|⚫|⚰|⚱|⚽|⚾|⛄|⛅|⛈|⛎|⛏|⛑|⛓|⛔|⛩|⛪|[⛰-⛵]|[⛷-⛺]|⛽|✂|✅|[✈-✍]|✏|✒|✔|✖|✝|✡|✨|✳|✴|❄|❇|❌|❎|[❓-❕]|❗|❣|❤|[➕-➗]|➡|➰|➿|⤴|⤵|[⬅-⬇]|⬛|⬜|⭐|⭕|〰|〽|㊗|㊙|\u{1F004}|\u{1F0CF}|\u{1F170}|\u{1F171}|\u{1F17E}|\u{1F17F}|\u{1F18E}|[\u{1F191}-\u{1F19A}]|[\u{1F1E6}-\u{1F1FF}]|\u{1F201}|\u{1F202}|\u{1F21A}|\u{1F22F}|[\u{1F232}-\u{1F23A}]|\u{1F250}|\u{1F251}|[\u{1F300}-\u{1F321}]|[\u{1F324}-\u{1F393}]|\u{1F396}|\u{1F397}|[\u{1F399}-\u{1F39B}]|[\u{1F39E}-\u{1F3F0}]|[\u{1F3F3}-\u{1F3F5}]|[\u{1F3F7}-\u{1F4FD}]|[\u{1F4FF}-\u{1F53D}]|[\u{1F549}-\u{1F54E}]|[\u{1F550}-\u{1F567}]|\u{1F56F}|\u{1F570}|[\u{1F573}-\u{1F579}]|\u{1F57A}|\u{1F587}|[\u{1F58A}-\u{1F58D}]|\u{1F590}|\u{1F595}|\u{1F596}|\u{1F5A4}|\u{1F5A5}|\u{1F5A8}|\u{1F5B1}|\u{1F5B2}|\u{1F5BC}|[\u{1F5C2}-\u{1F5C4}]|[\u{1F5D1}-\u{1F5D3}]|[\u{1F5DC}-\u{1F5DE}]|\u{1F5E1}|\u{1F5E3}|\u{1F5E8}|\u{1F5EF}|\u{1F5F3}|[\u{1F5FA}-\u{1F64F}]|[\u{1F680}-\u{1F6C5}]|[\u{1F6CB}-\u{1F6D0}]|\u{1F6D1}|\u{1F6D2}|\u{1F6D5}|[\u{1F6E0}-\u{1F6E5}]|\u{1F6E9}|\u{1F6EB}|\u{1F6EC}|\u{1F6F0}|\u{1F6F3}|[\u{1F6F4}-\u{1F6F6}]|\u{1F6F7}|\u{1F6F8}|\u{1F6F9}|\u{1F6FA}|[\u{1F7E0}-\u{1F7EB}]|[\u{1F90D}-\u{1F90F}]|[\u{1F910}-\u{1F918}]|[\u{1F919}-\u{1F91E}]|\u{1F91F}|[\u{1F920}-\u{1F927}]|[\u{1F928}-\u{1F92F}]|\u{1F930}|\u{1F931}|\u{1F932}|[\u{1F933}-\u{1F93A}]|[\u{1F93C}-\u{1F93E}]|\u{1F93F}|[\u{1F940}-\u{1F945}]|[\u{1F947}-\u{1F94B}]|\u{1F94C}|[\u{1F94D}-\u{1F94F}]|[\u{1F950}-\u{1F95E}]|[\u{1F95F}-\u{1F96B}]|[\u{1F96C}-\u{1F970}]|\u{1F971}|[\u{1F973}-\u{1F976}]|\u{1F97A}|\u{1F97B}|[\u{1F97C}-\u{1F97F}]|[\u{1F980}-\u{1F984}]|[\u{1F985}-\u{1F991}]|[\u{1F992}-\u{1F997}]|[\u{1F998}-\u{1F9A2}]|[\u{1F9A5}-\u{1F9AA}]|\u{1F9AE}|\u{1F9AF}|[\u{1F9B0}-\u{1F9B9}]|[\u{1F9BA}-\u{1F9BF}]|\u{1F9C0}|\u{1F9C1}|\u{1F9C2}|[\u{1F9C3}-\u{1F9CA}]|[\u{1F9CD}-\u{1F9CF}]|[\u{1F9D0}-\u{1F9E6}]|[\u{1F9E7}-\u{1F9FF}]|[\u{1FA70}-\u{1FA73}]|[\u{1FA78}-\u{1FA7A}]|[\u{1FA80}-\u{1FA82}]|[\u{1FA90}-\u{1FA95}]|⌚|⌛|[⏩-⏬]|⏰|⏳|◽|◾|☔|☕|[♈-♓]|♿|⚓|⚡|⚪|⚫|⚽|⚾|⛄|⛅|⛎|⛔|⛪|⛲|⛳|⛵|⛺|⛽|✅|✊|✋|✨|❌|❎|[❓-❕]|❗|[➕-➗]|➰|➿|⬛|⬜|⭐|⭕|\u{1F004}|\u{1F0CF}|\u{1F18E}|[\u{1F191}-\u{1F19A}]|[\u{1F1E6}-\u{1F1FF}]|\u{1F201}|\u{1F21A}|\u{1F22F}|[\u{1F232}-\u{1F236}]|[\u{1F238}-\u{1F23A}]|\u{1F250}|\u{1F251}|[\u{1F300}-\u{1F320}]|[\u{1F32D}-\u{1F335}]|[\u{1F337}-\u{1F37C}]|[\u{1F37E}-\u{1F393}]|[\u{1F3A0}-\u{1F3CA}]|[\u{1F3CF}-\u{1F3D3}]|[\u{1F3E0}-\u{1F3F0}]|\u{1F3F4}|[\u{1F3F8}-\u{1F43E}]|\u{1F440}|[\u{1F442}-\u{1F4FC}]|[\u{1F4FF}-\u{1F53D}]|[\u{1F54B}-\u{1F54E}]|[\u{1F550}-\u{1F567}]|\u{1F57A}|\u{1F595}|\u{1F596}|\u{1F5A4}|[\u{1F5FB}-\u{1F64F}]|[\u{1F680}-\u{1F6C5}]|\u{1F6CC}|\u{1F6D0}|\u{1F6D1}|\u{1F6D2}|\u{1F6D5}|\u{1F6EB}|\u{1F6EC}|[\u{1F6F4}-\u{1F6F6}]|\u{1F6F7}|\u{1F6F8}|\u{1F6F9}|\u{1F6FA}|[\u{1F7E0}-\u{1F7EB}]|[\u{1F90D}-\u{1F90F}]|[\u{1F910}-\u{1F918}]|[\u{1F919}-\u{1F91E}]|\u{1F91F}|[\u{1F920}-\u{1F927}]|[\u{1F928}-\u{1F92F}]|\u{1F930}|\u{1F931}|\u{1F932}|[\u{1F933}-\u{1F93A}]|[\u{1F93C}-\u{1F93E}]|\u{1F93F}|[\u{1F940}-\u{1F945}]|[\u{1F947}-\u{1F94B}]|\u{1F94C}|[\u{1F94D}-\u{1F94F}]|[\u{1F950}-\u{1F95E}]|[\u{1F95F}-\u{1F96B}]|[\u{1F96C}-\u{1F970}]|\u{1F971}|[\u{1F973}-\u{1F976}]|\u{1F97A}|\u{1F97B}|[\u{1F97C}-\u{1F97F}]|[\u{1F980}-\u{1F984}]|[\u{1F985}-\u{1F991}]|[\u{1F992}-\u{1F997}]|[\u{1F998}-\u{1F9A2}]|[\u{1F9A5}-\u{1F9AA}]|\u{1F9AE}|\u{1F9AF}|[\u{1F9B0}-\u{1F9B9}]|[\u{1F9BA}-\u{1F9BF}]|\u{1F9C0}|\u{1F9C1}|\u{1F9C2}|[\u{1F9C3}-\u{1F9CA}]|[\u{1F9CD}-\u{1F9CF}]|[\u{1F9D0}-\u{1F9E6}]|[\u{1F9E7}-\u{1F9FF}]|[\u{1FA70}-\u{1FA73}]|[\u{1FA78}-\u{1FA7A}]|[\u{1FA80}-\u{1FA82}]|[\u{1FA90}-\u{1FA95}]|[\u{1F3FB}-\u{1F3FF}]|☝|⛹|[✊-✍]|\u{1F385}|[\u{1F3C2}-\u{1F3C4}]|\u{1F3C7}|[\u{1F3CA}-\u{1F3CC}]|\u{1F442}|\u{1F443}|[\u{1F446}-\u{1F450}]|[\u{1F466}-\u{1F478}]|\u{1F47C}|[\u{1F481}-\u{1F483}]|[\u{1F485}-\u{1F487}]|\u{1F48F}|\u{1F491}|\u{1F4AA}|\u{1F574}|\u{1F575}|\u{1F57A}|\u{1F590}|\u{1F595}|\u{1F596}|[\u{1F645}-\u{1F647}]|[\u{1F64B}-\u{1F64F}]|\u{1F6A3}|[\u{1F6B4}-\u{1F6B6}]|\u{1F6C0}|\u{1F6CC}|\u{1F90F}|\u{1F918}|[\u{1F919}-\u{1F91E}]|\u{1F91F}|\u{1F926}|\u{1F930}|\u{1F931}|\u{1F932}|[\u{1F933}-\u{1F939}]|[\u{1F93C}-\u{1F93E}]|\u{1F9B5}|\u{1F9B6}|\u{1F9B8}|\u{1F9B9}|\u{1F9BB}|[\u{1F9CD}-\u{1F9CF}]|[\u{1F9D1}-\u{1F9DD}]|‍|⃣|\uFE0F|[\u{1F1E6}-\u{1F1FF}]|[\u{1F3FB}-\u{1F3FF}]|[\u{1F9B0}-\u{1F9B3}]|[\u{E0020}-\u{E007F}]|©|®|‼|⁉|™|ℹ|[↔-↙]|↩|↪|⌚|⌛|⌨|⎈|⏏|[⏩-⏳]|[⏸-⏺]|Ⓜ|▪|▫|▶|◀|[◻-◾]|[☀-☄]|★|[☇-☍]|☎|☏|☐|☑|☒|☔|☕|☖|☗|☘|[☙-☜]|☝|☞|☟|☠|☡|☢|☣|☤|☥|☦|[☧-☩]|☪|[☫-☭]|☮|☯|[☰-☷]|[☸-☺]|[☻-☿]|♀|♁|♂|[♃-♇]|[♈-♓]|[♔-♞]|♟|♠|♡|♢|♣|♤|♥|♦|♧|♨|[♩-♺]|♻|♼|♽|♾|♿|[⚀-⚅]|⚐|⚑|[⚒-⚔]|⚕|⚖|⚗|⚘|⚙|⚚|⚛|⚜|[⚝-⚟]|⚠|⚡|[⚢-⚩]|⚪|⚫|[⚬-⚯]|⚰|⚱|[⚲-⚼]|⚽|⚾|[⚿-⛃]|⛄|⛅|⛆|⛇|⛈|[⛉-⛍]|⛎|⛏|⛐|⛑|⛒|⛓|⛔|[⛕-⛨]|⛩|⛪|[⛫-⛯]|[⛰-⛵]|⛶|[⛷-⛺]|⛻|⛼|⛽|[⛾-✁]|✂|✃|✄|✅|[✈-✍]|✎|✏|✐|✑|✒|✔|✖|✝|✡|✨|✳|✴|❄|❇|❌|❎|[❓-❕]|❗|❣|❤|[❥-❧]|[➕-➗]|➡|➰|➿|⤴|⤵|[⬅-⬇]|⬛|⬜|⭐|⭕|〰|〽|㊗|㊙|[\u{1F000}-\u{1F003}]|\u{1F004}|[\u{1F005}-\u{1F0CE}]|\u{1F0CF}|[\u{1F0D0}-\u{1F0FF}]|[\u{1F10D}-\u{1F10F}]|\u{1F12F}|[\u{1F16C}-\u{1F16F}]|\u{1F170}|\u{1F171}|\u{1F17E}|\u{1F17F}|\u{1F18E}|[\u{1F191}-\u{1F19A}]|[\u{1F1AD}-\u{1F1E5}]|\u{1F201}|\u{1F202}|[\u{1F203}-\u{1F20F}]|\u{1F21A}|\u{1F22F}|[\u{1F232}-\u{1F23A}]|[\u{1F23C}-\u{1F23F}]|[\u{1F249}-\u{1F24F}]|\u{1F250}|\u{1F251}|[\u{1F252}-\u{1F2FF}]|[\u{1F300}-\u{1F321}]|\u{1F322}|\u{1F323}|[\u{1F324}-\u{1F393}]|\u{1F394}|\u{1F395}|\u{1F396}|\u{1F397}|\u{1F398}|[\u{1F399}-\u{1F39B}]|\u{1F39C}|\u{1F39D}|[\u{1F39E}-\u{1F3F0}]|\u{1F3F1}|\u{1F3F2}|[\u{1F3F3}-\u{1F3F5}]|\u{1F3F6}|[\u{1F3F7}-\u{1F3FA}]|[\u{1F400}-\u{1F4FD}]|\u{1F4FE}|[\u{1F4FF}-\u{1F53D}]|[\u{1F546}-\u{1F548}]|[\u{1F549}-\u{1F54E}]|\u{1F54F}|[\u{1F550}-\u{1F567}]|[\u{1F568}-\u{1F56E}]|\u{1F56F}|\u{1F570}|\u{1F571}|\u{1F572}|[\u{1F573}-\u{1F579}]|\u{1F57A}|[\u{1F57B}-\u{1F586}]|\u{1F587}|\u{1F588}|\u{1F589}|[\u{1F58A}-\u{1F58D}]|\u{1F58E}|\u{1F58F}|\u{1F590}|[\u{1F591}-\u{1F594}]|\u{1F595}|\u{1F596}|[\u{1F597}-\u{1F5A3}]|\u{1F5A4}|\u{1F5A5}|\u{1F5A6}|\u{1F5A7}|\u{1F5A8}|[\u{1F5A9}-\u{1F5B0}]|\u{1F5B1}|\u{1F5B2}|[\u{1F5B3}-\u{1F5BB}]|\u{1F5BC}|[\u{1F5BD}-\u{1F5C1}]|[\u{1F5C2}-\u{1F5C4}]|[\u{1F5C5}-\u{1F5D0}]|[\u{1F5D1}-\u{1F5D3}]|[\u{1F5D4}-\u{1F5DB}]|[\u{1F5DC}-\u{1F5DE}]|\u{1F5DF}|\u{1F5E0}|\u{1F5E1}|\u{1F5E2}|\u{1F5E3}|[\u{1F5E4}-\u{1F5E7}]|\u{1F5E8}|[\u{1F5E9}-\u{1F5EE}]|\u{1F5EF}|[\u{1F5F0}-\u{1F5F2}]|\u{1F5F3}|[\u{1F5F4}-\u{1F5F9}]|[\u{1F5FA}-\u{1F64F}]|[\u{1F680}-\u{1F6C5}]|[\u{1F6C6}-\u{1F6CA}]|[\u{1F6CB}-\u{1F6D0}]|\u{1F6D1}|\u{1F6D2}|\u{1F6D3}|\u{1F6D4}|\u{1F6D5}|[\u{1F6D6}-\u{1F6DF}]|[\u{1F6E0}-\u{1F6E5}]|[\u{1F6E6}-\u{1F6E8}]|\u{1F6E9}|\u{1F6EA}|\u{1F6EB}|\u{1F6EC}|[\u{1F6ED}-\u{1F6EF}]|\u{1F6F0}|\u{1F6F1}|\u{1F6F2}|\u{1F6F3}|[\u{1F6F4}-\u{1F6F6}]|\u{1F6F7}|\u{1F6F8}|\u{1F6F9}|\u{1F6FA}|[\u{1F6FB}-\u{1F6FF}]|[\u{1F774}-\u{1F77F}]|[\u{1F7D5}-\u{1F7DF}]|[\u{1F7E0}-\u{1F7EB}]|[\u{1F7EC}-\u{1F7FF}]|[\u{1F80C}-\u{1F80F}]|[\u{1F848}-\u{1F84F}]|[\u{1F85A}-\u{1F85F}]|[\u{1F888}-\u{1F88F}]|[\u{1F8AE}-\u{1F8FF}]|\u{1F90C}|[\u{1F90D}-\u{1F90F}]|[\u{1F910}-\u{1F918}]|[\u{1F919}-\u{1F91E}]|\u{1F91F}|[\u{1F920}-\u{1F927}]|[\u{1F928}-\u{1F92F}]|\u{1F930}|\u{1F931}|\u{1F932}|[\u{1F933}-\u{1F93A}]|[\u{1F93C}-\u{1F93E}]|\u{1F93F}|[\u{1F940}-\u{1F945}]|[\u{1F947}-\u{1F94B}]|\u{1F94C}|[\u{1F94D}-\u{1F94F}]|[\u{1F950}-\u{1F95E}]|[\u{1F95F}-\u{1F96B}]|[\u{1F96C}-\u{1F970}]|\u{1F971}|\u{1F972}|[\u{1F973}-\u{1F976}]|[\u{1F977}-\u{1F979}]|\u{1F97A}|\u{1F97B}|[\u{1F97C}-\u{1F97F}]|[\u{1F980}-\u{1F984}]|[\u{1F985}-\u{1F991}]|[\u{1F992}-\u{1F997}]|[\u{1F998}-\u{1F9A2}]|\u{1F9A3}|\u{1F9A4}|[\u{1F9A5}-\u{1F9AA}]|[\u{1F9AB}-\u{1F9AD}]|\u{1F9AE}|\u{1F9AF}|[\u{1F9B0}-\u{1F9B9}]|[\u{1F9BA}-\u{1F9BF}]|\u{1F9C0}|\u{1F9C1}|\u{1F9C2}|[\u{1F9C3}-\u{1F9CA}]|\u{1F9CB}|\u{1F9CC}|[\u{1F9CD}-\u{1F9CF}]|[\u{1F9D0}-\u{1F9E6}]|[\u{1F9E7}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FA73}]|[\u{1FA74}-\u{1FA77}]|[\u{1FA78}-\u{1FA7A}]|[\u{1FA7B}-\u{1FA7F}]|[\u{1FA80}-\u{1FA82}]|[\u{1FA83}-\u{1FA8F}]|[\u{1FA90}-\u{1FA95}]|[\u{1FA96}-\u{1FFFD}]/gu;
          return emojiStrip(string).replace(emojiRegex, '');
     }

     useEffect(() => {
          setLoading(false)
          dispatch(getMyWallet())
     },[])

     useEffect(() => {
          if(giftShare && payType && giftHolderName.trim().length !== 0 && giftSenderName.trim().length !== 0)
          {
               setClickButtonDisabled(false)
          }else if(giftPhone && payType && giftHolderPhone.length === 9 && giftHolderPhone.startsWith("5") && giftHolderName.trim().length !== 0  && giftSenderName.trim().length !== 0 )
          {
               setClickButtonDisabled(false)
          }else if(giftPhone && giftHolderPhone.length === 9 && giftHolderPhone.startsWith("5") && giftHolderName.trim().length !== 0  && userRole === "company"  )
          {
               setClickButtonDisabled(false)
          }else if(walletPrivateToggle && quantity * price <= walletPrivateAmount && giftPhone && giftHolderPhone.length === 9 && giftHolderPhone.startsWith("5") && giftHolderName.trim().length !== 0 && giftSenderName.trim().length !== 0 || walletPrivateToggle && giftPhone && giftHolderPhone.length === 9 && giftHolderPhone.startsWith("5") && giftHolderName.trim().length !== 0 && giftSenderName.trim().length !== 0 && totalWithPromo <= walletPrivateAmount || walletCorporateToggle && quantity * price <= walletCorporateAmount && giftPhone && giftHolderPhone.length === 9 && giftHolderPhone.startsWith("5") && giftHolderName.trim().length !== 0 && giftSenderName.trim().length !== 0 || walletCorporateToggle && totalWithPromo <= walletCorporateAmount && giftPhone && giftHolderPhone.length === 9 && giftHolderPhone.startsWith("5") && giftHolderName.trim().length !== 0 && giftSenderName.trim().length !== 0){
               setClickButtonDisabled(false)
          }else if(walletPrivateToggle && quantity * price <= walletPrivateAmount && giftShare  && giftHolderName.trim().length !== 0 && giftSenderName.trim().length !== 0 || walletPrivateToggle && giftShare && giftHolderName.trim().length !== 0 && giftSenderName.trim().length !== 0 && totalWithPromo <= walletPrivateAmount || walletCorporateToggle && quantity * price <= walletCorporateAmount && giftShare && giftHolderName.trim().length !== 0 && giftSenderName.trim().length !== 0 || walletCorporateToggle && totalWithPromo <= walletCorporateAmount && giftShare && giftHolderName.trim().length !== 0 && giftSenderName.trim().length !== 0){
               setClickButtonDisabled(false)
          }else{
               setClickButtonDisabled(true)
          }
     },[giftShare, giftPhone, giftHolderName, giftHolderPhone, giftSenderName, payType, walletPrivateToggle, walletCorporateToggle])

     useEffect(() => {
          if(order)
          {
               onPay()
          }
     },[order])

     useEffect(() => {
          if(payment)
          {
               //wallet
               // var adjustEvent = new AdjustEvent("gr3gac");
               // adjustEvent.setRevenue(payment?.cost,"SAR")
               // Adjust.trackEvent(adjustEvent);
               navigation.navigate("Thanks",{ paymentDetails : [payment] })
          }
     },[payment])
     
     useEffect(() => {
          setLoading(loadingData)
     },[loadingData])

     useEffect(() => {
          if(otpPayWallet)
          {
               let type = giftPhone ? "SMS" : giftShare ? "Link" : null;
               navigation.navigate("CheckOtp",{ 
                    productId : productId,
                    quantity : quantity,
                    giftHolderName : giftHolderName,
                    giftHolderPhone : giftHolderPhone,
                    giftSenderName : giftSenderName,
                    message : message,
                    type : type,
                    contactPhone : contactPhone
               })
          }
     },[otpPayWallet])

     useEffect(() => {
          _handleGetUser()
     },[])

     useEffect(() => {
          setQuantity(route?.params?.quantity)
          setPrice(route?.params?.price)
          setProductId(route?.params?.productId)
          setProductName(route?.params?.productName)
          setTotal(route?.params?.price * route?.params?.quantity)
          setVat(route?.params?.vat)
          setSku(route?.params?.sku)
     },[route?.params?.quantity, route?.params?.price, route?.params?.productId, route?.params?.sku, route?.params?.productName])

     useEffect(() => {
          if(success || faild || loadingPromo)
               dispatch(handleCheckPromoReload())
     },[codeDiscound])

     useEffect(() => {
          setWalletPrivateToggle(false)
          setWalletCorporateToggle(false)
          setPayType(null)
     },[success])

     // {
     //      "id": 5,
     //      "code": "1343REG",
     //      "typeCode": "CashBack",
     //      "status": "Unlimited",
     //      "type": "Percentage",
     //      "limit": 10,
     //      "value": 10,
     //      "isActive": true
     // }

     useEffect(() => {
          if(myWallet){
               myWallet.map((wallet) => {
                    if(wallet.type === "PRIVATE"){
                         setWalletPrivateId(wallet.id)
                         setWalletPrivateAmount(wallet.amount)
                    }else if(wallet.type === "CORPORATE"){
                         setWalletCorporateId(wallet.id)
                         setWalletCorporateAmount(wallet.amount)
                    }
               })
          }
     },[myWallet])

     const vatValue = (( price * vat ) /  100 ) * quantity;

     const originalPriceWithQuntity = price * quantity;
     const originalPrice = ( originalPriceWithQuntity * ( 100 - vat ) ) /  100

     const totalDiscountPromo = success?.type === "Amount" ? success?.value :  success?.type === "Percentage" ?  (total * success?.value) / 100 : 0

     const totalWithPromo = success?.typeCode === "Discount" ? total - totalDiscountPromo : total
     //total / 10

     const priceWithoutVat = ( price * ( 100 - vat ) ) /  100

     const _handleCreateOrder = () => {
          let type = giftPhone ? "SMS" : giftShare ? "Link" : null;
          let validPromo = success ? codeDiscound : null

          const cost = quantity * price
          if(walletPrivateToggle && cost <= walletPrivateAmount || walletPrivateToggle && totalWithPromo <= walletPrivateAmount || walletCorporateToggle && cost <= walletCorporateAmount || walletCorporateToggle && totalWithPromo <= walletCorporateAmount )
          {
               let walletType = walletPrivateToggle && walletCorporateToggle ? "ALL" : walletCorporateToggle ? "CORPORATE" : walletPrivateToggle ? "PRIVATE" : "ALL"
               dispatch(createOrderWithWallet(productId, quantity, giftHolderName, giftHolderPhone, giftSenderName, message, type, walletType, validPromo))
          }else{
               dispatch(addOrder(payType, productId, quantity, giftHolderName, giftHolderPhone, giftSenderName, message, type, validPromo, walletPrivateToggle, walletCorporateToggle, address ))
          }
     }


     const _handleCreateOrderWallet = () => {
          let type = giftPhone ? "SMS" : giftShare ? "Link" : null;
          dispatch(createOrderWallet(productId, quantity, giftHolderName, giftHolderPhone, giftSenderName, message, type ))
     }

     const _handleSendOtpOrderWallet = () => {
          dispatch(createOtpOrderWallet())
     }

     const _handleNumberPhone = (number) => {     
          const filterDecode = (str) => {
              return str = str.replace(/[\u202d-\uF8FF\u202c]/g, '');
          }

          var
          persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
          arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
          fixNumbers = function (str)
          {
               if(typeof str === 'string'){
                    for(var i=0; i<10; i++)
                    {
                         str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
                    }
               }
               return str;
          };

          const decodeNumber = filterDecode(number);
          const replaceNumber = Platform.OS === "ios" ? fixNumbers(decodeNumber).replaceAll(' ', '') : fixNumbers(decodeNumber)

          if(replaceNumber.startsWith("+966"))
          {    
               return replaceNumber.toString().substring(4);
          }else if(replaceNumber.startsWith("05")) {
               return replaceNumber.toString().substring(1);
          }else if(replaceNumber.startsWith("00966")){
               return replaceNumber.toString().substring(5);
          }

          return replaceNumber.replace(/[^0-9]/g, '');
     }

     const onPay = async () => {

          if(order && id)
          {
               const customer = {
                    isdNumber: '966',
                    number: phone ? phone : '',
                    customerId: '',
                    first_name: order ? `${order[0].id}` : " ",
                    middle_name: ',',
                    last_name: "",
                    email: email ? email : "clients@regards.sa",
               };

               if(payType === "apple" && order[0]?.payment_type === "TAP_PAY")
               {
                    RNGoSell.goSellSDK.startPayment(applePayConfigurations(String(walletPrivateToggle || walletCorporateToggle ? order[0]?.cost - order[0]?.walletPay : order[0]?.cost),customer,order[0].id), 0, (error, status) => {

                         setTimeout(() => {
                              setClickButtonDisabled(false)
                         },3500)

                         var myString = JSON.stringify(status);
                         var resultStr = String(status.sdk_result)

                         switch (resultStr) {
                              case 'SUCCESS':
                                   chargeSDKResult(status)
                              break

                              case 'CANCELLED':
                                   setClickButtonDisabled(false)
                                   dispatch(cleanUpPayment())
                              break

                              case 'DECLINED':
                                   handleSDKResult(status)
                              break

                              case 'FAILED':
                                   handleSDKResult(status)
                              break

                              case "SDK_ERROR":
                                   setShowAlertSDK(true)
                              break
                              
                                   case "NOT_IMPLEMENTED":
                              break
                         }
                    }) 
               }else if(payType === "cradit" && order[0]?.payment_type === "TAP_PAY")
               {
                    RNGoSell.goSellSDK.startPayment(craditConfigurations(String(walletPrivateToggle || walletCorporateToggle ? order[0]?.cost - order[0]?.walletPay : order[0]?.cost),customer,order[0].id), 0, (error, status) => {

                         setTimeout(() => {
                              setClickButtonDisabled(false)
                         },3500)

                         var myString = JSON.stringify(status);
                         var resultStr = String(status.sdk_result)

                         switch (resultStr) {
                              case 'SUCCESS':
                                   chargeSDKResult(status)
                              break

                              case 'CANCELLED':
                                   setClickButtonDisabled(false)
                                   dispatch(cleanUpPayment())
                              break

                              case 'DECLINED':
                                   handleSDKResult(status)
                              break

                              case 'FAILED':
                                   handleSDKResult(status)
                              break

                              case "SDK_ERROR":
                                   setShowAlertSDK(true)
                              break
                              
                                   case "NOT_IMPLEMENTED":
                              break
                         }
                    }) 
               }else if(payType === "tamara" && order[0]?.payment_type === "TAMARA")
               {
                    setTamaraCheckOutStatus(order)
               }
          }
     }

     const handleSDKResult = (result) => {
          switch (result['trx_mode']) {
               case "CHARGE":
                    chargeSDKResult(result);
               break;
          
               case "AUTHORIZE":
                    printSDKResult(result);
               break;
          
               case "SAVE_CARD":
                    printSDKResult(result);
               break;
          
               case "TOKENIZE":
                    Object.keys(result).map((key) => {
                         console.log(`TOKENIZE \t${key}:\t\t\t${result[key]}`);
                    })
               break;
          }
     }
      
     const  printSDKResult = (result) => {
          if (!result) return
          Object.keys(result).map((key) => {
               if(result['status'] === "CANCELLED")
               {
                    setClickButtonDisabled(false)
                    dispatch(cleanUpPayment())
               }else{
                    setClickButtonDisabled(false)
                    setShowAlert(true)
               }
          })
     }

     const chargeSDKResult = async (result) => {
          // Object.keys(result).map((key) => {
               if(result['status'] === "CAPTURED")
               {
                    let charge_id = result.charge_id;
                    await dispatch(cleanUpPayment())
                    if(charge_id)
                    {
                         try{
                              const items = order ? order.map((item, index) => ({
                                   item_id: item.productId,
                                   item_name: item.productName || 'unknown',
                                   price: item.price,
                                   quantity: item.quantity,
                                   index: index
                              })) : [];

                              appEvents({
                                   eventName : "purchase",
                                   payload : {
                                        currency : "SAR",
                                        value : order?.[0]?.cost,
                                        transaction_id : charge_id,
                                        coupon : codeDiscound ? codeDiscound : undefined,
                                        shipping : 0,
                                        tax : 15,
                                        items: items
                                   }
                              })
                         } catch (error) {
                         }    
                         let payCost = order?.[0]?.walletPay ? order?.[0]?.cost - order?.[0]?.walletPay : order?.[0]?.cost;

                         var adjustEvent = new AdjustEvent("gr3gac");
                         adjustEvent.setRevenue(payCost)
                         adjustEvent.setProductId(order?.[0]?.productId)
                         adjustEvent.addPartnerParameter(order?.[0]?.vendorId)
                         adjustEvent.setPurchaseToken(order?.[0]?.id)
                         Adjust.trackEvent(adjustEvent);

                         // charge_id doubles as Snap's event_id, so a retried
                         // callback is deduplicated instead of double-counted.
                         snapchatPurchaseEvent({
                              price : payCost,
                              currency : "SAR",
                              transactionId : charge_id,
                              numberOfItems : order?.[0]?.quantity ?? 1,
                              itemId : order?.[0]?.productId
                         });

                         navigation.navigate("Thanks",{ paymentDetails : order })
                    }
                    
               }else if(result['status'] === "DECLINED"){
                    dispatch(cleanUpPayment())
                    setShowAlert(true)

               }else {
                    dispatch(cleanUpPayment())
                    setShowAlert(true)
               }
          // })
     }

     const handleCheckPromoCode = () => {
          // console.log("click button")
          dispatch(handleCheckPromo(codeDiscound))
     }

     const handleTamaraSuccess = () => {
     }

     const handleTamaraFail = (handleFail) => {
          console.log("handleFail ", handleFail)
          setTamaraCheckOutStatus(null)
     }

     const handleTamaraCancel = (handleCancel) => {
          console.log("handleCancel ", handleCancel)
          setTamaraCheckOutStatus(null)
     }

     const ChechOutTamara = () => {
          if(tamaraCheckOutStatus) {
               // navigationEffect.navigate.name= "home"
               return (
                    <View style={{  height : height("90") }}>
                         <View style={{position: "absolute", backgroundColor: 'rgba(0,0,0,0.2)',  top: 0, bottom: 0, right: 0,left: 0 }}>
                                   <View style={styles.containerTamara}>
                                        {/* <WebView
                                             originWhitelist={['*']}
                                             source={{ uri: tamaraCheckOutStatus?.tamaraCheckout?.checkout_url }}
                                             onLoadStart={handleLoadStart => {
                                                  if(handleLoadStart.nativeEvent.canGoBack){
                                                       console.log(handleLoadStart.nativeEvent)
                                                       setTamaraCheckOutStatus(false)
                                                  }else{
                                                       console.log("nativeEvent ",handleLoadStart.nativeEvent)
                                                  }
                                             }}
                                             onError={() => console.log('Webview load url fail')}
                                             javaScriptEnabled
                                             domStorageEnabled
                                             allowsInlineMediaPlayback
                                             mediaCapturePermissionGrantType={'grant'}
                                             mediaPlaybackRequiresUserAction={false}
                                        /> */}
                                        <TamaraPayment.TamaraCheckoutURL
                                             checkoutURL={tamaraCheckOutStatus?.tamaraCheckout?.checkout_url}
                                             successURL={"https://api.regards.sa/tamara/success"}
                                             failURL={"https://api.regards.sa/tamara/closed "}
                                             cancelURL={"https://api.regards.sa/tamara/closed"}
                                             onSuccess={(callBackSuccess) => {
                                                  setTamaraCheckOutStatus(false)

                                                  try {
                                                       const items = order ? order.map((item, index) => ({
                                                            item_id: item.productId,
                                                            item_name: item.productName || 'unknown',
                                                            price: item.price,
                                                            quantity: item.quantity,
                                                            index: index
                                                       })) : [];
                         
                                                       appEvents({
                                                            eventName : "purchase",
                                                            payload : {
                                                                 currency : "SAR",
                                                                 value : order?.[0]?.cost,
                                                                 transaction_id : order?.[0]?.id || "tamara_txn",
                                                                 coupon : codeDiscound ? codeDiscound : undefined,
                                                                 shipping : 0,
                                                                 tax : 15,
                                                                 items: items
                                                            }
                                                       })
                                                  } catch (error) {}

                                                  var adjustEvent = new AdjustEvent("gr3gac");
                                                  adjustEvent.setRevenue(order?.[0]?.cost,"SAR")
                                                  adjustEvent.setProductId(order?.[0]?.productId)
                                                  adjustEvent.addPartnerParameter(order?.[0]?.vendorId)
                                                  adjustEvent.setPurchaseToken(order?.[0]?.id)
                                                  Adjust.trackEvent(adjustEvent);

                                                  snapchatPurchaseEvent({
                                                       price : order?.[0]?.cost,
                                                       currency : "SAR",
                                                       transactionId : order?.[0]?.id,
                                                       numberOfItems : order?.[0]?.quantity ?? 1,
                                                       itemId : order?.[0]?.productId
                                                  });

                                                  navigation.navigate("Thanks",{ paymentDetails : [order] })
                                             }}
                                             onFail={(callBackFail) => {
                                                  setTamaraCheckOutStatus(false)

                                                  console.log("callBackFail ", callBackFail)
                                             }}
                                             onCancelURL={(callBackCancel) => {
                                                  setTamaraCheckOutStatus(false)
                                                  console.log("callBackCancel ", callBackCancel)
                                             }}
                                        />
                                 </View>
                              
                         </View>
                    </View>
               )
          }else{
               null
          }
     }
     
     return (
          <View style={styles.root}>
               {/* <Spinner
                    visible={loading}
                    textContent={ lang === "english" ? "Please wait" : "يرجي الانتظار"}
                    textStyle={{ color : Colors.standardColor, fontWeight : "400", fontSize : fontValue('16') }}
                    color={Colors.standardColor}
                    overlayColor={'rgba(255, 255, 255, 0.9)'}
               /> */}

               <Head 
                    title={ lang === "english" ? "Gift Order Details" : "تفاصيل طلب الهدية" }
                    handlePress={() => { tamaraCheckOutStatus ? setTamaraCheckOutStatus(false) : navigation.goBack()}}
               />

               <CustomModel 
                    show={showAlert}
                    text={lang === "english" ? " Payment Failed" : "عمليه الدفع لم تكتمل"}
                    closePress={() => setShowAlert(false)}
               />
               <CustomModel 
                    show={showAlertSDK}
                    text={lang === "english" ? " Payment Failed.. Please try again later" : "برجاء المحاولة بوقت لاحق"}
                    closePress={() => setShowAlertSDK(false)}
               />
               {ChechOutTamara()}
               {/* <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "position" : "height"}
                    keyboardDismissMode="true"
               > */}
               <KeyboardAwareScrollView 
                    keyboardDismissMode='on-drag' 
                    showsVerticalScrollIndicator={false} 
                    enableResetScrollToCoords={false}
                    keyboardOpeningTime={0}
                    extraScrollHeight={0}
                    keyboardShouldPersistTaps="handled"
                >
               <ScrollView 
                    showsVerticalScrollIndicator={false} 
                    keyboardDismissMode='on-drag' 
                    style={styles.screen}
                    scrollEnabled={true}
               >
               {/* onPress={() => { setGifPhone(true), setGiftShare(false) }} */}
                    <Card pushUp="2" style={{ height : font("50") , flexDirection  : lang === "arabic" ? "row-reverse" : "row", justifyContent : "space-between"}}>
                         <Title 
                              size="1.65" 
                              fontWeight="bold"
                              color="#3D3644" 
                              style={{ top : font("4"), maxWidth : "80%"}}
                              text= { lang === "english" ? "Have the gift recipient's mobile number?" : "هل لديك رقم جوال مستلم الهدية ؟" }
                         />
                         <Switch
                              // isOn={giftPhone}
                              // onColor="green"
                              // offColor="#999"
                              // labelStyle={{ color: "black", fontWeight: "700" }}
                              // size="large"
                              // onToggle={isOn => { setGifPhone(isOn), setGiftShare(!isOn) }}
                              // style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}       
                              // isRTL   
                              onValueChange={isOn => { setGifPhone(isOn), setGiftShare(!isOn) }}
                              value={giftPhone}    
                              trackColor={{false: '#eee', true: 'green'}}
                              // thumbColor={giftShare ? '#f5dd4b' : '#f4f3f4'}
                              ios_backgroundColor="#3e3e3e"              
                         />
                    </Card>
                    {/* <Card pushUp="1" flexDirection= { lang === "english" ? "row" : "row-reverse" } style={styles.containerCardImage}>
                         <CardImage
                              isActive={giftPhone}
                              onPress={() => { setGifPhone(true), setGiftShare(false) }}
                              title={ lang === "english" ?  "Phone Number" : "برقم الجوال" }
                              source={ 
                                   giftPhone && lang === "english"
                                   ? 
                                        require('../../../assets/images/sms-on-en.jpg') 
                                   : 
                                   giftPhone && lang === "arabic"
                                   ?
                                        require('../../../assets/images/sms-on-ar.jpg')
                                   :
                                   !giftPhone && lang === "english"
                                   ?
                                        require('../../../assets/images/sms-off-en.jpg')
                                   :
                                   !giftPhone && lang === "arabic"
                                   ?
                                        require('../../../assets/images/sms-off-ar.jpg')
                                   :
                                         null
                              }
                         />
                         <CardImage
                              isActive={giftShare}
                              onPress={() => { setGifPhone(false), setGiftShare(true) }}
                              title={ lang === "english" ? "Share by myself" : "بمشاركة الرابط" }
                              source={ 
                                   giftShare && lang === "english"
                                   ? 
                                        require('../../../assets/images/link-on-en.jpg') 
                                   : 
                                   giftShare && lang === "arabic"
                                   ?
                                        require('../../../assets/images/link-on-ar.jpg')
                                   :
                                   !giftShare && lang === "english"
                                   ?
                                        require('../../../assets/images/link-off-en.jpg')
                                   :
                                   !giftShare && lang === "arabic"
                                   ?
                                        require('../../../assets/images/link-off-ar.jpg')
                                   :
                                         null
                              }                 
                         />
                    </Card> */}
                    {
                         !giftShare 
                         ?
                              <>
                                        <Card pushUp={  lang === "arabic" ? "1" : "1.8"} flexDirection={lang === "english" ? "row" : "row-reverse"} style={styles.center}>
                                             <Title size="1.65" color="#3D3644" text={ lang === "english" ? "Recipient Phone" :  "رقم جوال مستلم الهدية" } fontWeight="500"/>
                                             <Title style={{ top : font("3") }} size="1.8" color="#f00" text={ lang === "english" ? " * " : " * " } />
                                        </Card>
                                        <Card pushUp="1">
                                             <InputPhone 
                                                  wide="80%"
                                                  value={giftHolderPhone}
                                                  backgroundColor="#F8F8F9"
                                                  handleChange={value  => setGiftHolderPhone(_handleNumberPhone(value))}
                                                  error={giftHolderPhone.length === 0 || giftHolderPhone.startsWith("5") && giftHolderPhone.length <= 9 ? false : true}
                                             />
                                        </Card>
                                        <Card pushUp=".5" flexDirection={lang === "english" ? "row" : "row-reverse"} style={styles.center}>
                                             <Title size="1.1" color="#999" text={ lang === "english" ? "The number to which the gift card will be sent via WhatsApp." :  "الرقم الذي ستصل اليه بطاقة الاهداء عن طريق WhatsApp" } fontWeight="500"/>
                                        </Card>
                              </>     
                         :
                              null
                    }
                    {
                         giftShare
                         ?
                              <>
                                   <View style={styles.containerSuccessOrder(lang)}>
                                        <Card pushUp="0.58">
                                             <Image style={{ width : font('27.5'), height : font('27.5') }} source={require('../../../assets/images/successOrder.png')}/>
                                        </Card>
                                   </View>
                                   {
                                        lang === "arabic" 
                                        ?
                                             <Card pushUp="1.5">
                                                  <Title 
                                                       size="1.65" 
                                                       style={{ textAlign : 'center' }} 
                                                       fontWeight="800"
                                                       color="#3D3644" 
                                                       text={ lang === "english" ? "" : "تم إنشاء رابط لإدخال رقم الجوال" }
                                                  />
                                                  <Title 
                                                       size="1.65" 
                                                       style={{ textAlign : 'center' }} 
                                                       color="#3D3644" 
                                                       text={ lang === "english" ? ``: `سيتم إرساله لك بمجرد إتمام عملية الشراء، لتقوم بمشاركته مع مستلم الهدية ليتمكن من إدخال رقم جواله بنفسه.` }
                                                  />
                                             </Card>
                                        :
                                        <Card pushUp="0">
                                             <Title 
                                                  size="1.65" 
                                                  style={{ textAlign : 'center' }} 
                                                  fontWeight="800"
                                                  color="#3D3644" 
                                                  text={ lang === "english" ? "We created link to enter Mobile Number" : `لقد تم إنشاء رابط لهديتك !` }
                                             />
                                             <Title 
                                                  size="1.65" 
                                                  style={{ textAlign : 'center' }} 
                                                  color="#3D3644" 
                                                  text={ lang === "english" ? `It will be sent to you once the purchase is complete, so you can share it with the gift recipient to enter his/her mobile number themselves.` : `` }
                                             />
                                        </Card>

                                   }
                              </>
                         :
                              null
                    }
                    <Card pushUp="3.2" flexDirection={lang === "english" ? "row" : "row-reverse"} style={[styles.center]}>
                         <Title size="1.65" fontWeight="600" color="#3D3644" text={ lang === "english" ?  "Gift Card Information" : "بيانات بطاقة الإهداء"}/>
                         <Title style={{ top : font("3") }} size="2.5" color="#f00" text={ lang === "english" ? " * " : " * " } />
                    </Card>

                    {/* <Card pushUp="2" flexDirection={lang === "english" ? "row" : "row-reverse"} style={[styles.center]}>
                         <Title size="1.65"  color="#3D3644" text={ lang === "english" ?  "To" : "الى"}/>
                    </Card> */}
                    <Card pushUp="1" pushDown="0">
                         <Input 
                              value={giftHolderName}
                              handleChange={value  => setGiftHolderName(removeEmojis(value))}
                              placeholder={ lang === "english" ?  "Recipient Name" : "اسم مستلم الهدية" }
                              multiline={Platform.OS === "ios" ? false : true}
                              contextMenuHidden={true}
                              maxLength={20}
                              backgroundColor="#F8F8F9"
                              // inputContainerStyle={{ borderBottomLeftRadius : fontValue("1"), borderBottomRightRadius : fontValue("1") }}
                         />
                    </Card>
                         {
                              giftShare
                              ?
                                   <View>
                                        {/* <Card pushUp="0.8" style={styles.center}>
                                             <Title size="1.65" color="#3D3644" text={ lang === "english" ? "Message" : "الرسالة" }/>
                                        </Card> */}
                                        
                                        <Card pushUp="1" style={styles.center}>
                                             <Input
                                                  placeholder={ lang === "english" ? "Your message on the Gift Card" : "رسالتك في بطاقة الاهداء" }
                                                  multiline={true}
                                                  heightInput="16"
                                                  handleChange={value  => setMessage(value)}
                                                  value={message}
                                                  maxLength={225}
                                                  backgroundColor="#F8F8F9"
                                                  inputContainerStyle={{  
                                                       paddingHorizontal : font("14"),
                                                       paddingTop : font("15") , 
                                                       // borderBottomLeftRadius : fontValue("1"), 
                                                       // borderBottomRightRadius : fontValue("1"), 
                                                       // borderTopLeftRadius : fontValue("1"), 
                                                       // borderTopRightRadius : fontValue("1"),
                                                       // borderBottomWidth : .5,
                                                       // borderBottomColor : "#999",
                                                  }}
                                             />
                                        </Card>
                                        {/* <Card flexDirection={lang === "english" ? "row" : "row-reverse"} pushUp="0.5" style={styles.center}>
                                             <Title 
                                                  size="1.65" 
                                                  color="#3D3644"
                                                  text={lang === "english" ? "From" :  "من" }
                                             />
                                        </Card> */}
                                        <Card pushUp="1">
                                             <Input 
                                                  value={ userRole === "company" ? `${ firstName + " " + lastName }` : giftSenderName}
                                                  handleChange={value  => setGiftSenderName(removeEmojis(value))}
                                                  placeholder={ lang === "english" ? "Enter Your Name" : "اسمك" }
                                                  contextMenuHidden={true}
                                                  maxLength={20}
                                                  backgroundColor="#F8F8F9"
                                                  // inputContainerStyle={{ borderTopLeftRadius : fontValue("1"), borderTopRightRadius : fontValue("1") }}
                                                  // keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                                             />
                                        </Card>
                                   </View>
                              :
                                   <>
                                        {/* <Card pushUp="0.8" style={styles.center}>
                                             <Title size="1.65"  fontWeight="400" color="#3D3644" text={ lang === "english" ? "Message" : "الرسالة" }/>
                                        </Card> */}
                                        
                                        <Card pushUp="1" style={styles.center}>
                                             <Input
                                                  placeholder={ lang === "english" ? "Your message on the Gift Card" : "رسالتك في بطاقة الاهداء" }
                                                  multiline={true}
                                                  heightInput="16"
                                                  handleChange={value  => setMessage(value)}
                                                  value={message}
                                                  maxLength={225}
                                                  backgroundColor="#F8F8F9"
                                                  inputContainerStyle={{  
                                                       paddingHorizontal : font("14"),
                                                       paddingTop : font("15") , 
                                                       // borderBottomLeftRadius : fontValue("1"), 
                                                       // borderBottomRightRadius : fontValue("1"), 
                                                       // borderTopLeftRadius : fontValue("1"), 
                                                       // borderTopRightRadius : fontValue("1"),
                                                       // borderBottomWidth : .5,
                                                       // borderBottomColor : "#999",
                                                  }}

                                             />
                                        </Card>
                                        {/* <Card flexDirection={lang === "english" ? "row" : "row-reverse"} pushUp="0.5" style={styles.center}>
                                             <Title 
                                                  size="1.65" 
                                                  color="#3D3644"
                                                  text={lang === "english" ? "From" :  "من" }
                                             />
                                        </Card> */}
                                        <Card pushUp="1">
                                             <Input 
                                                  value={ userRole === "company" ? `${ firstName + " " + lastName }` : giftSenderName}
                                                  // handleChange={value  => setGiftSenderName(value)}
                                                  handleChange={value  => setGiftSenderName(removeEmojis(value))}
                                                  placeholder={ lang === "english" ? "Enter Your Name" : "اسمك" }
                                                  contextMenuHidden={true}
                                                  maxLength={20}
                                                  backgroundColor="#F8F8F9"
                                                  disabled={ userRole === "company" ? true : false}

                                                  // inputContainerStyle={{ borderTopLeftRadius : fontValue("1"), borderTopRightRadius : fontValue("1") }}
                                                  // keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                                             />
                                        </Card>
                                   </>
                         }

                         <Card pushUp="2" widthCard="95%" style={{ justifyContent : 'center', alignItems : "center", alignSelf : "center" }} flexDirection="column">
                              <Hr/>
                         </Card>

                         <Card pushUp="2">
                            {
                              giftShare 
                              ?
                                   <>
                                        <Title 
                                             size="1.4" 
                                             color="green"
                                             fontWeight="bold"
                                             text={lang === "english" ? "Once the purchase is complete and enters mobile number, the gift recipient will receive:" : "بمجرد إتمام الشراء و إدخال رقم الجوال سيتم إرسال لمستلم الهدية" }
                                             style={{  textAlign : lang === "arabic" ? "right" : "left" }}
                                        />
                                        <Title 
                                             size="1.4" 
                                             color="#000"
                                             text={lang === "english" ? "•⁠  Gift Card." :  "•⁠  ⁠بطاقة الإهداء." }
                                             style={{  textAlign : lang === "arabic" ? "right" : "left" }}
                                        />
                                        <Title 
                                             size="1.4" 
                                             color="#000"
                                             text={lang === "english" ? "•⁠  Link to request a suitable appointment." :  "•⁠  ⁠⁠رابط لطلب حجز الموعد المناسب." }
                                             style={{  textAlign : lang === "arabic" ? "right" : "left" }}
                                        />
                                   </>
                              :
                                   <>
                                         <Title 
                                             size="1.4" 
                                             color="green"
                                             fontWeight="bold"
                                             text={lang === "english" ? "Once the purchase is complete, the gift recipient will receive:" :  "بمجرد إتمام الشراء سيتم إرسال لمستلم الهدية :" }
                                             style={{  textAlign : lang === "arabic" ? "right" : "left" }}

                                        />
                                        <Title 
                                             size="1.4" 
                                             color="#000"
                                             text={lang === "english" ? "•⁠  Gift Card." :  "•⁠  ⁠بطاقة الإهداء." }
                                             style={{  textAlign : lang === "arabic" ? "right" : "left" }}

                                        />
                                        <Title 
                                             size="1.4" 
                                             color="#000"
                                             text={lang === "english" ? "•⁠  Link to request a suitable appointment." :   "•⁠  ⁠⁠رابط لطلب حجز الموعد المناسب." }
                                             style={{  textAlign : lang === "arabic" ? "right" : "left" }}
                                        />
                                   </>
                            }
                         </Card>

                         <Card pushUp="2" widthCard="95%" style={{ justifyContent : 'center', alignItems : "center", alignSelf : "center" }} flexDirection="column">
                              <Hr/>
                         </Card>

                         {
                              userRole === "client" ?
                                   <>
                                        {/* <Card pushUp="1" style={{ justifyContent : "center", alignItems : "center" }}>
                                             <Title 
                                                  size="1.65" 
                                                  color="#3D3644"
                                                  fontWeight="500"
                                                  text={lang === "english" ? "Promo Code" :  "الرمز الترويجي"}
                                             />
                                        </Card> */}

                                        <Card flexDirection={ lang === "arabic" ? "row-reverse" : "row" } pushUp="1" style={{ justifyContent : "space-between", alignItems : "center" }}>
                                             <View style={styles.titlePromoCode(lang)}>
                                                  <Title 
                                                       size="3" 
                                                       color="#3D3644"
                                                       text={lang === "english" ? "🏷️" :  "🏷️"}
                                                  />
                                             </View>
                                             <TextInput 
                                                  style={{ 
                                                       width : "42.4%",
                                                       fontSize : fontPercent("1.65"),
                                                       textAlign : 'center',
                                                       backgroundColor : "#F8F8F9",
                                                       height : fontValue("40"),
                                                       color : Colors.standardColor
                                                  }}
                                                  placeholder={ lang === "arabic" ? "أدخل الرمز" : "Enter code"  }
                                                  placeholderTextColor="#999"
                                                  onChangeText={value => onChangeCodeDiscound(value.toUpperCase())}
                                                  value={codeDiscound}
                                             />
                                             {
                                                  loadingPromo
                                                  ?
                                                       <TouchableOpacity 
                                                            disabled={true}
                                                            style={{ 
                                                                 justifyContent : "center", 
                                                                 alignItems : 'center', 
                                                                 height : fontValue("40"), 
                                                                 width : width("27.5"), 
                                                                 backgroundColor : Colors.standardColor,
                                                                 borderBottomLeftRadius : lang === "arabic" ? fontValue("18") : 0, 
                                                                 borderTopLeftRadius :  lang === "arabic" ? fontValue("18") : 0, 
                                                                 borderBottomRightRadius : lang === "english" ? fontValue("18") : 0, 
                                                                 borderTopRightRadius :  lang === "english" ? fontValue("18") : 0, 
                                                            }}
                                                            onPress={() => handleCheckPromoCode()}
                                                       >
                                                            <AntDesign name="loading1" color="#fff" size={fontValue("20")}/>
                                                       </TouchableOpacity>
                                                  :
                                                  success
                                                  ?
                                                       <TouchableOpacity 
                                                            disabled={true}
                                                            style={{ 
                                                                 justifyContent : "center", 
                                                                 alignItems : 'center', 
                                                                 height : fontValue("40"), 
                                                                 width : width("27.5"), 
                                                                 backgroundColor : "#4BB543",
                                                                 borderBottomLeftRadius : lang === "arabic" ? fontValue("18") : 0, 
                                                                 borderTopLeftRadius :  lang === "arabic" ? fontValue("18") : 0, 
                                                                 borderBottomRightRadius : lang === "english" ? fontValue("18") : 0, 
                                                                 borderTopRightRadius :  lang === "english" ? fontValue("18") : 0, 
                                                            }}
                                                            onPress={() => handleCheckPromoCode()}
                                                       >
                                                            <Feather name="check-circle" color="#fff" size={fontValue("20")}/>  
                                                       </TouchableOpacity>
                                                  :
                                                  faild
                                                  ?
                                                       <TouchableOpacity 
                                                            disabled={true}
                                                            style={{ 
                                                                 justifyContent : "center", 
                                                                 alignItems : 'center', 
                                                                 height : fontValue("40"), 
                                                                 width : width("27.5"), 
                                                                 backgroundColor : "#f00",
                                                                 borderBottomLeftRadius : lang === "arabic" ? fontValue("18") : 0, 
                                                                 borderTopLeftRadius :  lang === "arabic" ? fontValue("18") : 0, 
                                                                 borderBottomRightRadius : lang === "english" ? fontValue("18") : 0, 
                                                                 borderTopRightRadius :  lang === "english" ? fontValue("18") : 0, 
                                                            }}
                                                            onPress={() => handleCheckPromoCode()}
                                                       >
                                                            <Feather name="x" color="#fff" size={fontValue("20")}/>  
                                                       </TouchableOpacity>
                                                  :
                                                       <TouchableOpacity 
                                                            style={{ 
                                                                 justifyContent : "center", 
                                                                 alignItems : 'center', 
                                                                 height : fontValue("40"), 
                                                                 width : width("27.5"), 
                                                                 backgroundColor : Colors.standardColor,
                                                                 borderBottomLeftRadius : lang === "arabic" ? fontValue("18") : 0, 
                                                                 borderTopLeftRadius :  lang === "arabic" ? fontValue("18") : 0, 
                                                                 borderBottomRightRadius : lang === "english" ? fontValue("18") : 0, 
                                                                 borderTopRightRadius :  lang === "english" ? fontValue("18") : 0, 
                                                            }}
                                                            onPress={() => handleCheckPromoCode()}
                                                       >
                                                            <Title text={ lang === "arabic" ? "تطبيق" : "Apply" } color="#fff" size="1.65"/>
                                                       </TouchableOpacity>
                                             }
                                        </Card>
                                   </>
                              :
                                   null
                         }

                              {
                                   faild
                                   ?
                                        <Card pushUp="2" style={{ alignItems : "center", justifyContent : "center" }}>
                                             {
                                                  lang === "english"
                                                  ?
                                                       <View style={{ flexDirection : "row", justifyContent : "center", alignItems : "center" }}>
                                                            <AntDesign style={{ paddingHorizontal : "1%" }} name='exclamationcircle' color="#f00" size={fontValue("11.5")}/>
                                                            <Title text={ lang === "english" ? faild?.en : faild?.ar } color="#f00" size="1.3"/>
                                                       </View>                                                  
                                                  :    
                                                       <View style={{ flexDirection : "row-reverse", justifyContent : "center", alignItems : "center" }}>
                                                            <AntDesign style={{ paddingHorizontal : "1%" }} name='exclamationcircle' color="#f00" size={fontValue("11.5")}/>
                                                            <Title text={ lang === "english" ? faild?.en : faild?.ar } color="#f00" size="1.3"/>
                                                       </View>  
                                             }
                                        </Card>
                                   :
                                        null

                              }
                         <View>
                              
                              <Card pushUp="1" style={{ justifyContent : 'center', alignItems : "center" }} flexDirection="column">
                                   <Card pushUp="0" widthCard="95%" style={{ justifyContent : 'center', alignItems : "center", alignSelf : "center" }} flexDirection="column">
                                        <Hr/>
                                   </Card>
                                   <Card pushUp="2">
                                        <Title 
                                             size="1.65"
                                             fontWeight="500" 
                                             color="#000"
                                             text={lang === "english" ? "Order Invoice Summary" :  "ملخص فاتورة الطلب"}
                                        />
                                   </Card>
                                   <Card pushUp="2" flexDirection={ lang === "english" ? "row" : "row-reverse"} style={{ justifyContent : "space-between", width : "90%" }}>
                                        <Title 
                                             size="1.65" 
                                             fontWeight="500"
                                             color="#3D3644"
                                             text={lang === "english" ? "Service Name" :  "اسم الخدمة"}
                                        /> 
                                        <View 
                                             style={{
                                                  width : lang === "english" ? "60%" : "60%", 
                                                  flexDirection : lang === "english" ? "row" : "row-reverse",
                                                  justifyContent : "flex-end"
                                             }}
                                        >
                                                  <Title 
                                                       size="1.65" 
                                                       color="#3D3644"
                                                       fontWeight="500"
                                                       text={productName}
                                                       style={{ textAlign : "center" }}                                                                                     
                                                  />
                                        </View>
                                   </Card>

                                   <Card pushUp="2" pushDown="2" flexDirection={ lang === "english" ? "row" : "row-reverse"} style={{ justifyContent : "space-between", width : "90%" }}>
                                        <Title 
                                             size="1.65" 
                                             color="#3D3644"
                                             fontWeight="500"
                                             text={ lang === "english" ? "QTY" : "الكمية" }
                                             style={{ textAlign : "center" }}                                          
                                         /> 
                                        <View style={{ justifyContent : 'flex-end'}}>
                                             <Title 
                                                  size="1.65" 
                                                  color="#3D3644"
                                                  fontWeight="500"
                                                  text={route?.params?.quantity}  
                                                  style={{ 
                                                       textAlign : "center", 
                                                       left: lang === "arabic" ? font('5') : null,
                                                       right: lang === "english" ? font('5') : null,
                                                  }}                                                                                     
                                             />
                                        </View>
                                   </Card>
                                   
                                   {/* <Card pushUp="2" pushDown="3" flexDirection={ lang === "english" ? "row" : "row-reverse"} style={{ justifyContent : "space-between", width : "90%" }}>
                                        <Title 
                                             size="1.65" 
                                             color="#3D3644"
                                             fontWeight="600"
                                             text={ lang === "english" ? "Unit Price" : "قيمة الوحدة" }
                                             style={{ textAlign : "center" }}                                          
                                         /> 
                                        <View style={{ justifyContent : 'flex-end'}}>
                                             <Title 
                                                  size="1.65" 
                                                  color="#3D3644"
                                                  fontWeight="600"
                                                  text={priceWithoutVat?.toLocaleString("en",{ minimumFractionDigits: 2,maximumFractionDigits: 2 })}  
                                                  style={{ 
                                                       textAlign : "center", 
                                                       left: lang === "arabic" ? font('5') : null,
                                                       right: lang === "english" ? font('5') : null,
                                                  }}                                                                                     
                                             />
                                        </View>
                                   </Card> */}

                                   <Hr/>
                                   <Card pushUp="2" pushDown="1" flexDirection={ lang === "english" ? "row" : "row-reverse"} style={{ justifyContent : "space-between", width : "90%" }}>
                                        <Title 
                                             size="1.65" 
                                             color="#3D3644"
                                             fontWeight="500"
                                             text={lang === "english" ? "Price" :"قيمة الخدمة"}
                                             style={{ textAlign : "center" }}                                          
                                         /> 
                                        <View style={{ justifyContent : 'flex-end'}}>
                                             <Card flexDirection={ "row-reverse" }>
                                                  <Title 
                                                       size="1.65" 
                                                       color="#3D3644"
                                                       fontWeight="500"
                                                       text={`${originalPrice?.toLocaleString("en",{ minimumFractionDigits: 2,maximumFractionDigits: 2 })}`}
                                                       style={{ textAlign : "center" }}                                                                                     
                                                  />
                                                  <UniversalImage
                                                       source={require('../../../assets/images/sar.svg').default} 
                                                       style={[styles.sarStyle,{ top : font("1.6") }]} 
                                                  />
                                             </Card>
                                        </View>
                                   </Card>
                                   <Card pushUp="0" pushDown={ success ? "1" : "3"} flexDirection={ lang === "english" ? "row" : "row-reverse"} style={{ justifyContent : "space-between", width : "90%" }}>
                                        <Title 
                                             size="1.65" 
                                             color="#3D3644"
                                             fontWeight="400"
                                             text={lang === "english" ? "+ VAT" :"+ ضريبة القيمة المضافة"}
                                             style={{ textAlign : "center" }}                                          
                                        /> 
                                         <View style={{ justifyContent : 'flex-end'}}>
                                             <Card flexDirection={"row-reverse" }>
                                                  <Title 
                                                       size="1.65" 
                                                       color="#3D3644"
                                                       fontWeight="500"
                                                       text={`${vatValue?.toLocaleString("en",{ minimumFractionDigits: 2,maximumFractionDigits: 2 })}`}
                                                       style={{ textAlign : "center" }}                                                                                     
                                                  />
                                                  <UniversalImage
                                                       source={require('../../../assets/images/sar.svg').default} 
                                                       style={[styles.sarStyle,{ top : font("1.6") }]} 
                                                  />
                                             </Card>
                                        </View>
                                   </Card>
                                   {
                                        success && success?.typeCode == "Discount"
                                        ?
                                             <Card pushUp="0" pushDown="3" flexDirection={ lang === "english" ? "row" : "row-reverse"} style={{ justifyContent : "space-between", width : "90%" }}>
                                                       <Title 
                                                            size="1.7" 
                                                            color={"#3D3644"}
                                                            fontWeight={ success ? "400" : "500"}
                                                            text={lang === "english" ? "Total" :"المجموع"}
                                                            style={{ textAlign : "right"}}                                          
                                                       /> 
                                                  <View style={{ justifyContent : 'flex-end', alignItems : "center"}}>
                                                       <Card flexDirection={"row-reverse" }>
                                                            <Title 
                                                                 size="1.65" 
                                                                 color={ success ? "#999" : "#3D3644"}
                                                                 fontWeight="500"
                                                                 text={`${ total?.toLocaleString("en",{ minimumFractionDigits: 2,maximumFractionDigits: 2 })}`}
                                                                 style={{ textAlign : "center", textDecorationLine : success ? 'line-through' : null }}                                                                                     
                                                            />
                                                            <UniversalImage
                                                                 source={require('../../../assets/images/sar.svg').default} 
                                                                 style={[styles.sarStyle,{ top : font("1.6") }]} 
                                                            />
                                                       </Card>
                                                  </View>
                                             </Card>
                                        :
                                        success && success?.typeCode == "CashBack"
                                        ?
                                             <Card pushUp="0" pushDown="3" flexDirection={ lang === "english" ? "row" : "row-reverse"} style={{ justifyContent : "space-between", width : "90%" }}>
                                                  <Title 
                                                       size="1.7" 
                                                       color={"#3D3644"}
                                                       fontWeight={ success ? "400" : "500"}
                                                       text={lang === "english" ? "Total" :"المجموع"}
                                                       style={{ textAlign : "right"}}                                          
                                                  /> 
                                                  <View style={{ justifyContent : 'flex-end', alignItems : "center"}}>
                                                       <Card flexDirection={"row-reverse" }>
                                                            <Title 
                                                                 size="1.65" 
                                                                 color={"#3D3644"}
                                                                 fontWeight="500"
                                                                 text={`${ total?.toLocaleString("en",{ minimumFractionDigits: 2,maximumFractionDigits: 2 })}`}
                                                                 style={{ textAlign : "center" }}                                                                                     
                                                            />
                                                            <UniversalImage
                                                                 source={require('../../../assets/images/sar.svg').default} 
                                                                 style={[styles.sarStyle,{ top : font("1.6") }]} 
                                                            />
                                                       </Card>
                                                  </View>
                                             </Card>
                                        :
                                             null
                                   }

                                   {
                                        success && success?.typeCode == "Discount"
                                        ?
                                             <Card pushUp="0" pushDown="3" flexDirection={ lang === "english" ? "row" : "row-reverse"} style={{ justifyContent : "space-between", width : "90%" }}>
                                                  <Title 
                                                       size="1.65" 
                                                       color="#50C878"
                                                       fontWeight="400"
                                                       text={lang === "english" ? "Discount" :"الخصم"}
                                                       style={{ textAlign : "center" }}                                          
                                                  /> 
                                                  <View style={{ justifyContent : 'flex-end'}}>
                                                       <Card flexDirection={"row-reverse" }>
                                                            <Title 
                                                                 size="1.65" 
                                                                 color="#50C878"
                                                                 fontWeight="600"
                                                                 text={`-${totalDiscountPromo?.toLocaleString("en",{ minimumFractionDigits: 2,maximumFractionDigits: 2 })}`}
                                                                 style={{ textAlign : "center" }}                                                                                     
                                                            />
                                                            <UniversalImage
                                                                 source={require('../../../assets/images/sarGreen.svg').default} 
                                                                 style={[styles.sarStyle,{ top : font("1.6") }]} 
                                                            />
                                                       </Card>
                                                  </View>
                                             </Card>
                                        :
                                        success && success?.typeCode == "CashBack"
                                        ?
                                                                                     <Card pushUp="0" pushDown="3" flexDirection={ lang === "english" ? "row" : "row-reverse"} style={{ justifyContent : "space-between", width : "90%" }}>
                                                  <Title 
                                                       size="1.65" 
                                                       color="#50C878"
                                                       fontWeight="400"
                                                       text={lang === "english" ? "CashBack" :"كاش باك"}
                                                       style={{ textAlign : "center" }}                                          
                                                  /> 
                                                  <View style={{ justifyContent : 'flex-end'}}>
                                                       <Card flexDirection={"row-reverse" }>
                                                            <Title 
                                                                 size="1.65" 
                                                                 color="#50C878"
                                                                 fontWeight="600"
                                                                 text={`${totalDiscountPromo?.toLocaleString("en",{ minimumFractionDigits: 2,maximumFractionDigits: 2 })}`}
                                                                 style={{ textAlign : "center" }}                                                                                     
                                                            />
                                                            <UniversalImage
                                                                 source={require('../../../assets/images/sarGreen.svg').default} 
                                                                 style={[styles.sarStyle,{ top : font("1.6") }]} 
                                                            />
                                                       </Card>
                                                  </View>
                                             </Card>
                                        :
                                             null
                                   }
                                   {
                                        success && success?.typeCode == "Discount"
                                        ?
                                             <Card pushUp="0" pushDown="3" flexDirection={ lang === "english" ? "row" : "row-reverse"} style={{ justifyContent : "space-between", width : "90%" }}>
                                                  <Title 
                                                       size="1.7" 
                                                       color={"#3D3644"}
                                                       fontWeight="600"
                                                       text={lang === "english" ? "Net" :"المجموع بعد الخصم"}
                                                       style={{ textAlign : "right"}}                                          
                                                  /> 
                                                  <View style={{ flexDirection : "row-reverse" }}>
                                                       <Title 
                                                            size="1.65" 
                                                            color={"#3D3644"}
                                                            fontWeight="500"
                                                            text={`${ totalWithPromo?.toLocaleString("en",{ minimumFractionDigits: 2,maximumFractionDigits: 2 })}`}
                                                            style={{ textAlign : "center", justifyContent : "center", paddingHorizontal : fontValue("1"), alignItems : "center" }}                                                                                     
                                                       />
                                                       <View>
                                                            <UniversalImage
                                                                 source={require('../../../assets/images/sar.svg').default} 
                                                                 style={[styles.sarStyle,{ top : font("1.6") }]} 
                                                            />
                                                       </View>
                                                  </View>
                                             </Card>
                                        :
                                             null
                                   }
                              </Card>
                         </View>
                         <Card pushUp="0">
                              {
                                   walletPrivateId && walletPrivateAmount && userRole === "client"
                              ?
                                   <Card flexDirection={ lang === "english" ? "row" : "row-reverse" } style={styles.containerWallet}>
                                        <View style={{ flexDirection : lang === "english" ? "row" : "row-reverse", justifyContent : "center", alignItems : "center" }}>
                                             <Ionicons name="wallet" size={fontValue("20")} color={Colors.standardColor}/>
                                             <Title style={{ paddingHorizontal : fontValue("5") }} color="#3D3644" size="1.65" fontWeight="500" text={t('WalletPrivate')}/>
                                        </View>
                                        <View style={{ flexDirection : lang === "english" ? "row" : "row-reverse" }}>
                                             <View style={{ justifyContent : "center", alignItems : "center", flexDirection : "row", paddingHorizontal : fontValue("4") }}>
                                                  <UniversalImage
                                                       source={require('../../../assets/images/sarMove.svg').default} 
                                                       style={styles.sarStyle} 
                                                  />
                                                  <Title style={{ paddingHorizontal : fontValue("1") }} size="1.65" fontWeight="500" color={Colors.standardColor} text={ lang === "english" ? `${walletPrivateAmount?.toLocaleString("en",{ minimumFractionDigits: 0,maximumFractionDigits: 2 })}` : `${walletPrivateAmount?.toLocaleString("en",{ minimumFractionDigits: 0,maximumFractionDigits: 2 })}` }/>
                                             </View>
                                             <CheckBox
                                                  boxType="square"
                                                  animationDuration={.2}
                                                  onAnimationType="bounce"
                                                  offAnimationType="bounce"
                                                  onTintColor={Colors.standardColor}
                                                  onCheckColor={Colors.standardColor}
                                                  style={{ width : fontValue("16"), height : fontValue("16") }}
                                                  disabled={ success?.typeCode == "CashBack" ? true : false}
                                                  value={walletPrivateToggle}
                                                  onValueChange={(newValue) => { setWalletPrivateToggle(newValue), setWalletCorporateToggle(false), payType === "tamara" || success?.typeCode == "CashBack" ? setPayType("false") : null }}
                                             />
                                        </View>
                                   </Card>
                              :    
                                   null
                              }
                         </Card>
                         <Card pushUp="0">
                              {
                                   walletCorporateId && walletCorporateAmount && userRole === "client"
                              ?
                                   <Card flexDirection={ lang === "english" ? "row" : "row-reverse" } style={styles.containerWallet}>
                                        <View style={{ flexDirection : lang === "english" ? "row" : "row-reverse", justifyContent : "center", alignItems : "center" }}>
                                             <Ionicons name="wallet" size={fontValue("20")} color={Colors.standardColor}/>
                                             <Title style={{ paddingHorizontal : fontValue("5") }} color="#3D3644" size="1.65" fontWeight="500" text={t('WalletCorprite')}/>
                                        </View>
                                        <View style={{ flexDirection : lang === "english" ? "row" : "row-reverse" }}>
                                             <View style={{ justifyContent : "center", alignItems : "center", flexDirection : "row", paddingHorizontal : fontValue("4") }}>
                                                  <UniversalImage
                                                       source={require('../../../assets/images/sarMove.svg').default} 
                                                       style={styles.sarStyle} 
                                                  />
                                                  <Title style={{ paddingHorizontal : fontValue("1") }} size="1.65" fontWeight="500" color={Colors.standardColor} text={ lang === "english" ? `${walletCorporateAmount?.toLocaleString("en",{ minimumFractionDigits: 0,maximumFractionDigits: 2 })}` : `${walletCorporateAmount?.toLocaleString("en",{ minimumFractionDigits: 0,maximumFractionDigits: 2 })}` }/>
                                             </View>
                                                  <CheckBox
                                                       boxType="square"
                                                       animationDuration={.2}
                                                       onAnimationType="bounce"
                                                       offAnimationType="bounce"
                                                       onTintColor={Colors.standardColor}
                                                       onCheckColor={Colors.standardColor}
                                                       style={{ width : fontValue("16"), height : fontValue("16") }}
                                                       disabled={ success?.typeCode == "CashBack" ? true : false}
                                                       value={walletCorporateToggle}
                                                       onValueChange={(newValue) => { setWalletCorporateToggle(newValue), setWalletPrivateToggle(false), payType === "tamara" || success?.typeCode == "CashBack" ? setPayType("false") : null }}
                                                  />
                                        </View>
                                   </Card>
                              :    
                                   null
                              }
                         </Card>
                         {
                              userRole === "client" ?
                                   <>
                                        <Card flexDirection={ lang === "english" ? "row" : "row-reverse" } pushUp="2" pushDown="2" style={styles.containerTypePayment}>
                                             <Title size="1.65" fontWeight="500" color="#3D3644" text={ lang === "english" ? "Payment Methods" : "اختر طريقة الدفع" }/>
                                        </Card>
                                        <View style={{ justifyContent : "center", alignItems : "flex-end", borderColor : "#eee", borderWidth : 1, borderRadius : font("9"), paddingHorizontal : font("7")}}>
                                             <View style={{ width : "100%", flexDirection : lang === "english" ? "row" : "row-reverse", justifyContent : "space-between", alignItems : "center", paddingHorizontal : font("4")}}>
                                                  <View style={{ flexDirection : lang === "english" ? "row" : "row-reverse", justifyContent : "center", alignItems : "center", marginBottom : font("5"), marginTop : font("5")  }}>
                                                       <View style={{ width : font('36'), height : font('36') }}>
                                                            <Image style={{ width : '100%', height : "100%", resizeMode : "contain" }} source={require('../../../assets/images/bank-card.png')}/>
                                                       </View>
                                                       <View style={{ paddingHorizontal : font("10") }}>
                                                            <Title size="1.5" fontWeight="500" color="#3D3644" text={ lang === "english" ? "Payment Methods" : "بطاقات بنكية" }/>
                                                       </View>
                                                  </View>
                                                  <CheckBox
                                                       boxType="square"
                                                       animationDuration={.2}
                                                       onAnimationType="bounce"
                                                       offAnimationType="bounce"
                                                       onTintColor={Colors.standardColor}
                                                       onCheckColor={Colors.standardColor}
                                                       style={{ width : fontValue("16"), height : fontValue("16") }}
                                                       disabled={payType === "cradit" ? true : false}
                                                       value={payType === "cradit" ? true : false}
                                                       onChange={() =>  setPayType("cradit")}
                                                  />
                                             </View>
                                             <Card pushUp="0" pushDown="0" widthCard="98%" style={{ justifyContent : 'center', alignItems : "center", alignSelf : "center" }} flexDirection="column">
                                                 <Hr />
                                             </Card>
                                             <View style={{ width : "100%", flexDirection : lang === "english" ? "row" : "row-reverse", justifyContent : "space-between", alignItems : "center", paddingHorizontal : font("4")}}>
                                                  <View style={{ flexDirection : lang === "english" ? "row" : "row-reverse", justifyContent : "center", alignItems : "center", marginBottom : font("5"), marginTop : font("5")  }}>
                                                       <View style={{ width : font('36'), height : font('36') }}>
                                                            <Image style={{ width : '100%', height : "100%", resizeMode : "contain" }} source={require('../../../assets/images/apple-pay.png')}/>
                                                       </View>
                                                       <View style={{ paddingHorizontal : font("10") }}>
                                                            <Title size="1.5" fontWeight="500" color="#3D3644" text={ "Apple Pay" }/>
                                                       </View>
                                                  </View>
                                                  <CheckBox
                                                            boxType="square"
                                                            animationDuration={.2}
                                                            onAnimationType="bounce"
                                                            offAnimationType="bounce"
                                                            onTintColor={Colors.standardColor}
                                                            onCheckColor={Colors.standardColor}
                                                            style={{ width : fontValue("16"), height : fontValue("16") }}
                                                            disabled={payType === "apple" ? true : false}
                                                            value={payType === "apple" ? true : false}
                                                            onChange={() =>  setPayType("apple")}

                                                  />
                                             </View>
                                             <Card pushUp="0" pushDown="0" widthCard="98%" style={{ justifyContent : 'center', alignItems : "center", alignSelf : "center" }} flexDirection="column">
                                                 <Hr />
                                             </Card>
                                             <View style={{ width : "100%", flexDirection : lang === "english" ? "row" : "row-reverse", justifyContent : "space-between", alignItems : "center", paddingHorizontal : font("4")}}>
                                                  <View style={{ flexDirection : lang === "english" ? "row" : "row-reverse", justifyContent : "center", alignItems : "center", marginBottom : font("5"), marginTop : font("5")  }}>
                                                       <View style={{ width : font('36'), height : font('36') }}>
                                                            <Image style={{ width : '100%', height : "100%", resizeMode : "contain" }} source={require('../../../assets/images/Tamara.png')}/>
                                                       </View>
                                                       <View style={{ paddingHorizontal : font("10") }}>
                                                            <Title size="1.5" fontWeight="500" color="#3D3644" text={ lang === "english" ? "Tamara" : "تمارا" }/>
                                                       </View>
                                                  </View>
                                                  <CheckBox
                                                            boxType="square"
                                                            animationDuration={.2}
                                                            onAnimationType="bounce"
                                                            offAnimationType="bounce"
                                                            onTintColor={Colors.standardColor}
                                                            onCheckColor={Colors.standardColor}
                                                            style={{ width : fontValue("16"), height : fontValue("16") }}
                                                            disabled={ walletPrivateToggle || walletCorporateToggle || success?.typeCode == "CashBack" ? true : payType === "tamara" ? true : false } 
                                                            value={payType === "tamara"  ? true : false}
                                                            onValueChange={(value) => { value === "tamara" ? setPayType(null) : setPayType("tamara")}}
                                                            // onValueChange={(newValue) => { setWalletPrivateToggle(newValue), setWalletCorporateToggle(false)}}

                                                  />
                                             </View>
                                        </View>   
                                   </>
                              : userRole === "company" 
                              ?
                                   <Card flexDirection={ lang === "english" ? "row" : "row-reverse" } style={styles.containerWallet}>
                                        <View style={{ flexDirection : lang === "english" ? "row" : "row-reverse", justifyContent : "center", alignItems : "center" }}>
                                             <Ionicons name="wallet" size={fontValue("20")} color={Colors.standardColor}/>
                                             <Title style={{ paddingHorizontal : fontValue("5") }} color="#3D3644" size="1.6" fontWeight="600" text={ lang === "english" ? "Wallet" : "المحفظة" }/>
                                        </View>
                                        <View style={{ justifyContent : "center", alignItems : "center" }}>
                                             <Title style={{ paddingHorizontal : fontValue("5") }} size="1.8" fontWeight="600" color={Colors.standardColor} text={ lang === "english" ? `${walletCorporateAmount} SAR` : `${walletCorporateAmount} ريال` }/>
                                        </View>
                                   </Card>
                              :
                                   null
                         }
                                       
               </ScrollView>
               </KeyboardAwareScrollView>
               <View style={styles.screen}>
                    <Card pushDown="2.75" pushUp="1.25">
                         {
                              userRole === "client" 
                              ?
                                   
                                   <ButtonApp 
                                        title={ walletPrivateToggle && quantity * price <= walletPrivateAmount || walletPrivateToggle && totalWithPromo <= walletPrivateAmount || walletCorporateToggle && quantity * price <= walletCorporateAmount || walletCorporateToggle && totalWithPromo <= walletCorporateAmount ? lang === "english" ? "Confirm" : "تأكيد" : lang === "english" ? "Place Order" : "تآكيد الطلب"}
                                        onPress={ () => _handleCreateOrder()}
                                        disabled={clickButtonDisabled}
                                   />
                              : userRole === "company" 
                              ?
                                   <ButtonApp 
                                        title={ walletCorporateAmount < total ? lang === "english" ? "No Sufficient Balance" : "لا يوجود رصيد لاتمام العملية" : lang === "english" ? "Continue Purchasing From Wallet" : "لمتابعة الشراء من المحفظة"}
                                        onPress={ () => _handleSendOtpOrderWallet()}
                                        disabled={ walletCorporateAmount < total ? true : clickButtonDisabled}
                                   />  
                              :
                                   null     
                         }
                    </Card>
               </View>
          </View>
     )
}

const styles = StyleSheet.create({
     root : {
          flex : 1,
          backgroundColor : Colors.backgroundColor,
     },
     screen : {
          paddingHorizontal : '4%',
     },
     center : {
          alignItems : 'center',
          justifyContent : "center"
     },
     containerCardImage : {
          justifyContent : 'space-between'
     },
     containerTypePayment : {
          justifyContent : 'space-between'
     },
     containerWallet : {
          justifyContent : 'space-between',
          alignItems : 'center',
          paddingTop : fontValue("11"),
          paddingBottom : fontValue("11"),
          paddingLeft : fontValue("15"),
          paddingRight : fontValue("15"),
          marginBottom : fontValue("10"),
          backgroundColor : "#F8F8F9",
          borderRadius : font("18")
     },
     hafeInput : {
          width : '49%'
     },
     containerMultiInput : {
          justifyContent : 'space-between'
     },
     containerSuccessOrder : (lang) => ({
          justifyContent : 'center',
          alignItems : 'center',   
          height :  lang === "english" ? fontValue("34.57") : null
     }),
     containerTextCenter : {
          justifyContent : 'center',
          alignItems : 'center'
     },
     titlePromoCode : (lang) => ({
          justifyContent : "center", 
          alignItems : 'center', 
          height : fontValue("40"),  
          backgroundColor : "#F8F8F9", 
          width : "27.5%", 
          borderBottomRightRadius : lang === "arabic" ? fontValue("18") : 0, 
          borderTopRightRadius :  lang === "arabic" ? fontValue("18") : 0, 
          borderBottomLeftRadius : lang === "english" ? fontValue("18") : 0, 
          borderTopLeftRadius :  lang === "english" ? fontValue("18") : 0, 
          borderLeftColor : lang === "arabic" ? Colors.standardColor : null, 
          borderRightColor : lang === "english" ? Colors.standardColor : null, 
          borderLeftWidth : lang === "arabic" ? .5 : null,
          borderRightWidth : lang === "english" ? .5 : null
     }),
     containerTamara: {
          flex: 1,
          minWidth: '100%',
          minHeight: 100,
     },
     resultContainer: {
          flex: 1,
          marginTop: 50,
          justifyContent: 'center',
     },
     container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
     },
     mainContainer: {
          flex: 1,
     },
     button: {
          alignSelf: 'stretch',
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 10,
     },
     sarStyle : {
          width : font("11"), 
          height : font("11"), 
     }
})

export default Payment