import React, {Component} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import Toast from "react-native-root-toast";
import GLOBALS from '../globals';

/**
 * Komponent obslugujacy ekran rejestracji
 */
class Registration extends Component {

    constructor() {
        super();
        this.state = {
            isLoading: true,
            username: '',
            pwd1: '',
            pwd2: '',
            email: ''
        }
    }

    /**
     * Funkcja przeprowadzajaca rejestracje
     */
    register = () => {

        if (this.state.username.length > 0 &&
            this.state.pwd1.length > 0 &&
            this.state.email.length > 0) {

            if (this.state.pwd1 === this.state.pwd2) {
                fetch(GLOBALS.SERVER_URL + "/actions/register.php", {
                    method: 'POST',
                    body: JSON.stringify({
                        username: this.state.username,
                        pwd: this.state.pwd1,
                        email: this.state.email,
                    })
                }).then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.status === 1) {
                            Toast.show("Rejestracja pomyślna");
                            this.props.navigation.goBack()
                        } else {
                            Toast.show("Nie udało się zarejestowac");
                        }
                    })
            } else {
                Toast.show("Hasła sie nie zgadzają");
            }

        } else {
            Toast.show("Dane nie są uzupełnione");
        }


    }


    // funkcje obslugujace inputy
    onChangeUsername = (text) => {
        this.setState({
            username: text
        })
    }

    onChangePwd1 = (text) => {
        this.setState({
            pwd1: text
        })
    }

    onChangePwd2 = (text) => {
        this.setState({
            pwd2: text
        })
    }

    onChangeEmail = (text) => {
        this.setState({
            email: text
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.inputGroup}>

                    <Text>Nazwa użytkownika</Text>
                    <TextInput
                        style={styles.input}
                        value={this.state.username}
                        onChangeText={this.onChangeUsername}
                        textContentType={'username'}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text>Hasło</Text>
                    <TextInput
                        style={styles.input}
                        value={this.state.pwd1}
                        textContentType={'password'}
                        autocomplete={'password'}
                        secureTextEntry={true}
                        onChangeText={this.onChangePwd1}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text>Powtórz hasło</Text>
                    <TextInput
                        style={styles.input}
                        value={this.state.pwd2}
                        textContentType={'password'}
                        autocomplete={'password'}
                        secureTextEntry={true}
                        onChangeText={this.onChangePwd2}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text>Adres Email</Text>
                    <TextInput
                        style={styles.input}
                        value={this.state.email}
                        textContentType={'emailAddress'}
                        onChangeText={this.onChangeEmail}
                    />
                </View>
                <View
                    style={styles.button}>
                    <Button
                        title="Rejestruj"
                        color="#841584"
                        onPress={this.register}
                    />
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    inputGroup: {
        padding: 4,
        marginBottom: 10,
        alignItems: 'center'
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        width: '80%'
    },
    container: {
        justifyContent: 'center',
        flex: 1,
    },
    button: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto'
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

    return <Registration {...props} navigation={navigation}/>;
}