// Pervious code Main Code
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   ActivityIndicator,
//   TouchableOpacity,
//   FlatList,
// } from 'react-native';
// import { getAuth } from 'firebase/auth';
// import {
//   doc,
//   getDoc,
//   updateDoc,
//   arrayUnion,
//   addDoc,
//   collection,
//   query,
//   where,
//   getDocs,
//   onSnapshot,
//   orderBy,
// } from 'firebase/firestore';
// import { TextInput } from 'react-native-gesture-handler';
// import { db } from '../../../firebase';
// import moment from 'moment';
// import { useNavigation } from '@react-navigation/native';
// import DropDownPicker from 'react-native-dropdown-picker';

// export default function TicketDetailsScreen({ route }) {
//   const ticketId = route?.params?.ticketId;
//   const [ticket, setTicket] = useState(null);
//   const [associatedData, setAssociatedData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [replyText, setReplyText] = useState('');
//   const [sendingReply, setSendingReply] = useState(false);
//   const [engineer, setEngineer] = useState(null);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [noteText, setNoteText] = useState('');
//   const [sendingNote, setSendingNote] = useState(false);
//   const [ticketNotes, setTicketNotes] = useState([]);
//   const [assignmentHistory, setAssignmentHistory] = useState([]);
//   const [engineerReview, setEngineerReview] = useState([]);
//   const navigation = useNavigation();

//   const [priorityOpen, setPriorityOpen] = useState(false);
//   const [priorityValue, setPriorityValue] = useState(null);
//   const [priorityItems, setPriorityItems] = useState([
//     { label: 'Low', value: 'LOW' },
//     { label: 'Medium', value: 'MEDIUM' },
//     { label: 'High', value: 'HIGH' },
//     { label: 'Urgent', value: 'URGENT' },
//   ]);

//   const [statusOpen, setStatusOpen] = useState(false);
//   const [statusValue, setStatusValue] = useState(null);
//   const [statusItems, setStatusItems] = useState([
//     { label: 'OPEN', value: 'OPEN' },
//     { label: 'IN PROGRESS', value: 'IN_PROGRESS' },
//     { label: 'CLOSED', value: 'CLOSED' },
//   ]);

//   useEffect(() => {
//     const fetchUserAndTicketData = async () => {
//       try {
//         setLoading(true);
//         const auth = getAuth();
//         const currentUser = auth.currentUser;
//         if (currentUser) {
//           setCurrentUserId(currentUser.uid);
//         }

//         // Fetch ticket
//         const ticketRef = doc(db, 'tickets', ticketId);
//         const ticketSnap = await getDoc(ticketRef);
//         if (!ticketSnap.exists()) {
//           console.error('Ticket not found');
//           return;
//         }

//         const ticketData = { id: ticketSnap.id, ...ticketSnap.data() };
//         setTicket(ticketData);
//         setPriorityValue(ticketData.priority || null);
//         setStatusValue(ticketData.status || null);

//         // Fetch associated product
//         const key = `${ticketData.modelId}_${ticketData.serialNumber}`;
//         const productRef = doc(db, 'products', key);
//         const productSnap = await getDoc(productRef);
//         if (productSnap.exists()) {
//           setAssociatedData({ id: productSnap.id, ...productSnap.data() });
//         }

//         // Fetch engineer details
//         if (ticketData.engineerId) {
//           const engineerRef = doc(db, 'users', ticketData.engineerId);
//           const engineerSnap = await getDoc(engineerRef);
//           if (engineerSnap.exists()) {
//             setEngineer({
//               name: engineerSnap.data().displayName || 'N/A',
//               phone: engineerSnap.data().phone || 'N/A',
//             });
//           }
//         }

//         // Fetch assignment history
//         const assignmentQuery = query(
//           collection(db, 'ticket-assignments'),
//           where('ticketId', '==', ticketId),
//         );
//         const assignmentSnap = await getDocs(assignmentQuery);
//         const assignments = [];

//         for (const docSnap of assignmentSnap.docs) {
//           const data = docSnap.data();
//           let userName = 'N/A';
//           if (data.userId) {
//             const userRef = doc(db, 'users', data.userId);
//             const userSnap = await getDoc(userRef);
//             if (userSnap.exists()) {
//               userName = userSnap.data().displayName || 'N/A';
//             }
//           }
//           assignments.push({
//             id: docSnap.id,
//             userName,
//             roleName: data.roleName,
//             createdAt: data.createdAt,
//           });
//         }
//         assignments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         setAssignmentHistory(assignments);

//         // Fetch service engineer reviews
//         const reviewsQuery = query(
//           collection(db, 'ticket-staff-review'),
//           where('ticketId', '==', ticketId),
//         );
//         const reviewsSnap = await getDocs(reviewsQuery);
//         const reviewList = [];

