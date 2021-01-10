
import React from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import SearchScreen from "./screens/SearchScreen"
import {createAppContainer} from "react-navigation"
import {createBottomTabNavigator} from "react-navigation-tabs"
import TransactionsScreen from './screens/BookTransactionsScreen';
import { RotationGestureHandler } from 'react-native-gesture-handler';


export default class App extends React.Component{
  render(){
  return(
        <AppContainer/>
      )
  }
}

const TabNavigator=createBottomTabNavigator({
Transaction:{screen:TransactionsScreen},
Search:{screen:SearchScreen}
},
{
  defaultNavigationOptions:({navigation})=>({
    tabBarIcon:()=>{
      const routeName=navigation.state.routeName;
      if(routeName === "Transaction"){
        console.log(routeName)
        return(
          <Image
            source={require("./assets/book.png")}
            style={{width:30,height:30}}
          />

        )
      }
      else if(routeName === "Search"){
        return(
          <Image
            source={require("./assets/searchingbook.png")}
            style={{width:30,height:30}}
          />

        )
      }
    }
  })
}
);

const AppContainer=createAppContainer(TabNavigator)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
