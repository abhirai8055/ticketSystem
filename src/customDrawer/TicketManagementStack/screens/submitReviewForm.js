// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   FlatList,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import DropDownPicker from 'react-native-dropdown-picker';
// import { getDoc, doc, addDoc, collection } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { db } from '../../../firebase';

// export default function SubmitReviewForm() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const ticketId = route?.params?.ticketId;

//   const [ticket, setTicket] = useState(null);
//   const [user, setUser] = useState(null);

//   const [backupHrdTest, setBackupHrdTest] = useState('');
//   const [faultyCell, setFaultyCell] = useState('');
//   const [decision, setDecision] = useState('');
//   const [remarks, setRemarks] = useState('');
//   const [workStatus, setWorkStatus] = useState(null);
//   const [batteryStatus, setBatteryStatus] = useState(null);

//   const [workStatusOpen, setWorkStatusOpen] = useState(false);
//   const [batteryStatusOpen, setBatteryStatusOpen] = useState(false);

//   const [workStatusError, setWorkStatusError] = useState('');
//   const [batteryStatusError, setBatteryStatusError] = useState('');

//   const workStatusOptions = [
//     { label: 'Pending', value: 'pending' },
//     { label: 'Started', value: 'started' },
//     { label: 'Completed', value: 'completed' },
//   ];

//   const batteryStatusOptions = [
//     { label: 'Healthy', value: 'healthy' },
//     { label: 'Faulty', value: 'faulty' },
//     { label: 'Discharged', value: 'discharged' },
//   ];

//   // export const updateRegistrationStatus = async (
//   //   data: Partial<ProductRegistration>,
//   // ) => {
//   //   try {
//   //     if (!data.modelNumber) {
//   //       throw new Error('Model number is required');
//   //     }
//   //     if (!data.serialNumber) {
//   //       throw new Error('Serial number is required');
//   //     }
//   //     const productRef = doc(
//   //       db,
//   //       'products',
//   //       `${data.modelNumber}_${data.serialNumber}`,
//   //     );
//   //     const result = {
//   //       status: data.status,
//   //     };
 
//   //     await updateDoc(productRef, result);
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch ticket details
//         const ticketRef = doc(db, 'tickets', ticketId);
//         const ticketSnap = await getDoc(ticketRef);
//         if (ticketSnap.exists()) {
//           setTicket({ id: ticketSnap.id, ...ticketSnap.data() });
//         }

//         // Fetch current user details
//         const auth = getAuth();
//         const currentUser = auth.currentUser;
//         if (currentUser) {
//           const userRef = doc(db, 'users', currentUser.uid);
//           const userSnap = await getDoc(userRef);
//           if (userSnap.exists()) {
//             const userData = userSnap.data();
//             setUser({
//               id: userSnap.id,
//               name: userData.displayName || 'N/A',
//               roleName: userData.roleName || 'N/A',
//             });
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchData();
//   }, [ticketId]);

//   const handleSubmit = async () => {
//     setWorkStatusError('');
//     setBatteryStatusError('');

//     if (!workStatus) setWorkStatusError('Work Status is required');
//     if (!batteryStatus) setBatteryStatusError('Battery Status is required');

//     if (workStatus && batteryStatus) {
//       try {
//         const reviewData = {
//           ticketId: ticket?.id,
//           backupHrdTest,
//           faultyCellObserved: faultyCell,
//           decision,
//           remarks,
//           workStatus,
//           batteryStatus,
//           createdAt: new Date().toISOString(),
//           userId: user?.id,
//           userName: user?.name,
//           roleName: user?.roleName,
//         };

//         await addDoc(collection(db, 'ticket-staff-review'), reviewData);

//         Alert.alert('Success', 'Review submitted successfully');
//         navigation.navigate('ticketDetails', { ticketId });
//       } catch (error) {
//         console.error('Error submitting review:', error);
//         Alert.alert('Error', 'Failed to submit review');
//       }
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.heading}>Submit Ticket Review</Text>
//       <Text style={styles.ticketId}>
//         Ticket-Id: {ticket?.id || 'Loading...'}
//       </Text>

