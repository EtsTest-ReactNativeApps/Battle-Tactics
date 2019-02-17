import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Container, Text, Button, Content } from 'native-base'
// components
import RandomStart from '../components/RandomStart'
import { AppConsumer } from '../storage/AppContext'

export default class SettingsScreen extends Component {
  static navigationOptions = {
    title: 'SETTINGS',
    headerTintColor: '#ffffff',
    headerStyle: {
      backgroundColor: '#1e8fb5',
      borderBottomColor: '#ffffff',
      borderBottomWidth: 3,
    },
    headerTitleStyle: {
      fontSize: 23,
    },
  };

  render() {
    return (
      <AppConsumer>

        {(context) => (
          <Container>

            <Content>

              <Text>This is the Screen screen</Text>

              <Button
                info
                rounded
                style={styles.button}
                onPress={() => { this.props.navigation.navigate("PlayerOne") }}
              >
                <Text>Player One</Text>
              </Button>

              <Button
                info
                rounded
                style={styles.button}
                onPress={() => { this.props.navigation.navigate("PlayerTwo") }}
              >
                <Text>Player Two</Text>
              </Button>


              <Button
                info
                rounded
                style={styles.button}
                onPress={() => { context.getAllData() }}
              >
                <Text>Import Armies</Text>
              </Button>

              <Button
                info
                rounded
                style={styles.button}
                onPress={() => { context.consoleLogFactionTEST() }}
              >
                <Text>consoleLogFactionTEST</Text>
              </Button>

              <Button
                info
                rounded
                style={styles.button}
                onPress={() => { context.clearAsyncStorage() }}
              >
                <Text>clearAsyncStorage</Text>
              </Button>

                            <Button
                info
                rounded
                style={styles.button}
                onPress={() => { context.getFactionFromStorage() }}
              >
                <Text>getFactionFromStorage</Text>
              </Button>

              {/* <RandomStart random={this.props.randomStart} />  */}

            </Content>
          </Container>
        )}

      </AppConsumer>
    );

  }
}

const styles = StyleSheet.create({
  button: {
    margin: 20,
    padding: 50,
    paddingRight: 10,
    paddingLeft: 10,
    width: 180,
    justifyContent: "center",
    borderRadius: 10
  }
})
