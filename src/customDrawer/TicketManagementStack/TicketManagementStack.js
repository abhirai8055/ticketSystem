import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OpenTicketScreen from '../TicketManagementStack/screens/OpenTicketScreen';
import InProgressTicketScreen from '../TicketManagementStack/screens/InProgressTicketScreen';
import ClosedTicketScreen from '../TicketManagementStack/screens/ClosedTicketScreen';
import TicketsScreen from '../TicketManagementStack/screens/HomeScreen';
import ActiveTickets from './screens/ActiveTickets';
import NewAssignTicket from './screens/NewAssignTicket';


const Stack = createStackNavigator();

const TicketManagementStack = ({ route }) => {
  const { userUid } = route.params || {};
  const { userType } = route.params || {};
  // console.warn(userType);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        options={{ headerShown: false }}
        // children={props => <TicketsScreen {...props} userUid={userUid} />}
         children={props => (
          <TicketsScreen {...props} userUid={userUid} userType={userType} />)}
        
      />
      <Stack.Screen
        name="OpenTicket"
        component={OpenTicketScreen}
        options={{ headerShown: false }}
        initialParams={{ userUid }}
        userUid={userUid}
      />
      <Stack.Screen
        name="InProgressTicket"
        component={InProgressTicketScreen}
        options={{ headerShown: false }}
        initialParams={{ userUid }}
        userUid={userUid}
      />
      <Stack.Screen
        name="ClosedTicket"
        component={ClosedTicketScreen}
        options={{ headerShown: false }}
        initialParams={{ userUid }}
        userUid={userUid}
      />

      <Stack.Screen
        name="ActiveTickets"
        component={ActiveTickets}
        options={{ headerShown: false }}
        initialParams={{ userUid }}
        userUid={userUid}
      />

      <Stack.Screen
        name="NewAssignTickets"
        component={NewAssignTicket}
        options={{ headerShown: false }}
        initialParams={{ userUid }}
        userUid={userUid}
      />
    </Stack.Navigator>
  );
};

export default TicketManagementStack;
























//MAIN
// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import OpenTicketScreen from '../TicketManagementStack/screens/OpenTicketScreen';
// import InProgressTicketScreen from '../TicketManagementStack/screens/InProgressTicketScreen';
// import ClosedTicketScreen from '../TicketManagementStack/screens/ClosedTicketScreen';
// import TicketsScreen from '../TicketManagementStack/screens/HomeScreen';
// import ActiveTickets from './screens/ActiveTickets';
// import NewAssignTicket from './screens/NewAssignTicket';


// const Stack = createStackNavigator();

// const TicketManagementStack = ({ route }) => {
//   const { userUid } = route.params || {};
//   const { userType } = route.params || {};
//   // console.warn(userType);

//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="HomeScreen"
//         options={{ headerShown: false }}
//         // children={props => <TicketsScreen {...props} userUid={userUid} />}
//          children={props => (
//           <TicketsScreen {...props} userUid={userUid} userType={userType} />)}
        
//       />
//       <Stack.Screen
//         name="OpenTicket"
//         component={OpenTicketScreen}
//         options={{ headerShown: false }}
//         initialParams={{ userUid }}
//         userUid={userUid}
//       />
//       <Stack.Screen
//         name="InProgressTicket"
//         component={InProgressTicketScreen}
//         options={{ headerShown: false }}
//         initialParams={{ userUid }}
//         userUid={userUid}
//       />
//       <Stack.Screen
//         name="ClosedTicket"
//         component={ClosedTicketScreen}
//         options={{ headerShown: false }}
//         initialParams={{ userUid }}
//         userUid={userUid}
//       />

//       <Stack.Screen
//         name="ActiveTickets"
//         component={ActiveTickets}
//         options={{ headerShown: false }}
//         initialParams={{ userUid }}
//         userUid={userUid}
//       />

//       <Stack.Screen
//         name="NewAssignTickets"
//         component={NewAssignTicket}
//         options={{ headerShown: false }}
//         initialParams={{ userUid }}
//         userUid={userUid}
//       />
//     </Stack.Navigator>
//   );
// };

// export default TicketManagementStack;