//       <Text style={styles.label}>Backup HRD Test</Text>
//       <TextInput
//         style={styles.input}
//         value={backupHrdTest}
//         onChangeText={setBackupHrdTest}
//         placeholder="Enter backup HRD test details"
//         multiline
//       />

//       <Text style={styles.label}>Faulty Cell Observed</Text>
//       <TextInput
//         style={styles.input}
//         value={faultyCell}
//         onChangeText={setFaultyCell}
//         placeholder="Enter faulty cell observed"
//         multiline
//       />

//       <Text style={styles.label}>Decision</Text>
//       <TextInput
//         style={styles.input}
//         value={decision}
//         onChangeText={setDecision}
//         placeholder="Enter decision"
//         multiline
//       />

//       <Text style={styles.label}>Remarks</Text>
//       <TextInput
//         style={styles.input}
//         value={remarks}
//         onChangeText={setRemarks}
//         placeholder="Enter remarks"
//         multiline
//       />

//       <View style={styles.dropdownContainer}>
//         <View style={styles.dropdownBox}>
//           <Text style={styles.label}>Work Status</Text>
//           <DropDownPicker
//             open={workStatusOpen}
//             value={workStatus}
//             items={workStatusOptions}
//             setOpen={setWorkStatusOpen}
//             setValue={setWorkStatus}
//             placeholder="Select work status"
//             style={styles.dropdown}
//             dropDownContainerStyle={{ borderColor: '#ccc' }}
//             zIndex={3000}
//           />
//           {workStatusError ? (
//             <Text style={styles.errorText}>{workStatusError}</Text>
//           ) : null}
//         </View>

//         <View style={styles.dropdownBox}>
//           <Text style={styles.label}>Battery Status</Text>
//           <DropDownPicker
//             open={batteryStatusOpen}
//             value={batteryStatus}
//             items={batteryStatusOptions}
//             setOpen={setBatteryStatusOpen}
//             setValue={setBatteryStatus}
//             placeholder="Select battery status"
//             style={styles.dropdown}
//             dropDownContainerStyle={{ borderColor: '#ccc' }}
//             zIndex={2000}
//           />
//           {batteryStatusError ? (
//             <Text style={styles.errorText}>{batteryStatusError}</Text>
//           ) : null}
//         </View>
//       </View>

//       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>Submit Review</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 20,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#344563',
//     marginBottom: 10,
//   },
//   ticketId: {
//     marginBottom: 15,
//     color: '#0077cc',
//     fontWeight: '600',
//   },
//   label: {
//     marginBottom: 6,
//     fontWeight: '600',
//     color: '#333',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 6,
//     padding: 10,
//     marginBottom: 15,
//     backgroundColor: '#f9f9f9',
//   },
//   dropdownContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//     flexWrap: 'wrap',
//   },
//   dropdownBox: {
//     width: '48%',
//     zIndex: 3000,
//   },
//   dropdown: {
//     backgroundColor: '#f9f9f9',
//     borderColor: '#ccc',
//     borderRadius: 6,
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     marginTop: 4,
//   },
//   button: {
//     backgroundColor: '#4a90e2',
//     paddingVertical: 14,
//     borderRadius: 6,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });
















import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getDoc, doc, addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../../firebase';

