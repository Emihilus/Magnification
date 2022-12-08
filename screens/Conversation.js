import React, {Component} from 'react';
import {ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from "react-native-root-toast";
import GLOBALS from '../globals';

/**
 * Komponent obslugujacy ekran Rozmowy z kims
 */
class Conversation extends Component {

    constructor() {
        super();
        this.state = {
            isLoading: true,
            dataSource: []
        }
    }

    /**
     * Funkcja przeladowuje rozmowe
     * @returns {Promise<void>}
     */
    reloadConversation = async () => {
        fetch(GLOBALS.SERVER_URL + "/actions/getConversation.php", {
                method: 'POST',
                body: JSON.stringify({
                    myUsername: await AsyncStorage.getItem('myUsername'),
                    userToken: await AsyncStorage.getItem('myToken'),
                    receiver: this.props.route.params.who
                })
            }
        ).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === 0) {
                    Toast.show("Użytkownik nie istnieje");
                    this.props.navigation.goBack()
                } else if (responseJson.status === -1) {
                    Toast.show("Nie jesteś już zalogowany");
                    this.props.navigation.navigate('Logowanie')
                } else {
                    this.setState({
                        isLoading: false,
                        dataSource: responseJson
                    })
                    setTimeout(this.reloadConversation, 500);
                }
            })
    }

    /**
     * Funkcja wysyla wiadomosc
     * @returns {Promise<void>}
     */
    sendMesssage = async () => {
        fetch(GLOBALS.SERVER_URL + "/actions/addMessage.php", {
            method: 'POST',
            body: JSON.stringify({
                myUsername: await AsyncStorage.getItem('myUsername'),
                userToken: await AsyncStorage.getItem('myToken'),
                receiver: this.props.route.params.who,
                content: this.state.msgInput
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status != 1) {
                    Toast.show("Błąd podczas wysyłania wiadomośći")
                } else {
                    this.setState({
                        msgInput: null
                    })
                }
            })
    }

    /**
     * Komponent wiersza wiadomosci
     * @param item
     * @returns {JSX.Element}
     * @private
     */
    _msg_row = ({item}) => (
        <View style={styles.listItem}>
            <Text style={styles.sender}> {item.sender_username} </Text>
            <Text> <Text style={styles.content}>{item.content} </Text>{item.creation_date}  </Text>
        </View>
    );

    /**
     * Obsluguje input wiadomosci
     * @param text
     */
    onChangeText = (text) => {
        this.setState({
            msgInput: text
        })
    }

    componentDidMount() {
        this.reloadConversation();
    }

    render() {
        this.props.navigation.setOptions({title: 'Konwersacja z ' + this.props.route.params.who})

        if (this.state.isLoading) {
            return (<View style={styles.container}>
                <ActivityIndicator size='large' animating/>
            </View>);
        } else {
            return (
                <View style={styles.container}>
                    <FlatList
                        data={this.state.dataSource}
                        renderItem={this._msg_row}
                        keyExtrator={(item, index) => index}
                        inverted={true}
                    />
                    <View style={styles.inputGroup}>

                        <TextInput
                            style={styles.input}
                            value={this.state.msgInput}
                            placeholder={'Wpisz wiadomość'}
                            onChangeText={this.onChangeText}
                        />
                        <Button
                            title="Wyślij"
                            color="#841584"
                            onPress={this.sendMesssage}
                        />
                    </View>
                </View>
            );
        }
    }
}


const styles = StyleSheet.create({
    inputGroup: {
        flexDirection: 'row'
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        flexGrow: 1
    },
    container: {
        flex: 1,
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

    return <Conversation {...props} navigation={navigation}/>;
}