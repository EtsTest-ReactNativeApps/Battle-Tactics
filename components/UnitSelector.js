import React, { Component } from 'react'
import { AsyncStorage, StyleSheet } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import { Grid, Row } from 'react-native-easy-grid'
import { AppProvider, AppConsumer } from '../storage/AppContext';
import UnitCard from '../components/UnitCard';
import Units from '../utils/data/units.json';

class CustomDidMount extends Component {
  componentDidMount() {
    this.props.getFactionFromStorage
    console.log("CUSTOMDIDMOOUNTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
    // do not delete: VERY IMPORTAN!!!
  }
  render() {
    return null
  }
}


export default class UnitSelector extends Component {


  render() {
    return (
      <AppConsumer>
        {(context) => (
          <Container>
            <Grid>

              <Row size={10}>

                <Button
                  onPress={() => context.getFactionFromStorage(context.state.playerOne.faction)}
                >
                  <Text>Load Units</Text>
                </Button>
              </Row>

              <Row size={70}>
                <Content>
                  {/* {console.log(context.state.BSData)} */}
                  {context.state.BSData.data.map(unit => (

                    (unit.type === "model") ? (

                      <UnitCard
                        key={unit["id"]}
                        modelName={unit.name}
                        bfRole={unit.bf_role}
                        points={unit.pts}
                        PL={unit.PL}
                        cardPress={() => {
                          context.setUnit({ 
                            id: unit.id, 
                            style: "modelKiwi",
                            text: "",
                            modelName: unit.name,
                            player: 1,
                            x: 0,
                            y: 0,
                            m: unit.profile.M,
                            wound: unit.profile.W,
                            inRange: false,
                            weapons: [
                              {
                                  name: "Macrostubber",
                                  range: 12
                              },
                              {
                                  name: "Volkite Blaster",
                                  range: 24
                              }
                          ]
                          })
                        }}
                      >{}</UnitCard>

                    ) : (console.log(""))
                  ))}
                </Content>




                {/* <Content>
                  {console.log(context.state.BSData)}
                  {context.state.BSData.data.map(unit => (


                    (unit.type === "unit") ? (

                      <UnitCard
                        key={unit["id"]}
                        name={unit["name"]}
                        cardPress={() => {
                          context.setUnit({ name: unit.name, id: unit.id })
                        }}
                      >{}</UnitCard>

                    ) : (console.log(""))
                  ))}
                </Content> */}
              </Row>

              <Row size={20}>
                <Text>{context.state.playerOne.units}</Text>
              </Row>

            </Grid>
          </Container>
        )}
      </AppConsumer>
    )
  }
}

const styles = StyleSheet.create({

});