export default function SubmitReviewForm() {
  const navigation = useNavigation();
  const route = useRoute();
  const ticketId = route?.params?.ticketId;

  const [ticket, setTicket] = useState(null);
  const [user, setUser] = useState(null);

  const [backupHrdTest, setBackupHrdTest] = useState('');
  const [faultyCell, setFaultyCell] = useState('');
  const [decision, setDecision] = useState('');
  const [remarks, setRemarks] = useState('');
  const [workStatus, setWorkStatus] = useState(null);
  const [batteryStatus, setBatteryStatus] = useState(null);

  const [workStatusOpen, setWorkStatusOpen] = useState(false);
  const [batteryStatusOpen, setBatteryStatusOpen] = useState(false);

  const [workStatusError, setWorkStatusError] = useState('');
  const [batteryStatusError, setBatteryStatusError] = useState('');

  const workStatusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Started', value: 'started' },
    { label: 'Completed', value: 'completed' },
  ];

  const batteryStatusOptions = [
    { label: 'Healthy', value: 'healthy' },
    { label: 'Faulty', value: 'faulty' },
    { label: 'Discharged', value: 'discharged' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketRef = doc(db, 'tickets', ticketId);
        const ticketSnap = await getDoc(ticketRef);
        if (ticketSnap.exists()) {
          setTicket({ id: ticketSnap.id, ...ticketSnap.data() });
        }

        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUser({
              id: userSnap.id,
              name: userData.displayName || 'N/A',
              roleName: userData.roleName || 'N/A',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchData();
  }, [ticketId]);

  const handleSubmit = async () => {
    setWorkStatusError('');
    setBatteryStatusError('');

    if (!workStatus) setWorkStatusError('Work Status is required');
    if (!batteryStatus) setBatteryStatusError('Battery Status is required');

    if (workStatus && batteryStatus) {
      try {
        const reviewData = {
          ticketId: ticket?.id,
          backupHrdTest,
          faultyCellObserved: faultyCell,
          decision,
          remarks,
          workStatus,
          batteryStatus,
          createdAt: new Date().toISOString(),
          userId: user?.id,
          userName: user?.name,
          roleName: user?.roleName,
        };

        await addDoc(collection(db, 'ticket-staff-review'), reviewData);

        Alert.alert('Success', 'Review submitted successfully');
        navigation.navigate('TicketDetails', { ticketId });
      } catch (error) {
        console.error('Error submitting review:', error);
        Alert.alert('Error', 'Failed to submit review');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Submit Ticket Review</Text>
      <Text style={styles.ticketId}>
        Ticket-Id: {ticket?.id || 'Loading...'}
      </Text>

      <Text style={styles.label}>Backup HRD Test</Text>
      <TextInput
        style={styles.input}
        value={backupHrdTest}
        onChangeText={setBackupHrdTest}
        placeholder="Enter backup HRD test details"
        multiline
      />

      <Text style={styles.label}>Faulty Cell Observed</Text>
      <TextInput
        style={styles.input}
        value={faultyCell}
        onChangeText={setFaultyCell}
        placeholder="Enter faulty cell observed"
        multiline
      />

      <Text style={styles.label}>Decision</Text>
      <TextInput
        style={styles.input}
        value={decision}
        onChangeText={setDecision}
        placeholder="Enter decision"
        multiline
      />

      <Text style={styles.label}>Remarks</Text>
      <TextInput
        style={styles.input}
        value={remarks}
        onChangeText={setRemarks}
        placeholder="Enter remarks"
        multiline
      />

      <View style={styles.dropdownContainer}>
        <View style={styles.dropdownBox}>
          <Text style={styles.label}>Work Status</Text>
          <DropDownPicker
            open={workStatusOpen}
            value={workStatus}
            items={workStatusOptions}
            setOpen={setWorkStatusOpen}
            setValue={setWorkStatus}
            placeholder="Select work status"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownList}
            zIndex={3000}
          />
          {workStatusError ? (
            <Text style={styles.errorText}>{workStatusError}</Text>
          ) : null}
        </View>

        <View style={styles.dropdownBox}>
          <Text style={styles.label}>Battery Status</Text>
          <DropDownPicker
            open={batteryStatusOpen}
            value={batteryStatus}
            items={batteryStatusOptions}
            setOpen={setBatteryStatusOpen}
            setValue={setBatteryStatus}
            placeholder="Select battery status"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownList}
            zIndex={2000}
          />
          {batteryStatusError ? (
            <Text style={styles.errorText}>{batteryStatusError}</Text>
          ) : null}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Review</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#344563',
    marginBottom: 10,
  },
  ticketId: {
    marginBottom: 15,
    color: '#0077cc',
    fontWeight: '600',
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  dropdownBox: {
    width: '48%',
    marginBottom: 15,
  },
  dropdown: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ccc',
    borderRadius: 6,
  },
  dropdownList: {
    borderColor: '#ccc',
    borderRadius: 6,
    zIndex: 2000,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});