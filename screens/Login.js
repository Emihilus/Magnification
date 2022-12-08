import React, {Component} from 'react';
import Toast from 'react-native-root-toast';
import {Button, StyleSheet, Text, View, ActivityIndicator, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from "@react-navigation/native";
import GLOBALS from '../globals';

/**
 * Komponent obslugujacy ekran logowania
 */
class Login extends Component {

    constructor() {
        super();
        this.state = {
            loginInput: '',
            pwdInput: ''
        }
    }

    /**
     * Funkcja oblsuguje logowanie
     */
    login = () => {
        fetch(GLOBALS.SERVER_URL + "/utils/login.php", {
            method: 'POST',
            body: JSON.stringify({
                username: this.state.loginInput ?? '',
                pwd: this.state.pwdInput ?? '',
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === 0) {
                    Toast.show("Błedne dane logowania");
                } else {
                    AsyncStorage.setItem('myUsername', this.state.loginInput);
                    AsyncStorage.setItem('myToken', responseJson.token);
                    Toast.show("Zalogowano");

                    this.props.navigation.navigate('Conversations')
                }
            })
    }

    // Funkcje oblsugujace inputy loginu i hasla
    onChangeLoginText = (text) => {
        this.setState({
            loginInput: text
        })
    }

    onChangePwdText = (text) => {
        this.setState({
            pwdInput: text
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.loginGroup}>
                    <TextInput
                        style={[styles.input, styles.lGel]}
                        placeholder={'Login'}
                        onChangeText={this.onChangeLoginText}
                    />
                    <TextInput
                        style={[styles.input, styles.lGel]}
                        placeholder={'Hasło'}
                        onChangeText={this.onChangePwdText}
                    />
                    <View style={styles.lGel}>
                        <Button
                            title="Zaloguj"
                            color="#841584"
                            onPress={this.login}
                        />
                    </View>
                    <View style={styles.lGel}>
                        <Button
                            title="Rejestracja"
                            color="#841584"
                            onPress={() => {
                                this.props.navigation.navigate('Rejestracja')
                            }}
                        />
                    </View>
                </View>

            </View>);

    }
}


const styles = StyleSheet.create({
    loginGroup: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '80%'
    },
    lGel: {
        marginBottom: 10
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        flexGrow: 1
    },
    container: {
        flex: 1,
        height: '100%'
    },
    sender: {
        fontSize: 26,
    },
    content: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    listItem: {
        padding: 10,
        borderWidth: 1,
        outlineWidth: 0,
        backgroundColor: '#fff'
    },
    hovered: {
        backgroundColor: '#ddd'
    },
    focused: {
        boxShadow: '0px 0px 0px 1px blue'
    },
    pressed: {
        backgroundColor: 'lightblue'
    },
    disabled: {
        opacity: 0.5
    },
    buttons: {
        flexDirection: 'row',
        marginVertical: '1rem'
    },
});


export default function (props) {
    const navigation = useNavigation();

    return <Login {...props} navigation={navigation}/>;
}
