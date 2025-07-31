// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Image,
//   Button,
//   Alert,
// } from 'react-native';
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   doc,
//   updateDoc,
//   Timestamp,
// } from 'firebase/firestore';

// import { useNavigation } from '@react-navigation/native';
// import { db } from '../../../../firebase';
// import { TextInput } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// const PAGE_SIZE = 10;

// export default function NewAssignTicketEngineer({ userUid: propUid, route }) {
//   const navigation = useNavigation();
//   const userUid = propUid || route?.params?.userUid;

//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [searchText, setSearchText] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [selectedPriority, setSelectedPriority] = useState('All');
//   const [selectedStatus, setSelectedStatus] = useState('All');
//   const [selectedAgent, setSelectedAgent] = useState('All');

//   useEffect(() => {
//     const fetchUnassignedTickets = async () => {
//       try {
//         const ticketsRef = collection(db, 'tickets');
//         const engineerQuery = query(
//           ticketsRef,
//           where('engineerId', '==', userUid),
//         );

//         const snapshot = await getDocs(engineerQuery);
//         const unassigned = snapshot.docs
//           .map(doc => ({ id: doc.id, ...doc.data() }))
//           .filter(
//             ticket =>
//               ticket.acceptedAt === '' ||
//               ticket.acceptedAt === null ||
//               ticket.acceptedAt === undefined,
//           );

//         setTickets(unassigned);
//       } catch (error) {
//         console.error('Error fetching tickets:', error);
//         Alert.alert('Error', 'Failed to fetch tickets.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userUid) {
//       fetchUnassignedTickets();
//     }
//   }, [userUid]);

//   const handleAccept = async ticketId => {
//     try {
//       const ticketRef = doc(db, 'tickets', ticketId);
//       await updateDoc(ticketRef, {
//         acceptedAt: Timestamp.now(),
//       });

//       setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
//     } catch (error) {
//       console.error('Error updating ticket:', error);
//       Alert.alert('Error', 'Failed to accept the ticket.');
//     }
//   };

//   const filteredTickets = tickets.filter(ticket => {
//     const matchesSearch =
//       ticket.ticketId?.toLowerCase().includes(searchText.toLowerCase()) ||
//       ticket.title?.toLowerCase().includes(searchText.toLowerCase());

//     const matchesCategory =
//       selectedCategory === 'All' || ticket.category === selectedCategory;

//     const matchesPriority =
//       selectedPriority === 'All' || ticket.priority === selectedPriority;

//     const matchesStatus =
//       selectedStatus === 'All' || ticket.status === selectedStatus;

//     const matchesAgent =
//       selectedAgent === 'All' || ticket.agent === selectedAgent;

//     return (
//       matchesSearch &&
//       matchesCategory &&
//       matchesPriority &&
//       matchesStatus &&
//       matchesAgent
//     );
//   });

//   const totalPages = Math.ceil(tickets.length / PAGE_SIZE);
//   const startIdx = (currentPage - 1) * PAGE_SIZE;
//   // const paginatedTickets = tickets.slice(startIdx, startIdx + PAGE_SIZE);
//   // // const paginatedTickets = tickets.slice(startIdx, startIdx + PAGE_SIZE);
//   const paginatedTickets = filteredTickets.slice(
//     startIdx,
//     startIdx + PAGE_SIZE,
//   );

//   if (!userUid) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           Missing user ID. Please log in again.
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
//         <Text style={styles.infoText}>No new tickets assigned to you.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.pageWrapper}>
//       <ScrollView
//         horizontal
//         style={styles.container}
//         showsHorizontalScrollIndicator
//       >
//         <View style={styles.filtersWrapper}>
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search by id, name"
//             value={searchText}
//             onChangeText={setSearchText}
//           />

//           <Picker
//             selectedValue={selectedCategory}
//             onValueChange={setSelectedCategory}
//             style={styles.picker}
//           >
//             <Picker.Item label="All" value="All" />
//             <Picker.Item label="Ticket Category 1" value="Ticket Category 1" />
//             <Picker.Item label="Ticket Category 2" value="Ticket Category 2" />
//             <Picker.Item label="Ticket Category 4" value="Ticket Category 4" />
//             Add more categories as needed
//           </Picker>

