import React, { useState } from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { getAuth, signOut } from 'firebase/auth';

export function CustomDrawerContent(props) {
  const [ticketExpanded, setTicketExpanded] = useState(false);
  const drawerRoute = props.state.routes[props.state.index];
  const currentScreen =
    drawerRoute?.state?.routes?.[drawerRoute.state.index]?.name || '';

  const { userType } = props;
  // console.warn(userType);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        props.navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to logout');
        console.error('Logout error:', error);
      });
  };

  // Define menu options based on userType
  const engineerScreens = [
    { label: 'New Assign Tickets', screen: 'NewAssignTickets' },
    { label: 'Active Tickets', screen: 'ActiveTickets' },
    { label: 'Closed Ticket', screen: 'ClosedTicket' },
    { label: 'All Tickets', screen: 'HomeScreen' },
  ];

  const staffScreens = [
    { label: 'All Tickets', screen: 'HomeScreen' },
    { label: 'Open Ticket', screen: 'OpenTicket' },
    { label: 'In-Progress Ticket', screen: 'InProgressTicket' },
    { label: 'Closed Ticket', screen: 'ClosedTicket' },
  ];

  const screensToRender =
    userType === 'engineer' ? engineerScreens : staffScreens;

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
          marginTop: 30,
          justifyContent: 'center',
        }}
      >
        <Image
          source={require('../images/logo.webp')}
          style={{ width: 50, height: 50 }}
        />
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
          JATL
        </Text>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View>
          {/* Dashboard Item */}
          <DrawerItem
            label="Dashboard"
            onPress={() => props.navigation.navigate('Dashboard')}
            focused={props.state.index === 0}
            icon={() => (
              <Image
                source={require('../images/dashboard.png')}
                style={{ width: 20, height: 20 }}
              />
            )}
          />

          {/* Ticket Management Toggle */}
          <TouchableOpacity
            onPress={() => setTicketExpanded(!ticketExpanded)}
            style={styles.menuItem}
          >
            <Image
              source={require('../images/tickets.png')}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Ticket Management</Text>
            <Image
              source={
                ticketExpanded
                  ? require('../images/up.png')
                  : require('../images/down.png')
              }
              style={styles.expandIcon}
            />
          </TouchableOpacity>

          {/* Ticket Submenus - Based on Role */}
          {ticketExpanded && (
            <View style={styles.subMenu}>
              {screensToRender.map(item => {
                const isActive = currentScreen === item.screen;
                return (
                  <TouchableOpacity
                    key={item.screen}
                    onPress={() =>
                      props.navigation.navigate('Ticket Management', {
                        screen: item.screen,
                      })
                    }
                    style={[
                      styles.subMenuItemWrapper,
                      isActive && styles.activeItemWrapper,
                    ]}
                  >
                    <View
                      style={[
                        styles.activeIndicator,
                        isActive && styles.activeIndicatorVisible,
                      ]}
                    />
                    <Text
                      style={
                        isActive ? styles.activeSubItem : styles.subMenuItem
                      }
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </DrawerContentScrollView>

      {/* Logout at Bottom */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  expandIcon: {
    width: 20,
    height: 20,
  },
  subMenu: {
    marginLeft: 20,
    paddingVertical: 8,
  },
  subMenuItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 12,
    borderRadius: 6,
  },
  activeItemWrapper: {
    backgroundColor: '#e6f0ff',
  },
  subMenuItem: {
    fontSize: 14,
    color: '#333',
    paddingLeft: 10,
  },
  activeSubItem: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    paddingLeft: 10,
  },
  activeIndicator: {
    width: 4,
    height: '100%',
    backgroundColor: 'transparent',
    marginRight: 6,
    borderRadius: 2,
  },
  activeIndicatorVisible: {
    backgroundColor: '#007AFF',
  },
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

// //MAIN
// import React, { useState } from 'react';
// import {
//   DrawerContentScrollView,
//   DrawerItem,
// } from '@react-navigation/drawer';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Alert,
// } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';

// export function CustomDrawerContent(props) {
//   const [ticketExpanded, setTicketExpanded] = useState(false);
//   const drawerRoute = props.state.routes[props.state.index];
//   const currentScreen =
//     drawerRoute?.state?.routes?.[drawerRoute.state.index]?.name || '';

//   const { userType } = props;
//   // console.warn(userType);

//   const handleLogout = () => {
//     const auth = getAuth();
//     signOut(auth)
//       .then(() => {
//         props.navigation.reset({
//           index: 0,
//           routes: [{ name: 'Login' }],
//         });
//       })
//       .catch((error) => {
//         Alert.alert('Error', 'Failed to logout');
//         console.error('Logout error:', error);
//       });
//   };

//   // Define menu options based on userType
//   const engineerScreens = [
//     { label: 'New Assign Tickets', screen: 'NewAssignTickets' },
//     { label: 'Active Tickets', screen: 'ActiveTickets' },
//     { label: 'Closed Ticket', screen: 'ClosedTicket' },
//     { label: 'All Tickets', screen: 'HomeScreen' },
//   ];

//   const staffScreens = [
//     { label: 'All Tickets', screen: 'HomeScreen' },
//     { label: 'Open Ticket', screen: 'OpenTicket' },
//     { label: 'In-Progress Ticket', screen: 'InProgressTicket' },
//     { label: 'Closed Ticket', screen: 'ClosedTicket' },
//   ];

//   const screensToRender = userType === 'engineer' ? engineerScreens : staffScreens;

//   return (
//     <View style={{ flex: 1 }}>
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           backgroundColor: '#fff',
//           borderBottomWidth: 1,
//           borderBottomColor: '#eee',
//           marginTop: 30,
//           justifyContent: 'center',
//         }}
//       >
//         <Image
//           source={require('../images/logo.png')}
//           style={{ width: 50, height: 50 }}
//         />
//         <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
//           JATL
//         </Text>
//       </View>

//       <DrawerContentScrollView
//         {...props}
//         contentContainerStyle={{ flexGrow: 1 }}
//       >
//         <View>
//           {/* Dashboard Item */}
//           <DrawerItem
//             label="Dashboard"
//             onPress={() => props.navigation.navigate('Dashboard')}
//             focused={props.state.index === 0}
//             icon={() => (
//               <Image
//                 source={require('../images/dashboard.jpg')}
//                 style={{ width: 20, height: 20 }}
//               />
//             )}
//           />

//           {/* Ticket Management Toggle */}
//           <TouchableOpacity
//             onPress={() => setTicketExpanded(!ticketExpanded)}
//             style={styles.menuItem}
//           >
//             <Image
//               source={require('../images/tickets.jpg')}
//               style={styles.menuIcon}
//             />
//             <Text style={styles.menuText}>Ticket Management</Text>
//             <Image
//               source={
//                 ticketExpanded
//                   ? require('../images/up.jpg')
//                   : require('../images/down.jpg')
//               }
//               style={styles.expandIcon}
//             />
//           </TouchableOpacity>

//           {/* Ticket Submenus - Based on Role */}
//           {ticketExpanded && (
//             <View style={styles.subMenu}>
//               {screensToRender.map((item) => {
//                 const isActive = currentScreen === item.screen;
//                 return (
//                   <TouchableOpacity
//                     key={item.screen}
//                     onPress={() =>
//                       props.navigation.navigate('Ticket Management', {
//                         screen: item.screen,
//                       })
//                     }
//                     style={[
//                       styles.subMenuItemWrapper,
//                       isActive && styles.activeItemWrapper,
//                     ]}
//                   >
//                     <View
//                       style={[
//                         styles.activeIndicator,
//                         isActive && styles.activeIndicatorVisible,
//                       ]}
//                     />
//                     <Text
//                       style={
//                         isActive ? styles.activeSubItem : styles.subMenuItem
//                       }
//                     >
//                       {item.label}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           )}
//         </View>
//       </DrawerContentScrollView>

//       {/* Logout at Bottom */}
//       <View style={styles.logoutContainer}>
//         <TouchableOpacity
//           style={styles.logoutButton}
//           onPress={handleLogout}
//         >
//           <Text style={styles.logoutText}>Log Out</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//   },
//   menuIcon: {
//     width: 24,
//     height: 24,
//     marginRight: 10,
//   },
//   menuText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     flex: 1,
//   },
//   expandIcon: {
//     width: 20,
//     height: 20,
//   },
//   subMenu: {
//     marginLeft: 20,
//     paddingVertical: 8,
//   },
//   subMenuItemWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingRight: 12,
//     borderRadius: 6,
//   },
//   activeItemWrapper: {
//     backgroundColor: '#e6f0ff',
//   },
//   subMenuItem: {
//     fontSize: 14,
//     color: '#333',
//     paddingLeft: 10,
//   },
//   activeSubItem: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#007AFF',
//     paddingLeft: 10,
//   },
//   activeIndicator: {
//     width: 4,
//     height: '100%',
//     backgroundColor: 'transparent',
//     marginRight: 6,
//     borderRadius: 2,
//   },
//   activeIndicatorVisible: {
//     backgroundColor: '#007AFF',
//   },
//   logoutContainer: {
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     backgroundColor: '#fff',
//   },
//   logoutButton: {
//     backgroundColor: '#FF3B30',
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   logoutText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });
