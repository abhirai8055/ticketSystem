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

export default function ActiveTicketEngineer({ userUid: propUid, route }) {
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
    const fetchTicketsAndAgents = async () => {
      try {
        // Fetch users to map supportStaffId to displayName
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);
        const agentData = {};
        usersSnap.forEach(doc => {
          agentData[doc.id] = doc.data().displayName || 'N/A';
        });
        setAgentMap(agentData);

        // Fetch tickets
        const ticketsRef = collection(db, 'tickets');
        const engineerQuery = query(
          ticketsRef,
          where('engineerId', '==', userUid),
          where('status', 'in', ['OPEN', 'IN_PROGRESS'])
        );
        const staffQuery = query(
          ticketsRef,
          where('supportStaffId', '==', userUid),
          where('status', 'in', ['OPEN', 'IN_PROGRESS'])
        );

        const [engineerSnap, staffSnap] = await Promise.all([
          getDocs(engineerQuery),
          getDocs(staffQuery),
        ]);

        const ticketMap = new Map();
        engineerSnap.docs.forEach(doc => {
          ticketMap.set(doc.id, { id: doc.id, ...doc.data() });
        });
        staffSnap.docs.forEach(doc => {
          ticketMap.set(doc.id, { id: doc.id, ...doc.data() });
        });

        const combinedTickets = Array.from(ticketMap.values());

        // Fetch categories and set categoryMap in state
        const categoriesSnap = await getDocs(collection(db, 'categories'));
        const categoryData = {};
        categoriesSnap.forEach(doc => {
          categoryData[doc.id] = doc.data().name || 'N/A';
        });
        setCategoryMap(categoryData);

        // Map tickets with categoryName and displayName
        const ticketsWithDetails = combinedTickets.map(ticket => ({
          ...ticket,
          categoryName: categoryData[ticket.category] || 'N/A',
          displayName: agentData[ticket.supportStaffId] || 'N/A',
        }));

        setTickets(ticketsWithDetails);
      } catch (error) {
        console.error('Error fetching tickets and agents:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userUid) {
      fetchTicketsAndAgents();
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
      (ticket.priority && ticket.priority.toLowerCase() === selectedPriority.toLowerCase());

    const matchesStatus =
      selectedStatus === 'All' ||
      (ticket.status && ticket.status.toLowerCase() === selectedStatus.toLowerCase());

    const matchesAgent =
      selectedAgent === 'All' || ticket.displayName === selectedAgent;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesAgent;
  });

  const totalPages = Math.ceil(filteredTickets.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginatedTickets = filteredTickets.slice(startIdx, startIdx + PAGE_SIZE);

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

  if (tickets.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>No tickets assigned to you.</Text>
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
              <Picker.Item label = "Urgent" value="URGENT" />
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
              <Picker.Item label="CLOSED" value="CLOSED" />
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
                <Text style={styles.infoText}>No tickets assigned to you.</Text>
              </View>
            </View>
          ) : paginatedTickets.length === 0 ? (
            <View style={styles.tableRow}>
              <View style={[styles.columnCell, styles.noResultsCell]}>
                <Text style={styles.infoText}>No results found for the applied filters.</Text>
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
                      item.status === 'CLOSED' && styles.statusClosed,
                      item.status === 'OPEN' && styles.statusOpen,
                      item.status === 'IN_PROGRESS' && styles.statusInProgress,
                    ]}
                  >
                    {item.status
                      ? item.status
                          .split('_')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                          .join(' ')
                      : 'N/A'}
                  </Text>
                </View>
                <View style={styles.columnCell}>
                  <Text style={styles.cellText}>{item.displayName || 'N/A'}</Text>
                </View>
                <View style={styles.columnCell}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('TicketDetails', {
                        ticketId: item.id,
                      });
                    }}
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
    flex: 8,
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
  statusClosed: {
    backgroundColor: '#dc2626',
  },
  statusOpen: {
    backgroundColor: '#2563eb',
  },
  statusInProgress: {
    backgroundColor: '#16a34a',
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


//AMIN
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

// export default function ActiveTickets({ userUid: propUid, route }) {
//   const navigation = useNavigation();
//   const userUid = propUid || route?.params?.userUid;

//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);

//  useEffect(() => {
//   const fetchTickets = async () => {
//     try {
//       const ticketsRef = collection(db, 'tickets');
//       const engineerQuery = query(
//         ticketsRef,
//         where('engineerId', '==', userUid)
//       );

//       const engineerSnap = await getDocs(engineerQuery);

//       const engineerTickets = engineerSnap.docs
//         .map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }))
//         .filter(ticket => ticket.acceptedAt);

//       setTickets(engineerTickets);
//     } catch (error) {
//       console.error('Error fetching tickets:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (userUid) {
//     fetchTickets();
//   }
// }, [userUid]);

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
//       <ScrollView horizontal style={styles.container} showsHorizontalScrollIndicator>
//         <View style={styles.tableContainer}>
//           {/* Table Header */}
//           <View style={styles.tableHeader}>
//             {['Ticket ID', 'Title', 'Category', 'Agent', 'Status', 'Action'].map(header => (
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
//               {/* <View style={styles.columnCell}>
//                 <Text style={styles.cellText}>
//                   {item.acceptedAt
//                     ? new Date(item.acceptedAt.seconds ? item.acceptedAt.seconds * 1000 : item.acceptedAt).toLocaleString()
//                     : 'N/A'}
//                 </Text>
//               </View> */}
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
//                 onPress={() => {
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
