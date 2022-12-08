import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View, ActivityIndicator, Button} from 'react-native';
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import GLOBALS from '../globals';

/**
 * Komponent obslugujacy ekran listy konwersacji
 */
class ConversationsList extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            dataSource: []
        }
    }

    /**
     * Laduje konwersacje
     * @returns {Promise<void>}
     */
    loadConversations = async () => {
        let username = await AsyncStorage.getItem('myUsername');
        let myToken = await AsyncStorage.getItem('myToken')

        fetch(GLOBALS.SERVER_URL + "/actions/getMessages.php", {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                userToken: myToken
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status !== -1) {
                    this.setState({
                        isLoading: false,
                        dataSource: responseJson
                    })
                    setTimeout(this.loadConversations, 500);
                } else {
                    Toast.show("Nie jesteś już zalogowany");
                    this.props.navigation.navigate('Logowanie')
                }
            })
    }

    /**
     * Komponent elementu listy konwersacji
     * @param item
     * @returns {JSX.Element}
     * @private
     */
    _conv_row = ({item}) => (
        <Pressable style={(state) => [
            styles.listItem,
            state.focused && styles.focused,
            state.hovered && styles.hovered,
            state.pressed && styles.pressed,
            styles.disabled]}
                   onPress={() => {
                       this.props.navigation.navigate('Conversation', {who: item.username})
                   }}>

                <Text style={[styles.sender, { color: (item.msg_status >= 1) ?'red' : 'black' }]}> {item.username} </Text>
                <Text style={[{ color: (item.msg_status >= 1) ?'red' : 'black' }]}>
                    <Text style={[styles.content, { color: (item.msg_status >= 1) ?'red' : 'black' }]}>{item.content} </Text>{item.creation_date}
                </Text>
        </Pressable>
    );

    componentDidMount() {
        this.loadConversations();
    }

    render() {

        if (this.state.isLoading) {
            return (<View style={styles.container}>
                <ActivityIndicator size='large' animating/>
            </View>);
        } else {
            return (
                <FlatList
                    data={this.state.dataSource}
                    renderItem={this._conv_row}
                    keyExtrator={(item, index) => index}
                />
            );
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
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

    return <ConversationsList {...props} navigation={navigation}/>;
}