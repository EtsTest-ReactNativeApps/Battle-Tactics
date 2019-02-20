import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Container, Text } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
// components
import TerrainSideMenu from '../components/TerrainSideMenu';
import NextBackWrapper from '../components/NextBackWrapper';
import TerrainPlacement from '../components/TerrainComponents/TerrainPlacement';
// context
import { AppConsumer } from '../storage/AppContext';

export default class ChooseTerrain extends Component {
  static navigationOptions = {
    title: 'CHOOSE TERRAIN',
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

              <Grid style={styles.grid}>
                
                <Row size={90}>
                  <TerrainPlacement />
                </Row>
                <Row size={10}>
                  <NextBackWrapper path="Factions"/>
                </Row>
              
              </Grid>

            </Container>
          )}
        </AppConsumer>
    );
  }
}

const styles = StyleSheet.create({
  grid: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around"
  },
})
