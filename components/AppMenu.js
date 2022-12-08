import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Menu, MenuItem } from 'react-native-material-menu';
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-root-toast';


/**
 * Kompoment obslugujacy menu zawierajace opcje 'nowa rozmowa' i 'wyloguj'
 * @returns {JSX.Element}
 * @constructor
 */
export default function AppMenu() {
    const [visible, setVisible] = useState(false);

    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);
    const navigation = useNavigation();

    // wyczysczenie tokenu i aktualnie zalogowanego uzytkownika
    const logout = async () => {
        await AsyncStorage.removeItem('myToken')
        await AsyncStorage.removeItem('myUsername')
        navigation.navigate('Logowanie')
        Toast.show("Wylogowano");
    }

    return (
        <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Menu
                visible={visible}
                anchor={<Text onPress={showMenu}>Menu</Text>}
                onRequestClose={hideMenu}>
                <MenuItem onPress={() => navigation.navigate('Nowa rozmowa')}>Nowa rozmowa</MenuItem>
                <MenuItem onPress={logout}>Wyloguj</MenuItem>
            </Menu>
        </View>
    );
}