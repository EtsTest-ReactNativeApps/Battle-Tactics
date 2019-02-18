import React, { Component } from 'react'
import { Container, StyleSheet, Image } from 'react-native'
import { View, Text, DeckSwiper, Card, CardItem, Thumbnail, Left, Body, Icon, Button } from 'native-base';


// components
import Maps from '../utils/data/maps.json';

// context 
import { AppConsumer } from '../storage/AppContext';


getImage = (image) => {
  switch (image) {
    case "map1":
    return require("../graphics/maps/DustPlains.png")
    break;

    case "map2":
    return require("../graphics/maps/RockFormations.png")
    break;

    case "map3":
    return require("../graphics/maps/SandDunes.png")
    break;

    default:
      return console.log("no map")

  } 
}

const MapCardsSelector = () => {
  
  
  return (
    <AppConsumer>
      {(context) => (
       
        <View>

          <DeckSwiper
            dataSource={Maps}
            renderItem={item =>
              <Card style={{ elevation: 3 }}>
                <CardItem>
                  <Left>
                    <Thumbnail source={this.getImage(item.image)} />
                    <Body>
                      <Text>{item.name}</Text>
                      <Text note>{item.subNote}</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem cardBody>
                  <Image style={{ height: 300, flex: 1 }} source={this.getImage(item.image)} />
                </CardItem>
                <CardItem>
                  <Icon name="heart" style={{ color: '#ED4A6A' }} 
                  onPress={() => {
                    context.setMap(item.name);
                    // alert("<3 clicked!")
                  }}
                  />
                  <Text>{item.text}</Text>
                </CardItem>
              </Card>
            }
            />

            </View>
      
      )}
    </AppConsumer>

  )

}



const styles = StyleSheet.create({})

export default MapCardsSelector;
