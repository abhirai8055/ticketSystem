// import React from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import DashboardScreen from './customDrawer/DashboardScreen';
// import DashboardScreenStaff from './customDrawer/DashboardScrenStaff';
// import TicketManagementStack from './customDrawer/TicketManagementStack/TicketManagementStack';
// import { CustomDrawerContent } from './customDrawer/CustomDrawerContent';

// const Drawer = createDrawerNavigator();

// const AppNavigater = ({ route }) => {
//   const { userUid, userType } = route.params || {};
//   // console.warn(userType);

//   return (
//     <Drawer.Navigator
//       screenOptions={{ headerShown: true }}
//       drawerContent={props => (
//         <CustomDrawerContent {...props} userType={userType} />
//       )}
//     >
//       <Drawer.Screen
//         name="Dashboard"
//         component={
//           userType === 'engineer' ? DashboardScreen : DashboardScreenStaff
//         }
//       />
//       <Drawer.Screen
//         name="Ticket Management"
//         component={TicketManagementStack}
//         initialParams={{ userUid, userType }}
//       />
//     </Drawer.Navigator>
//   );
// };

// export default AppNavigater;

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from './customDrawer/DashboardScreen';
import DashboardScreenStaff from './customDrawer/DashboardScrenStaff';
import ActiveTickets from './customDrawer/TicketManagementStack/screens/engineerScreen/ActiveTicketsEngineer';
import NewAssignTicket from './customDrawer/TicketManagementStack/screens/engineerScreen/NewAssignTicketEngineer';
import ClosedTicketEnginner from './customDrawer/TicketManagementStack/screens/engineerScreen/ClosedTicketEnginner';
import AllTicketsEnginner from './customDrawer/TicketManagementStack/screens/engineerScreen/AllTicketsEnginner';
import OpenTicketScreen from './customDrawer/TicketManagementStack/screens/staffScreen/OpenTicketStaff';
import InProgressTicketScreen from './customDrawer/TicketManagementStack/screens/staffScreen/InProgressTicketStaff';
import ClosedTicketStaff from './customDrawer/TicketManagementStack/screens/staffScreen/ClosedTicketStaff';
import AllTicketsStaff from './customDrawer/TicketManagementStack/screens/staffScreen/AllTicketsStaff';
import { CustomDrawerContent } from './customDrawer/CustomDrawerContent';

const Drawer = createDrawerNavigator();

const AppNavigater = ({ route }) => {
  const { userUid, userType } = route.params || {};
  console.log('AppNavigater - userType:', userType, 'userUid:', userUid);

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: true }}
      drawerContent={props => (
        <CustomDrawerContent {...props} userType={userType} userUid={userUid} />
      )}
    >
      <Drawer.Screen
        name="Dashboard"
        component={
          userType === 'engineer' ? DashboardScreen : DashboardScreenStaff
        }
        initialParams={{ userUid, userType }}
      />
      {userType === 'engineer' ? (
        <>
          <Drawer.Screen
            name="NewAssignTickets"
            component={NewAssignTicket}
            initialParams={{ userUid, userType }}
            options={{ headerShown: true }}
          />
          <Drawer.Screen
            name="ActiveTickets"
            component={ActiveTickets}
            initialParams={{ userUid, userType }}
            options={{ headerShown: true }}
          />
          <Drawer.Screen
            name="ClosedTicket"
            component={ClosedTicketEnginner}
            initialParams={{ userUid, userType }}
            options={{ headerShown: true }}
          />
          <Drawer.Screen
            name="AllTickets"
            component={AllTicketsEnginner}
            initialParams={{ userUid, userType }}
            options={{ headerShown: true }}
          />
        </>
      ) : (
        <>
          <Drawer.Screen
            name="AllTickets"
            component={AllTicketsStaff}
            initialParams={{ userUid, userType }}
            options={{ headerShown: true }}
          />
          <Drawer.Screen
            name="OpenTicket"
            component={OpenTicketScreen}
            initialParams={{ userUid, userType }}
            options={{ headerShown: true }}
          />
          <Drawer.Screen
            name="InProgressTicket"
            component={InProgressTicketScreen}
            initialParams={{ userUid, userType }}
            options={{ headerShown: true }}
          />
          <Drawer.Screen
            name="ClosedTicket"
            component={ClosedTicketStaff}
            initialParams={{ userUid, userType }}
            options={{ headerShown: true }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
};

export default AppNavigater;

// ye code is used to navigate between different screens in the app, specifically for the ticket management system. It sets up a drawer navigator that allows users to access various screens based on their user type (engineer or staff). The code includes screens for viewing tickets, managing tickets, and submitting reviews, with appropriate header visibility settings for each screen.

// import React from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import DashboardScreen from './customDrawer/DashboardScreen';
// import DashboardScreenStaff from './customDrawer/DashboardScrenStaff';
// import TicketManagementStack from './customDrawer/TicketManagementStack/TicketManagementStack';
// import { CustomDrawerContent } from './customDrawer/CustomDrawerContent';

// const Drawer = createDrawerNavigator();

// const AppNavigater = ({ route }) => {
//   const { userUid, userType } = route.params || {};
//   console.log('AppNavigater - userType:', userType, 'userUid:', userUid);

//   return (
//     <Drawer.Navigator
//       screenOptions={{ headerShown: true }}
//       drawerContent={props => (
//         <CustomDrawerContent {...props} userType={userType} userUid={userUid} />
//       )}
//     >
//       <Drawer.Screen
//         name="Dashboard"
//         component={
//           userType === 'engineer' ? DashboardScreen : DashboardScreenStaff
//         }
//         initialParams={{ userUid, userType }}
//       />
//       <Drawer.Screen
//         name="Ticket Management"
//         component={TicketManagementStack}
//         initialParams={{ userUid, userType }}
//       />
//     </Drawer.Navigator>
//   );
// };

// export default AppNavigater;
