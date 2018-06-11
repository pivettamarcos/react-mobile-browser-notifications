import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Permissions, Notifications } from 'expo';

const PUSH_ENDPOINT = 'https://192.168.0.9:1337/';

let existingStatus = "", finalStatus = "";


export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Button title="registerPush" onPress={registerForPushNotificationsAsync}></Button>
      </View>
    );
  }
}

async function registerForPushNotificationsAsync() {
    existingStatus = await Permissions.askAsync(
        Permissions.NOTIFICATIONS
    );
    finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        let status = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    // POST the token to your backend server from where you can retrieve it to send push notifications.
    return fetch(PUSH_ENDPOINT, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: {
                value: token,
            },
            user: {
                username: 'Brent',
            },
        }),
    });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
