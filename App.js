import React, {useState} from 'react';
import {RootSiblingParent} from 'react-native-root-siblings';
import {View, StyleSheet, Button, TextInput} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ConversationsList from "./screens/ConversationsList";
import Conversation from "./screens/Conversation";
import Login from "./screens/Login";
import AppMenu from "./components/AppMenu";
import Registration from "./screens/Registration";

const Stack = createNativeStackNavigator();

const App = () => {

    // owiniecie SuperTextInput
    function NewConversationModal({navigation}) {
        return (
            <SuperTextInput navigation={navigation}/>
        );
    }

    return (
        <RootSiblingParent>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Group>
                        <Stack.Screen name="Logowanie"
                                      component={Login}/>
                        <Stack.Screen name="Conversations"
                                      component={ConversationsList}
                                      options={{
                                          headerTitle: 'Rozmowy',
                                          headerRight: () => (
                                              <View>
                                                  <AppMenu/>
                                              </View>)
                                      }}/>
                        <Stack.Screen name="Conversation"
                                      component={Conversation}
                                      options={{
                                          headerRight: () => (
                                              <View>
                                                  <AppMenu/>
                                              </View>)
                                      }}/>
                        <Stack.Screen name="Rejestracja"
                                      component={Registration}/>
                    </Stack.Group>

                    <Stack.Group screenOptions={{presentation: 'modal'}}>
                        <Stack.Screen name="Nowa rozmowa" component={NewConversationModal}/>
                    </Stack.Group>
                </Stack.Navigator>
            </NavigationContainer>
        </RootSiblingParent>
    );
};

/**
 * Kompoment widoku ekranu rozpoczynania nowej rozmowy
 * @param navigation
 * @returns {JSX.Element}
 * @constructor
 */
function SuperTextInput({navigation}) {
    const [textContent, changeTextState] = useState('');

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TextInput
                style={styles.input}
                value={textContent}
                placeholder={'Podaj nazwe użytkownika'}
                onChangeText={(textContent) => changeTextState(textContent)}/>
            <Button onPress={() => navigation.navigate('Conversation', {who: textContent})} title="Rozpocznij rozowę"/>
        </View>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        padding: 10,
        marginBottom: 10
    },
});

export default App;