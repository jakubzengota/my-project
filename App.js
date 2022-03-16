import * as React from 'react';
import { View, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { useEffect, useState, useContext, useCallback } from 'react';
import ReactDOM from "react-dom";
import { NavigationContainer, DrawerActions, DefaultTheme, DarkTheme, useTheme } from '@react-navigation/native';
import { Container, Content, Text, Header, Left, Body, Title, Right, Icon, Button } from 'native-base';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Sidebar from './customDrawer';
import { EventRegister } from 'react-native-event-listeners';
import Profilecontent from './components/Profilecontent';
import QRCode from 'react-native-qrcode-svg';
import { set } from 'react-native-reanimated';

const Drawer = createDrawerNavigator();

//---------------------------------------HOME SCREEN---------------------------------------\\
function HomeScreen({navigation}){
  const [qrValue, setQrValue] = useState();
  const [inputText, setInputText] = useState('');
  const {colors} = useTheme();

  return (
    <Container>
      <Header style={{backgroundColor: colors.card}}>
        <Left style={{flex:0.1}}>
          <Button
              transparent
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
              <Icon style={{color: colors.text, width: 20}} name="menu"/>
          </Button>
        </Left>
          <Body style={{flex: 1, alignItems: 'center'}}>
            <Title style={{color: colors.text}}>Home</Title>
          </Body>
        <Right style={{flex:0.1}} />
      </Header>
      <Content
        contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.card
          }}>
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
        {/* <Qrcontent/> */}
        <View>
          <TextInput
            style={styles.textInput}
            onChangeText={(inputText) => setInputText(inputText)}
            value={inputText}
          />
          <Button
            style={{width:140, backgroundColor: 'green', justifyContent: 'center' }}
            onPress={() => setQrValue('https://info.porta.com.pl/ewizytowka/vcard/'+ inputText + '.vcf')}
            title="Wygeneruj kod QR">      
          </Button>
        </View>
      </Content>
    </Container>
  );
}
//---------------------------------------PROFILE SCREEN---------------------------------------\\
function ProfileScreen({navigation}) {
  const {colors} = useTheme();
  
  return (
    <Container>
      <Header style={{backgroundColor: colors.card}}>
        <Left style={{flex:0.1}}>
          <Button 
              transparent
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
              <Icon style={{color: colors.text, width: 20}} name="menu" />
            </Button>
        </Left>
          <Body style={{flex: 1, alignItems: 'center'}}>
            <Title style={{color: colors.text}}>Profile</Title>
          </Body>
        <Right style={{flex:0.1}} />
      </Header>
      <Content
        contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.card
          }}>
        <Text style={{color: colors.text}}>Profile Screen</Text>

        {/* <Profilecontent/> */}
      </Content>
    </Container>
  );
}

const AppDrawer = () => {
  return (
    <Drawer.Navigator drawerContent={props=> <Sidebar {...props} />}>

      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
            drawerIcon: ({focused, color, size}) => (
              <Icon name="home" style={{fontSize: size, color: color}}/>
            ),
          }}
        />
      
      <Drawer.Screen
        name="Profile" 
        component={ProfileScreen}
        options={{
          headerShown: false,
          drawerIcon: ({focused, color, size}) => (
            <Icon name="people" style={{fontSize: size, color: color}} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

function App() {
  const [darkApp, setDarkApp] = useState(false);
  const appTheme = darkApp ? DarkTheme : DefaultTheme;

  useEffect( () => {
    let eventListener = EventRegister.addEventListener(
      'changeThemeEvent',
      data => {
        setDarkApp(data);
      },
    );
    return () => {
      EventRegister.removeAllListeners(eventListener);
    };
  }, []);

  return (
      <NavigationContainer theme = {appTheme}>
        <AppDrawer/>
      </NavigationContainer>
  );
}

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
    height: 40,
    width: 140,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    justifyContent: 'center'
  },

});

export default App;