//         for (const docSnap of reviewsSnap.docs) {
//           const data = docSnap.data();
//           let name = 'N/A';
//           if (data.userId) {
//             const userRef = doc(db, 'users', data.userId);
//             const userSnap = await getDoc(userRef);
//             if (userSnap.exists()) {
//               name = userSnap.data().displayName || 'N/A';
//             }
//           }
//           reviewList.push({
//             id: docSnap.id,
//             ...data,
//             name,
//           });
//         }
//         reviewList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         setEngineerReview(reviewList);
//       } catch (error) {
//         console.error('Error fetching details:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserAndTicketData();
//   }, [ticketId]);

//   // Real-time listener for ticket notes
//   useEffect(() => {
//     if (!ticketId) return;

//     const notesQuery = query(
//       collection(db, 'ticket-notes'),
//       where('ticketId', '==', ticketId),
//       orderBy('createdAt', 'desc')
//     );

//     const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
//       const notes = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setTicketNotes(notes);
//     }, (error) => {
//       console.error('Error fetching notes:', error);
//     });

//     return () => unsubscribe();
//   }, [ticketId]);

//   const updateField = async (field, value) => {
//     try {
//       const ticketRef = doc(db, 'tickets', ticketId);
//       await updateDoc(ticketRef, {
//         [field]: value,
//         updatedAt: new Date().toISOString(),
//       });

//       setTicket(prev => ({
//         ...prev,
//         [field]: value,
//         updatedAt: new Date().toISOString(),
//       }));

//       if (field === 'priority') {
//         setPriorityValue(value);
//       } else if (field === 'status') {
//         setStatusValue(value);
//       }
//     } catch (error) {
//       console.error(`Failed to update ${field}:`, error);
//     }
//   };

//   const handleSendReply = async () => {
//     if (!replyText.trim()) return;
//     setSendingReply(true);
//     try {
//       const engineerDocRef = doc(db, 'users', ticket.engineerId);
//       const engineerSnap = await getDoc(engineerDocRef);

//       let engineerName = 'Engineer';
//       if (engineerSnap.exists()) {
//         engineerName = engineerSnap.data().displayName || 'Engineer';
//       }

//       const ticketRef = doc(db, 'tickets', ticketId);
//       await updateDoc(ticketRef, {
//         replies: arrayUnion({
//           from: engineerName,
//           message: replyText,
//           timestamp: new Date().toISOString(),
//         }),
//       });

//       setReplyText('');
//     } catch (error) {
//       console.error('Error sending reply:', error);
//     } finally {
//       setSendingReply(false);
//     }
//   };

//   const handleSubmitReview = () => {
//     navigation.navigate('submitReviewForm', {
//       ticketId,
//       engineerName: engineer?.name,
//       engineerPhone: engineer?.phone,
//     });
//   };

//   const handleAddNoteToCollection = async () => {
//     if (!noteText.trim()) return;
//     setSendingNote(true);

//     try {
//       const auth = getAuth();
//       const currentUser = auth.currentUser;
//       if (!currentUser) throw new Error('No logged-in user found');

//       const userRef = doc(db, 'users', currentUser.uid);
//       const userSnap = await getDoc(userRef);
//       if (!userSnap.exists()) throw new Error('User not found');
//       const userData = userSnap.data();

//       let roleName = 'UNKNOWN';
//       if (userData.role) {
//         const roleRef = doc(db, 'roles', userData.role);
//         const roleSnap = await getDoc(roleRef);
//         if (roleSnap.exists()) {
//           roleName = roleSnap.data().roleName || 'UNKNOWN';
//         }
//       }

//       // Optimistic update: Add note to UI immediately
//       const tempNoteId = `temp-${Date.now()}`;
//       const newNote = {
//         id: tempNoteId,
//         createdAt: new Date().toISOString(),
//         noteMsg: noteText.trim(),
//         roleName: roleName,
//         ticketId: ticketId,
//         userId: currentUser.uid,
//         userName: userData.displayName || 'Unknown',
//       };
//       setTicketNotes(prev => [newNote, ...prev]);
//       setNoteText('');

//       // Add to Firestore
//       await addDoc(collection(db, 'ticket-notes'), newNote);
//     } catch (error) {
//       console.error('Error adding note:', error.message);
//       // Revert optimistic update on error
//       setTicketNotes(prev => prev.filter(note => note.id !== tempNoteId));
//       Alert.alert('Error', 'Failed to add note. Please try again.');
//     } finally {
//       setSendingNote(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#4a90e2" />
//       </View>
//     );
//   }

//   if (!ticket) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>Ticket not found.</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
//     >
//       {/* Ticket Card */}
//       <View style={styles.card}>
//         <Text style={styles.title}>{ticket.title || 'Untitled Ticket'}</Text>
//         <Text style={styles.date}>
//           Created At: {moment(ticket.createdAt).format('DD MMM YYYY hh:mm A') || 'N/A'}
//         </Text>
//         <Text style={styles.description}>
//           {ticket.description || 'No description available.'}
//         </Text>
//       </View>