//           <Picker
//             selectedValue={selectedPriority}
//             onValueChange={setSelectedPriority}
//             style={styles.picker}
//           >
//             <Picker.Item label="All" value="All" />
//             <Picker.Item label="Low" value="Low" />
//             <Picker.Item label="Medium" value="Medium" />
//             <Picker.Item label="High" value="High" />
//             <Picker.Item label="High" value="Urgent" />
//           </Picker>

//           <Picker
//             selectedValue={selectedStatus}
//             onValueChange={setSelectedStatus}
//             style={styles.picker}
//           >
//             <Picker.Item label="All" value="All" />
//             <Picker.Item label="OPEN" value="OPEN" />
//             <Picker.Item label="IN_PROGRESS" value="IN_PROGRESS" />
//             <Picker.Item label="CLOSED" value="CLOSED" />
//           </Picker>

//           <Picker
//             selectedValue={selectedAgent}
//             onValueChange={setSelectedAgent}
//             style={styles.picker}
//           >
//             <Picker.Item label="All" value="All" />
//             <Picker.Item label="Jishan" value="Jishan" />
//             <Picker.Item label="Joy" value="Joy" />
//             <Picker.Item label="Sanny" value="Sanny" />
//             <Picker.Item label="ABhatt" value="ABhatt" />
//             Add dynamically if needed
//           </Picker>
//         </View>

//         <View style={styles.tableContainer}>
//           {/* Table Header */}
//           <View style={styles.tableHeader}>
//             {[
//               'Ticket ID',
//               'Title',
//               'Category',
//               'Priority',
//               'Status',
//               'Agent',
//               'Actions',
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
//                 <Text style={styles.priorityBadge}>
//                   {item.priority || 'N/A'}
//                 </Text>
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
//                   {item.status || 'N/A'}
//                 </Text>
//               </View>
//               <View style={styles.columnCell}>
//                 <Text style={styles.cellText}>{item.agent || 'N/A'}</Text>
//               </View>
//               <View style={styles.columnCell}>
//                 <TouchableOpacity
//                   onPress={() => handleAccept(item.id)}
//                   style={styles.acceptBtn}
//                 >
//                   <Text style={{ color: '#007BFF', fontWeight: 'bold' }}>
//                     Accept
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() =>
//                     navigation.navigate('ticketDetails', {
//                       ticketId: item.id,
//                     })
//                   }
//                 >
//                   <Image
//                     source={require('../../../../images/view.png')}
//                     style={styles.action}
//                   />
//                 </TouchableOpacity>
//               </View>
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
//   filtersWrapper: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     padding: 10,
//     backgroundColor: '#fff',
//     marginHorizontal: 10,
//     borderRadius: 8,
//     elevation: 2,
//     marginBottom: 5,
//   },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flex: 1,
//     minWidth: '100%',
//     marginBottom: 10,
//     backgroundColor: '#fff',
//   },
//   picker: {
//     flexBasis: '48%',
//     minWidth: '48%',
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     marginBottom: 10,
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
//     flexDirection: 'row',
//     gap: 8,
//     textAlign: 'center',
//   },
//   cellText: {
//     fontSize: 12,
//     color: '#333',
//     textAlign: 'center',
//   },
//   priorityBadge: {
//     backgroundColor: '#00BCD4',
//     color: '#fff',
//     fontWeight: 'bold',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 10,
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
//     marginTop: 5,
//     marginLeft: 5,
//   },
//   acceptBtn: {
//     borderWidth: 1,
//     borderColor: '#007BFF',
//     borderRadius: 4,
//     paddingHorizontal: 5,
//     paddingVertical: 4,
//     marginBottom: 5,
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

// govind Code

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Image,
//   Alert,
// } from 'react-native';
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   doc,
//   updateDoc,
//   Timestamp,
// } from 'firebase/firestore';
// import { useNavigation } from '@react-navigation/native';
// import { db } from '../../../../firebase';
// import { TextInput } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// const PAGE_SIZE = 10;

// export default function NewAssignTicketEngineer({ userUid: propUid, route }) {
//   const navigation = useNavigation();
//   const userUid = propUid || route?.params?.userUid;

