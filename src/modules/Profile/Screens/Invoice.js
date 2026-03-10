import React, { useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Platform, PermissionsAndroid, Alert } from 'react-native'
import QRCode from 'react-native-qrcode-svg';
import { Head, ItemHistory, Card, Title, Hr, ButtonApp, Logo } from '../../../components';
import { useTranslation } from "react-i18next"; 
import { fontPercent, fontValue, width } from '../../../utils/Responsive';
import { Table, TableWrapper, Col, Row, Rows } from 'react-native-table-component';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import mement from "moment"
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util'
import LogoApp from '../../../assets/images/logoAnd2.png';
import Icon from "@react-native-vector-icons/fontawesome6"
import Colors from '../../../constants/Colors';
import DeviceInfo from 'react-native-device-info';

const Invoice = ({ navigation , route}) => {

     const { t, i18n } = useTranslation();
     const lang = i18n.language;

     const { invoice } = route.params;

     const createPDF = async () => {
          let options = {
               html : `<html>
                    <head>
                         <style>
                         .root {
                              box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
                              width: 88%;
                              height: 95%;
                              margin-left: 3%;
                              margin-right: 3%;
                              padding-left: 3%;
                              padding-right: 3%;
                              
                         }
                         #block_container {
                              padding-top: 7.5%;
                              display: flex;
                              justify-content: space-between;
                              align-items: center;
                              width: 100%;
                         }
                         #block_container > div {
                              display: inline-block;
                              vertical-align: middle;
                         }
                         
                         #imageContainer{
                              width: 8rem;
                              height: 8rem;
                         }

                         #imageContainer img {
                              width: 100%;
                              height: 100%;
                         }

                         #titleInvoice{
                              font-weight: 700;
                              font-size: 12px;
                              padding-top: 1.5px;
                              padding-bottom: 1.5px;
                              margin: 0px;
                         }
                         .title{
                              font-size: 12px;
                              padding-top: 1.5px;
                              padding-bottom: 1.5px;
                              margin: 0px;
                         }

                         body {
                              font-family: 'Helvetica';
                              font-size: 12px;
                         }
                         header, footer {
                              height: 50px;
                              background-color: #fff;
                              color: #000;
                              display: flex;
                              justify-content: center;
                              padding: 0 20px;
                         }
                         .table {
                              display: flex;
                              flex-direction: row-reverse;
                              width: 100%;
                              border-collapse: collapse;
                              margin-top: 5%;
                              min-width: 25%;
                         }

                         .table td {
                              padding-left: 1rem;
                              padding-right: 1rem;
                         }

                         .table-details {
                              flex-direction: row-reverse;
                              width: 100%;
                              border-collapse: collapse;
                              margin-top: 5%;
                              
                         }

                         .table-details tr td{
                              text-align: center;
                         }

                         .table-details tr {
                              width: 100%;
                         }

                         th, td {
                              border: 1px solid #999;
                              padding-top: .2rem;
                              padding-bottom: .2rem;
                              text-align: right;
                              font-size: .7rem;
                         }
                         th {
                              font-weight: 600;
                              background-color: #777;
                              text-align: center;
                              color: #ebe7e7;
                         }
                         #line {
                              color: #dad6d6;
                              box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
                         }
                         .container{
                              padding-top: 2.5rem;
                         }
                         .container-cost {
                              display: flex;
                              justify-content: space-between;
                              width: 12rem;
                              flex-direction: row-reverse;
                              padding-bottom: .8rem;
                         }
                         .container-title {
                              text-align: right;

                         }

                         .container-price {
                              display: flex;
                              flex-direction: row-reverse;
                         }

                         .cost-title {
                              text-align: left;
                              font-weight: 600;
                              font-size: .72rem;
                         }
                         .cost-data{
                              text-align: right;
                              font-weight: 600;
                         }
                         #container-qr{
                              padding-top: 1.2rem;
                         }
                         #qrcode {
                              display: flex;
                              justify-content: center;
                              align-items: center;
                              width : 100%
                              height : 100%
                         }
                    </style>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
                    </head>
                    <body>
                         <div class="root">
                              <div id="block_container">
                                   <div id="bloc1">
                                        <p id="titleInvoice">فاتوره ضريبة مبسطة</p>
                                        <p class="title">شركة تحياتي لتقنية المعلومات</p>
                                        <p class="title">Regards Information Technology Company</p>
                                        <p class="title">7144, Abi Bakr As Siddiq 4740, Riyadh 13335</p>
                                        <p class="title">الرقم الضريبي : 311320257400003</p>
                                   </div>
                                   <div id="imageContainer">
                                        <img src="https://alasala-cdn.fra1.cdn.digitaloceanspaces.com/Regards-1.png">
                                   </div>
                              </div>
                              <hr id="line">
                              <table class="table">
                              <tr>
                                   <td>${new Date(invoice?.issue_date).toLocaleDateString("en")}</td>
                                   <td>تاريخ الفاتورة</td>
                              </tr>
                              <tr>
                                   <td>${mement(invoice?.due_date).format("DD")+`${invoice?.orderId}`+ mement(invoice?.due_date).format("MM")}</td>
                                   <td>رقم الفاتورة</td>
                              </tr>
                              </table>
                              <table class="table-details">
                                   <tr>
                                        <th>
                                        <div>
                                             <span>Units subtotal Inc.VAT</span>
                                        </div>
                                        <div>
                                             <span>المجموع شامل ضريبة القيمة المضافة</span>
                                        </div>
                                        </th>
                                        <th>
                                        <div>
                                             <span>Unit Price</span>
                                        </div>
                                        <div>
                                             <span>سعر الخدمة</span>
                                        </div>
                                        </th>
                                        <th>
                                        <div>
                                             <span>Quantity</span>
                                        </div>
                                        <div>
                                             <span>الكمية</span>
                                        </div>
                                        </th>
                                        <th>
                                        <div>
                                             <span>Service Name</span>
                                        </div>
                                        <div>
                                             <span>اسم الخدمة</span>
                                        </div>
                                        </th>
                                   </tr>
                                   <tr>
                                        <td>${invoice?.qoyod_product_line_total}</td>
                                        <td>${invoice?.qoyod_product_unit_price.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]}</td>
                                        <td>${Math.floor(invoice?.qoyod_product_quantity)}</td>
                                        <td>${invoice?.qoyod_product_name.replace("-",`\n`)}</td>
                                   </tr>
                              </table>
                              <div class="container">
                                   <div class="container-cost">
                                        <div class="container-title">
                                             <span class="cost-title">:الاجمالي قبل الضريبة</span>
                                        </div>
                                        <div class="container-price">
                                             <span style="padding-left: .25rem;">${(invoice?.qoyod_product_unit_price * invoice?.qoyod_product_quantity).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]}</span><span class="cost-data">ر.س</span>
                                        </div>
                                   </div>
                                   <div class="container-cost">
                                        <div class="container-title">
                                             <span class="cost-title">:اجمالي الضريبة</span>
                                        </div>
                                        <div class="container-price">
                                             <span style="padding-left: .25rem;">${ ((invoice?.qoyod_product_unit_price * (invoice?.qoyod_product_tax_percent/100)) * invoice?.qoyod_product_quantity ).toFixed(2) }</span><span class="cost-data">ر.س</span>
                                        </div>
                                   </div>
                                   <div class="container-cost">
                                        <div class="container-title">
                                             <span class="cost-title">:المجموع</span>
                                        </div>
                                        <div class="container-price">
                                             <span style="padding-left: .25rem;">${ ( ( invoice?.qoyod_product_unit_price * invoice?.qoyod_product_quantity ) + ( invoice?.qoyod_product_unit_price * (invoice?.qoyod_product_tax_percent/100) *  invoice?.qoyod_product_quantity )).toFixed(2)}</span><span class="cost-data">ر.س</span>
                                        </div>
                                   </div>
                                   <div class="container-cost">
                                        <div class="container-title">
                                             <span class="cost-title">:الخصم</span>
                                        </div>
                                        <div class="container-price">
                                             <span style="padding-left: .25rem;">${ Math.round(Number(invoice?.qoyod_discount_amount) +  ((invoice?.qoyod_discount_amount * invoice?.qoyod_product_tax_percent ) /100)) }</span><span class="cost-data">ر.س</span>
                                        </div>
                                   </div>
                                   <div class="container-cost">
                                        <div class="container-title">
                                             <span class="cost-title">:المجموع</span>
                                        </div>
                                        <div class="container-price">
                                             <span style="padding-left: .25rem;">${Number(invoice?.qoyod_product_line_total).toFixed(2)}</span><span class="cost-data">ر.س</span>
                                        </div>
                                   </div>
                              </div>

                              <div id="container-qr">
                                   <div id="qrcode"></div>
                              </div>
                         </div>
                         <script>

                              var qrcode = new QRCode("qrcode", {
                                   text: "${invoice?.qrcode_string}",
                                   width : 130,
                                   height : 130,
                                   colorDark : "#000000",
                                   colorLight : "#ffffff",
                                   correctLevel : QRCode.CorrectLevel.H
                              });
                         </script>
                    </body>
                    </html>`,
               fileName: 'Regards',
               directory: 'Documents',
               base64 : true,
               
          };
      
          // let file = await RNHTMLtoPDF.convert(options)

          if(Platform.OS === "ios")
          {
               ReactNativeBlobUtil.ios.openDocument(file.filePath);
          }else if(Platform.OS === "android")
          {
               let deviceVersion = DeviceInfo.getSystemVersion();
               let granted = PermissionsAndroid.RESULTS.DENIED;
               if(deviceVersion >= 13){
                    granted = PermissionsAndroid.RESULTS.GRANTED;
                    if(granted === "granted")
                    {
                         ReactNativeBlobUtil.android.actionViewIntent(file.filePath, 'application/pdf');
                    }
               }else{
                    granted = await PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE );
                    console.log("12 android " , granted)
               }
          }

     }

     return (
          <ReactNativeZoomableView
               maxZoom={2}
               minZoom={1}
               zoomStep={0.5}
               initialZoom={1}
               zoomEnabled={true}
               bindToBorders={true}
               // onZoomAfter={this.logOutZoomState}
               style={{
                    width: "100%",
                    backgroundColor : "#fff"
               }}
          >
               <View direction="ltr" style={styles.root}>
                    <Card pushDown="3">
                         <Head 
                              title={ lang === "english" ? "Tax Invocie" : "الفاتورة الضريبية" }
                              handlePress={() => navigation.goBack()}
                         />
                    </Card>
                    {
                         invoice 
                         ?               
                              <Card style={styles.screen}>
                              <TouchableOpacity style={{ zIndex : 999, top : fontValue(10), left : width("3%"),flexDirection : "row", alignItems : "center", width : width("18") }} onPress={() => createPDF()}>
                                   <Icon name="file-pdf" size={fontValue("12")} style={{ marginRight : fontValue("3") }} color={Colors.standardColor}/>
                                   <Title text={"تحميل الفاتورة"} size={1}  color={Colors.standardColor}/>
                              </TouchableOpacity>
                                   <Card flexDirection={ lang === "english" ? "row-reverse" : "row-reverse" } style={styles.headCard}>
                                        <Logo 
                                             width="65" 
                                             height="65"
                                             source={LogoApp}
                                        />
                                        <Card pushUp="2" pushDown="2">
                                             <Title size={.8} style={{ textAlign : "left" }} fontWeight="bold" text={ lang === "english" ? "Simplified Tax Invoice" : "فاتورة ضريبية مبسطة"}/>
                                             <Title size={.8} style={{ textAlign : "left" }} fontWeight="400" text={`شركة تحياتي لتقنية المعلومات \nRegards Information Technology Company`}/>
                                             <Title size={.8} style={{ textAlign : "left" }} fontWeight="400" text="7144, Abi Bakr As Siddiq 4740, Riyadh 13335"/>
                                             <Title size={.8} style={{ textAlign : "left" }} fontWeight="400" text="الرقم الضريبي : 311320257400003"/>
                                        </Card>
                                   </Card>
                                   <Card style={{ marginHorizontal : "3%" }}>
                                        <Hr/>
                                   </Card>
                                   <Card pushUp="2" style={{ marginHorizontal : "3%" }} flexDirection="row-reverse"> 
                                        <Table style={{flexDirection: 'column', width : 140}} borderStyle={{borderWidth: .25, borderColor : "#333"}}>
                                             {/* Left Wrapper */}
                                             <TableWrapper style={{width: 140}} borderStyle= {{ borderWidth : 1 }}>
                                                  <TableWrapper style={{flexDirection: 'row'}}>
                                                       <Col heightArr={[15,15,15]} data={[new Date(invoice?.issue_date).toLocaleDateString("en"), mement(invoice?.due_date).format("DD")+`${invoice?.orderId}`+ mement(invoice?.due_date).format("MM")]}   textStyle={styles.text}/>
                                                       <Col data={ lang === "english" ? ['Invoice No.', 'Invoice Date','Order ID'] : ['تاريخ الفاتورة','رقم الفاتورة']} style={styles.title} heightArr={[15, 15, 15]} textStyle={styles.titleText}></Col>
                                                  </TableWrapper>
                                             </TableWrapper>
                                        </Table>
                                   </Card>
                                   <Card pushUp="2" style={{ marginHorizontal : "3%" }}>
                                        <Table borderStyle={{borderWidth: .25, borderColor: '#333'}}>
                                             <Row widthArr={[width("18"),width("18"),width("18"),width("31")]} data={[`Service Name \n اسم الخدمة`, 'Quantity \n الكمية', 'Unit price \n سعر الوحدة', `Units subtotal Inc.VAT\n المجموع شامل ضريبة القيمة المضافة`]} style={styles.head(lang)} textStyle={styles.textHeadTableDetails}/>
                                             <Rows widthArr={[width("18"),width("18"),width("18"),width("31")]} data={[[invoice?.qoyod_product_name.replace("-",`\n`), Math.floor(invoice?.qoyod_product_quantity), invoice?.qoyod_product_unit_price.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0], invoice?.qoyod_product_line_total]]} style={ styles.rowsStyle(lang) } textStyle={styles.text}/>
                                        </Table>
                                   </Card>
                                   <Card pushUp="2" flexDirection={lang === "english" ? "column" : "column"} style={{ marginHorizontal : "3%", alignItems : "flex-start" }}>
                                        <Card flexDirection={lang === "english" ? "row-reverse" : "row-reverse"} pushUp="1">
                                             <Title style={{ textAlign :  "right",paddingHorizontal : "3%", width : width("25%") }} text={ lang === "english" ? `Total Before VAT` : `الاجمالي قبل الضريبة:`} fontWeight="bold" size=".8"/>
                                             <Title style={{ textAlign :  "left", width : width("20%") }} text={ lang === "english" ? (invoice?.qoyod_product_unit_price * invoice?.qoyod_product_quantity).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0] + ` SAR` : (invoice?.qoyod_product_unit_price * invoice?.qoyod_product_quantity).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0] + ` ر.س`} size=".8" fontWeight="bold"/>
                                        </Card>
                                        <Card flexDirection={lang === "english" ? "row-reverse" : "row-reverse"} pushUp="1">
                                             <Title style={{ textAlign :  "right", paddingHorizontal : "3%", width : width("25%") }} text={ lang === "english" ? `VAT` : `اجمالي الضريبة:`} size=".8" fontWeight="bold"/>
                                             <Title style={{ textAlign :  "left", width : width("20%") }} text={ lang === "english" ? `${ ((invoice?.qoyod_product_unit_price * (invoice?.qoyod_product_tax_percent/100)) * invoice?.qoyod_product_quantity ).toFixed(2) } SAR`  : `${ ((invoice?.qoyod_product_unit_price * (invoice?.qoyod_product_tax_percent/100)) * invoice?.qoyod_product_quantity ).toFixed(2) } ر.س` } size=".8" fontWeight="bold"/> 
                                        </Card>

                                        <Card flexDirection={lang === "english" ? "row-reverse" : "row-reverse"} pushUp="1">
                                             <Title style={{ textAlign :  "right", paddingHorizontal : "3%", width : width("25%") }} text={ lang === "english" ? `Total` : `المجموع :`} size=".8" fontWeight="bold"/>
                                             <Title style={{ textAlign :  "left", width : width("20%") }} text={ lang === "english" ? `${ ( ( invoice?.qoyod_product_unit_price * invoice?.qoyod_product_quantity ) + ( invoice?.qoyod_product_unit_price * (invoice?.qoyod_product_tax_percent/100) *  invoice?.qoyod_product_quantity )).toFixed(2)} SAR` : `${ ( ( invoice?.qoyod_product_unit_price * invoice?.qoyod_product_quantity ) + ( invoice?.qoyod_product_unit_price * (invoice?.qoyod_product_tax_percent/100) *  invoice?.qoyod_product_quantity )).toFixed(2)} ر.س`} size=".8" fontWeight="bold"/> 
                                        </Card>
                                        {
                                             invoice?.qoyod_discount_amount
                                             ?
                                                  <Card flexDirection={lang === "english" ? "row-reverse" : "row-reverse"} pushUp="1">
                                                       <Title style={{ textAlign :  "right", paddingHorizontal : "3%", width : width("25%") }} text={ lang === "english" ? `Discound` : `الخصم :`} size=".8" fontWeight="bold"/>
                                                       <Title style={{ textAlign :  "left", width : width("20%") }} text={ lang === "english" ? `${ Math.round(Number(invoice?.qoyod_discount_amount) +  ((invoice?.qoyod_discount_amount * invoice?.qoyod_product_tax_percent ) /100)) } SAR` : `${ Math.round(Number(invoice?.qoyod_discount_amount) +  ((invoice?.qoyod_discount_amount * invoice?.qoyod_product_tax_percent ) /100)) } ر.س`} size=".8" fontWeight="bold"/> 
                                                  </Card>
                                             :
                                                  null
                                        }
                                        <Card flexDirection={lang === "english" ? "row-reverse" : "row-reverse"} pushUp="1">
                                             <Title style={{ textAlign :  "right", paddingHorizontal : "3%", width : width("25%") }} text={ lang === "english" ? `NET` : `المجموع:`} size=".8" fontWeight="bold"/>
                                             <Title style={{ textAlign :  "left", width : width("20%")}} text={lang === "english" ? `${Number(invoice?.qoyod_product_line_total).toFixed(2)} SAR` : `${Number(invoice?.qoyod_product_line_total).toFixed(2)} ر.س` } size=".8" fontWeight="bold"/>
                                        </Card>
                                   </Card>
                                   <Card pushUp="3" pushDown="12" flexDirection="column" style={{ justifyContent : "center", alignItems : "center" }}>
                                        <QRCode
                                             value={invoice?.qrcode_string}
                                        />
                                   </Card>
                                   
                              </Card>
                         :
                              <Title style={{ textAlign : "center" }} size="2" text={ lang === "english" ? "Invoice is not available now" : "الفاتورة غير متاحة الان"}/>    
                    }
               </View>
          </ReactNativeZoomableView>
     )
}