//       {/* Complaint Details Card */}
//       <View style={styles.detailsCard}>
//         <Text style={styles.detailsCardTitle}>Complaint Details</Text>
//         <View style={styles.row}>
//           <Text style={styles.label}>Complainant Name:</Text>
//           <Text style={styles.value}>{ticket.complainee_name || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Complainant Phone:</Text>
//           <Text style={styles.value}>{ticket.complainee_number || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Ticket Creation:</Text>
//           <Text style={styles.value}>
//             {moment(ticket.createdAt).format('DD MMM YYYY hh:mm A') || 'N/A'}
//           </Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Last Activity:</Text>
//           <Text style={styles.value}>
//             {moment(ticket.updatedAt).format('DD MMM YYYY hh:mm A') || 'N/A'}
//           </Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Category:</Text>
//           <Text style={styles.value}>{ticket.category || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Priority:</Text>
//           <View style={{ flex: 1, zIndex: 10 }}>
//             <DropDownPicker
//               open={priorityOpen}
//               value={priorityValue}
//               items={priorityItems}
//               setOpen={setPriorityOpen}
//               setValue={callback => {
//                 const newValue = callback(priorityValue);
//                 setPriorityValue(newValue);
//                 updateField('priority', newValue);
//               }}
//               setItems={setPriorityItems}
//               placeholder="Select Priority"
//               containerStyle={{ height: 40, marginBottom: 30, width: 140 }}
//             />
//           </View>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Status:</Text>
//           <View style={{ flex: 1, zIndex: 5 }}>
//             <DropDownPicker
//               open={statusOpen}
//               value={statusValue}
//               items={statusItems}
//               setOpen={setStatusOpen}
//               setValue={callback => {
//                 const newValue = callback(statusValue);
//                 setStatusValue(newValue);
//                 updateField('status', newValue);
//               }}
//               setItems={setStatusItems}
//               placeholder="Select Status"
//               containerStyle={{ height: 40, marginBottom: 30, width: 140 }}
//             />
//           </View>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Address:</Text>
//           <Text style={styles.value}>
//             {ticket.complainee_address_1 || 'N/A'}, {ticket.complainee_city || 'N/A'},{' '}
//             {ticket.complainee_state || 'N/A'}, {ticket.complainee_pincode || 'N/A'}
//           </Text>
//         </View>
//       </View>

//       {/* Associated Details Card */}
//       <View style={styles.detailsCard}>
//         <Text style={styles.detailsCardTitle}>Associated Details</Text>
//         {associatedData ? (
//           <>
//             <View style={styles.row}>
//               <Text style={styles.label}>Customer Name:</Text>
//               <Text style={styles.value}>{associatedData.customerName || 'N/A'}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Customer Phone:</Text>
//               <Text style={styles.value}>{associatedData.mobileNumber || 'N/A'}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Model Number:</Text>
//               <Text style={styles.value}>{associatedData.modelNumber || 'N/A'}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Serial Number:</Text>
//               <Text style={styles.value}>{associatedData.serialNumber || 'N/A'}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Registration Date:</Text>
//               <Text style={styles.value}>
//                 {moment(associatedData.registeredAt).format('DD MMM YYYY hh:mm A') || 'N/A'}
//               </Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Warranty Period:</Text>
//               <Text style={styles.value}>{associatedData.warrantyPeriod || 'N/A'}</Text>
//             </View>
//           </>
//         ) : (
//           <Text style={styles.noDataText}>No associated product details found.</Text>
//         )}
//       </View>

