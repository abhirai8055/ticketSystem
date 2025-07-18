import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/LoginScreen';
import AppNavigater from './src/AppNavigater';
import TicketDetailsScreen from './src/customDrawer/TicketManagementStack/screens/ticketDetails';
import SubmitReviewForm from './src/customDrawer/TicketManagementStack/screens/submitReviewForm';
import ActiveTickets from './src/customDrawer/TicketManagementStack/screens/ActiveTickets';
import NewAssignTickets from './src/customDrawer/TicketManagementStack/screens/NewAssignTicket';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AppNavigater"
          component={AppNavigater}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ticketDetails"
          component={TicketDetailsScreen}
          options={{ headerShown: true }}
        />

        <Stack.Screen
          name="submitReviewForm"
          component={SubmitReviewForm}
          options={{ headerShown: false }}
        />

         <Stack.Screen
          name="ActiveTicket"
          component={ActiveTickets}
          options={{ headerShown: false }}
        />

         <Stack.Screen
          name="NewAssignTicket"
          component={NewAssignTickets}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SbmitReviewForm"
          component={SubmitReviewForm}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
