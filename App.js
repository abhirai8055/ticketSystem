import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/LoginScreen';
import AppNavigater from './src/AppNavigater';
import TicketDetailsScreen from './src/customDrawer/TicketManagementStack/screens/TicketDetails';
import SubmitReviewForm from './src/customDrawer/TicketManagementStack/screens/SubmitReviewForm';
import ActiveTickets from './src/customDrawer/TicketManagementStack/screens/engineerScreen/ActiveTicketsEngineer';
import NewAssignTicketEngineer from './src/customDrawer/TicketManagementStack/screens/engineerScreen/NewAssignTicketEngineer';
import EditTicketScreen from './src/customDrawer/TicketManagementStack/screens/EditTicketScreen';

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
          name="TicketDetails"
          component={TicketDetailsScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="SubmitReviewForm"
          component={SubmitReviewForm}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ActiveTickets"
          component={ActiveTickets}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewAssignTickets"
          component={NewAssignTicketEngineer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditTicket"
          component={EditTicketScreen}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});

// ye code Feature Code hai ager Feature me stack navigator ka use hoga to ye code use hoga

// import { StyleSheet, Text, View } from 'react-native';
// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';
// import LoginScreen from './src/LoginScreen';
// import AppNavigater from './src/AppNavigater';
// import TicketDetailsScreen from './src/customDrawer/TicketManagementStack/screens/ticketDetails';
// import SubmitReviewForm from './src/customDrawer/TicketManagementStack/screens/submitReviewForm';
// import ActiveTickets from './src/customDrawer/TicketManagementStack/screens/engineerScreen/ActiveTicketsEngineer';
// import NewAssignTicketEngineer from './src/customDrawer/TicketManagementStack/screens/engineerScreen/NewAssignTicketEngineer';

// const Stack = createStackNavigator();

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Login"
//           component={LoginScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="AppNavigater"
//           component={AppNavigater}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="ticketDetails"
//           component={TicketDetailsScreen}
//           options={{ headerShown: true }}
//         />
//         <Stack.Screen
//           name="submitReviewForm"
//           component={SubmitReviewForm}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="ActiveTickets"
//           component={ActiveTickets}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="NewAssignTickets"
//           component={NewAssignTicketEngineer}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="SubmitReviewForm"
//           component={SubmitReviewForm}
//           options={{ headerShown: true }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

// const styles = StyleSheet.create({});
