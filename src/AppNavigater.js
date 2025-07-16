import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from './customDrawer/DashboardScreen';
import DashboardScreenStaff from './customDrawer/DashboardScrenStaff';
import TicketManagementStack from './customDrawer/TicketManagementStack/TicketManagementStack';
import { CustomDrawerContent } from './customDrawer/CustomDrawerContent';

const Drawer = createDrawerNavigator();

const AppNavigater = ({ route }) => {
  const { userUid, userType } = route.params || {};
  // console.warn(userType);

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: true }}
      drawerContent={props => (
        <CustomDrawerContent {...props} userType={userType} />
      )}
    >
      <Drawer.Screen
        name="Dashboard"
        component={
          userType === 'engineer' ? DashboardScreen : DashboardScreenStaff
        }
      />
      <Drawer.Screen
        name="Ticket Management"
        component={TicketManagementStack}
        initialParams={{ userUid, userType }}
      />
    </Drawer.Navigator>
  );
};

export default AppNavigater;