export default Invoice

const styles = StyleSheet.create({
     root : {
          flex: 1,
          backgroundColor : "#fff",
          width : "100%"
     },
     screen : {
          backgroundColor : "#fff",
          marginHorizontal : "5%",
          shadowColor: "#000",
          shadowOffset: {
               width: 0, 
               height: 5,
          },
          shadowOpacity: 0.36,
          shadowRadius: 6.68,
          elevation: 11,
     },
     headCard : {
          paddingTop : fontValue("10"),
          justifyContent : "space-between",
          alignItems : "center",
          marginHorizontal : "3%",
     },
     head : (lang) => ({
          backgroundColor : "#777",
          flexDirection : lang === "english" ? "row-reverse" : "row-reverse",
          height : 20,
     }),
     rowsStyle : (lang) => ({
          flexDirection : lang === "english" ? "row-reverse" : "row-reverse",
          // height : 20,
     }),
     textHeadTableDetails : {
          color : "#fff",
          fontSize : fontPercent("0.8"),
          textAlign : "center",
     },
     title: { flex: 1, backgroundColor: '#fff' },
     titleText: { marginRight: 6, textAlign:'right', fontSize : fontPercent("0.8"), fontWeight : "bold", color : "#000" },
     text: { textAlign: 'center', fontSize : fontPercent("0.8"), fontWeight : "400",  color : "#000"  },
})