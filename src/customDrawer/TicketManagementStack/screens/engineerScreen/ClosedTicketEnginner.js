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
// import { db } from '../../../../firebase';

// const PAGE_SIZE = 10;

// export default function ClosedTicketEnginner({ userUid: propUid, route }) {
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

//         // ✅ Engineer tickets with status CLOSED
//         const engineerQuery = query(
//           ticketsRef,
//           where('engineerId', '==', userUid),
//           where('status', '==', 'CLOSED'),
//         );

//         // // ✅ Support Staff tickets with status CLOSED
//         // const staffQuery = query(
//         //   ticketsRef,
//         //   where('supportStaffId', '==', userUid),
//         //   where('status', '==', 'CLOSED'),
//         // );

//         const [engineerSnap, staffSnap] = await Promise.all([
//           getDocs(engineerQuery),
//           // getDocs(staffQuery),
//         ]);

//         const engineerTickets = engineerSnap.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         // const staffTickets = staffSnap.docs.map(doc => ({
//         //   id: doc.id,
//         //   ...doc.data(),
//         // }));

//         // const combinedTickets = [...engineerTickets, ...staffTickets];
//          const combinedTickets = [...engineerTickets,];

//         // Fetch all categories in one go
//         const categoriesSnap = await getDocs(collection(db, 'categories'));
//         const categoryMap = {};
//         categoriesSnap.forEach(doc => {
//           categoryMap[doc.id] = doc.data().name || 'N/A';
//         });

//         // Attach category name to each ticket (based on categoryId or category field)
//         const ticketsWithCategoryName = combinedTickets.map(ticket => {
//           const categoryId = ticket.category; // assumes 'category' is the categoryId
//           return {
//             ...ticket,
//             categoryName: categoryMap[categoryId] || 'N/A',
//           };
//         });

//         // console.log('Tickets with categories:', ticketsWithCategoryName);
//         setTickets(ticketsWithCategoryName);
//         setTickets(combinedTickets);
//       } catch (error) {
//         console.error('Error fetching closed tickets:', error);
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

//         <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 }}>
//           Closed Tickets Enginner
//         </Text>
//           f{/* Table Header */}
//           <View style={styles.tableHeader}>
//             {[
//               'Ticket ID',
//               'Title',
//               'Category',
//               'Priority',
//               'Status',
//               'Agent',
//               'Customer Review',
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
//                 <Text style={styles.cellText}>
//                   {item.categoryName || 'N/A'}
//                 </Text>
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
//                   source={require('../../../../images/view.png')}
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
// }

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
//     marginLeft: 55,
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
// // });

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
// } from 'react-native';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { useNavigation } from '@react-navigation/native';
// import { db } from '../../../../firebase';
// import { TextInput } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// const PAGE_SIZE = 10;

// export default function ClosedTicketEnginner({ userUid: propUid, route }) {
//   const navigation = useNavigation();
//   const userUid = propUid || route?.params?.userUid;

//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchText, setSearchText] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [selectedPriority, setSelectedPriority] = useState('All');
//   const [selectedAgent, setSelectedAgent] = useState('All');

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const ticketsRef = collection(db, 'tickets');
//         const engineerQuery = query(
//           ticketsRef,
//           where('engineerId', '==', userUid),
//           where('status', '==', 'CLOSED'),
//         );

//         const engineerSnap = await getDocs(engineerQuery);
//         const engineerTickets = engineerSnap.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         const categoriesSnap = await getDocs(collection(db, 'categories'));
//         const categoryMap = {};
//         categoriesSnap.forEach(doc => {
//           categoryMap[doc.id] = doc.data().name || 'N/A';
//         });

//         const ticketsWithCategoryName = engineerTickets.map(ticket => ({
//           ...ticket,
//           categoryName: categoryMap[ticket.category] || 'N/A',
//         }));

//         setTickets(ticketsWithCategoryName);
//       } catch (error) {
//         console.error('Error fetching closed tickets:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userUid) {
//       fetchTickets();
//     }
//   }, [userUid]);