//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchText, setSearchText] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [selectedPriority, setSelectedPriority] = useState('All');
//   const [selectedStatus, setSelectedStatus] = useState('All');
//   const [selectedAgent, setSelectedAgent] = useState('All');

//   useEffect(() => {
//     const fetchUnassignedTickets = async () => {
//       try {
//         const ticketsRef = collection(db, 'tickets');
//         const engineerQuery = query(
//           ticketsRef,
//           where('engineerId', '==', userUid),
//         );

//         const snapshot = await getDocs(engineerQuery);
//         const unassigned = snapshot.docs
//           .map(doc => ({ id: doc.id, ...doc.data() }))
//           .filter(
//             ticket =>
//               (ticket.acceptedAt === '' ||
//                 ticket.acceptedAt === null ||
//                 ticket.acceptedAt === undefined) &&
//               ticket.status !== 'CLOSED',
//           );

//         setTickets(unassigned);
//       } catch (error) {
//         console.error('Error fetching tickets:', error);
//         Alert.alert('Error', 'Failed to fetch tickets.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userUid) {
//       fetchUnassignedTickets();
//     }
//   }, [userUid]);

//   const handleAccept = async ticketId => {
//     try {
//       const ticketRef = doc(db, 'tickets', ticketId);
//       await updateDoc(ticketRef, {
//         acceptedAt: Timestamp.now(),
//       });

//       setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
//     } catch (error) {
//       console.error('Error updating ticket:', error);
//       Alert.alert('Error', 'Failed to accept the ticket.');
//     }
//   };

//   const filteredTickets = tickets.filter(ticket => {
//     const matchesSearch =
//       ticket.ticketId?.toLowerCase().includes(searchText.toLowerCase()) ||
//       ticket.title?.toLowerCase().includes(searchText.toLowerCase());

//     const matchesCategory =
//       selectedCategory === 'All' || ticket.category === selectedCategory;

//     const matchesPriority =
//       selectedPriority === 'All' ||
//       (ticket.priority &&
//         ticket.priority.toLowerCase() === selectedPriority.toLowerCase());

//     const matchesStatus =
//       selectedStatus === 'All' || ticket.status === selectedStatus;

//     const matchesAgent =
//       selectedAgent === 'All' || ticket.agent === selectedAgent;

//     return (
//       matchesSearch &&
//       matchesCategory &&
//       matchesPriority &&
//       matchesStatus &&
//       matchesAgent
//     );
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
//           Missing user ID. Please log in again.
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
//           placeholder="Search by ID or Title"
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
//               selectedValue={selectedStatus}
//               onValueChange={setSelectedStatus}
//               style={styles.picker}
//               dropdownIconColor="#64748b"
//             >
//               <Picker.Item label="All Statuses" value="All" />
//               <Picker.Item label="OPEN" value="OPEN" />
//               <Picker.Item label="IN_PROGRESS" value="IN_PROGRESS" />
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
//               'Actions',
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
//                   No new tickets assigned to you.
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
//                   <Text style={styles.cellText}>{item.category || 'N/A'}</Text>
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
//                   <Text
//                     style={[
//                       styles.statusBadge,
//                       item.status === 'OPEN' && styles.statusOpen,
//                       item.status === 'IN_PROGRESS' && styles.statusInProgress,
//                     ]}
//                   >
//                     {item.status || 'N/A'}
//                   </Text>
//                 </View>
//                 <View style={styles.columnCell}>
//                   <Text style={styles.cellText}>
//                     {item.supportStaffId || 'N/A'}
//                   </Text>
//                 </View>
//                 <View style={styles.columnCell}>
//                   <TouchableOpacity
//                     onPress={() => handleAccept(item.id)}
//                     style={styles.acceptBtn}
//                   >
//                     <Text style={styles.acceptBtnText}>Accept</Text>
//                   </TouchableOpacity>
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
//     flexDirection: 'row',
//   },
//   noResultsCell: {
//     flex: 7, // Span across all columns
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
//     backgroundColor: '#22c55e',
//   },
//   priorityMedium: {
//     backgroundColor: '#f59e0b',
//   },
//   priorityHigh: {
//     backgroundColor: '#ef4444',
//   },
//   priorityUrgent: {
//     backgroundColor: '#b91c1c',
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
//   statusOpen: {
//     backgroundColor: '#2563eb',
//   },
//   statusInProgress: {
//     backgroundColor: '#16a34a',
//   },
//   acceptBtn: {
//     backgroundColor: '#2563eb',
//     borderRadius: 6,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     marginRight: 8,
//   },
//   acceptBtnText: {
//     color: '#ffffff',
//     fontWeight: '600',
//     fontSize: 14,
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
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../../../firebase';
import { TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PAGE_SIZE = 10;

export default function NewAssignTicketEngineer({ userUid: propUid, route }) {
  const navigation = useNavigation();
  const userUid = propUid || route?.params?.userUid;

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedAgent, setSelectedAgent] = useState('All');
  const [agentMap, setAgentMap] = useState({}); 
  const [categoryMap, setCategoryMap] = useState({}); 

  useEffect(() => {
    const fetchUnassignedTickets = async () => {
      try {
        // Fetch users to map supportStaffId to displayName
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);
        const agentData = {};
        usersSnap.forEach(doc => {
          agentData[doc.id] = doc.data().displayName || 'N/A';
        });
        setAgentMap(agentData);

        // Fetch categories to map category ID to name
        const categoriesRef = collection(db, 'categories');
        const categoriesSnap = await getDocs(categoriesRef);
        const categoryData = {};
        categoriesSnap.forEach(doc => {
          categoryData[doc.id] = doc.data().name || 'N/A';
        });
        setCategoryMap(categoryData);

        // Fetch tickets
        const ticketsRef = collection(db, 'tickets');
        const engineerQuery = query(ticketsRef, where('engineerId', '==', userUid));

        const snapshot = await getDocs(engineerQuery);
        const unassigned = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(
            ticket =>
              (ticket.acceptedAt === '' ||
                ticket.acceptedAt === null ||
                ticket.acceptedAt === undefined) &&
              ticket.status !== 'CLOSED',
          );

        // Map tickets with categoryName and displayName
        const ticketsWithDetails = unassigned.map(ticket => ({
          ...ticket,
          categoryName: categoryMap[ticket.category] || 'N/A',
          displayName: agentMap[ticket.supportStaffId] || 'N/A',
        }));

        setTickets(ticketsWithDetails);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        Alert.alert('Error', 'Failed to fetch tickets.');
      } finally {
        setLoading(false);
      }
    };

    if (userUid) {
      fetchUnassignedTickets();
    }
  }, [userUid]);

  const handleAccept = async ticketId => {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, {
        acceptedAt: Timestamp.now(),
      });

      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
    } catch (error) {
      console.error('Error updating ticket:', error);
      Alert.alert('Error', 'Failed to accept the ticket.');
    }
  };

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

    const matchesStatus =
      selectedStatus === 'All' || ticket.status === selectedStatus;

    const matchesAgent =
      selectedAgent === 'All' || ticket.displayName === selectedAgent;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPriority &&
      matchesStatus &&
      matchesAgent
    );
  });

  const totalPages = Math.ceil(filteredTickets.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginatedTickets = filteredTickets.slice(startIdx, startIdx + PAGE_SIZE);

  if (!userUid) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Missing user ID. Please log in again.
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

  return (
    <View style={styles.pageWrapper}>
      <View style={styles.filtersWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by ID or Title"
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
              {Object.values(categoryMap).map(categoryName => (
                <Picker.Item
                  key={categoryName}
                  label={categoryName}
                  value={categoryName}
                />
              ))}
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
              selectedValue={selectedStatus}
              onValueChange={setSelectedStatus}
              style={styles.picker}
              dropdownIconColor="#64748b"
            >
              <Picker.Item label="All Statuses" value="All" />
              <Picker.Item label="OPEN" value="OPEN" />
              <Picker.Item label="IN_PROGRESS" value="IN_PROGRESS" />
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
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
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
              'Actions',
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
                  No new tickets assigned to you.
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
                  <Text style={styles.cellText}>{item.categoryName || 'N/A'}</Text>
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
                  <Text
                    style={[
                      styles.statusBadge,
                      item.status === 'OPEN' && styles.statusOpen,
                      item.status === 'IN_PROGRESS' && styles.statusInProgress,
                    ]}
                  >
                    {item.status || 'N/A'}
                  </Text>
                </View>
                <View style={styles.columnCell}>
                  <Text style={styles.cellText}>{item.displayName || 'N/A'}</Text>
                </View>
                <View style={styles.columnCell}>
                  <TouchableOpacity
                    onPress={() => handleAccept(item.id)}
                    style={styles.acceptBtn}
                  >
                    <Text style={styles.acceptBtnText}>Accept</Text>
                  </TouchableOpacity>
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
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingBottom: 20,
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
    flexDirection: 'row',
  },
  noResultsCell: {
    flex: 7,
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
  priorityNA: {
    backgroundColor: '#94a3b8',
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
  statusOpen: {
    backgroundColor: '#2563eb',
  },
  statusInProgress: {
    backgroundColor: '#16a34a',
  },
  acceptBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  acceptBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  actionIcon: {
    height: 24,
    width: 24,
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
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Image,
//   Button,
//   Alert,
//   TextInput,
// } from 'react-native';
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   doc,
//   updateDoc,
//   Timestamp,
// } from 'firebase/firestore';
// import { Picker } from '@react-native-picker/picker';
// import { useNavigation } from '@react-navigation/native';
// import { db } from '../../../firebase';

// const PAGE_SIZE = 10;

// export default function NewAssignTickets({ userUid: propUid, route }) {
//   const navigation = useNavigation();
//   const userUid = propUid || route?.params?.userUid;

//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [searchText, setSearchText] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [selectedPriority, setSelectedPriority] = useState('All');
//   const [selectedStatus, setSelectedStatus] = useState('All');
//   const [selectedAgent, setSelectedAgent] = useState('All');

//   useEffect(() => {
//     const fetchUnassignedTickets = async () => {
//       try {
//         const ticketsRef = collection(db, 'tickets');
//         const engineerQuery = query(
//           ticketsRef,
//           where('engineerId', '==', userUid)
//         );

//         const snapshot = await getDocs(engineerQuery);
//         const unassigned = snapshot.docs
//           .map(doc => ({ id: doc.id, ...doc.data() }))
//           .filter(
//             ticket =>
//               ticket.acceptedAt === '' ||
//               ticket.acceptedAt === null ||
//               ticket.acceptedAt === undefined
//           );

//         setTickets(unassigned);
//       } catch (error) {
//         console.error('Error fetching tickets:', error);
//         Alert.alert('Error', 'Failed to fetch tickets.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userUid) {
//       fetchUnassignedTickets();
//     }
//   }, [userUid]);

//   const handleAccept = async ticketId => {
//     try {
//       const ticketRef = doc(db, 'tickets', ticketId);
//       await updateDoc(ticketRef, {
//         acceptedAt: Timestamp.now(),
//       });

//       setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
//     } catch (error) {
//       console.error('Error updating ticket:', error);
//       Alert.alert('Error', 'Failed to accept the ticket.');
//     }
//   };

//   const filteredTickets = tickets.filter(ticket => {
//     const matchesSearch =
//       ticket.ticketId?.toLowerCase().includes(searchText.toLowerCase()) ||
//       ticket.title?.toLowerCase().includes(searchText.toLowerCase());

//     const matchesCategory =
//       selectedCategory === 'All' || ticket.category === selectedCategory;

//     const matchesPriority =
//       selectedPriority === 'All' || ticket.priority === selectedPriority;

//     const matchesStatus =
//       selectedStatus === 'All' || ticket.status === selectedStatus;

//     const matchesAgent =
//       selectedAgent === 'All' || ticket.agent === selectedAgent;

//     return (
//       matchesSearch &&
//       matchesCategory &&
//       matchesPriority &&
//       matchesStatus &&
//       matchesAgent
//     );
//   });

//   const totalPages = Math.ceil(filteredTickets.length / PAGE_SIZE);
//   const startIdx = (currentPage - 1) * PAGE_SIZE;
//   const paginatedTickets = filteredTickets.slice(startIdx, startIdx + PAGE_SIZE);

//   if (!userUid) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>Missing user ID. Please log in again.</Text>
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

//   if (filteredTickets.length === 0) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.infoText}>No tickets match your filter criteria.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.pageWrapper}>
//       {/* Filters */}
//       <View style={styles.filtersWrapper}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by id, name"
//           value={searchText}
//           onChangeText={setSearchText}
//         />

//         <Picker
//           selectedValue={selectedCategory}
//           onValueChange={setSelectedCategory}
//           style={styles.picker}
//         >
//           <Picker.Item label="All" value="All" />
//           <Picker.Item label="Hardware" value="Hardware" />
//           <Picker.Item label="Software" value="Software" />
//         </Picker>

//         <Picker
//           selectedValue={selectedPriority}
//           onValueChange={setSelectedPriority}
//           style={styles.picker}
//         >
//           <Picker.Item label="All" value="All" />
//           <Picker.Item label="High" value="High" />
//           <Picker.Item label="Medium" value="Medium" />
//           <Picker.Item label="Low" value="Low" />
//         </Picker>

//         <Picker
//           selectedValue={selectedStatus}
//           onValueChange={setSelectedStatus}
//           style={styles.picker}
//         >
//           <Picker.Item label="All" value="All" />
//           <Picker.Item label="OPEN" value="OPEN" />
//           <Picker.Item label="IN_PROGRESS" value="IN_PROGRESS" />
//           <Picker.Item label="CLOSED" value="CLOSED" />
//         </Picker>

//         <Picker
//           selectedValue={selectedAgent}
//           onValueChange={setSelectedAgent}
//           style={styles.picker}
//         >
//           <Picker.Item label="All" value="All" />
//           <Picker.Item label="Agent 1" value="Agent 1" />
//           <Picker.Item label="Agent 2" value="Agent 2" />
//         </Picker>
//       </View>

//       {/* Table */}
//       <ScrollView horizontal style={styles.container}>
//         <View style={styles.tableContainer}>
//           {/* Header */}
//           <View style={styles.tableHeader}>
//             {[
//               'Ticket ID',
//               'Title',
//               'Category',
//               'Priority',
//               'Status',
//               'Agent',
//               'Actions',
//             ].map(header => (
//               <View key={header} style={styles.columnHeader}>
//                 <Text style={styles.headerText}>{header}</Text>
//               </View>
//             ))}
//           </View>

//           {/* Rows */}
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
//                 <Text style={styles.priorityBadge}>{item.priority || 'N/A'}</Text>
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
//                   {item.status || 'N/A'}
//                 </Text>
//               </View>
//               <View style={styles.columnCell}>
//                 <Text style={styles.cellText}>{item.agent || 'N/A'}</Text>
//               </View>
//               <View style={styles.columnCell}>
//                 <TouchableOpacity
//                   onPress={() => handleAccept(item.id)}
//                   style={styles.acceptBtn}
//                 >
//                   <Text style={{ color: '#007BFF', fontWeight: 'bold' }}>
//                     Accept
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() =>
//                     navigation.navigate('ticketDetails', {
//                       ticketId: item.id,
//                     })
//                   }
//                 >
//                   <Image
//                     source={require('../../../images/view.png')}
//                     style={styles.action}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ))}
//         </View>
//       </ScrollView>

//       {/* Pagination */}
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
//   filtersWrapper: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     padding: 10,
//     backgroundColor: '#fff',
//     marginHorizontal: 10,
//     borderRadius: 8,
//     elevation: 2,
//     marginBottom: 5,
//   },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     flex: 1,
//     minWidth: '100%',
//     marginBottom: 10,
//     backgroundColor: '#fff',
//   },
//   picker: {
//     flexBasis: '48%',
//     minWidth: '48%',
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     marginBottom: 10,
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
//     flexDirection: 'row',
//     gap: 8,
//     textAlign: 'center',
//   },
//   cellText: {
//     fontSize: 12,
//     color: '#333',
//     textAlign: 'center',
//   },
//   priorityBadge: {
//     backgroundColor: '#00BCD4',
//     color: '#fff',
//     fontWeight: 'bold',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 10,
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
//     marginTop: 5,
//     marginLeft: 5,
//   },
//   acceptBtn: {
//     borderWidth: 1,
//     borderColor: '#007BFF',
//     borderRadius: 4,
//     paddingHorizontal: 5,
//     paddingVertical: 4,
//     marginBottom: 5,
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

// MAIN
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Image,
//   Button,
//   Alert,
// } from 'react-native';
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   doc,
//   updateDoc,
//   Timestamp,
// } from 'firebase/firestore';

// import { useNavigation } from '@react-navigation/native';
// import { db } from '../../../firebase';

// const PAGE_SIZE = 10;

// export default function NewAssignTickets({ userUid: propUid, route }) {
//   const navigation = useNavigation();
//   const userUid = propUid || route?.params?.userUid;

//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const fetchUnassignedTickets = async () => {
//       try {
//         const ticketsRef = collection(db, 'tickets');
//         const engineerQuery = query(
//           ticketsRef,
//           where('engineerId', '==', userUid)
//         );

//         const snapshot = await getDocs(engineerQuery);
//         const unassigned = snapshot.docs
//           .map(doc => ({ id: doc.id, ...doc.data() }))
//           .filter(
//             ticket =>
//               ticket.acceptedAt === '' ||
//               ticket.acceptedAt === null ||
//               ticket.acceptedAt === undefined
//           );

//         setTickets(unassigned);
//       } catch (error) {
//         console.error('Error fetching tickets:', error);
//         Alert.alert('Error', 'Failed to fetch tickets.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userUid) {
//       fetchUnassignedTickets();
//     }
//   }, [userUid]);

//   const handleAccept = async ticketId => {
//     try {
//       const ticketRef = doc(db, 'tickets', ticketId);
//       await updateDoc(ticketRef, {
//         acceptedAt: Timestamp.now(),
//       });

//       setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
//     } catch (error) {
//       console.error('Error updating ticket:', error);
//       Alert.alert('Error', 'Failed to accept the ticket.');
//     }
//   };

//   const totalPages = Math.ceil(tickets.length / PAGE_SIZE);
//   const startIdx = (currentPage - 1) * PAGE_SIZE;
//   const paginatedTickets = tickets.slice(startIdx, startIdx + PAGE_SIZE);

//   if (!userUid) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>Missing user ID. Please log in again.</Text>
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
//         <Text style={styles.infoText}>No new tickets assigned to you.</Text>
//       </View>
//     );
//   }

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
//               'Priority',
//               'Status',
//               'Agent',
//               'Actions',
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
//                 <Text style={styles.priorityBadge}>{item.priority || 'N/A'}</Text>
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
//                   {item.status || 'N/A'}
//                 </Text>
//               </View>
//               <View style={styles.columnCell}>
//                 <Text style={styles.cellText}>{item.agent || 'N/A'}</Text>
//               </View>
//               <View style={styles.columnCell}>
//                 <TouchableOpacity
//                   onPress={() => handleAccept(item.id)}
//                   style={styles.acceptBtn}
//                 >
//                   <Text style={{ color: '#007BFF', fontWeight: 'bold' }}>Accept</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() =>
//                     navigation.navigate('ticketDetails', {
//                       ticketId: item.id,
//                     })
//                   }
//                 >
//                   <Image
//                     source={require('../../../images/view.png')}
//                     style={styles.action}
//                   />
//                 </TouchableOpacity>
//               </View>
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
//           onPress={() =>
//             setCurrentPage(prev => Math.min(prev + 1, totalPages))
//           }
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
//     flexDirection: 'row',
//     gap: 15,
//     textAlign: 'center',
//   },
//   cellText: {
//     fontSize: 12,
//     color: '#333',
//     textAlign: 'center',
//   },
//   priorityBadge: {
//     backgroundColor: '#00BCD4',
//     color: '#fff',
//     fontWeight: 'bold',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 10,
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
//     marginTop: 5,
//     marginLeft: 55
//   },
//   acceptBtn: {
//     borderWidth: 1,
//     borderColor: '#007BFF',
//     borderRadius: 4,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     marginBottom: 5,
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
