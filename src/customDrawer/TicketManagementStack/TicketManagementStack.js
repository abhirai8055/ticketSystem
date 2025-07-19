// ye code Feature Code hai ager Feature me stack navigator ka use hoga to ye code use hoga




// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import OpenTicketScreen from './screens/staffScreen/OpenTicketStaff';
// import InProgressTicketScreen from './screens/staffScreen/InProgressTicketStaff';
// import ActiveTickets from './screens/engineerScreen/ActiveTicketsEngineer';
// import NewAssignTicket from './screens/engineerScreen/NewAssignTicketEngineer';
// import ClosedTicketEnginner from './screens/engineerScreen/ClosedTicketEnginner';
// import ClosedTicketStaff from './screens/staffScreen/ClosedTicketStaff';
// import AllTicketsStaff from './screens/staffScreen/AllTicketsStaff';
// import AllTicketsEnginner from './screens/engineerScreen/AllTicketsEnginner';

// const Stack = createStackNavigator();

// const TicketManagementStack = ({ route }) => {
//   const { userUid, userType } = route.params || {};
//   console.log('TicketManagementStack - userType:', userType, 'userUid:', userUid);

//   // Initial route userType ke hisaab se set karo
//   const initialRouteName = userType === 'engineer' ? 'AllTicketsEngineer' : 'AllTicketsStaff';

//   return (
//     <Stack.Navigator initialRouteName={initialRouteName}>
//       <Stack.Screen
//         name="AllTicketsStaff"
//         options={{ headerShown: false }}
//         children={props => (
//           <AllTicketsStaff {...props} userUid={userUid} userType={userType} />
//         )}
//       />
//       <Stack.Screen
//         name="AllTicketsEngineer"
//         options={{ headerShown: false }}
//         children={props => (
//           <AllTicketsEnginner {...props} userUid={userUid} userType={userType} />
//         )}
//       />
//       <Stack.Screen
//         name="OpenTicket"
//         component={OpenTicketScreen}
//         options={{ headerShown: false }}
//         initialParams={{ userUid }}
//       />
//       <Stack.Screen
//         name="InProgressTicket"
//         component={InProgressTicketScreen}
//         options={{ headerShown: false }}
//         initialParams={{ userUid }}
//       />
//       <Stack.Screen
//         name="ClosedTicketEnginner"
//         component={ClosedTicketEnginner}
//         options={{ headerShown: false }}
//         initialParams={{ userUid }}
//       />
//       <Stack.Screen
//         name="ClosedTicketStaff"
//         component={ClosedTicketStaff}
//         options={{ headerShown: false }}
//         initialParams={{ userUid }}
//       />
//       <Stack.Screen
//         name="ActiveTickets"
//         component={ActiveTickets}
//         options={{ headerShown: false }}
//         initialParams={{ userUid }}
//       />
//       <Stack.Screen
//         name="NewAssignTickets"
//         component={NewAssignTicket}
//         options={{ headerShown: false }}
//         initialParams={{ userUid }}
//       />
//     </Stack.Navigator>
//   );
// };

// export default TicketManagementStack;










// Stack navigation Code

// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import OpenTicketScreen from './screens/staffScreen/OpenTicketStaff';
// import InProgressTicketScreen from './screens/staffScreen/InProgressTicketStaff';
// import ActiveTickets from './screens/engineerScreen/ActiveTicketsEngineer';
// import NewAssignTicket from './screens/engineerScreen/NewAssignTicketEngineer';
// import ClosedTicketEnginner from './screens/engineerScreen/ClosedTicketEnginner';
// import ClosedTicketStaff from './screens/staffScreen/ClosedTicketStaff';
// import AllTicketsStaff from './screens/staffScreen/AllTicketsStaff';
// import AllTicketsEnginner from './screens/engineerScreen/AllTicketsEnginner';

// const Stack = createStackNavigator();

// const TicketManagementStack = ({ route }) => {
//   const { userUid, userType } = route.params || {};
//   console.log('TicketManagementStack - userType:', userType, 'userUid:', userUid);

//   const initialRouteName = userType === 'engineer' ? 'AllTicketsEngineer' : 'AllTicketsStaff';

//   // Screen configurations with custom titles matching drawer labels
//   const screenConfigs = {
//     AllTicketsStaff: { title: 'All Tickets Staff' },
//     AllTicketsEngineer: { title: 'All Tickets Enginner' },
//     OpenTicket: { title: 'Open Ticket' },
//     InProgressTicket: { title: 'In-Progress Ticket' },
//     ClosedTicketEnginner: { title: 'Closed Ticket Enginner' },
//     ClosedTicketStaff: { title: 'Closed Ticket Staff' },
//     ActiveTickets: { title: 'Active Tickets' },
//     NewAssignTickets: { title: 'New Assign Tickets' },
//   };

//   return (
//     <Stack.Navigator
//       initialRouteName={initialRouteName}
//       screenOptions={{
//         headerStyle: { backgroundColor: '#fff' },
//         headerTintColor: '#007AFF',
//         headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
//         headerTitleAlign: 'center',
//       }}
//     >
//       <Stack.Screen
//         name="AllTicketsStaff"
//         options={{ headerTitle: screenConfigs.AllTicketsStaff.title }}
//         children={props => (
//           <AllTicketsStaff {...props} userUid={userUid} userType={userType} />
//         )}
//       />
//       <Stack.Screen
//         name="AllTicketsEngineer"
//         options={{ headerTitle: screenConfigs.AllTicketsEngineer.title }}
//         children={props => (
//           <AllTicketsEnginner {...props} userUid={userUid} userType={userType} />
//         )}
//       />
//       <Stack.Screen
//         name="OpenTicket"
//         component={OpenTicketScreen}
//         options={{ headerTitle: screenConfigs.OpenTicket.title }}
//         initialParams={{ userUid, userType }}
//       />
//       <Stack.Screen
//         name="InProgressTicket"
//         component={InProgressTicketScreen}
//         options={{ headerTitle: screenConfigs.InProgressTicket.title }}
//         initialParams={{ userUid, userType }}
//       />
//       <Stack.Screen
//         name="ClosedTicketEnginner"
//         component={ClosedTicketEnginner}
//         options={{ headerTitle: screenConfigs.ClosedTicketEnginner.title }}
//         initialParams={{ userUid, userType }}
//       />
//       <Stack.Screen
//         name="ClosedTicketStaff"
//         component={ClosedTicketStaff}
//         options={{ headerTitle: screenConfigs.ClosedTicketStaff.title }}
//         initialParams={{ userUid, userType }}
//       />
//       <Stack.Screen
//         name="ActiveTickets"
//         component={ActiveTickets}
//         options={{ headerTitle: screenConfigs.ActiveTickets.title }}
//         initialParams={{ userUid, userType }}
//       />
//       <Stack.Screen
//         name="NewAssignTickets"
//         component={NewAssignTicket}
//         options={{ headerTitle: screenConfigs.NewAssignTickets.title }}
//         initialParams={{ userUid, userType }}
//       />
//     </Stack.Navigator>
//   );
// };

// export default TicketManagementStack;
