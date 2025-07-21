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

// Assuming you have a star image in your project
const STAR_IMAGE = require('../../../../images/star.png'); // Replace with your yellow star image path

export default function ClosedTicketStaff({ userUid: propUid, route }) {
  const navigation = useNavigation();
  const userUid = propUid || route?.params?.userUid;

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedAgent, setSelectedAgent] = useState('All');
  const [agentOptions, setAgentOptions] = useState(['All']);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketsRef = collection(db, 'tickets');
        const engineerQuery = query(
          ticketsRef,
          where('engineerId', '==', userUid),
          where('status', '==', 'CLOSED'),
        );
        const staffQuery = query(
          ticketsRef,
          where('supportStaffId', '==', userUid),
          where('status', '==', 'CLOSED'),
        );

        const [engineerSnap, staffSnap] = await Promise.all([
          getDocs(engineerQuery),
          getDocs(staffQuery),
        ]);

        const ticketMap = new Map();
        [engineerSnap, staffSnap].forEach(snap => {
          snap.docs.forEach(doc => {
            ticketMap.set(doc.id, { id: doc.id, ...doc.data() });
          });
        });

        const combinedTickets = Array.from(ticketMap.values());

        const categoriesSnap = await getDocs(collection(db, 'categories'));
        const categoryMap = {};
        categoriesSnap.forEach(doc => {
          categoryMap[doc.id] = doc.data().name || 'N/A';
        });

        // Fetch customer reviews
        const reviewsRef = collection(db, 'customer-ticket-reviews');
        const ticketsWithDetails = await Promise.all(
          combinedTickets.map(async ticket => {
            const reviewQuery = query(reviewsRef, where('ticketId', '==', ticket.ticketId));
            const reviewSnap = await getDocs(reviewQuery);
            const customerReview = reviewSnap.docs.length > 0 ? reviewSnap.docs[0].data().rating || 'N/A' : 'N/A';

            console.log(
              `Ticket ID: ${ticket.ticketId}, Priority: ${ticket.priority}, Agent: ${ticket.agent}, Customer Review: ${customerReview}`,
            );
            return {
              ...ticket,
              categoryName: categoryMap[ticket.category] || 'N/A',
              priority: ticket.priority ? ticket.priority.toLowerCase() : 'N/A',
              agent: ticket.agent || 'N/A',
              customerReview: customerReview,
            };
          }),
        );

        // Extract unique agent names for dropdown
        const uniqueAgents = [
          ...new Set(
            ticketsWithDetails
              .map(ticket => ticket.agent)
              .filter(agent => agent !== 'N/A'),
          ),
        ];
        setAgentOptions(['All', ...uniqueAgents]);

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
      (ticket.ticketId?.toLowerCase() || '').includes(
        searchText.toLowerCase(),
      ) ||
      (ticket.title?.toLowerCase() || '').includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || ticket.categoryName === selectedCategory;

    const matchesPriority =
      selectedPriority === 'All' ||
      (ticket.priority &&
        ticket.priority === selectedPriority.toLowerCase()); // Match normalized values

    const matchesAgent =
      selectedAgent === 'All' || ticket.agent === selectedAgent;

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
  const renderStars = (rating) => {
    const stars = [];
    const ratingNum = parseFloat(rating) || 0;
    const maxStars = 5;

    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <Image
          key={i}
          source={ratingNum >= i ? STAR_IMAGE : require('../../../../images/empty-star.png')}
          style={styles.starIcon}
        />
      );
    }
    return (
      <View style={styles.starRow}>
        {stars}
      </View>
    );
  };

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
              <Picker.Item label="Low" value="low" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="High" value="high" />
              <Picker.Item label="Urgent" value="urgent" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedAgent}
              onValueChange={setSelectedAgent}
              style={styles.picker}
              dropdownIconColor="#64748b"
            >
              {agentOptions.map(agent => (
                <Picker.Item key={agent} label={agent} value={agent} />
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
              'Services Engineer',
              'Customer Review',
              'Status',
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
                      item.priority === 'low' && styles.priorityLow,
                      item.priority === 'medium' && styles.priorityMedium,
                      item.priority === 'high' && styles.priorityHigh,
                      item.priority === 'urgent' && styles.priorityUrgent,
                      !item.priority && styles.priorityNA,
                    ]}
                  >
                    {item.priority
                      ? item.priority.charAt(0).toUpperCase() +
                        item.priority.slice(1)
                      : 'N/A'}
                  </Text>
                </View>
                <View style={styles.columnCell}>
                  <Text style={styles.cellText}>{item.agent || 'N/A'}</Text>
                </View>
                <View style={styles.columnCell}>
                  {renderStars(item.customerReview)}
                </View>
                <View style={styles.columnCell}>
                  <Text
                    style={[
                      styles.statusBadge,
                      item.status === 'CLOSED' && styles.statusClosed,
                    ]}
                  >
                    {item.status
                      ? item.status
                          .split('_')
                          .map(
                            word =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase(),
                          )
                          .join(' ')
                      : 'N/A'}
                  </Text>
                </View>
                <View style={styles.columnCell}>
                  <View style={styles.actionContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('EditTicket', {
                          ticketId: item.id,
                        })
                      }
                    >
                      <Image
                        source={require('../../../../images/edit.png')}
                        style={styles.actionIcon}
                      />
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
    backgroundColor: '#e74c3c',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIcon: {
    height: 24,
    width: 24,
  },
  starIcon: {
    height: 20,
    width: 20,
    marginHorizontal: 2,
    flexDirection: 'row'
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
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