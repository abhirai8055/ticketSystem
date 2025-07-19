import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
// import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../../../firebase';

const PAGE_SIZE = 10;

const OpenTicketScreen = ({ userUid: propUid, route }) => {
  const navigation = useNavigation();

  // ✅ Corrected: Use UID from either props or route
  const userUid = propUid || route?.params?.userUid;

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketsRef = collection(db, 'tickets');

        // Query for engineer tickets with OPEN status
        // const engineerQuery = query(
        //   ticketsRef,
        //   where('engineerId', '==', userUid),
        //   where('status', '==', 'OPEN'),
        // );

        // Query for support staff tickets with OPEN status
        const staffQuery = query(
          ticketsRef,
          where('supportStaffId', '==', userUid),
          where('status', '==', 'OPEN'),
        );

        const [staffSnap] = await Promise.all([
          // getDocs(engineerQuery),
          getDocs(staffQuery),
        ]);

        // const engineerTickets = engineerSnap.docs.map(doc => ({
        //   id: doc.id,
        //   ...doc.data(),
        // }));

        const staffTickets = staffSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const combinedTickets = [...staffTickets];

        setTickets(combinedTickets);
      } catch (error) {
        console.error('Error fetching open tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userUid) {
      fetchTickets();
    }
  }, [userUid]);

  if (!userUid) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Error: Missing user ID. Please log in again.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (tickets.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>No tickets assigned to you.</Text>
      </View>
    );
  }

  const totalPages = Math.ceil(tickets.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginatedTickets = tickets.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <View style={styles.pageWrapper}>
      <ScrollView
        horizontal
        style={styles.container}
        showsHorizontalScrollIndicator
      >
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            {[
              'Ticket ID',
              'Title',
              'Category',
              'Agent',
              'Status',
              'Action',
            ].map(header => (
              <View key={header} style={styles.columnHeader}>
                <Text style={styles.headerText}>{header}</Text>
              </View>
            ))}
          </View>

          {/* Table Rows */}
          {paginatedTickets.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.evenRow : styles.oddRow,
              ]}
            >
              <View style={styles.columnCell}>
                <Text style={styles.cellText}>{item.ticketId}</Text>
              </View>
              <View style={styles.columnCell}>
                <Text style={styles.cellText}>{item.title || 'N/A'}</Text>
              </View>
              <View style={styles.columnCell}>
                <Text style={styles.cellText}>{item.category || 'N/A'}</Text>
              </View>
              <View style={styles.columnCell}>
                <Text style={styles.cellText}>{item.agent || 'N/A'}</Text>
              </View>
              <View style={styles.columnCell}>
                <Text
                  style={[
                    styles.statusBadge,
                    item.status === 'CLOSED' && styles.statusClosed,
                    item.status === 'OPEN' && styles.statusOpen,
                    item.status === 'IN_PROGRESS' && styles.statusInProgress,
                  ]}
                >
                  {item.status
                    ? item.status
                        .split('_')
                        .map(
                          word => word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(' ')
                    : 'Pending'}
                </Text>
              </View>

              <TouchableOpacity
                // onPress={() =>
                //   navigation.navigate('TicketDetailsScreen', {
                //     ticketId: item.id,
                //   })
                // }

                onPress={() => {
                  console.log(
                    'Navigating to TicketDetailsScreen with ID:',
                    item.id,
                  );
                  navigation.navigate('ticketDetails', {
                    ticketId: item.id,
                  });
                }}
              >
                <Image
                  source={require('../../../../images/view.png')}
                  style={styles.action}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Pagination Controls */}
      <View style={styles.pagination}>
        <Button
          title="Previous"
          onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        <Text style={styles.pageIndicator}>
          {currentPage} / {totalPages}
        </Text>
        <Button
          title="Next"
          onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        />
      </View>
    </View>
  );
};

