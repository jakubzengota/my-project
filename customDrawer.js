import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import React, { useState } from "react";
import {DrawerActions, useTheme} from '@react-navigation/native'
import {Icon, Container, View, Header, Footer, Content, Button, Right, ListItem, Left, List, Body, Text, Switch} from 'native-base';
import Animated from 'react-native-reanimated';
import { EventRegister  } from 'react-native-event-listeners';

function Sidebar({progress,...props}){
    const {colors} = useTheme();
    const [darkMode, setDarkMode] = useState(false)
    const translateX = Animated.interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [0, 0],
    });

    return (
        <Container>
            <Header style={{backgroundColor: colors.card, borderBottomWidth: 0}}>
                <Right>
                    <Button
                        transparent
                        onPress={() => 
                            props.navigation.dispatch(DrawerActions.closeDrawer())
                        }>
                            <Icon style={{color: colors.text}} name="menu"/>
                        </Button>
                </Right>
            </Header>
            <Content contentContainerStyle={{flex: 1, backgroundColor: colors.card}}>
                <DrawerContentScrollView {...props}>
                    <Animated.View style={{transform: [{translateX}]}}>
                        <DrawerItemList {...props} />
                    {/* <DrawerItem 
                        label="O aplikacji" 
                        icon={({color, size}) => ( 
                            <Icon name="grid" style={{fontSize: size, color: color}}/>
                        )}
                        onPress={() => props.navigation.navigate('Home')}
                    /> */}
                    </Animated.View>
                </DrawerContentScrollView>
                <List>
                    <ListItem>
                        <Body>
                            <Text style={{color: colors.text, fontSize: 15}}>Dark Mode</Text>
                        </Body>
                        <Right>
                            <Switch value={darkMode} onValueChange={(val) =>{
                                setDarkMode(val)
                                console.log(val);
                                EventRegister.emit('changeThemeEvent', val);
                            }}/>
                        </Right>
                    </ListItem>
                </List>
            </Content>
            <Footer style={{backgroundColor: colors.card}}><View style={{margin: 15}}><Text style={{color: colors.text}}>PORTA 2022</Text></View></Footer>
        </Container>
        
    );
}
export default Sidebar;