//   const filteredTickets = tickets.filter(ticket => {
//     const matchesSearch =
//       ticket.ticketId?.toLowerCase().includes(searchText.toLowerCase()) ||
//       ticket.title?.toLowerCase().includes(searchText.toLowerCase());

//     const matchesCategory =
//       selectedCategory === 'All' || ticket.categoryName === selectedCategory;

//     const matchesPriority =
//       selectedPriority === 'All' ||
//       (ticket.priority &&
//         ticket.priority.toLowerCase() === selectedPriority.toLowerCase());

//     const matchesAgent =
//       selectedAgent === 'All' || ticket.agent === selectedAgent;

//     return matchesSearch && matchesCategory && matchesPriority && matchesAgent;
//   });

//   const totalPages = Math.ceil(filteredTickets.length / PAGE_SIZE);
//   const startIdx = (currentPage - 1) * PAGE_SIZE;
//   const paginatedTickets = filteredTickets.slice(
//     startIdx,
//     startIdx + PAGE_SIZE,
//   );

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
//         <ActivityIndicator size="large" color="#2563eb" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.pageWrapper}>
//       <View style={styles.filtersWrapper}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by ID or Name"
//           value={searchText}
//           onChangeText={setSearchText}
//           placeholderTextColor="#64748b"
//         />

//         <View style={styles.filterRow}>
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={selectedCategory}
//               onValueChange={setSelectedCategory}
//               style={styles.picker}
//               dropdownIconColor="#64748b"
//             >
//               <Picker.Item label="All Categories" value="All" />
//               <Picker.Item
//                 label="Ticket Category 1"
//                 value="Ticket Category 1"
//               />
//               <Picker.Item
//                 label="Ticket Category 2"
//                 value="Ticket Category 2"
//               />
//               <Picker.Item
//                 label="Ticket Category 4"
//                 value="Ticket Category 4"
//               />
//             </Picker>
//           </View>

//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={selectedPriority}
//               onValueChange={setSelectedPriority}
//               style={styles.picker}
//               dropdownIconColor="#64748b"
//             >
//               <Picker.Item label="All Priorities" value="All" />
//               <Picker.Item label="Low" value="LOW" />
//               <Picker.Item label="Medium" value="MEDIUM" />
//               <Picker.Item label="High" value="HIGH" />
//               <Picker.Item label="Urgent" value="URGENT" />
//             </Picker>
//           </View>

//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={selectedAgent}
//               onValueChange={setSelectedAgent}
//               style={styles.picker}
//               dropdownIconColor="#64748b"
//             >
//               <Picker.Item label="All Agents" value="All" />
//               <Picker.Item label="Jishan" value="Jishan" />
//               <Picker.Item label="Joy" value="Joy" />
//               <Picker.Item label="Sanny" value="Sanny" />
//               <Picker.Item label="ABhatt" value="ABhatt" />
//             </Picker>
//           </View>
//         </View>
//       </View>

//       <ScrollView
//         horizontal
//         style={styles.container}
//         showsHorizontalScrollIndicator={false}
//       >
//         <View style={styles.tableContainer}>
//           <View style={styles.tableHeader}>
//             {[
//               'Ticket ID',
//               'Title',
//               'Category',
//               'Priority',
//               'Status',
//               'Agent',
//               'Customer Review',
//               'Action',
//             ].map(header => (
//               <View key={header} style={styles.columnHeader}>
//                 <Text style={styles.headerText}>{header}</Text>
//               </View>
//             ))}
//           </View>