//       {/* Conversations Card */}
//       <View style={styles.detailsCard}>
//         <Text style={styles.detailsCardTitle}>Conversations</Text>
//         <ScrollView
//           nestedScrollEnabled
//           style={{ maxHeight: 400 }}
//           showsVerticalScrollIndicator={false}
//         >
//           {ticket.replies && ticket.replies.length > 0 ? (
//             ticket.replies.map((reply, index) => (
//               <View key={index} style={styles.replyBubble}>
//                 <Text style={styles.replyFrom}>{reply.from || 'Unknown'}:</Text>
//                 <Text style={styles.replyMessage}>{reply.message || ''}</Text>
//                 <Text style={styles.replyTimestamp}>
//                   {moment(reply.timestamp).format('DD MMM YYYY hh:mm A') || ''}
//                 </Text>
//               </View>
//             ))
//           ) : (
//             <Text style={styles.noDataText}>No replies yet.</Text>
//           )}
//         </ScrollView>
//         <View style={styles.rowFull}>
//           <Text style={styles.labelFull}>Reply:</Text>
//           <TextInput
//             style={styles.textInput}
//             value={replyText}
//             onChangeText={setReplyText}
//             placeholder="Type your reply..."
//             editable={!sendingReply}
//             multiline
//           />
//         </View>
//         <TouchableOpacity
//           style={[styles.button, sendingReply && styles.buttonDisabled]}
//           onPress={handleSendReply}
//           disabled={sendingReply}
//         >
//           <Text style={styles.buttonText}>
//             {sendingReply ? 'Sending...' : 'Send Reply'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Submit Review Card */}
//       {currentUserId === ticket.engineerId && engineer && (
//         <View style={styles.detailsCard}>
//           <Text style={styles.detailsCardTitle}>Submit Review</Text>
//           <View style={styles.row}>
//             <Text style={styles.label}>Service Engineer:</Text>
//             <Text style={styles.value}>{engineer.name}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>Phone:</Text>
//             <Text style={styles.value}>{engineer.phone}</Text>
//           </View>
//           <TouchableOpacity style={styles.button} onPress={handleSubmitReview}>
//             <Text style={styles.buttonText}>Submit Review</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Service Engineer Review Card */}
//       {engineerReview.length > 0 && (
//         <View style={styles.detailsCard}>
//           <Text style={styles.detailsCardTitle}>Service Engineer Review</Text>
//           <ScrollView
//             nestedScrollEnabled
//             style={{ maxHeight: 400 }}
//             showsVerticalScrollIndicator={false}
//           >
//             {engineerReview.map((review, index) => (
//               <View key={review.id || index} style={styles.reviewBlock}>
//                 <View style={styles.reviewHeader}>
//                   <Text style={styles.engineerName}>{review.name}</Text>
//                   <View style={styles.badge}>
//                     <Text style={styles.badgeText}>{review.status || 'N/A'}</Text>
//                   </View>
//                   <Text style={styles.reviewDate}>
//                     {moment(review.createdAt).format('DD MMM YYYY hh:mm A')}
//                   </Text>
//                 </View>
//                 <Text style={styles.label}>Backup HRD Test:</Text>
//                 <Text style={styles.value}>{review.backup_hrd_test || 'N/A'}</Text>
//                 <Text style={styles.label}>Faulty Cell Fault Observed:</Text>
//                 <Text style={styles.value}>{review.faulty_cell_fault_observe || 'N/A'}</Text>
//                 <Text style={styles.label}>Remarks:</Text>
//                 <Text style={styles.value}>{review.remarks || 'N/A'}</Text>
//                 <Text style={styles.label}>Battery Status:</Text>
//                 <View style={[styles.badge, { marginTop: 4, alignSelf: 'flex-start' }]}>
//                   <Text style={styles.badgeText}>{review.battery_status || 'N/A'}</Text>
//                 </View>
//                 {index < engineerReview.length - 1 && <View style={{ height: 20 }} />}
//               </View>
//             ))}
//           </ScrollView>
//         </View>
//       )}