export default OpenTicketScreen;

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: 10,
  },
  container: {
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  tableContainer: {
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
  },
  columnHeader: {
    width: 150,
    padding: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#005BB5',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  columnCell: {
    width: 150,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  cellText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    color: '#fff',
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  statusClosed: {
    backgroundColor: '#e74c3c',
  },
  statusOpen: {
    backgroundColor: '#3498db',
  },
  statusInProgress: {
    backgroundColor: '#27ae60',
  },
  action: {
    height: 30,
    width: 30,
    margin: 10,
    marginLeft: 55
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 2,
  },
  pageIndicator: {
    marginHorizontal: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
















// MAIN
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Button,
// } from 'react-native';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// // import { db } from '../firebase';
// import { useNavigation } from '@react-navigation/native';
// import { db } from '../../../firebase';

// const PAGE_SIZE = 10;

// const OpenTicketScreen = ({ userUid: propUid, route }) => {
//   const navigation = useNavigation();

//   // ✅ Corrected: Use UID from either props or route
//   const userUid = propUid || route?.params?.userUid;

//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const ticketsRef = collection(db, 'tickets');

//         // Query for engineer tickets with OPEN status
//         // const engineerQuery = query(
//         //   ticketsRef,
//         //   where('engineerId', '==', userUid),
//         //   where('status', '==', 'OPEN'),
//         // );

//         // Query for support staff tickets with OPEN status
//         const staffQuery = query(
//           ticketsRef,
//           where('supportStaffId', '==', userUid),
//           where('status', '==', 'OPEN'),
//         );

//         const [staffSnap] = await Promise.all([
//           // getDocs(engineerQuery),
//           getDocs(staffQuery),
//         ]);

//         // const engineerTickets = engineerSnap.docs.map(doc => ({
//         //   id: doc.id,
//         //   ...doc.data(),
//         // }));

//         const staffTickets = staffSnap.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         const combinedTickets = [...staffTickets];

//         setTickets(combinedTickets);
//       } catch (error) {
//         console.error('Error fetching open tickets:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userUid) {
//       fetchTickets();
//     }
//   }, [userUid]);

//   if (!userUid) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           Error: Missing user ID. Please log in again.
//         </Text>
//       </View>
//     );
//   }

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   if (tickets.length === 0) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.infoText}>No tickets assigned to you.</Text>
//       </View>
//     );
//   }

//   const totalPages = Math.ceil(tickets.length / PAGE_SIZE);
//   const startIdx = (currentPage - 1) * PAGE_SIZE;
//   const paginatedTickets = tickets.slice(startIdx, startIdx + PAGE_SIZE);

//   return (
//     <View style={styles.pageWrapper}>
//       <ScrollView
//         horizontal
//         style={styles.container}
//         showsHorizontalScrollIndicator
//       >
//         <View style={styles.tableContainer}>
//           {/* Table Header */}
//           <View style={styles.tableHeader}>
//             {[
//               'Ticket ID',
//               'Title',
//               'Category',
//               'Agent',
//               'Status',
//               'Action',
//             ].map(header => (
//               <View key={header} style={styles.columnHeader}>
//                 <Text style={styles.headerText}>{header}</Text>
//               </View>
//             ))}
//           </View>

//           {/* Table Rows */}
//           {paginatedTickets.map((item, index) => (
//             <View
//               key={item.id}
//               style={[
//                 styles.tableRow,
//                 index % 2 === 0 ? styles.evenRow : styles.oddRow,
//               ]}
//             >
//               <View style={styles.columnCell}>
//                 <Text style={styles.cellText}>{item.ticketId}</Text>
//               </View>
//               <View style={styles.columnCell}>
//                 <Text style={styles.cellText}>{item.title || 'N/A'}</Text>
//               </View>
//               <View style={styles.columnCell}>
//                 <Text style={styles.cellText}>{item.category || 'N/A'}</Text>
//               </View>
//               <View style={styles.columnCell}>
//                 <Text style={styles.cellText}>{item.agent || 'N/A'}</Text>
//               </View>
//               <View style={styles.columnCell}>
//                 <Text
//                   style={[
//                     styles.statusBadge,
//                     item.status === 'CLOSED' && styles.statusClosed,
//                     item.status === 'OPEN' && styles.statusOpen,
//                     item.status === 'IN_PROGRESS' && styles.statusInProgress,
//                   ]}
//                 >
//                   {item.status
//                     ? item.status
//                         .split('_')
//                         .map(
//                           word => word.charAt(0).toUpperCase() + word.slice(1),
//                         )
//                         .join(' ')
//                     : 'Pending'}
//                 </Text>
//               </View>

//               <TouchableOpacity
//                 // onPress={() =>
//                 //   navigation.navigate('TicketDetailsScreen', {
//                 //     ticketId: item.id,
//                 //   })
//                 // }

//                 onPress={() => {
//                   console.log(
//                     'Navigating to TicketDetailsScreen with ID:',
//                     item.id,
//                   );
//                   navigation.navigate('ticketDetails', {
//                     ticketId: item.id,
//                   });
//                 }}
//               >
//                 <Image
//                   source={require('../../../images/view.png')}
//                   style={styles.action}
//                 />
//               </TouchableOpacity>
//             </View>
//           ))}
//         </View>
//       </ScrollView>

//       {/* Pagination Controls */}
//       <View style={styles.pagination}>
//         <Button
//           title="Previous"
//           onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//         />
//         <Text style={styles.pageIndicator}>
//           {currentPage} / {totalPages}
//         </Text>
//         <Button
//           title="Next"
//           onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages}
//         />
//       </View>
//     </View>
//   );
// };

// export default OpenTicketScreen;

// const styles = StyleSheet.create({
//   pageWrapper: {
//     flex: 1,
//     backgroundColor: '#f2f2f2',
//     paddingTop: 10,
//   },
//   container: {
//     backgroundColor: '#fff',
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   errorText: {
//     fontSize: 18,
//     color: 'red',
//     textAlign: 'center',
//   },
//   infoText: {
//     fontSize: 16,
//     color: '#555',
//     textAlign: 'center',
//   },
//   tableContainer: {
//     margin: 10,
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: '#fff',
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     backgroundColor: '#007AFF',
//   },
//   columnHeader: {
//     width: 150,
//     padding: 12,
//     justifyContent: 'center',
//     borderRightWidth: 1,
//     borderRightColor: '#005BB5',
//   },
//   headerText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   evenRow: {
//     backgroundColor: '#f9f9f9',
//   },
//   oddRow: {
//     backgroundColor: '#ffffff',
//   },
//   columnCell: {
//     width: 150,
//     padding: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRightWidth: 1,
//     borderRightColor: '#eee',
//   },
//   cellText: {
//     fontSize: 12,
//     color: '#333',
//     textAlign: 'center',
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     color: '#fff',
//     fontWeight: 'bold',
//     overflow: 'hidden',
//   },
//   statusClosed: {
//     backgroundColor: '#e74c3c',
//   },
//   statusOpen: {
//     backgroundColor: '#3498db',
//   },
//   statusInProgress: {
//     backgroundColor: '#27ae60',
//   },
//   action: {
//     height: 30,
//     width: 30,
//     margin: 10,
//     marginLeft: 55
//   },
//   pagination: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 10,
//     backgroundColor: '#fff',
//     marginHorizontal: 10,
//     borderRadius: 8,
//     elevation: 2,
//   },
//   pageIndicator: {
//     marginHorizontal: 20,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });