// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "../firebase"; // adjust path if needed

// export default function TicketsScreen({ route }) {
//   const userUid = route?.params?.userUid;

//   console.log("TicketsScreen received userUid:", userUid);

//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);

//   if (!userUid) {
//     console.error("TicketsScreen: Missing userUid! Cannot fetch tickets.");
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           Error: Missing user ID. Please log in again.
//         </Text>
//       </View>
//     );
//   }

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const ticketsRef = collection(db, "tickets");

//         console.log("Fetching tickets for user UID:", userUid);

//         // Because Firestore client SDK doesn't support OR queries directly,
//         // do two queries and merge the results:
//         const engineerQuery = query(ticketsRef, where("engineerId", "==", userUid));
//         const staffQuery = query(ticketsRef, where("supportStaffId", "==", userUid));

//         const [engineerSnap, staffSnap] = await Promise.all([
//           getDocs(engineerQuery),
//           getDocs(staffQuery),
//         ]);

//         const engineerTickets = engineerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         const staffTickets = staffSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//         const combinedTickets = [...engineerTickets, ...staffTickets];

//         setTickets(combinedTickets);
//         console.log("Tickets fetched:", combinedTickets.length);
//       } catch (error) {
//         console.error("Error fetching tickets:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTickets();
//   }, [userUid]);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#0000ff" />
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

//   return (
//     <FlatList
//       data={tickets}
//       keyExtractor={item => item.id}
//       renderItem={({ item }) => (
//         <View style={styles.card}>
//           <Text style={styles.title}>{item.title || "Ticket"}</Text>
//           <Text style={styles.description}>{item.description || "No description"}</Text>
//           <Text style={styles.meta}>Status: {item.status || "Pending"}</Text>
//         </View>
//       )}
//       contentContainerStyle={{ padding: 10 }}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   errorText: {
//     fontSize: 18,
//     color: "red",
//     textAlign: "center",
//   },
//   infoText: {
//     fontSize: 16,
//     color: "#555",
//     textAlign: "center",
//   },
//   card: {
//     backgroundColor: "#f9f9f9",
//     borderRadius: 10,
//     marginBottom: 10,
//     padding: 15,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   description: {
//     fontSize: 14,
//     color: "#333",
//   },
//   meta: {
//     marginTop: 10,
//     fontStyle: "italic",
//     color: "#555",
//   },
// });

// import React, { useEffect, useState } from "react";
// import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "../firebase"; // adjust path if needed

// export default function TicketsScreen({ route }) {
//   const userUid = route?.params?.userUid;
//   console.log("TicketsScreen received userUid:", userUid);
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);

//   if (!userUid) {
//     console.error("TicketsScreen: Missing userUid! Cannot fetch tickets.");
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           Error: Missing user ID. Please log in again.
//         </Text>
//       </View>
//     );
//   }

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const ticketsRef = collection(db, "tickets");
//         console.log("Fetching tickets for user UID:", userUid);

//         // Because Firestore client SDK doesn't support OR queries directly,
//         // do two queries and merge the results:
//         const engineerQuery = query(ticketsRef, where("engineerId", "==", userUid));
//         const staffQuery = query(ticketsRef, where("supportStaffId", "==", userUid));

//         const [engineerSnap, staffSnap] = await Promise.all([
//           getDocs(engineerQuery),
//           getDocs(staffQuery),
//         ]);

//         const engineerTickets = engineerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         const staffTickets = staffSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//         const combinedTickets = [...engineerTickets, ...staffTickets];
//         setTickets(combinedTickets);
//         console.log("Tickets fetched:", combinedTickets.length);
//       } catch (error) {
//         console.error("Error fetching tickets:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTickets();
//   }, [userUid]);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#0000ff" />
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

//   return (
//     <ScrollView style={styles.container} horizontal showsHorizontalScrollIndicator={false}>
//       <View style={styles.tableContainer}>
//         {/* Table Header */}
//         <View style={styles.tableHeader}>
//           <View style={styles.columnHeader}>
//             <Text style={styles.headerText}>ID</Text>
//           </View>
//           <View style={styles.columnHeader}>
//             <Text style={styles.headerText}>Title</Text>
//           </View>
//           <View style={styles.columnHeader}>
//             <Text style={styles.headerText}>Description</Text>
//           </View>
//           <View style={styles.columnHeader}>
//             <Text style={styles.headerText}>Status</Text>
//           </View>
//         </View>

//         {/* Table Rows */}
//         {tickets.map((item, index) => (
//           <View key={item.id} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
//             <View style={styles.columnCell}>
//               <Text style={styles.cellText} numberOfLines={1}>
//                 {item.id.substring(0, 8)}...
//               </Text>
//             </View>
//             <View style={styles.columnCell}>
//               <Text style={styles.cellText} numberOfLines={2}>
//                 {item.title || "Ticket"}
//               </Text>
//             </View>
//             <View style={styles.columnCell}>
//               <Text style={styles.cellText} numberOfLines={3}>
//                 {item.description || "No description"}
//               </Text>
//             </View>
//             <View style={styles.columnCell}>
//               <Text style={[styles.cellText, styles.statusText]} numberOfLines={1}>
//                 {item.status || "Pending"}
//               </Text>
//             </View>
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   errorText: {
//     fontSize: 18,
//     color: "red",
//     textAlign: "center",
//   },
//   infoText: {
//     fontSize: 16,
//     color: "#555",
//     textAlign: "center",
//   },
//   tableContainer: {
//     margin: 10,
//     borderRadius: 8,
//     overflow: "hidden",
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#4a90e2",
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   columnHeader: {
//     width: 120,
//     padding: 12,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRightWidth: 1,
//     borderRightColor: "#3a7bc8",
//   },
//   headerText: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#fff",
//     textAlign: "center",
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   evenRow: {
//     backgroundColor: "#f9f9f9",
//   },
//   oddRow: {
//     backgroundColor: "#fff",
//   },
//   columnCell: {
//     width: 120,
//     padding: 12,
//     justifyContent: "center",
//     borderRightWidth: 1,
//     borderRightColor: "#eee",
//     minHeight: 50,
//   },
//   cellText: {
//     fontSize: 12,
//     color: "#333",
//     textAlign: "center",
//   },
//   statusText: {
//     fontWeight: "600",
//     color: "#4a90e2",
//   },
// });

// import React, { useEffect, useState } from "react";
// import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from "react-native";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "../firebase";
// import { useNavigation } from "@react-navigation/native";

// export default function TicketsScreen({ route }) {
//   const userUid = route?.params?.userUid;
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const navigation = useNavigation();

//   if (!userUid) {
//     console.error("TicketsScreen: Missing userUid! Cannot fetch tickets.");
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>
//           Error: Missing user ID. Please log in again.
//         </Text>
//       </View>
//     );
//   }

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const ticketsRef = collection(db, "tickets");
//         const engineerQuery = query(ticketsRef, where("engineerId", "==", userUid));
//         const staffQuery = query(ticketsRef, where("supportStaffId", "==", userUid));

//         const [engineerSnap, staffSnap] = await Promise.all([
//           getDocs(engineerQuery),
//           getDocs(staffQuery),
//         ]);

//         const engineerTickets = engineerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         const staffTickets = staffSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         const combinedTickets = [...engineerTickets, ...staffTickets];

//         setTickets(combinedTickets);
//       } catch (error) {
//         console.error("Error fetching tickets:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTickets();
//   }, [userUid]);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#0000ff" />
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

//   return (
//     <ScrollView horizontal style={styles.container} showsHorizontalScrollIndicator>
//       <View style={styles.tableContainer}>
//         {/* Table Header */}
//         <View style={styles.tableHeader}>
//           <View style={styles.columnHeader}><Text style={styles.headerText}>Ticket ID</Text></View>
//           <View style={styles.columnHeader}><Text style={styles.headerText}>Title</Text></View>
//           <View style={styles.columnHeader}><Text style={styles.headerText}>Category</Text></View>
//           <View style={styles.columnHeader}><Text style={styles.headerText}>Agent</Text></View>
//           <View style={styles.columnHeader}><Text style={styles.headerText}>Status</Text></View>
//           <View style={styles.columnHeader}><Text style={styles.headerText}>Action</Text></View>
//         </View>

//         {/* Table Rows */}
//         {tickets.map((item, index) => (
//           <View key={item.id} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
//             <View style={styles.columnCell}><Text style={styles.cellText}>{item.ticketId}</Text></View>
//             <View style={styles.columnCell}><Text style={styles.cellText}>{item.title || "N/A"}</Text></View>
//             <View style={styles.columnCell}><Text style={styles.cellText}>{item.category || "N/A"}</Text></View>
//             <View style={styles.columnCell}><Text style={styles.cellText}>{item.agent || "N/A"}</Text></View>
//             <View style={styles.columnCell}>
//               <Text style={[
//                 styles.statusBadge,
//                 item.status === "CLOSED" && styles.statusClosed,
//                 item.status === "OPEN" && styles.statusOpen,
//                 item.status === "IN_PROGRESS" && styles.statusInProgress,
//               ]}>
//                 {item.status || "Pending"}
//               </Text>
//             </View>
//             <TouchableOpacity
//               onPress={()=> {
//                 navigation.navigate("ticketDetails")
//               }}
//             >
//             <Image
//               source={require('../images/view.png')}
//               style={styles.action}
//             />
//             </TouchableOpacity>
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   errorText: {
//     fontSize: 18,
//     color: "red",
//     textAlign: "center",
//   },
//   infoText: {
//     fontSize: 16,
//     color: "#555",
//     textAlign: "center",
//   },
//   tableContainer: {
//     margin: 10,
//     borderRadius: 8,
//     overflow: "hidden",
//     backgroundColor: "#fff",
//     elevation: 3,
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#007AFF",
//   },
//   columnHeader: {
//     width: 150,
//     padding: 12,
//     justifyContent: "center",
//     borderRightWidth: 1,
//     borderRightColor: "#005BB5",
//   },
//   headerText: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#fff",
//     textAlign: "center",
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   evenRow: {
//     backgroundColor: "#f9f9f9",
//   },
//   oddRow: {
//     backgroundColor: "#fff",
//   },
//   columnCell: {
//     width: 150,
//     padding: 12,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRightWidth: 1,
//     borderRightColor: "#eee",
//   },
//   cellText: {
//     fontSize: 12,
//     color: "#333",
//     textAlign: "center",
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     color: "#fff",
//     fontWeight: "bold",
//     overflow: "hidden",
//   },
//   statusClosed: {
//     backgroundColor: "#e74c3c",
//   },
//   statusOpen: {
//     backgroundColor: "#3498db",
//   },
//   statusInProgress: {
//     backgroundColor: "#27ae60",
//   },
//   action:{
//     height: 30,
//     width: 30,
//     alignSelf: 'center',
//   }
// });














// Latest Code

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
// import { db } from '../firebase';
// import { useNavigation } from '@react-navigation/native';

// const PAGE_SIZE = 10;

// export default function TicketsScreen({ route }) {
//   const userUid = route?.params?.userUid;
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);

//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const ticketsRef = collection(db, 'tickets');
//         const engineerQuery = query(
//           ticketsRef,
//           where('engineerId', '==', userUid),
//         );
//         const staffQuery = query(
//           ticketsRef,
//           where('supportStaffId', '==', userUid),
//         );

//         const [engineerSnap, staffSnap] = await Promise.all([
//           getDocs(engineerQuery),
//           getDocs(staffQuery),
//         ]);

//         const engineerTickets = engineerSnap.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         const staffTickets = staffSnap.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         const combinedTickets = [...engineerTickets, ...staffTickets];

//         setTickets(combinedTickets);
//       } catch (error) {
//         console.error('Error fetching tickets:', error);
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
//                         // .toLowerCase()
//                         .split('_')
//                         .map(
//                           word => word.charAt(0).toUpperCase() + word.slice(1),
//                         )
//                         .join(' ')
//                     : 'Pending'}
//                 </Text>
//               </View>
//               <TouchableOpacity
//                 onPress={() =>
//                   navigation.navigate('ticketDetails', { ticketId: item.id })
//                 }
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
//     marginLeft: 60,
//     // alignItems: 'center',
//     // justifyContent: 'center',
//     // textAlign: 'center'
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
import { db } from '../../../firebase';

const PAGE_SIZE = 10;

export default function TicketsScreen({ userUid: propUid, route }) {


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

      const engineerQuery = query(
        ticketsRef,
        where('engineerId', '==', userUid)
      );
      const staffQuery = query(
        ticketsRef,
        where('supportStaffId', '==', userUid)
      );

      const [engineerSnap, staffSnap] = await Promise.all([
        getDocs(engineerQuery),
        getDocs(staffQuery)
      ]);

      // Combine and remove duplicates (if any)
      const ticketMap = new Map();

      engineerSnap.docs.forEach(doc => {
        ticketMap.set(doc.id, { id: doc.id, ...doc.data() });
      });

      staffSnap.docs.forEach(doc => {
        ticketMap.set(doc.id, { id: doc.id, ...doc.data() });
      });

      const combinedTickets = Array.from(ticketMap.values());

      // Fetch all categories in one go
      const categoriesSnap = await getDocs(collection(db, 'categories'));
      const categoryMap = {};
      categoriesSnap.forEach(doc => {
        categoryMap[doc.id] = doc.data().name || 'N/A';
      });

      // Attach category name to each ticket (based on categoryId or category field)
      const ticketsWithCategoryName = combinedTickets.map(ticket => {
        const categoryId = ticket.category; // assumes 'category' is the categoryId
        return {
          ...ticket,
          categoryName: categoryMap[categoryId] || 'N/A'
        };
      });

      // console.log('Tickets with categories:', ticketsWithCategoryName);
      setTickets(ticketsWithCategoryName);
    } catch (error) {
      console.error('Error fetching tickets with categories:', error);
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
              'Priority',
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
                {/* <Text style={styles.cellText}>{item.category || 'N/A'}</Text> */}
                <Text style={styles.cellText}>{item.categoryName || 'N/A'}</Text> 
              </View>
              <View style={styles.columnCell}>
                <Text style={styles.cellText}>{item.agent || 'N/A'}</Text>
              </View>
               <View style={styles.columnCell}>
                <Text style={styles.cellText}>{item.priority || 'N/A'}</Text>
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
                  source={require('../../../images/view.png')}
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
}

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













//Latest with USerType

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
// import { useNavigation } from '@react-navigation/native';
// import { db } from '../../../firebase';

// const PAGE_SIZE = 10;

// export default function TicketsScreen({ userUid: propUid, userType: propType, route }) {
//   const navigation = useNavigation();

//   const userUid = propUid || route?.params?.userUid;
//   const userType = propType || route?.params?.userType;

//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const ticketsRef = collection(db, 'tickets');
//         let q;

//         if (userType === 'engineer') {
//           q = query(ticketsRef, where('engineerId', '==', userUid));
//         } else if (userType === 'support') {
//           q = query(ticketsRef, where('supportStaffId', '==', userUid));
//         } else {
//           console.warn('Invalid userType');
//           return;
//         }

//         const snap = await getDocs(q);

//         const filtered = snap.docs
//           .map(doc => ({ id: doc.id, ...doc.data() }))
//           .filter(ticket => {
//             if (userType === 'engineer') {
//               return ticket.engineerId?.trim() !== '';
//             } else if (userType === 'support') {
//               return ticket.supportStaffId?.trim() !== '';
//             }
//             return false;
//           });

//         setTickets(filtered);
//       } catch (error) {
//         console.error('Error fetching tickets:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userUid && userType) {
//       fetchTickets();
//     }
//   }, [userUid, userType]);

//   if (!userUid || !userType) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>Error: Missing user credentials.</Text>
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
//       <ScrollView horizontal style={styles.container} showsHorizontalScrollIndicator>
//         <View style={styles.tableContainer}>
//           <View style={styles.tableHeader}>
//             {['Ticket ID', 'Title', 'Category', 'Agent', 'Priority', 'Status', 'Action'].map(header => (
//               <View key={header} style={styles.columnHeader}>
//                 <Text style={styles.headerText}>{header}</Text>
//               </View>
//             ))}
//           </View>

//           {paginatedTickets.map((item, index) => (
//             <View
//               key={item.id}
//               style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
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
//                 <Text style={styles.cellText}>{item.priority || 'N/A'}</Text>
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
//                         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//                         .join(' ')
//                     : 'Pending'}
//                 </Text>
//               </View>

//               <TouchableOpacity
//                 onPress={() => navigation.navigate('ticketDetails', { ticketId: item.id })}
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
// });