//           {tickets.length === 0 ? (
//             <View style={styles.tableRow}>
//               <View style={[styles.columnCell, styles.noResultsCell]}>
//                 <Text style={styles.infoText}>
//                   No closed tickets assigned to you.
//                 </Text>
//               </View>
//             </View>
//           ) : paginatedTickets.length === 0 ? (
//             <View style={styles.tableRow}>
//               <View style={[styles.columnCell, styles.noResultsCell]}>
//                 <Text style={styles.infoText}>
//                   No results found for the applied filters.
//                 </Text>
//               </View>
//             </View>
//           ) : (
//             paginatedTickets.map((item, index) => (
//               <View
//                 key={item.id}
//                 style={[
//                   styles.tableRow,
//                   index % 2 === 0 ? styles.evenRow : styles.oddRow,
//                 ]}
//               >
//                 <View style={styles.columnCell}>
//                   <Text style={styles.cellText}>{item.ticketId || 'N/A'}</Text>
//                 </View>
//                 <View style={styles.columnCell}>
//                   <Text style={styles.cellText}>{item.title || 'N/A'}</Text>
//                 </View>
//                 <View style={styles.columnCell}>
//                   <Text style={styles.cellText}>
//                     {item.categoryName || 'N/A'}
//                   </Text>
//                 </View>
//                 <View style={styles.columnCell}>
//                   <Text
//                     style={[
//                       styles.priorityBadge,
//                       item.priority === 'LOW' && styles.priorityLow,
//                       item.priority === 'MEDIUM' && styles.priorityMedium,
//                       item.priority === 'HIGH' && styles.priorityHigh,
//                       item.priority === 'URGENT' && styles.priorityUrgent,
//                     ]}
//                   >
//                     {item.priority || 'N/A'}
//                   </Text>
//                 </View>
//                 <View style={styles.columnCell}>
//                   <Text style={[styles.statusBadge, styles.statusClosed]}>
//                     {item.status
//                       ? item.status
//                           .split('_')
//                           .map(
//                             word =>
//                               word.charAt(0).toUpperCase() +
//                               word.slice(1).toLowerCase(),
//                           )
//                           .join(' ')
//                       : 'Closed'}
//                   </Text>
//                 </View>
//                 <View style={styles.columnCell}>
//                   <Text style={styles.cellText}>{item.agent || 'N/A'}</Text>
//                 </View>
//                 <View style={styles.columnCell}>
//                   <Text style={styles.cellText}>
//                     {item.customerReview || 'No Review'}
//                   </Text>
//                 </View>
//                 <View style={styles.columnCell}>
//                   <TouchableOpacity
//                     onPress={() =>
//                       navigation.navigate('TicketDetails', {
//                         ticketId: item.id,
//                       })
//                     }
//                   >
//                     <Image
//                       source={require('../../../../images/view.png')}
//                       style={styles.actionIcon}
//                     />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             ))
//           )}
//         </View>
//       </ScrollView>