//       {/* Ticket Notes Card */}
//       <View style={styles.detailsCard}>
//         <Text style={styles.detailsCardTitle}>Ticket Notes</Text>
//         {ticketNotes.length === 0 ? (
//           <Text style={styles.noDataText}>No notes added yet.</Text>
//         ) : (
//           ticketNotes.map(note => (
//             <View key={note.id} style={styles.noteCard}>
//               <View style={styles.noteHeader}>
//                 <Text style={styles.noteUser}>{note.userName}</Text>
//                 <Text style={styles.noteRole}>{note.roleName}</Text>
//                 <Text style={styles.noteTime}>
//                   {moment(note.createdAt).format('DD-MMM-YYYY hh:mm A')}
//                 </Text>
//               </View>
//               <Text style={styles.noteMessage}>{note.noteMsg}</Text>
//             </View>
//           ))
//         )}
//         <View style={styles.rowFull}>
//           <Text style={styles.labelFull}>Note:</Text>
//           <TextInput
//             style={styles.textInput}
//             value={noteText}
//             onChangeText={setNoteText}
//             placeholder="Enter your note..."
//             editable={!sendingNote}
//             multiline
//           />
//         </View>
//         <TouchableOpacity
//           style={[styles.button, sendingNote && styles.buttonDisabled]}
//           onPress={handleAddNoteToCollection}
//           disabled={sendingNote}
//         >
//           <Text style={styles.buttonText}>
//             {sendingNote ? 'Saving...' : 'Add Note'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Assignment History Card */}
//       {assignmentHistory.length > 0 && (
//         <View style={styles.detailsCard}>
//           <Text style={styles.detailsCardTitle}>Assignment History</Text>
//           <View
//             style={[styles.row, { borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 6 }]}
//           >
//             <Text style={[styles.label, { fontWeight: 'bold' }]}>Assigned To</Text>
//             <Text style={[styles.value, { fontWeight: 'bold' }]}>Assigned At</Text>
//           </View>
//           {assignmentHistory.map(entry => (
//             <View key={entry.id} style={styles.row}>
//               <Text style={styles.label}>
//                 {entry.userName} <Text style={styles.roleBadge}>{entry.roleName}</Text>
//               </Text>
//               <Text style={styles.value}>
//                 {moment(entry.createdAt).format('DD-MM-YYYY HH:mm A')}
//               </Text>
//             </View>
//           ))}
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f6f6f6', padding: 10 },
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   errorText: { color: 'red', fontSize: 18, textAlign: 'center' },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//     marginBottom: 10,
//   },
//   title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
//   date: { fontSize: 14, color: '#555', marginBottom: 12 },
//   description: { fontSize: 16, color: '#444' },
//   detailsCard: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   detailsCardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     paddingBottom: 5,
//   },
//   replyBubble: {
//     backgroundColor: '#f0f4ff',
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   replyFrom: {
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 2,
//   },
//   replyMessage: {
//     color: '#444',
//     marginBottom: 4,
//   },
//   replyTimestamp: {
//     fontSize: 12,
//     color: '#888',
//     textAlign: 'right',
//   },
//   row: { flexDirection: 'row', marginBottom: 10, flexWrap: 'wrap' },
//   label: { fontWeight: '600', color: '#555', width: '50%', fontSize: 14 },
//   value: { color: '#333', width: '50%', fontSize: 14 },
//   rowFull: { marginBottom: 10 },
//   labelFull: {
//     fontWeight: '600',
//     color: '#555',
//     fontSize: 14,
//     marginBottom: 5,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 6,
//     padding: 10,
//     fontSize: 14,
//     backgroundColor: '#fff',
//     minHeight: 60,
//     textAlignVertical: 'top',
//   },
//   button: {
//     backgroundColor: '#4a90e2',
//     paddingVertical: 12,
//     borderRadius: 6,
//     alignItems: 'center',
//   },
//   buttonDisabled: {
//     backgroundColor: '#a0c4ff',
//   },
//   buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
//   noDataText: { fontSize: 14, color: '#888', textAlign: 'center' },
//   noteCard: {
//     backgroundColor: '#e9edf4',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 10,
//   },
//   noteHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//     flexWrap: 'wrap',
//   },
//   noteUser: {
//     fontWeight: 'bold',
//     fontSize: 14,
//     marginRight: 8,
//   },
//   noteRole: {
//     backgroundColor: '#4a90e2',
//     color: '#fff',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 6,
//     fontSize: 12,
//     fontWeight: '600',
//     marginRight: 'auto',
//   },
//   noteTime: {
//     fontSize: 12,
//     color: '#555',
//     marginLeft: 'auto',
//   },
//   noteMessage: {
//     fontSize: 14,
//     color: '#333',
//     lineHeight: 20,
//   },
//   roleBadge: {
//     backgroundColor: '#4a90e2',
//     color: '#fff',
//     borderRadius: 6,
//     fontSize: 12,
//     fontWeight: '600',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//   },
//   reviewHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//     flexWrap: 'wrap',
//   },
//   engineerName: {
//     fontWeight: 'bold',
//     color: '#344563',
//     fontSize: 16,
//   },
//   reviewDate: {
//     color: '#6b6b6b',
//     fontSize: 13,
//   },
//   badge: {
//     backgroundColor: '#4a90e2',
//     borderRadius: 12,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     marginLeft: 8,
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
// });



// Updated Code 
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { TextInput } from 'react-native-gesture-handler';
import { db } from '../../../firebase';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function TicketDetailsScreen({ route }) {
  const ticketId = route?.params?.ticketId;
  const [ticket, setTicket] = useState(null);
  const [associatedData, setAssociatedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [engineer, setEngineer] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [sendingNote, setSendingNote] = useState(false);
  const [ticketNotes, setTicketNotes] = useState([]);
  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [engineerReview, setEngineerReview] = useState([]);
  const navigation = useNavigation();

  const [priorityOpen, setPriorityOpen] = useState(false);
  const [priorityValue, setPriorityValue] = useState(null);
  const [priorityItems, setPriorityItems] = useState([
    { label: 'Low', value: 'LOW' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'High', value: 'HIGH' },
    { label: 'Urgent', value: 'URGENT' },
  ]);

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState(null);
  const [statusItems, setStatusItems] = useState([
    { label: 'OPEN', value: 'OPEN' },
    { label: 'IN PROGRESS', value: 'IN_PROGRESS' },
    { label: 'CLOSED', value: 'CLOSED' },
  ]);

  useEffect(() => {
    const fetchUserAndTicketData = async () => {
      try {
        setLoading(true);
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          setCurrentUserId(currentUser.uid);
        }

        const ticketRef = doc(db, 'tickets', ticketId);
        const ticketSnap = await getDoc(ticketRef);
        if (!ticketSnap.exists()) {
          console.error('Ticket not found');
          return;
        }

        const ticketData = { id: ticketSnap.id, ...ticketSnap.data() };
        setTicket(ticketData);
        setPriorityValue(ticketData.priority || null);
        setStatusValue(ticketData.status || null);

        const key = `${ticketData.modelId}_${ticketData.serialNumber}`;
        const productRef = doc(db, 'products', key);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setAssociatedData({ id: productSnap.id, ...productSnap.data() });
        }

        if (ticketData.engineerId) {
          const engineerRef = doc(db, 'users', ticketData.engineerId);
          const engineerSnap = await getDoc(engineerRef);
          if (engineerSnap.exists()) {
            setEngineer({
              name: engineerSnap.data().displayName || 'N/A',
              phone: engineerSnap.data().phone || 'N/A',
            });
          }
        }

        const assignmentQuery = query(
          collection(db, 'ticket-assignments'),
          where('ticketId', '==', ticketId),
        );
        const assignmentSnap = await getDocs(assignmentQuery);
        const assignments = [];
        for (const docSnap of assignmentSnap.docs) {
          const data = docSnap.data();
          let userName = 'N/A';
          if (data.userId) {
            const userRef = doc(db, 'users', data.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              userName = userSnap.data().displayName || 'N/A';
            }
          }
          assignments.push({
            id: docSnap.id,
            userName,
            roleName: data.roleName,
            createdAt: data.createdAt,
          });
        }
        assignments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAssignmentHistory(assignments);

        const reviewsQuery = query(
          collection(db, 'ticket-staff-review'),
          where('ticketId', '==', ticketId),
        );
        const reviewsSnap = await getDocs(reviewsQuery);
        const reviewList = [];
        for (const docSnap of reviewsSnap.docs) {
          const data = docSnap.data();
          let name = 'N/A';
          if (data.userId) {
            const userRef = doc(db, 'users', data.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              name = userSnap.data().displayName || 'N/A';
            }
          }
          reviewList.push({
            id: docSnap.id,
            ...data,
            name,
          });
        }
        reviewList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setEngineerReview(reviewList);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndTicketData();
  }, [ticketId]);

  useEffect(() => {
    if (!ticketId) return;

    const notesQuery = query(
      collection(db, 'ticket-notes'),
      where('ticketId', '==', ticketId)
    );

    const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
      const notes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Manually sort by createdAt in descending order
      notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTicketNotes(notes);
    }, (error) => {
      console.error('Error fetching notes:', error);
    });

    return () => unsubscribe();
  }, [ticketId]);

  const updateField = async (field, value) => {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, {
        [field]: value,
        updatedAt: new Date().toISOString(),
      });

      setTicket(prev => ({
        ...prev,
        [field]: value,
        updatedAt: new Date().toISOString(),
      }));

      if (field === 'priority') {
        setPriorityValue(value);
      } else if (field === 'status') {
        setStatusValue(value);
      }
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      const engineerDocRef = doc(db, 'users', ticket.engineerId);
      const engineerSnap = await getDoc(engineerDocRef);

      let engineerName = 'Engineer';
      if (engineerSnap.exists()) {
        engineerName = engineerSnap.data().displayName || 'Engineer';
      }

      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, {
        replies: arrayUnion({
          from: engineerName,
          message: replyText,
          timestamp: new Date().toISOString(),
        }),
      });

      setReplyText('');
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSendingReply(false);
    }
  };

  const handleSubmitReview = () => {
    navigation.navigate('SubmitReviewForm', {
      ticketId,
      engineerName: engineer?.name,
      engineerPhone: engineer?.phone,
    });
  };

  const handleAddNoteToCollection = async () => {
    if (!noteText.trim()) return;
    setSendingNote(true);

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No logged-in user found');

      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) throw new Error('User not found');
      const userData = userSnap.data();

      let roleName = 'UNKNOWN';
      if (userData.role) {
        const roleRef = doc(db, 'roles', userData.role);
        const roleSnap = await getDoc(roleRef);
        if (roleSnap.exists()) {
          roleName = roleSnap.data().roleName || 'UNKNOWN';
        }
      }

      const tempNoteId = `temp-${Date.now()}`;
      const newNote = {
        id: tempNoteId,
        createdAt: new Date().toISOString(),
        noteMsg: noteText.trim(),
        roleName: roleName,
        ticketId: ticketId,
        userId: currentUser.uid,
        userName: userData.displayName || 'Unknown',
      };
      setTicketNotes(prev => [newNote, ...prev]);
      setNoteText('');

      await addDoc(collection(db, 'ticket-notes'), newNote);
    } catch (error) {
      console.error('Error adding note:', error.message);
      setTicketNotes(prev => prev.filter(note => note.id !== `temp-${Date.now()}`));
      Alert.alert('Error', 'Failed to add note. Please try again.');
    } finally {
      setSendingNote(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Ticket not found.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    if (item.type === 'ticket') {
      return (
        <View style={styles.card}>
          <Text style={styles.title}>{ticket.title || 'Untitled Ticket'}</Text>
          <Text style={styles.subtitle}>
            Created At: {moment(ticket.createdAt).format('DD MMM YYYY hh:mm A') || 'N/A'}
          </Text>
          <Text style={styles.description}>
            {ticket.description || 'No description available.'}
          </Text>
        </View>
      );
    }
    if (item.type === 'complaint') {
      return (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Complaint Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Complainant Name:</Text>
            <Text style={styles.value}>{ticket.complainee_name || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Complainant Phone:</Text>
            <Text style={styles.value}>{ticket.complainee_number || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Ticket Creation:</Text>
            <Text style={styles.value}>
              {moment(ticket.createdAt).format('DD MMM YYYY hh:mm A') || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Last Activity:</Text>
            <Text style={styles.value}>
              {moment(ticket.updatedAt).format('DD MMM YYYY hh:mm A') || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{ticket.category || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Priority:</Text>
            <View style={[styles.dropdownContainer, { zIndex: 1000 }]}>
              <DropDownPicker
                open={priorityOpen}
                value={priorityValue}
                items={priorityItems}
                setOpen={setPriorityOpen}
                setValue={callback => {
                  const newValue = callback(priorityValue);
                  setPriorityValue(newValue);
                  updateField('priority', newValue);
                }}
                setItems={setPriorityItems}
                placeholder="Select Priority"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownList}
                placeholderStyle={styles.placeholder}
                textStyle={styles.dropdownText}
              />
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Status:</Text>
            <View style={[styles.dropdownContainer, { zIndex: 1000 }]}>
              <DropDownPicker
                open={statusOpen}
                value={statusValue}
                items={statusItems}
                setOpen={setStatusOpen}
                setValue={callback => {
                  const newValue = callback(statusValue);
                  setStatusValue(newValue);
                  updateField('status', newValue);
                }}
                setItems={setStatusItems}
                placeholder="Select Status"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownList}
                placeholderStyle={styles.placeholder}
                textStyle={styles.dropdownText}
              />
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>
              {ticket.complainee_address_1 || 'N/A'}, {ticket.complainee_city || 'N/A'},{' '}
              {ticket.complainee_state || 'N/A'}, {ticket.complainee_pincode || 'N/A'}
            </Text>
          </View>
        </View>
      );
    }
    if (item.type === 'associated') {
      return (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Associated Details</Text>
          {associatedData ? (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Customer Name:</Text>
                <Text style={styles.value}>{associatedData.customerName || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Customer Phone:</Text>
                <Text style={styles.value}>{associatedData.mobileNumber || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Model Number:</Text>
                <Text style={styles.value}>{associatedData.modelNumber || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Serial Number:</Text>
                <Text style={styles.value}>{associatedData.serialNumber || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Registration Date:</Text>
                <Text style={styles.value}>
                  {moment(associatedData.registeredAt).format('DD MMM YYYY hh:mm A') || 'N/A'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Warranty Period:</Text>
                <Text style={styles.value}>{associatedData.warrantyPeriod || 'N/A'}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.noDataText}>No associated product details found.</Text>
          )}
        </View>
      );
    }
    if (item.type === 'conversations') {
      return (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Conversations</Text>
          <ScrollView
            nestedScrollEnabled
            style={styles.scrollableSection}
            showsVerticalScrollIndicator={false}
          >
            {ticket.replies && ticket.replies.length > 0 ? (
              ticket.replies.map((reply, index) => (
                <View key={index} style={styles.replyBubble}>
                  <Text style={styles.replyFrom}>{reply.from || 'Unknown'}:</Text>
                  <Text style={styles.replyMessage}>{reply.message || ''}</Text>
                  <Text style={styles.replyTimestamp}>
                    {moment(reply.timestamp).format('DD MMM YYYY hh:mm A') || ''}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No replies yet.</Text>
            )}
          </ScrollView>
          <View style={styles.inputRow}>
            <Text style={styles.labelFull}>Reply:</Text>
            <TextInput
              style={styles.textInput}
              value={replyText}
              onChangeText={setReplyText}
              placeholder="Type your reply..."
              editable={!sendingReply}
              multiline
            />
          </View>
          <TouchableOpacity
            style={[styles.button, sendingReply && styles.buttonDisabled]}
            onPress={handleSendReply}
            disabled={sendingReply}
          >
            <Text style={styles.buttonText}>
              {sendingReply ? 'Sending...' : 'Send Reply'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (item.type === 'submitReview' && currentUserId === ticket.engineerId && engineer) {
      return (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Submit Review</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Service Engineer:</Text>
            <Text style={styles.value}>{engineer.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{engineer.phone}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmitReview}>
            <Text style={styles.buttonText}>Submit Review</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (item.type === 'engineerReview' && engineerReview.length > 0) {
      return (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Service Engineer Review</Text>
          <ScrollView
            nestedScrollEnabled
            style={styles.scrollableSection}
            showsVerticalScrollIndicator={false}
          >
            {engineerReview.map((review, index) => (
              <View key={review.id || index} style={styles.reviewBlock}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.engineerName}>{review.name}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{review.status || 'N/A'}</Text>
                  </View>
                  <Text style={styles.reviewDate}>
                    {moment(review.createdAt).format('DD MMM YYYY hh:mm A')}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Backup HRD Test:</Text>
                  <Text style={styles.value}>{review.backup_hrd_test || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Faulty Cell Fault Observed:</Text>
                  <Text style={styles.value}>{review.faulty_cell_fault_observe || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Remarks:</Text>
                  <Text style={styles.value}>{review.remarks || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Battery Status:</Text>
                  <View style={[styles.badge, { alignSelf: 'flex-start' }]}>
                    <Text style={styles.badgeText}>{review.battery_status || 'N/A'}</Text>
                  </View>
                </View>
                {index < engineerReview.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </ScrollView>
        </View>
      );
    }
    if (item.type === 'ticketNotes') {
      return (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ticket Notes</Text>
          {ticketNotes.length === 0 ? (
            <Text style={styles.noDataText}>No notes added yet.</Text>
          ) : (
            ticketNotes.map(note => (
              <View key={note.id} style={styles.noteCard}>
                <View style={styles.noteHeader}>
                  <Text style={styles.noteUser}>{note.userName}</Text>
                  <Text style={styles.noteRole}>{note.roleName}</Text>
                  <Text style={styles.noteTime}>
                    {moment(note.createdAt).format('DD-MMM-YYYY hh:mm A')}
                  </Text>
                </View>
                <Text style={styles.noteMessage}>{note.noteMsg}</Text>
              </View>
            ))
          )}
          <View style={styles.inputRow}>
            <Text style={styles.labelFull}>Note:</Text>
            <TextInput
              style={styles.textInput}
              value={noteText}
              onChangeText={setNoteText}
              placeholder="Enter your note..."
              editable={!sendingNote}
              multiline
            />
          </View>
          <TouchableOpacity
            style={[styles.button, sendingNote && styles.buttonDisabled]}
            onPress={handleAddNoteToCollection}
            disabled={sendingNote}
          >
            <Text style={styles.buttonText}>
              {sendingNote ? 'Saving...' : 'Add Note'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (item.type === 'assignmentHistory' && assignmentHistory.length > 0) {
      return (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Assignment History</Text>
          <View style={[styles.detailRow, styles.headerRow]}>
            <Text style={[styles.label, styles.headerText]}>Assigned To</Text>
            <Text style={[styles.value, styles.headerText]}>Assigned At</Text>
          </View>
          {assignmentHistory.map(entry => (
            <View key={entry.id} style={styles.detailRow}>
              <Text style={styles.label}>
                {entry.userName}{' '}
                {entry.roleName === 'Service Engineer' ? (
                  <Text style={[styles.roleBadge, styles.engineerBadge]}>{entry.roleName}</Text>
                ) : (
                  <Text style={[styles.roleBadge, styles.staffBadge]}>{entry.roleName}</Text>
                )}
              </Text>
              <Text style={styles.value}>
                {moment(entry.createdAt).format('DD-MM-YYYY HH:mm A')}
              </Text>
            </View>
          ))}
        </View>
      );
    }
    return null;
  };

  const data = [
    { type: 'ticket', key: 'ticket' },
    { type: 'complaint', key: 'complaint' },
    { type: 'associated', key: 'associated' },
    { type: 'conversations', key: 'conversations' },
    ...(currentUserId === ticket.engineerId && engineer ? [{ type: 'submitReview', key: 'submitReview' }] : []),
    ...(engineerReview.length > 0 ? [{ type: 'engineerReview', key: 'engineerReview' }] : []),
    { type: 'ticketNotes', key: 'ticketNotes' },
    ...(assignmentHistory.length > 0 ? [{ type: 'assignmentHistory', key: 'assignmentHistory' }] : []),
  ];

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.key}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  headerRow: {
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    width: '40%',
    marginRight: 16,
  },
  value: {
    fontSize: 16,
    color: '#4b5563',
    width: '60%',
    flexWrap: 'wrap',
  },
  headerText: {
    fontWeight: '600',
    color: '#1e293b',
  },
  dropdownContainer: {
    flex: 1,
  },
  dropdown: {
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  dropdownList: {
    borderColor: '#e5e7eb',
    borderRadius: 8,
    zIndex: 2000, // Increased zIndex to ensure dropdown appears above other elements
  },
  placeholder: {
    color: '#9ca3af',
    fontSize: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: '#374151',
  },
  inputRow: {
    marginBottom: 16,
  },
  labelFull: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  noDataText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 12,
  },
  replyBubble: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  replyFrom: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  replyMessage: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 8,
  },
  replyTimestamp: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
  },
  noteCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  noteUser: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginRight: 12,
  },
  noteRole: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  noteTime: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 'auto',
  },
  noteMessage: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  roleBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  engineerBadge: {
    backgroundColor: '#10b981',
    color: '#ffffff',
  },
  staffBadge: {
    backgroundColor: '#f59e0b',
    color: '#ffffff',
  },
  reviewBlock: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  engineerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  reviewDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  badge: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollableSection: {
    maxHeight: 400,
    marginBottom: 16,
  },
  separator: {
    height: 12,
  },
});