import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView, Text, View, StyleSheet, TextInput, Button, Switch } from 'react-native';
import {Image} from 'react-native'
import React, { useState, useContext } from 'react';


function Qrcontent(){
  const [inputText, setInputText] = useState('');
    const [qrValue, setQrValue] = useState();
    return (
        <SafeAreaView style={[{flex: 1}]}>
        <Image style={styles.image} source={require('../images/logoporta.png')} />
        <View style={[styles.upLogo]}>
          <View style={{borderColor:'white',borderWidth: 15}}>
            
            <QRCode
              value={qrValue ? qrValue : 'NA'}
              size={250}
              color="black"
              backgroundColor="white"
              logoSize={30}
              logoMargin={2}
              logoBorderRadius={13}
              logoBackgroundColor="yellow"
            />
          </View>
        </View>
        <View style={styles.container}>
          <TextInput
            style={styles.textInput}
            onChangeText={(inputText) => setInputText(inputText)}
            value={inputText}
          />
        </View>
        <View style={{margin:5}}>
          <Button
            onPress={() => setQrValue('https://info.porta.com.pl/ewizytowka/vcard/'+ inputText + '.vcf')}
            title="Wygeneruj kod QR"
          />
        </View>
      </SafeAreaView>
    );
  };
  const styles = StyleSheet.create({
    containerQr: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image:{
      height: null,
      flex: 0.3,
      width: null,
      resizeMode: 'contain'
    },
    upLogo:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        padding: 30
    },
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    text: {
      fontSize: 20,
      textAlign: 'center',
      margin: 5,
      
    },
    textScanQR: {
      fontSize: 15,
      textAlign: 'center',
      margin: 5,
      fontWeight: "bold",
    },
    textUserName: {
      fontSize: 20,
      textAlign: 'center',
      marginTop: 40,
      fontWeight: "bold",
    },
    textInput: {
      flexDirection: 'row',
      height: 40,
      marginTop: 20,
      marginLeft: 10,
      marginRight: 10,
      margin: 10,
      borderWidth: 1,
    },
    button: {
        paddingTop: 20,
    },
  });

export default Qrcontent;