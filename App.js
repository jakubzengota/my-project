import * as React from "react";
import { View, TextInput, Image, StatusBar, Alert } from "react-native";
import { useEffect, useState } from "react";
import {
  NavigationContainer,
  DrawerActions,
  DefaultTheme,
  DarkTheme,
  useTheme,
} from "@react-navigation/native";
import {
  Container,
  Content,
  Text,
  Header,
  Left,
  Body,
  Title,
  Right,
  Icon,
  Button,
} from "native-base";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Sidebar from "./customDrawer";
import { EventRegister } from "react-native-event-listeners";
import QRCode from "react-native-qrcode-svg";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Drawer = createDrawerNavigator();
export const ThemeContext = React.createContext();

//--------------------------------------HOME SCREEN---------------------------------------\\
function HomeScreen({ navigation, route, props }) {
  const [qrValue, setQrValue] = useState();
  const { colors } = useTheme();
  const staticImage = require("./assets/black.png");
  const staticImageDark = require("./assets/white.png");
  const [userName, setUserName] = useState("");
  const [firtRun, setFirstRun] = useState(true);

  //--------------------------------------LOCAL STORAGE---------------------------------------\\
  const storeData = async (newVCard, userName) => {
    try {
      await AsyncStorage.setItem("employee", JSON.stringify(newVCard));
      await AsyncStorage.setItem("userName", JSON.stringify(userName));
    } catch (e) {}
    getData();
  };

  const getData = async () => {
    try {
      const storedVcard = await AsyncStorage.getItem("employee");
      const storedUserName = await AsyncStorage.getItem("userName");
      if (storedVcard !== null) {
      }
      return [JSON.parse(storedVcard), JSON.parse(storedUserName)];
    } catch (e) {
    }
  };
  //--------------------------------------LOCAL STORAGE---------------------------------------\\
  
  useEffect(() => {
    if(firtRun == true){
      getData().then(([storedVcard, userName]) => {
        if (storedVcard !== "undefined") {
          setQrValue(storedVcard);
          setUserName(userName);
        }
      });
    }
    setFirstRun(false);
    if (route.params?.input) {
      axios
        .get(
          "https://info.porta.com.pl/ewizytowka/vcard/j/" + route.params.input +".json",{
            headers: {
              Cookie: "aToken=3d5f441a-17cd-4ab4-a163-2d0df47591fa"
            }
          }
        )
        .then(
          (res) => new Promise((resolve) => setTimeout(() => resolve(res), 500))
        )
        .then((res) => {
          const newVCard = res.data.vcf;
          setQrValue(res.data.vcf);
          storeData(newVCard, res.data);
        })
        .catch((err) => {
        });
    }
    if (route.params?.user) {
      setUserName(route.params.user);
    }
  });

  const context = React.useContext(ThemeContext);

  return (
    <Container style={{ backgroundColor: colors.card }}>
      <Header style={{ backgroundColor: colors.card }}>
        <Left style={{ flex: 0.1 }}>
          <Button
            transparent
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Icon style={{ color: colors.text, width: 20 }} name="menu" />
          </Button>
        </Left>
        <Body style={{ flex: 1, alignItems: "center" }}>
          <Title style={{ color: colors.text, fontWeight: "bold" }}>
            Business Card
          </Title>
        </Body>
        <Right style={{ flex: 0.1 }} />
      </Header>
      <View style={{ marginTop: 50, color: colors.card }}>
        <Image
          source={context ? staticImageDark : staticImage}
          style={{
            width: "100%",
            resizeMode: "contain",
            height: 90,
            backgroundColor: colors.card,
          }}
        ></Image>
      </View>
      <Content
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.card,
        }}
      >
        {qrValue && (
          <View
            style={{ borderColor: "white", borderWidth: 15, borderRadius: 25 }}
          >
            <QRCode
              value={qrValue ? qrValue : "NA"}
              size={250}
              color="black"
              backgroundColor="white"
              logoSize={30}
              logoMargin={2}
              logoBorderRadius={13}
              logoBackgroundColor="yellow"
            />
          </View>
        )}
        <View>
          {!userName && (
            <Text style={{ color: colors.text, marginBottom: 30 }}>
              ADD USER TO SEE QR CODE
            </Text>
          )}
        </View>
        <View>
          {!userName && (
            <Button
              style={{
                backgroundColor: colors.border,
                justifyContent: "center",
                borderRadius: 20,
                paddingLeft: 5,
                paddingRight: 5,
                width: 120,
              }}
              onPress={() => {
                navigation.navigate({
                  name: "User",
                  merge: true,
                });
              }}
            >
              <Text style={{ color: colors.text }}>ADD USER</Text>
            </Button>
          )}
          <View>
            {!!qrValue && !!userName && (
              <View
                style={{
                  color: colors.text,
                  marginTop: 20,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {userName && (
                  <>
                    <Text style={{ color: colors.text, fontSize: 17 }}>
                      {userName.name} {userName.lastName}
                    </Text>
                    <Text style={{ color: colors.text, fontSize: 17 }}>
                      {userName.title}
                    </Text>
                    <Text style={{ color: colors.text, fontSize: 17 }}>
                      {userName.mobile}
                    </Text>
                    <Text style={{ color: colors.text, fontSize: 17 }}>
                      {userName.email}
                    </Text>
                  </>
                )}
              </View>
            )}
          </View>
        </View>
      </Content>
    </Container>
  );
}
//---------------------------------------PROFILE SCREEN---------------------------------------\\
function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const [inputText, setInputText] = useState("");
  const staticImage = require("./assets/black.png");
  const staticImageDark = require("./assets/white.png");
  const [userName, setUserName] = useState("");
  const [isDisabled, setDisabled] = useState(false);

  const getQuote = () => {
    setDisabled(true);
    if (inputText != "") {
      axios
        .get("https://info.porta.com.pl/ewizytowka/vcard/j/" + inputText + ".json",{
          headers: {
            Cookie: "aToken=3d5f441a-17cd-4ab4-a163-2d0df47591fa"
          }
        })
        .then(
          (res) => new Promise((resolve) => setTimeout(() => resolve(res), 500))
        )
        .then((res) => {
          if (res.data.name === undefined) {
            Alert.alert("Error!", "Domain login not found", [
              {
                text: "Understood",
                onPress: () => console.log("alert closed"),
              },
            ]);
            setDisabled(false);
          } else {
            const newQuote = res.data;
            setUserName(newQuote);
            setDisabled(false);
            navigation.navigate({
              name: "Business Card",
              params: { input: inputText, user: newQuote },
              merge: true,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          Alert.alert("Connection error", "Check your internet connection", [
            { text: "Ok", onPress: () => console.log("alert closed") },
          ]);
          setDisabled(false);
        });
    } else {
      Alert.alert("Error", "Empty domain login field", [
        { text: "Ok", onPress: () => console.log("alert closed") },
      ]);
      setDisabled(false);
    }
  };
  const context = React.useContext(ThemeContext);
  return (
    <Container style={{ backgroundColor: colors.card }}>
      <Header style={{ backgroundColor: colors.card }}>
        <Left style={{ flex: 0.1 }}>
          <Button
            transparent
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Icon style={{ color: colors.text, width: 20 }} name="menu" />
          </Button>
        </Left>
        <Body style={{ flex: 1, alignItems: "center" }}>
          <Title style={{ color: colors.text, fontWeight: "bold" }}>User</Title>
        </Body>
        <Right style={{ flex: 0.1 }} />
      </Header>
      <View style={{ marginTop: 50, color: colors.card }}>
        <Image
          source={context ? staticImageDark : staticImage}
          style={{
            width: "100%",
            resizeMode: "contain",
            height: 90,
            backgroundColor: colors.card,
          }}
        ></Image>
      </View>
      <Content
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          paddingTop: 50,
          backgroundColor: colors.card,
        }}
      >
        <Text
          style={{
            color: colors.text,
            marginBottom: 20,
            marginTop: 10,
            fontWeight: "bold",
            fontSize: 15,
          }}
        >
          ENTER DOMAIN LOGIN
        </Text>
        <View>
          <TextInput
            style={{
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.card,
              fontWeight: "bold",
              height: 40,
              width: 140,
              marginTop: 20,
              marginBottom: 50,
              borderWidth: 1,
              justifyContent: "center",
              textAlign: "center",
            }}
            onChangeText={(inputText) => setInputText(inputText)}
            value={inputText}
          />
        </View>
        <View>
          {isDisabled ? (
            <Text>LOADING...</Text>
          ) : (
            <Button
              style={{
                backgroundColor: colors.border,
                justifyContent: "center",
                borderRadius: 20,
                paddingLeft: 5,
                paddingRight: 5,
              }}
              onPress={() => {
                getQuote();
              }}
              disabled={isDisabled}
            >
              <Text
                style={isDisabled ? { color: "red" } : { color: colors.text }}
              >
                Generate QR
              </Text>
            </Button>
          )}
        </View>
      </Content>
    </Container>
  );
}
//---------------------------------------ABOUT SCREEN---------------------------------------\\
function AboutScreen({ navigation }) {
  const { colors } = useTheme();
  const [inputText, setInputText] = useState("");
  const staticImage = require("./assets/black.png");
  const staticImageDark = require("./assets/white.png");
  const context = React.useContext(ThemeContext);
  return (
    <Container style={{ backgroundColor: colors.card }}>
      <Header style={{ backgroundColor: colors.card }}>
        <Left style={{ flex: 0.1 }}>
          <Button
            transparent
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Icon style={{ color: colors.text, width: 20 }} name="menu" />
          </Button>
        </Left>
        <Body style={{ flex: 1, alignItems: "center" }}>
          <Title style={{ color: colors.text, fontWeight: "bold" }}>
            About
          </Title>
        </Body>
        <Right style={{ flex: 0.1 }} />
      </Header>
      <View style={{ marginTop: 50, color: colors.card }}>
        <Image
          source={context ? staticImageDark : staticImage}
          style={{
            width: "100%",
            resizeMode: "contain",
            height: 90,
            backgroundColor: colors.card,
          }}
        ></Image>
      </View>
      <Content
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.card,
        }}
      >
        <Text
          style={{
            color: colors.text,
            width: "80%",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
            paddingBottom: 60,
            marginTop: -50,
          }}
        >
          The application displays a QR code for a selected PORTA employee.
        </Text>
        <Text
          style={{
            color: colors.text,
            width: "80%",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Select the "User" tab and enter the domain login.
        </Text>
        <Text
          style={{
            color: colors.text,
            width: "80%",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          A QR code will be displayed ready to be scanned.
        </Text>
        <Text
          style={{
            color: colors.text,
            width: "80%",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Scan the code.
        </Text>
        <Text
          style={{
            color: colors.text,
            width: "80%",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          The employee will be added automatically to the contacts on the phone.
        </Text>
        <Text
          style={{
            color: colors.text,
            width: "80%",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Aplication requires internet access.
        </Text>
        <Text
          style={{
            color: colors.text,
            width: "80%",
            textAlign: "center",
            marginTop: 30,
          }}
        >
          Version 6.1.1
        </Text>
      </Content>
    </Container>
  );
}
const AppDrawer = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <Sidebar {...props} />}>
      <Drawer.Screen
        name="Business Card"
        component={HomeScreen}
        options={{
          headerShown: false,
          drawerIcon: ({ focused, color, size }) => (
            <Icon name="home" style={{ fontSize: size, color: color }} />
          ),
        }}
      />

      <Drawer.Screen
        name="User"
        component={ProfileScreen}
        options={{
          headerShown: false,
          drawerIcon: ({ focused, color, size }) => (
            <Icon name="people" style={{ fontSize: size, color: color }} />
          ),
        }}
      />

      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          headerShown: false,
          drawerIcon: ({ focused, color, size }) => (
            <Icon name="grid" style={{ fontSize: size, color: color }} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

function App() {
  const [darkApp, setDarkApp] = useState(false);
  const appTheme = darkApp ? DarkTheme : DefaultTheme;

  useEffect(() => {
    let eventListener = EventRegister.addEventListener(
      "changeThemeEvent",
      (data) => {
        setDarkApp(data);
      }
    );
    return () => {
      EventRegister.removeAllListeners(eventListener);
    };
  }, []);
  return (
    <NavigationContainer theme={appTheme}>
      <StatusBar hidden />
      <ThemeContext.Provider value={darkApp}>
        <AppDrawer />
      </ThemeContext.Provider>
    </NavigationContainer>
  );
}

export default App;