//       <View style={styles.pagination}>
//         <TouchableOpacity
//           style={[
//             styles.paginationButton,
//             currentPage === 1 && styles.paginationButtonDisabled,
//           ]}
//           onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//         >
//           <Text style={styles.paginationButtonText}>Previous</Text>
//         </TouchableOpacity>
//         <Text style={styles.pageIndicator}>
//           Page {currentPage} of {totalPages}
//         </Text>
//         <TouchableOpacity
//           style={[
//             styles.paginationButton,
//             currentPage === totalPages && styles.paginationButtonDisabled,
//           ]}
//           onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages}
//         >
//           <Text style={styles.paginationButtonText}>Next</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   pageWrapper: {
//     flex: 1,
//     backgroundColor: '#f8fafc',
//     padding: 16,
//   },
//   container: {
//     flexGrow: 1,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   errorText: {
//     fontSize: 18,
//     color: '#dc2626',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   infoText: {
//     fontSize: 16,
//     color: '#475569',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   filtersWrapper: {
//     backgroundColor: '#ffffff',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 16,
//     backgroundColor: '#f8fafc',
//     marginBottom: 12,
//   },
//   filterRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//   },
//   pickerContainer: {
//     flex: 1,
//     minWidth: '48%',
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//     borderRadius: 8,
//     backgroundColor: '#f8fafc',
//     overflow: 'hidden',
//   },
//   picker: {
//     fontSize: 16,
//     color: '#1e293b',
//   },
//   tableContainer: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     marginBottom: 16,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     backgroundColor: '#2563eb',
//   },
//   columnHeader: {
//     flex: 1,
//     minWidth: 120,
//     padding: 12,
//     justifyContent: 'center',
//     borderRightWidth: 1,
//     borderRightColor: '#1e40af',
//   },
//   headerText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#ffffff',
//     textAlign: 'center',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e2e8f0',
//   },
//   evenRow: {
//     backgroundColor: '#f8fafc',
//   },
//   oddRow: {
//     backgroundColor: '#ffffff',
//   },
//   columnCell: {
//     flex: 1,
//     minWidth: 120,
//     padding: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRightWidth: 1,
//     borderRightColor: '#e2e8f0',
//   },
//   noResultsCell: {
//     flex: 8, // Span across all columns
//     padding: 20,
//   },
//   cellText: {
//     fontSize: 14,
//     color: '#1e293b',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   priorityBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 12,
//     color: '#ffffff',
//     fontWeight: '600',
//     fontSize: 12,
//     textAlign: 'center',
//     minWidth: 80,
//   },
//   priorityLow: {
//     backgroundColor: '#06B6D4',
//   },
//   priorityMedium: {
//     backgroundColor: '#3B82F6',
//   },
//   priorityHigh: {
//     backgroundColor: '#F97316',
//   },
//   priorityUrgent: {
//     backgroundColor: '#EF4444',
//   },
//   priorityNA: {
//     backgroundColor: '#94a3b8',
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 12,
//     color: '#ffffff',
//     fontWeight: '600',
//     fontSize: 12,
//     textAlign: 'center',
//     minWidth: 80,
//   },
//   statusClosed: {
//     backgroundColor: '#dc2626',
//   },
//   actionIcon: {
//     height: 24,
//     width: 24,
//   },
//   pagination: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   paginationButton: {
//     backgroundColor: '#2563eb',
//     borderRadius: 6,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//   },
//   paginationButtonDisabled: {
//     backgroundColor: '#94a3b8',
//   },
//   paginationButtonText: {
//     color: '#ffffff',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   pageIndicator: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1e293b',
//   },
// });

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../../../firebase';
import { TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PAGE_SIZE = 10;
const STAR_IMAGE = require('../../../../images/star.png');
const EMPTY_STAR_IMAGE = require('../../../../images/empty-star.png');

export default function ClosedTicketEnginner({ userUid: propUid, route }) {
  const navigation = useNavigation();
  const userUid = propUid || route?.params?.userUid;

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedAgent, setSelectedAgent] = useState('All');
  const [agentMap, setAgentMap] = useState({});

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Fetch users to map supportStaffId to displayName
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);
        const agentData = {};
        usersSnap.forEach(doc => {
          agentData[doc.id] = doc.data().displayName || 'N/A';
        });
        setAgentMap(agentData);

        const ticketsRef = collection(db, 'tickets');
        const engineerQuery = query(
          ticketsRef,
          where('engineerId', '==', userUid),
          where('status', '==', 'CLOSED'),
        );

        const engineerSnap = await getDocs(engineerQuery);
        const engineerTickets = engineerSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const categoriesSnap = await getDocs(collection(db, 'categories'));
        const categoryMap = {};
        categoriesSnap.forEach(doc => {
          categoryMap[doc.id] = doc.data().name || 'N/A';
        });

        // Fetch reviews for each ticket
        const reviewsRef = collection(db, 'customer-ticket-reviews');
        const ticketsWithDetails = await Promise.all(
          engineerTickets.map(async ticket => {
            const reviewQuery = query(
              reviewsRef,
              where('ticketId', '==', ticket.ticketId),
            );
            const reviewSnap = await getDocs(reviewQuery);
            let rating = 'N/A';
            let comment = 'No Review';
            if (reviewSnap.docs.length > 0) {
              const reviewData = reviewSnap.docs[0].data();
              rating = reviewData.rating || 'N/A';
              comment = reviewData.comment || 'No Review';
            }

            return {
              ...ticket,
              categoryName: categoryMap[ticket.category] || 'N/A',
              displayName: agentData[ticket.supportStaffId] || 'N/A',
              rating: rating,
              comment: comment,
            };
          }),
        );

        setTickets(ticketsWithDetails);
      } catch (error) {
        console.error('Error fetching closed tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userUid) {
      fetchTickets();
    }
  }, [userUid]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      ticket.ticketId?.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.title?.toLowerCase().includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || ticket.categoryName === selectedCategory;

    const matchesPriority =
      selectedPriority === 'All' ||
      (ticket.priority &&
        ticket.priority.toLowerCase() === selectedPriority.toLowerCase());

    const matchesAgent =
      selectedAgent === 'All' || ticket.displayName === selectedAgent;

    return matchesSearch && matchesCategory && matchesPriority && matchesAgent;
  });

  const totalPages = Math.ceil(filteredTickets.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginatedTickets = filteredTickets.slice(
    startIdx,
    startIdx + PAGE_SIZE,
  );

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
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  // Function to render stars based on rating
  // const renderStars = rating => {
  //   const stars = [];
  //   const ratingNum = parseFloat(rating) || 0;
  //   const maxStars = 5;

  //   for (let i = 1; i <= maxStars; i++) {
  //     stars.push(
  //       <Image
  //         key={i}
  //         source={ratingNum >= i ? STAR_IMAGE : EMPTY_STAR_IMAGE}
  //         style={styles.starIcon}
  //       />,
  //     );
  //   }
  //   return (
  //     <View style={styles.starRow}>
  //       {stars}
  //       <Text style={styles.ratingText}>
  //         {isNaN(ratingNum) ? 'N/A' : ratingNum.toFixed(1)}
  //       </Text>
  //     </View>
  //   );
  // };

  const renderStars = rating => {
    if (rating === 'N/A') {
      return (
        <View style={styles.starRow}>
          <Text style={styles.cellText}>No Review</Text>
        </View>
      );
    }

    const stars = [];
    const ratingNum = parseFloat(rating) || 0;
    const maxStars = 5;

    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <Image
          key={i}
          source={
            ratingNum >= i
              ? STAR_IMAGE
              : require('../../../../images/empty-star.png')
          }
          style={styles.starIcon}
        />,
      );
    }
    return <View style={styles.starRow}>{stars}</View>;
  };

  return (
    <View style={styles.pageWrapper}>
      <View style={styles.filtersWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by ID or Name"
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#64748b"
        />

        <View style={styles.filterRow}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={setSelectedCategory}
              style={styles.picker}
              dropdownIconColor="#64748b"
            >
              <Picker.Item label="All Categories" value="All" />
              <Picker.Item
                label="Ticket Category 1"
                value="Ticket Category 1"
              />
              <Picker.Item
                label="Ticket Category 2"
                value="Ticket Category 2"
              />
              <Picker.Item
                label="Ticket Category 4"
                value="Ticket Category 4"
              />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedPriority}
              onValueChange={setSelectedPriority}
              style={styles.picker}
              dropdownIconColor="#64748b"
            >
              <Picker.Item label="All Priorities" value="All" />
              <Picker.Item label="Low" value="LOW" />
              <Picker.Item label="Medium" value="MEDIUM" />
              <Picker.Item label="High" value="HIGH" />
              <Picker.Item label="Urgent" value="URGENT" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedAgent}
              onValueChange={setSelectedAgent}
              style={styles.picker}
              dropdownIconColor="#64748b"
            >
              <Picker.Item label="All Agents" value="All" />
              {Object.values(agentMap).map(agentName => (
                <Picker.Item
                  key={agentName}
                  label={agentName}
                  value={agentName}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        style={styles.container}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            {[
              'Ticket ID',
              'Title',
              'Category',
              'Priority',
              'Status',
              'Agent',
              'Customer Review',
              'Action',
            ].map(header => (
              <View key={header} style={styles.columnHeader}>
                <Text style={styles.headerText}>{header}</Text>
              </View>
            ))}
          </View>

          {tickets.length === 0 ? (
            <View style={styles.tableRow}>
              <View style={[styles.columnCell, styles.noResultsCell]}>
                <Text style={styles.infoText}>
                  No closed tickets assigned to you.
                </Text>
              </View>
            </View>
          ) : paginatedTickets.length === 0 ? (
            <View style={styles.tableRow}>
              <View style={[styles.columnCell, styles.noResultsCell]}>
                <Text style={styles.infoText}>
                  No results found for the applied filters.
                </Text>
              </View>
            </View>
          ) : (
            paginatedTickets.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.evenRow : styles.oddRow,
                ]}
              >
                <View style={styles.columnCell}>
                  <Text style={styles.cellText}>{item.ticketId || 'N/A'}</Text>
                </View>
                <View style={styles.columnCell}>
                  <Text style={styles.cellText}>{item.title || 'N/A'}</Text>
                </View>
                <View style={styles.columnCell}>
                  <Text style={styles.cellText}>
                    {item.categoryName || 'N/A'}
                  </Text>
                </View>
                <View style={styles.columnCell}>
                  <Text
                    style={[
                      styles.priorityBadge,
                      item.priority === 'LOW' && styles.priorityLow,
                      item.priority === 'MEDIUM' && styles.priorityMedium,
                      item.priority === 'HIGH' && styles.priorityHigh,
                      item.priority === 'URGENT' && styles.priorityUrgent,
                    ]}
                  >
                    {item.priority || 'N/A'}
                  </Text>
                </View>
                <View style={styles.columnCell}>
                  <Text style={[styles.statusBadge, styles.statusClosed]}>
                    {item.status
                      ? item.status
                          .split('_')
                          .map(
                            word =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase(),
                          )
                          .join(' ')
                      : 'Closed'}
                  </Text>
                </View>
                <View style={styles.columnCell}>
                  <Text style={styles.cellText}>
                    {item.displayName || 'N/A'}
                  </Text>
                </View>
                <View style={styles.columnCell}>
                  {renderStars(item.rating || 'No Review')}
                </View>
                <View style={styles.columnCell}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('TicketDetails', {
                        ticketId: item.id,
                      })
                    }
                  >
                    <Image
                      source={require('../../../../images/view.png')}
                      style={styles.actionIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.pagination}>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.paginationButtonDisabled,
          ]}
          onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <Text style={styles.paginationButtonText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>
          Page {currentPage} of {totalPages}
        </Text>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === totalPages && styles.paginationButtonDisabled,
          ]}
          onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.paginationButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  container: {
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#dc2626',
    textAlign: 'center',
    fontWeight: '500',
  },
  infoText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    fontWeight: '500',
  },
  filtersWrapper: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pickerContainer: {
    flex: 1,
    minWidth: '48%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  picker: {
    fontSize: 16,
    color: '#1e293b',
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
  },
  columnHeader: {
    flex: 1,
    minWidth: 120,
    padding: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#1e40af',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  evenRow: {
    backgroundColor: '#f8fafc',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  columnCell: {
    flex: 1,
    minWidth: 120,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  noResultsCell: {
    flex: 8, // Span across all columns
    padding: 20,
  },
  cellText: {
    fontSize: 14,
    color: '#1e293b',
    textAlign: 'center',
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    minWidth: 80,
  },
  priorityLow: {
    backgroundColor: '#06B6D4',
  },
  priorityMedium: {
    backgroundColor: '#3B82F6',
  },
  priorityHigh: {
    backgroundColor: '#F97316',
  },
  priorityUrgent: {
    backgroundColor: '#EF4444',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    minWidth: 80,
  },
  statusClosed: {
    backgroundColor: '#dc2626',
  },
  actionIcon: {
    height: 24,
    width: 24,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 2,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paginationButton: {
    backgroundColor: '#2563eb',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  paginationButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  paginationButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  pageIndicator: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
});
