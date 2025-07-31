// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Dimensions,
//   ScrollView,
//   ActivityIndicator,
//   StyleSheet,
//   Image,
// } from 'react-native';
// import { LineChart, PieChart } from 'react-native-chart-kit';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import DropDownPicker from 'react-native-dropdown-picker';
// import { db } from '../firebase';

// const STATUSES = [
//   { label: 'Last Day', value: 1 },
//   { label: 'Last 7 Days', value: 7 },
//   { label: 'Last 15 Days', value: 15 },
//   { label: 'Last 30 Days', value: 30 },
// ];

// const STATUSESYEARS = [
//   { label: 'This Day', value: 1 },
//   { label: 'This Weeks', value: 7 },
//   { label: 'This Months', value: 15 },
//   { label: 'This years', value: 30 },
// ];

// export default function DashboardScreen() {
//   const [loading, setLoading] = useState(true);
//   const [currentUserId, setCurrentUserId] = useState(null);

//   const [openCount, setOpenCount] = useState(0);
//   const [openLabels, setOpenLabels] = useState([]);
//   const [openData, setOpenData] = useState([]);

//   const [inProgressCount, setInProgressCount] = useState(0);
//   const [inProgressLabels, setInProgressLabels] = useState([]);
//   const [inProgressData, setInProgressData] = useState([]);

//   const [closedCount, setClosedCount] = useState(0);
//   const [closedLabels, setClosedLabels] = useState([]);
//   const [closedData, setClosedData] = useState([]);

//   const [myTicketCount, setMyTicketCount] = useState(0);
//   const [myTicketLabels, setMyTicketLabels] = useState([]);
//   const [myTicketData, setMyTicketData] = useState([]);

//   const [newTicketCount, setNewTicketCount] = useState(0);
//   const [newTicketLabels, setNewTicketLabels] = useState([]);
//   const [newTicketData, setNewTicketData] = useState([]);

//   const [respLabels, setRespLabels] = useState([]);
//   const [respData, setRespData] = useState([]);
//   const [respDays, setRespDays] = useState(7);
//   const [respOpen, setRespOpen] = useState(false);

//   const [resLabels, setResLabels] = useState([]);
//   const [resData, setResData] = useState([]);
//   const [resDays, setResDays] = useState(7);
//   const [resOpen, setResOpen] = useState(false);

//   const [satisOpen, setSatisOpen] = useState(false);
//   const [satisDays, setSatisDays] = useState(7);
//   const [satisData, setSatisData] = useState([]);
//   const [satisDataCategory, setSatisDataCategory] = useState([]);

//   const [priorityLabels, setPriorityLabels] = useState([]);
//   const [priorityData, setPriorityData] = useState({
//     Low: [],
//     Medium: [],
//     High: [],
//     Urgent: [],
//   });

//   useEffect(() => {
//     const auth = getAuth();
//     const user = auth.currentUser;
//     if (user) setCurrentUserId(user.uid);
//   }, []);

//   const fetchStatusStats = async status => {
//     const now = new Date();
//     const earliest = new Date(now);
//     earliest.setDate(now.getDate() - 6);

//     const map = {};
//     for (let i = 0; i < 7; i++) {
//       const d = new Date(earliest);
//       d.setDate(earliest.getDate() + i);
//       const key = d.toISOString().slice(0, 10);
//       map[key] = 0;
//     }

//     const fetchPriorityStats = async () => {
//       const now = new Date();
//       const earliest = new Date(now);
//       earliest.setDate(now.getDate() - 6);

//       const days = {};
//       for (let i = 0; i < 7; i++) {
//         const d = new Date(earliest);
//         d.setDate(earliest.getDate() + i);
//         const key = d.toISOString().slice(0, 10);
//         days[key] = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
//       }

//       const q = query(collection(db, 'tickets'));
//       const snap = await getDocs(q);

//       snap.forEach(doc => {
//         const data = doc.data();
//         const createdAt =
//           data.createdAt?.toDate?.() ?? new Date(data.createdAt);
//         const priority = data.priority || 'Low';
//         if (createdAt >= earliest && createdAt <= now) {
//           const key = createdAt.toISOString().slice(0, 10);
//           if (days[key]) days[key][priority] = (days[key][priority] || 0) + 1;
//         }
//       });

//       const labels = Object.keys(days).map(k =>
//         new Date(k).toLocaleDateString('en-GB', {
//           weekday: 'short',
//         }),
//       );

//       const low = [],
//         medium = [],
//         high = [],
//         urgent = [];

//       Object.values(days).forEach(day => {
//         low.push(day.Low);
//         medium.push(day.Medium);
//         high.push(day.High);
//         urgent.push(day.Urgent);
//       });

//       setPriorityLabels(labels);
//       setPriorityData({
//         Low: low,
//         Medium: medium,
//         High: high,
//         Urgent: urgent,
//       });
//     };

//     const q = query(collection(db, 'tickets'), where('status', '==', status));
//     const snap = await getDocs(q);

//     let total = 0;
//     snap.forEach(doc => {
//       const d =
//         doc.data().createdAt?.toDate?.() ?? new Date(doc.data().createdAt);
//       if (d >= earliest && d <= now) {
//         const key = d.toISOString().slice(0, 10);
//         if (map[key] !== undefined) {
//           map[key]++;
//           total++;
//         }
//       }
//     });

//     const labels = Object.keys(map).map(k =>
//       new Date(k).toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: 'short',
//       }),
//     );
//     const values = Object.values(map);
//     return { total, labels, values };
//   };

//   const fetchPriorityStats = async () => {
//     const now = new Date();
//     const earliest = new Date(now);
//     earliest.setDate(now.getDate() - 6);

//     const days = {};
//     for (let i = 0; i < 7; i++) {
//       const d = new Date(earliest);
//       d.setDate(earliest.getDate() + i);
//       const key = d.toISOString().slice(0, 10);
//       days[key] = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
//     }

//     const q = query(collection(db, 'tickets'));
//     const snap = await getDocs(q);

//     snap.forEach(doc => {
//       const data = doc.data();
//       const createdAt = data.createdAt?.toDate?.() ?? new Date(data.createdAt);
//       const priority = data.priority || 'Low';
//       if (createdAt >= earliest && createdAt <= now) {
//         const key = createdAt.toISOString().slice(0, 10);
//         if (days[key]) days[key][priority] = (days[key][priority] || 0) + 1;
//       }
//     });

//     const labels = Object.keys(days).map(k =>
//       new Date(k).toLocaleDateString('en-GB', {
//         weekday: 'short',
//       }),
//     );

//     const low = [],
//       medium = [],
//       high = [],
//       urgent = [];
//     Object.values(days).forEach(day => {
//       low.push(day.Low);
//       medium.push(day.Medium);
//       high.push(day.High);
//       urgent.push(day.Urgent);
//     });

//     setPriorityLabels(labels);
//     setPriorityData({ Low: low, Medium: medium, High: high, Urgent: urgent });
//   };

//   const fetchUnassigned = async () => {
//     const now = new Date();
//     const earliest = new Date(now);
//     earliest.setDate(now.getDate() - 6);
//     const map = {};
//     for (let i = 0; i < 7; i++) {
//       const d = new Date(earliest);
//       d.setDate(earliest.getDate() + i);
//       const key = d.toISOString().slice(0, 10);
//       map[key] = 0;
//     }

//     const q = query(
//       collection(db, 'tickets'),
//       where('supportStaffId', '==', currentUserId),
//       where('engineerId', '==', ''),
//     );
//     const snap = await getDocs(q);

//     let total = 0;
//     snap.forEach(doc => {
//       const d =
//         doc.data().createdAt?.toDate?.() ?? new Date(doc.data().createdAt);
//       if (d >= earliest && d <= now) {
//         const key = d.toISOString().slice(0, 10);
//         map[key]++;
//         total++;
//       }
//     });

//     const labels = Object.keys(map).map(k =>
//       new Date(k).toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: 'short',
//       }),
//     );
//     const values = Object.values(map);
//     return { total, labels, values };
//   };

//   const fetchFirstResponse = async () => {
//     const now = new Date();
//     const earliest = new Date(now);
//     earliest.setDate(now.getDate() - (respDays - 1));

//     const map = {};
//     for (let i = 0; i < respDays; i++) {
//       const d = new Date(earliest);
//       d.setDate(earliest.getDate() + i);
//       const key = d.toISOString().slice(0, 10);
//       map[key] = [];
//     }

//     const q = query(
//       collection(db, 'tickets'),
//       where('supportStaffId', '==', currentUserId),
//     );
//     const snap = await getDocs(q);

//     snap.forEach(doc => {
//       const data = doc.data();
//       if (data.acceptedAt && data.updatedAt) {
//         const acc = new Date(data.acceptedAt.toDate?.() ?? data.acceptedAt);
//         const upd = new Date(data.updatedAt.toDate?.() ?? data.updatedAt);
//         if (upd >= earliest && acc <= now) {
//           const key = acc.toISOString().slice(0, 10);
//           map[key]?.push((upd - acc) / 60000);
//         }
//       }
//     });

//     const labels = Object.keys(map).map(k =>
//       new Date(k).toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: 'short',
//       }),
//     );
//     const values = Object.values(map).map(arr =>
//       arr.length
//         ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2))
//         : 0,
//     );

//     setRespLabels(labels);
//     setRespData(values);
//   };

//   const fetchResolutionTime = async () => {
//     const now = new Date();
//     const earliest = new Date(now);
//     earliest.setDate(now.getDate() - (resDays - 1));

//     const map = {};
//     for (let i = 0; i < resDays; i++) {
//       const d = new Date(earliest);
//       d.setDate(earliest.getDate() + i);
//       const key = d.toISOString().slice(0, 10);
//       map[key] = [];
//     }

//     const q = query(
//       collection(db, 'tickets'),
//       where('supportStaffId', '==', currentUserId),
//     );
//     const snap = await getDocs(q);

//     snap.forEach(doc => {
//       const data = doc.data();
//       if (data.acceptedAt && data.closedAt) {
//         const acc = new Date(data.acceptedAt.toDate?.() ?? data.acceptedAt);
//         const close = new Date(data.closedAt.toDate?.() ?? data.closedAt);
//         if (close >= earliest && acc <= now) {
//           const key = acc.toISOString().slice(0, 10);
//           map[key]?.push((close - acc) / 60000);
//         }
//       }
//     });

//     const labels = Object.keys(map).map(k =>
//       new Date(k).toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: 'short',
//       }),
//     );
//     const values = Object.values(map).map(arr =>
//       arr.length
//         ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2))
//         : 0,
//     );

//     setResLabels(labels);
//     setResData(values);
//   };

//   const fetchCustomerSatisfaction = async () => {
//     const now = new Date();
//     const earliest = new Date(now);
//     earliest.setDate(now.getDate() - (satisDays - 1));

//     const q = query(collection(db, 'customer-ticket-reviews'));
//     const snap = await getDocs(q);

//     let high = 0,
//       mid = 0,
//       low = 0;

//     snap.forEach(doc => {
//       const data = doc.data();
//       const created = new Date(data.createdOn?.toDate?.() ?? data.createdOn);
//       if (created >= earliest && created <= now) {
//         const rating = parseInt(data.rating);
//         if (rating >= 4) high++;
//         else if (rating === 3) mid++;
//         else low++;
//       }
//     });

//     setSatisData([
//       {
//         name: 'Highly Satisfied',
//         population: high,
//         color: '#00bcd4',
//         legendFontColor: '#333',
//         legendFontSize: 12,
//       },
//       {
//         name: 'Satisfied',
//         population: mid,
//         color: '#2196f3',
//         legendFontColor: '#333',
//         legendFontSize: 12,
//       },
//       {
//         name: 'Unsatisfied',
//         population: low,
//         color: '#9c27b0',
//         legendFontColor: '#333',
//         legendFontSize: 12,
//       },
//     ]);

//     setSatisDataCategory([
//       {
//         name: 'Tickets by Category 1',
//         population: high,
//         color: '#0863ebff',
//         legendFontColor: '#333',
//         legendFontSize: 12,
//       },
//       {
//         name: 'Tickets by Category 2',
//         population: mid,
//         color: '#931ef2ff',
//         legendFontColor: '#333',
//         legendFontSize: 12,
//       },
//       {
//         name: 'Tickets by Category 4',
//         population: low,
//         color: '#fd6900ff',
//         legendFontColor: '#333',
//         legendFontSize: 12,
//       },
//     ]);
//   };

//   useEffect(() => {
//     if (!currentUserId) return;
//     setLoading(true);
//     Promise.all([
//       fetchStatusStats('OPEN').then(res => {
//         setOpenCount(res.total);
//         setOpenLabels(res.labels);
//         setOpenData(res.values);
//       }),
//       fetchStatusStats('IN_PROGRESS').then(res => {
//         setInProgressCount(res.total);
//         setInProgressLabels(res.labels);
//         setInProgressData(res.values);
//       }),
//       fetchStatusStats('CLOSED').then(res => {
//         setClosedCount(res.total);
//         setClosedLabels(res.labels);
//         setClosedData(res.values);
//       }),
//       fetchUnassigned().then(res => {
//         setMyTicketCount(res.total);
//         setMyTicketLabels(res.labels);
//         setMyTicketData(res.values);
//       }),
//       fetchPriorityStats().then(res => {
//         setNewTicketCount(res.total);
//         setNewTicketLabels(res.labels);
//         setNewTicketData(res.values);
//       }),
//     ]).finally(() => setLoading(false));
//   }, [currentUserId]);

//   useEffect(() => {
//     if (currentUserId) fetchFirstResponse();
//   }, [currentUserId, respDays]);

//   useEffect(() => {
//     if (currentUserId) fetchResolutionTime();
//   }, [currentUserId, resDays]);

//   useEffect(() => {
//     if (currentUserId) fetchCustomerSatisfaction();
//   }, [currentUserId, satisDays]);

//   const Card = ({ title, count, labels, values }) => (
//     <View style={styles.MainCard}>
//       <View style={styles.Icon}>
//         <Image
//           source={require('../images/tickets.png')}
//           style={{ width: 20, height: 20, padding: 10 }}
//         />
//         <Text style={styles.heading}>{title}</Text>
//       </View>
//       <Text style={styles.count}>{count}</Text>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.cardGrid}>
//         {/* Tickets Cards */}
//         <Card
//           title="My Tickets"
//           count={openCount}
//           labels={openLabels}
//           values={openData}
//         />
//         <Card
//           title="All Tickets"
//           count={inProgressCount}
//           labels={inProgressLabels}
//           values={inProgressData}
//         />
//         <Card
//           title="Active Tickets"
//           count={closedCount}
//           labels={closedLabels}
//           values={closedData}
//         />
//         <Card
//           title="Tickets Closed"
//           count={openCount}
//           labels={openLabels}
//           values={openData}
//         />
//       </View>
//       <View style={styles.cardChart}>
//         <View style={styles.row}>
//           <View>
//             <Text style={styles.heading}>New Tickets Created</Text>
//             <Text style={styles.headingTwo}>This Week</Text>
//           </View>
//           <DropDownPicker
//             open={respOpen}
//             value={respDays}
//             items={STATUSESYEARS}
//             setOpen={setRespOpen}
//             setValue={setRespDays}
//             style={styles.dd}
//             containerStyle={{ width: 130 }}
//             dropDownContainerStyle={{ backgroundColor: '#fff' }}
//           />
//         </View>

//         <LineChart
//           data={{
//             labels: priorityLabels,
//             datasets: [
//               {
//                 data: priorityData.Low,
//                 color: () => '#00bcd4',
//                 strokeWidth: 2,
//               },
//               {
//                 data: priorityData.Medium,
//                 color: () => '#2196f3',
//                 strokeWidth: 2,
//               },
//               {
//                 data: priorityData.High,
//                 color: () => '#ff9800',
//                 strokeWidth: 2,
//               },
//               {
//                 data: priorityData.Urgent,
//                 color: () => '#f44336',
//                 strokeWidth: 2,
//               },
//             ],
//             legend: ['Low', 'Medium', 'High', 'Urgent'],
//           }}
//           width={Dimensions.get('window').width - 70}
//           height={220}
//           chartConfig={{
//             backgroundGradientFrom: '#fff',
//             backgroundGradientTo: '#fff',
//             decimalPlaces: 0,
//             color: () => '#333',
//             labelColor: () => '#666',
//             style: { borderRadius: 10 },
//           }}
//           style={styles.chart}
//           bezier
//         />
//       </View>

//       {/* First Response Time Card */}
//       <View style={styles.cardChart}>
//         <View style={styles.row}>
//           <View style={styles.rowTwo}>
//             <Text style={styles.heading}>First Response Time</Text>
//             <Text style={styles.headingTwo}>
//               Average time to respond to tickets
//             </Text>
//           </View>
//           <DropDownPicker
//             open={respOpen}
//             value={respDays}
//             items={STATUSES}
//             setOpen={setRespOpen}
//             setValue={setRespDays}
//             style={styles.dd}
//             containerStyle={{ width: 130 }}
//             dropDownContainerStyle={{ backgroundColor: '#fff' }}
//           />
//         </View>
//         {/* <LineChart
//           data={{ labels: respLabels, datasets: [{ data: respData, color: () => '#e26a4a' }] }}
//           width={Dimensions.get('window').width - 70}
//           height={160}
//           chartConfig={{
//             backgroundGradientFrom: '#fff',
//             backgroundGradientTo: '#fff',
//             color: () => '#e26a4a',
//             labelColor: () => '#333',
//             decimalPlaces: 2,
//           }}f
//           style={styles.chart}
//           bezier
//         /> */}
//       </View>

//       {/* Avg. Resolution Time Card */}
//       <View style={styles.cardChart}>
//         <View style={styles.row}>
//           <View style={styles.rowTwo}>
//             <Text style={styles.heading}>First Response Time</Text>
//             <Text style={styles.headingTwo}>
//               Average time to respond to tickets
//             </Text>
//           </View>
//           <DropDownPicker
//             open={resOpen}
//             value={resDays}
//             items={STATUSES}
//             setOpen={setResOpen}
//             setValue={setResDays}
//             style={styles.dd}
//             containerStyle={{ width: 130 }}
//             dropDownContainerStyle={{ backgroundColor: '#fff' }}
//           />
//         </View>
//         {/* <LineChart
//           data={{ labels: resLabels, datasets: [{ data: resData, color: () => '#ff9800' }] }}
//           width={Dimensions.get('window').width - 70}
//           height={160}
//           chartConfig={{
//             backgroundGradientFrom: '#fff',
//             backgroundGradientTo: '#fff',
//             color: () => '#ff9800',
//             labelColor: () => '#333',
//             decimalPlaces: 2,
//           }}
//           style={styles.chart}
//           bezier
//         /> */}
//       </View>

//       {/* Customer Satisfaction Card */}
//       <View style={styles.cardChart}>
//         <View style={styles.row}>
//           <Text style={styles.heading}>Customer Satisfaction</Text>
//           <DropDownPicker
//             open={satisOpen}
//             value={satisDays}
//             items={STATUSESYEARS}
//             setOpen={setSatisOpen}
//             setValue={setSatisDays}
//             style={styles.dd}
//             containerStyle={{ width: 150 }}
//             dropDownContainerStyle={{ backgroundColor: '#fff' }}
//           />
//         </View>
//         <PieChart
//           data={satisData}
//           width={Dimensions.get('window').width - 70}
//           height={180}
//           chartConfig={{
//             color: () => '#333',
//             labelColor: () => '#333',
//           }}
//           accessor="population"
//           backgroundColor="transparent"
//           paddingLeft="15"
//           absolute
//         />
//       </View>

//       {/* Tickets by Category */}
//       <View style={styles.cardChart}>
//         <View style={styles.row}>
//           <Text style={styles.heading}>Customer Satisfaction</Text>
//         </View>
//         <PieChart
//           data={satisDataCategory}
//           width={Dimensions.get('window').width - 70}
//           height={180}
//           chartConfig={{
//             color: () => '#333',
//             labelColor: () => '#333',
//           }}
//           accessor="population"
//           backgroundColor="transparent"
//           paddingLeft="15"
//           absolute
//         />
//       </View>
//     </ScrollView>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     paddingBottom: 40,
//     backgroundColor: '#f6f6f6',
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   MainCard: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 15,
//     elevation: 3,
//     width: '48%',
//     flexDirection: 'column',
//     alignItems: 'start',
//     justifyContent: 'space-between',
//   },
//   cardGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 15,
//     elevation: 3,
//     width: '48%',
//   },
//   cardChart: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 15,
//     elevation: 3,
//     width: '100%',
//   },
//   heading: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginLeft: 2,
//   },
//   headingTwo: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 2,
//   },
//   count: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     color: '#4a90e2',
//     textAlign: 'right',
//     marginTop: 10,
//     marginBottom: 5,
//   },
//   chart: {
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     gap: 10,
//     marginBottom: 8,
//   },
//   rowTwo: {
//     flexDirection: 'column',
//     gap: 5,
//     marginBottom: 8,
//   },
//   Icon: {
//     flexDirection: 'column',
//     gap: 10,
//     // alignItems: 'center',
//     // marginBottom: 10,
//   },
//   dd: {
//     backgroundColor: '#fff',
//     borderColor: '#ccc',
//     zIndex: 50,
//     marginTop: 10,
//   },
// });
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import DropDownPicker from 'react-native-dropdown-picker';
import { db } from '../firebase';
import { Alert, BackHandler } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const TIME_PERIODS = [
  { label: 'Last Day', value: 1 },
  { label: 'Last 7 Days', value: 7 },
  { label: 'Last 15 Days', value: 15 },
  { label: 'Last 30 Days', value: 30 },
];

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // State for ticket status counts and charts
  const [openCount, setOpenCount] = useState(0);
  const [openLabels, setOpenLabels] = useState([]);
  const [openData, setOpenData] = useState([]);

  const [inProgressCount, setInProgressCount] = useState(0);
  const [inProgressLabels, setInProgressLabels] = useState([]);
  const [inProgressData, setInProgressData] = useState([]);

  const [closedCount, setClosedCount] = useState(0);
  const [closedLabels, setClosedLabels] = useState([]);
  const [closedData, setClosedData] = useState([]);

  const [myTicketCount, setMyTicketCount] = useState(0);
  const [myTicketLabels, setMyTicketLabels] = useState([]);
  const [myTicketData, setMyTicketData] = useState([]);

  const [newTicketCount, setNewTicketCount] = useState(0);
  const [newTicketLabels, setNewTicketLabels] = useState([]);
  const [newTicketData, setNewTicketData] = useState([]);

  // State for response and resolution time
  const [respLabels, setRespLabels] = useState([]);
  const [respData, setRespData] = useState([]);
  const [respDays, setRespDays] = useState(7);
  const [respOpen, setRespOpen] = useState(false);

  const [resLabels, setResLabels] = useState([]);
  const [resData, setResData] = useState([]);
  const [resDays, setResDays] = useState(7);
  const [resOpen, setResOpen] = useState(false);

  // State for customer satisfaction
  const [satisOpen, setSatisOpen] = useState(false);
  const [satisDays, setSatisDays] = useState(7);
  const [satisData, setSatisData] = useState([]);
  const [satisDataCategory, setSatisDataCategory] = useState([]);

  // State for priority data
  const [priorityLabels, setPriorityLabels] = useState([]);
  const [priorityData, setPriorityData] = useState({
    Low: [],
    Medium: [],
    High: [],
    Urgent: [],
  });

  // State for New Tickets Created dropdown
  const [newTicketDays, setNewTicketDays] = useState(7);
  const [newTicketOpen, setNewTicketOpen] = useState(false);

  // State for Card components
  const [allTicketsCount, setAllTicketsCount] = useState(0);
  const [activeTicketsCount, setActiveTicketsCount] = useState(0);
  const [ticketsClosedCount, setTicketsClosedCount] = useState(0);

  // Back button handler
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (!navigation) return true;
        Alert.alert(
          'Logout Confirmation',
          'Do you want to logout and go back to the Login screen?',
          [
            {
              text: 'No',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => {
                navigation.replace('Login');
              },
            },
          ],
          { cancelable: false },
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, [navigation]),
  );

  // Fetch current user ID
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) setCurrentUserId(user.uid);
    else setLoading(false); // Stop loading if no user
  }, []);

  // Fetch status stats for a given status
  const fetchStatusStats = async (status) => {
    if (!currentUserId) return { total: 0, labels: [], values: [] };
    const now = new Date();
    const earliest = new Date(now);
    earliest.setDate(now.getDate() - 6);

    const map = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(earliest);
      d.setDate(earliest.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      map[key] = 0;
    }

    const ticketsRef = collection(db, 'tickets');
    const engineerQuery = query(
      ticketsRef,
      where('engineerId', '==', currentUserId),
      where('status', '==', status)
    );
    const staffQuery = query(
      ticketsRef,
      where('supportStaffId', '==', currentUserId),
      where('status', '==', status)
    );

    try {
      const [engineerSnap, staffSnap] = await Promise.all([
        getDocs(engineerQuery),
        getDocs(staffQuery),
      ]);

      let total = 0;
      const ticketMap = new Map();

      engineerSnap.forEach(doc => {
        const createdAt = new Date(doc.data().createdAt);
        if (createdAt >= earliest && createdAt <= now) {
          const key = createdAt.toISOString().slice(0, 10);
          if (map[key] !== undefined) {
            ticketMap.set(doc.id, doc.data());
          }
        }
      });

      staffSnap.forEach(doc => {
        const createdAt = new Date(doc.data().createdAt);
        if (createdAt >= earliest && createdAt <= now) {
          const key = createdAt.toISOString().slice(0, 10);
          if (map[key] !== undefined) {
            ticketMap.set(doc.id, doc.data());
          }
        }
      });

      ticketMap.forEach((data, id) => {
        const createdAt = new Date(data.createdAt);
        const key = createdAt.toISOString().slice(0, 10);
        if (map[key] !== undefined) {
          map[key]++;
          total++;
        }
      });

      const labels = Object.keys(map).map(k =>
        new Date(k).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        }),
      );
      const values = Object.values(map);
      return { total, labels, values };
    } catch (error) {
      console.error('Error fetching status stats:', error);
      return { total: 0, labels: [], values: [] };
    }
  };

  // Fetch all tickets count
  const fetchAllTickets = async () => {
    if (!currentUserId) return 0;
    const ticketsRef = collection(db, 'tickets');
    const engineerQuery = query(ticketsRef, where('engineerId', '==', currentUserId));
    const staffQuery = query(ticketsRef, where('supportStaffId', '==', currentUserId));

    try {
      const [engineerSnap, staffSnap] = await Promise.all([
        getDocs(engineerQuery),
        getDocs(staffQuery),
      ]);

      const ticketMap = new Map();
      engineerSnap.forEach(doc => ticketMap.set(doc.id, doc.data()));
      staffSnap.forEach(doc => ticketMap.set(doc.id, doc.data()));

      return ticketMap.size;
    } catch (error) {
      console.error('Error fetching all tickets:', error);
      return 0;
    }
  };

  // Fetch active tickets count (OPEN or IN_PROGRESS)
  const fetchActiveTickets = async () => {
    if (!currentUserId) return 0;
    const ticketsRef = collection(db, 'tickets');
    const engineerQuery = query(
      ticketsRef,
      where('engineerId', '==', currentUserId),
      where('status', 'in', ['OPEN', 'IN_PROGRESS'])
    );
    const staffQuery = query(
      ticketsRef,
      where('supportStaffId', '==', currentUserId),
      where('status', 'in', ['OPEN', 'IN_PROGRESS'])
    );

    try {
      const [engineerSnap, staffSnap] = await Promise.all([
        getDocs(engineerQuery),
        getDocs(staffQuery),
      ]);

      const ticketMap = new Map();
      engineerSnap.forEach(doc => ticketMap.set(doc.id, doc.data()));
      staffSnap.forEach(doc => ticketMap.set(doc.id, doc.data()));

      return ticketMap.size;
    } catch (error) {
      console.error('Error fetching active tickets:', error);
      return 0;
    }
  };

  // Fetch newly assigned tickets (based on engineerId or supportStaffId, last 7 days)
  const fetchMyTickets = async () => {
    if (!currentUserId) return { total: 0, labels: [], values: [] };
    const now = new Date();
    const earliest = new Date(now);
    earliest.setDate(now.getDate() - 6);

    const map = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(earliest);
      d.setDate(earliest.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      map[key] = 0;
    }

    const ticketsRef = collection(db, 'tickets');
    const engineerQuery = query(
      ticketsRef,
      where('engineerId', '==', currentUserId),
      where('createdAt', '>=', earliest.toISOString())
    );
    const staffQuery = query(
      ticketsRef,
      where('supportStaffId', '==', currentUserId),
      where('createdAt', '>=', earliest.toISOString())
    );

    try {
      const [engineerSnap, staffSnap] = await Promise.all([
        getDocs(engineerQuery),
        getDocs(staffQuery),
      ]);

      const ticketMap = new Map();
      engineerSnap.forEach(doc => {
        const createdAt = new Date(doc.data().createdAt);
        if (createdAt >= earliest && createdAt <= now) {
          ticketMap.set(doc.id, doc.data());
        }
      });
      staffSnap.forEach(doc => {
        const createdAt = new Date(doc.data().createdAt);
        if (createdAt >= earliest && createdAt <= now) {
          ticketMap.set(doc.id, doc.data());
        }
      });

      let total = 0;
      ticketMap.forEach((data, id) => {
        const createdAt = new Date(data.createdAt);
        const key = createdAt.toISOString().slice(0, 10);
        if (map[key] !== undefined) {
          map[key]++;
          total++;
        }
      });

      const labels = Object.keys(map).map(k =>
        new Date(k).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        }),
      );
      const values = Object.values(map);
      return { total, labels, values };
    } catch (error) {
      console.error('Error fetching my tickets:', error);
      return { total: 0, labels: [], values: [] };
    }
  };

  // Fetch priority stats
  const fetchPriorityStats = async () => {
    if (!currentUserId) return { total: 0, labels: [], values: [] };
    const now = new Date();
    const earliest = new Date(now);
    earliest.setDate(now.getDate() - (newTicketDays - 1));

    const days = {};
    for (let i = 0; i < newTicketDays; i++) {
      const d = new Date(earliest);
      d.setDate(earliest.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      days[key] = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
    }

    const ticketsRef = collection(db, 'tickets');
    const engineerQuery = query(ticketsRef, where('engineerId', '==', currentUserId));
    const staffQuery = query(ticketsRef, where('supportStaffId', '==', currentUserId));

    try {
      const [engineerSnap, staffSnap] = await Promise.all([
        getDocs(engineerQuery),
        getDocs(staffQuery),
      ]);

      const ticketMap = new Map();
      engineerSnap.forEach(doc => ticketMap.set(doc.id, doc.data()));
      staffSnap.forEach(doc => ticketMap.set(doc.id, doc.data()));

      let total = 0;
      ticketMap.forEach((data, id) => {
        const createdAt = new Date(data.createdAt);
        const priority = data.priority || 'Low';
        if (createdAt >= earliest && createdAt <= now) {
          const key = createdAt.toISOString().slice(0, 10);
          if (days[key]) {
            days[key][priority] = (days[key][priority] || 0) + 1;
            total++;
          }
        }
      });

      const labels = Object.keys(days).map(k =>
        new Date(k).toLocaleDateString('en-GB', { weekday: 'short' }),
      );

      const low = [],
        medium = [],
        high = [],
        urgent = [];
      Object.values(days).forEach(day => {
        low.push(day.Low);
        medium.push(day.Medium);
        high.push(day.High);
        urgent.push(day.Urgent);
      });

      setPriorityLabels(labels);
      setPriorityData({ Low: low, Medium: medium, High: high, Urgent: urgent });
      return { total, labels, values: low };
    } catch (error) {
      console.error('Error fetching priority stats:', error);
      return { total: 0, labels: [], values: [] };
    }
  };

  // Fetch first response time
  const fetchFirstResponse = async () => {
    if (!currentUserId) return;
    const now = new Date();
    const earliest = new Date(now);
    earliest.setDate(now.getDate() - (respDays - 1));

    const map = {};
    for (let i = 0; i < respDays; i++) {
      const d = new Date(earliest);
      d.setDate(earliest.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      map[key] = [];
    }

    const ticketsRef = collection(db, 'tickets');
    const engineerQuery = query(ticketsRef, where('engineerId', '==', currentUserId));
    const staffQuery = query(ticketsRef, where('supportStaffId', '==', currentUserId));

    try {
      const [engineerSnap, staffSnap] = await Promise.all([
        getDocs(engineerQuery),
        getDocs(staffQuery),
      ]);

      const ticketMap = new Map();
      engineerSnap.forEach(doc => ticketMap.set(doc.id, doc.data()));
      staffSnap.forEach(doc => ticketMap.set(doc.id, doc.data()));

      ticketMap.forEach((data, id) => {
        if (data.acceptedAt && data.updatedAt) {
          const acc = new Date(data.acceptedAt);
          const upd = new Date(data.updatedAt);
          if (upd >= earliest && acc <= now) {
            const key = acc.toISOString().slice(0, 10);
            map[key]?.push((upd - acc) / 60000);
          }
        }
      });

      const labels = Object.keys(map).map(k =>
        new Date(k).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        }),
      );
      const values = Object.values(map).map(arr =>
        arr.length
          ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2))
          : 0,
      );

      setRespLabels(labels);
      setRespData(values);
    } catch (error) {
      console.error('Error fetching first response time:', error);
      setRespLabels([]);
      setRespData([]);
    }
  };

  // Fetch resolution time
  const fetchResolutionTime = async () => {
    if (!currentUserId) return;
    const now = new Date();
    const earliest = new Date(now);
    earliest.setDate(now.getDate() - (resDays - 1));

    const map = {};
    for (let i = 0; i < resDays; i++) {
      const d = new Date(earliest);
      d.setDate(earliest.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      map[key] = [];
    }

    const ticketsRef = collection(db, 'tickets');
    const engineerQuery = query(ticketsRef, where('engineerId', '==', currentUserId));
    const staffQuery = query(ticketsRef, where('supportStaffId', '==', currentUserId));

    try {
      const [engineerSnap, staffSnap] = await Promise.all([
        getDocs(engineerQuery),
        getDocs(staffQuery),
      ]);

      const ticketMap = new Map();
      engineerSnap.forEach(doc => ticketMap.set(doc.id, doc.data()));
      staffSnap.forEach(doc => ticketMap.set(doc.id, doc.data()));

      ticketMap.forEach((data, id) => {
        if (data.acceptedAt && data.closedAt) {
          const acc = new Date(data.acceptedAt);
          const close = new Date(data.closedAt);
          if (close >= earliest && acc <= now) {
            const key = acc.toISOString().slice(0, 10);
            map[key]?.push((close - acc) / 60000);
          }
        }
      });

      const labels = Object.keys(map).map(k =>
        new Date(k).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        }),
      );
      const values = Object.values(map).map(arr =>
        arr.length
          ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2))
          : 0,
      );

      setResLabels(labels);
      setResData(values);
    } catch (error) {
      console.error('Error fetching resolution time:', error);
      setResLabels([]);
      setResData([]);
    }
  };

  // Fetch customer satisfaction data
  const fetchCustomerSatisfaction = async () => {
    if (!currentUserId) return;
    const now = new Date();
    const earliest = new Date(now);
    earliest.setDate(now.getDate() - (satisDays - 1));

    const q = query(collection(db, 'customer-ticket-reviews'));
    try {
      const snap = await getDocs(q);

      let high = 0,
        mid = 0,
        low = 0;
      snap.forEach(doc => {
        const data = doc.data();
        const created = new Date(data.createdOn);
        if (created >= earliest && created <= now) {
          const rating = parseInt(data.rating);
          if (rating >= 4) high++;
          else if (rating === 3) mid++;
          else low++;
        }
      });

      setSatisData([
        {
          name: 'Highly Satisfied',
          population: high,
          color: '#00bcd4',
          legendFontColor: '#333',
          legendFontSize: 12,
        },
        {
          name: 'Satisfied',
          population: mid,
          color: '#2196f3',
          legendFontColor: '#333',
          legendFontSize: 12,
        },
        {
          name: 'Unsatisfied',
          population: low,
          color: '#9c27b0',
          legendFontColor: '#333',
          legendFontSize: 12,
        },
      ]);

      // Fetch tickets by category
      const ticketsRef = collection(db, 'tickets');
      const engineerQuery = query(ticketsRef, where('engineerId', '==', currentUserId));
      const staffQuery = query(ticketsRef, where('supportStaffId', '==', currentUserId));

      const [engineerSnap, staffSnap] = await Promise.all([
        getDocs(engineerQuery),
        getDocs(staffQuery),
      ]);

      const ticketMap = new Map();
      engineerSnap.forEach(doc => ticketMap.set(doc.id, doc.data()));
      staffSnap.forEach(doc => ticketMap.set(doc.id, doc.data()));

      const categories = {};
      ticketMap.forEach((data, id) => {
        const created = new Date(data.createdAt);
        if (created >= earliest && created <= now) {
          const category = data.category || 'Uncategorized';
          categories[category] = (categories[category] || 0) + 1;
        }
      });

      const categoryData = Object.entries(categories).map(
        ([name, count], index) => ({
          name,
          population: count,
          color: ['#0863eb', '#931ef2', '#fd6900', '#00bcd4'][index % 4],
          legendFontColor: '#333',
          legendFontSize: 12,
        }),
      );

      setSatisDataCategory(categoryData);
    } catch (error) {
      console.error('Error fetching customer satisfaction:', error);
      setSatisData([]);
      setSatisDataCategory([]);
    }
  };

  // Main data fetching useEffect
  useEffect(() => {
    if (!currentUserId) return;
    setLoading(true);
    Promise.all([
      fetchStatusStats('OPEN').then(res => {
        setOpenCount(res.total);
        setOpenLabels(res.labels);
        setOpenData(res.values);
      }),
      fetchStatusStats('IN_PROGRESS').then(res => {
        setInProgressCount(res.total);
        setInProgressLabels(res.labels);
        setInProgressData(res.values);
      }),
      fetchStatusStats('CLOSED').then(res => {
        setClosedCount(res.total);
        setClosedLabels(res.labels);
        setClosedData(res.values);
        setTicketsClosedCount(res.total);
      }),
      fetchMyTickets().then(res => {
        setMyTicketCount(res.total);
        setMyTicketLabels(res.labels);
        setMyTicketData(res.values);
      }),
      fetchPriorityStats().then(res => {
        setNewTicketCount(res.total);
        setNewTicketLabels(res.labels);
        setNewTicketData(res.values);
      }),
      fetchAllTickets().then(total => {
        setAllTicketsCount(total);
      }),
      fetchActiveTickets().then(total => {
        setActiveTicketsCount(total);
      }),
    ])
      .catch(error => console.error('Error in Promise.all:', error))
      .finally(() => setLoading(false));
  }, [currentUserId, newTicketDays]);

  // Fetch first response time
  useEffect(() => {
    if (currentUserId) fetchFirstResponse();
  }, [currentUserId, respDays]);

  // Fetch resolution time
  useEffect(() => {
    if (currentUserId) fetchResolutionTime();
  }, [currentUserId, resDays]);

  // Fetch customer satisfaction
  useEffect(() => {
    if (currentUserId) fetchCustomerSatisfaction();
  }, [currentUserId, satisDays]);

  // Card component
  const Card = ({ title, count }) => (
    <View style={styles.MainCard}>
      <View style={styles.Icon}>
        <Image
          source={require('../images/tickets.png')}
          style={{ width: 20, height: 20 }}
        />
        <Text style={styles.heading}>{title}</Text>
      </View>
      <Text style={styles.count}>{count || 0}</Text>
    </View>
  );

  // Render charts only if data is valid
  const renderNewTicketsChart = () => {
    if (!priorityLabels.length || !priorityData.Low.length) return null;
    return (
      <LineChart
        data={{
          labels: priorityLabels,
          datasets: [
            {
              data: priorityData.Low,
              color: () => '#00bcd4',
              strokeWidth: 2,
            },
            {
              data: priorityData.Medium,
              color: () => '#2196f3',
              strokeWidth: 2,
            },
            {
              data: priorityData.High,
              color: () => '#ff9800',
              strokeWidth: 2,
            },
            {
              data: priorityData.Urgent,
              color: () => '#f44336',
              strokeWidth: 2,
            },
          ],
          legend: ['Low', 'Medium', 'High', 'Urgent'],
        }}
        width={Dimensions.get('window').width - 70}
        height={220}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: () => '#333',
          labelColor: () => '#666',
          style: { borderRadius: 10 },
        }}
        style={styles.chart}
        bezier
      />
    );
  };

  const renderFirstResponseChart = () => {
    if (!respLabels.length || !respData.length) return null;
    return (
      <LineChart
        data={{
          labels: respLabels,
          datasets: [{ data: respData, color: () => '#e26a4a' }],
        }}
        width={Dimensions.get('window').width - 70}
        height={160}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: () => '#e26a4a',
          labelColor: () => '#333',
          decimalPlaces: 2,
        }}
        style={styles.chart}
        bezier
      />
    );
  };

  const renderResolutionTimeChart = () => {
    if (!resLabels.length || !resData.length) return null;
    return (
      <LineChart
        data={{
          labels: resLabels,
          datasets: [{ data: resData, color: () => '#ff9800' }],
        }}
        width={Dimensions.get('window').width - 70}
        height={160}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: () => '#ff9800',
          labelColor: () => '#333',
          decimalPlaces: 2,
        }}
        style={styles.chart}
        bezier
      />
    );
  };

  const renderSatisfactionChart = () => {
    if (!satisData.length) return null;
    return (
      <PieChart
        data={satisData}
        width={Dimensions.get('window').width - 70}
        height={180}
        chartConfig={{
          color: () => '#333',
          labelColor: () => '#333',
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    );
  };

  const renderCategoryChart = () => {
    if (!satisDataCategory.length) return null;
    return (
      <PieChart
        data={satisDataCategory}
        width={Dimensions.get('window').width - 70}
        height={180}
        chartConfig={{
          color: () => '#333',
          labelColor: () => '#333',
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardGrid}>
        <Card title="My Tickets" count={myTicketCount} />
        <Card title="All Tickets" count={allTicketsCount} />
        <Card title="Active Tickets" count={activeTicketsCount} />
        <Card title="Tickets Closed" count={ticketsClosedCount} />
      </View>

      <View style={styles.cardChart}>
        <View style={styles.row}>
          <View>
            <Text style={styles.heading}>New Tickets Created</Text>
            <Text style={styles.headingTwo}>This Week</Text>
          </View>
          <DropDownPicker
            open={newTicketOpen}
            value={newTicketDays}
            items={TIME_PERIODS}
            setOpen={setNewTicketOpen}
            setValue={setNewTicketDays}
            style={styles.dd}
            containerStyle={{ width: 130 }}
            dropDownContainerStyle={{ backgroundColor: '#fff' }}
            zIndex={1000}
            zIndexInverse={1000}
          />
        </View>
        {renderNewTicketsChart()}
      </View>

      <View style={styles.cardChart}>
        <View style={styles.row}>
          <View style={styles.rowTwo}>
            <Text style={styles.heading}>First Response Time</Text>
            <Text style={styles.headingTwo}>
              Average time to respond to tickets
            </Text>
          </View>
          <DropDownPicker
            open={respOpen}
            value={respDays}
            items={TIME_PERIODS}
            setOpen={setRespOpen}
            setValue={setRespDays}
            style={styles.dd}
            containerStyle={{ width: 130 }}
            dropDownContainerStyle={{ backgroundColor: '#fff' }}
            zIndex={900}
            zIndexInverse={900}
          />
        </View>
        {renderFirstResponseChart()}
      </View>

      <View style={styles.cardChart}>
        <View style={styles.row}>
          <View style={styles.rowTwo}>
            <Text style={styles.heading}>Avg. Resolution Time</Text>
            <Text style={styles.headingTwo}>
              Average time to resolve tickets
            </Text>
          </View>
          <DropDownPicker
            open={resOpen}
            value={resDays}
            items={TIME_PERIODS}
            setOpen={setResOpen}
            setValue={setResDays}
            style={styles.dd}
            containerStyle={{ width: 130 }}
            dropDownContainerStyle={{ backgroundColor: '#fff' }}
            zIndex={800}
            zIndexInverse={800}
          />
        </View>
        {renderResolutionTimeChart()}
      </View>

      <View style={styles.cardChart}>
        <View style={styles.row}>
          <Text style={styles.heading}>Customer Satisfaction</Text>
          <DropDownPicker
            open={satisOpen}
            value={satisDays}
            items={TIME_PERIODS}
            setOpen={setSatisOpen}
            setValue={setSatisDays}
            style={styles.dd}
            containerStyle={{ width: 150 }}
            dropDownContainerStyle={{ backgroundColor: '#fff' }}
            zIndex={700}
            zIndexInverse={700}
          />
        </View>
        {renderSatisfactionChart()}
      </View>

      <View style={styles.cardChart}>
        <View style={styles.row}>
          <Text style={styles.heading}>Tickets by Category</Text>
        </View>
        {renderCategoryChart()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f6f6f6',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  MainCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    width: '48%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardChart: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    width: '100%',
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 2,
  },
  headingTwo: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  count: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4a90e2',
    textAlign: 'right',
    marginTop: 2,
    marginBottom: 2,
  },
  chart: {
    borderRadius: 8,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  rowTwo: {
    flexDirection: 'column',
    gap: 5,
    marginBottom: 8,
  },
  Icon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dd: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    zIndex: 50,
    marginTop: 10,
  },
});
//MAIN
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Dimensions,
//   ScrollView,
//   ActivityIndicator,
//   StyleSheet,
// } from 'react-native';
// import { LineChart, PieChart } from 'react-native-chart-kit';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import DropDownPicker from 'react-native-dropdown-picker';
// import { db } from '../firebase';

// const STATUSES = [
//   { label: 'Last Day', value: 1 },
//   { label: 'Last 7 Days', value: 7 },
//   { label: 'Last 15 Days', value: 15 },
//   { label: 'Last 30 Days', value: 30 },
// ];

// export default function DashboardScreen() {
//   const [loading, setLoading] = useState(true);
//   const [currentUserId, setCurrentUserId] = useState(null);

//   const [openCount, setOpenCount] = useState(0);
//   const [openLabels, setOpenLabels] = useState([]);
//   const [openData, setOpenData] = useState([]);

//   const [inProgressCount, setInProgressCount] = useState(0);
//   const [inProgressLabels, setInProgressLabels] = useState([]);
//   const [inProgressData, setInProgressData] = useState([]);

//   const [closedCount, setClosedCount] = useState(0);
//   const [closedLabels, setClosedLabels] = useState([]);
//   const [closedData, setClosedData] = useState([]);

//   const [unassignedCount, setUnassignedCount] = useState(0);
//   const [unassignedLabels, setUnassignedLabels] = useState([]);
//   const [unassignedData, setUnassignedData] = useState([]);

//   const [respLabels, setRespLabels] = useState([]);
//   const [respData, setRespData] = useState([]);
//   const [respDays, setRespDays] = useState(7);
//   const [respOpen, setRespOpen] = useState(false);

//   const [resLabels, setResLabels] = useState([]);
//   const [resData, setResData] = useState([]);
//   const [resDays, setResDays] = useState(7);
//   const [resOpen, setResOpen] = useState(false);

//   const [satisOpen, setSatisOpen] = useState(false);
//   const [satisDays, setSatisDays] = useState(7);
//   const [satisData, setSatisData] = useState([]);

//   useEffect(() => {
//     const auth = getAuth();
//     const user = auth.currentUser;
//     if (user) setCurrentUserId(user.uid);
//   }, []);

//   const fetchStatusStats = async (status) => {
//     const now = new Date();
//     const earliest = new Date(now);
//     earliest.setDate(now.getDate() - 6);

//     const map = {};
//     for (let i = 0; i < 7; i++) {
//       const d = new Date(earliest);
//       d.setDate(earliest.getDate() + i);
//       const key = d.toISOString().slice(0, 10);
//       map[key] = 0;
//     }

//     const q = query(collection(db, 'tickets'), where('status', '==', status));
//     const snap = await getDocs(q);

//     let total = 0;
//     snap.forEach(doc => {
//       const d = doc.data().createdAt?.toDate?.() ?? new Date(doc.data().createdAt);
//       if (d >= earliest && d <= now) {
//         const key = d.toISOString().slice(0, 10);
//         if (map[key] !== undefined) {
//           map[key]++;
//           total++;
//         }
//       }
//     });

//     const labels = Object.keys(map).map(k =>
//       new Date(k).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
//     );
//     const values = Object.values(map);
//     return { total, labels, values };
//   };

//   const fetchUnassigned = async () => {
//     const now = new Date();
//     const earliest = new Date(now);
//     earliest.setDate(now.getDate() - 6);
//     const map = {};
//     for (let i = 0; i < 7; i++) {
//       const d = new Date(earliest);
//       d.setDate(earliest.getDate() + i);
//       const key = d.toISOString().slice(0, 10);
//       map[key] = 0;
//     }

//     const q = query(
//       collection(db, 'tickets'),
//       where('engineerId', '==', currentUserId),
//       where('supportStaffId', '==', '')
//     );
//     const snap = await getDocs(q);

//     let total = 0;
//     snap.forEach(doc => {
//       const d = doc.data().createdAt?.toDate?.() ?? new Date(doc.data().createdAt);
//       if (d >= earliest && d <= now) {
//         const key = d.toISOString().slice(0, 10);
//         map[key]++;
//         total++;
//       }
//     });

//     const labels = Object.keys(map).map(k =>
//       new Date(k).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
//     );
//     const values = Object.values(map);
//     return { total, labels, values };
//   };

//   const fetchFirstResponse = async () => {
//     const now = new Date();
//     const earliest = new Date(now);
//     earliest.setDate(now.getDate() - (respDays - 1));

//     const map = {};
//     for (let i = 0; i < respDays; i++) {
//       const d = new Date(earliest);
//       d.setDate(earliest.getDate() + i);
//       const key = d.toISOString().slice(0, 10);
//       map[key] = [];
//     }

//     const q = query(collection(db, 'tickets'), where('engineerId', '==', currentUserId));
//     const snap = await getDocs(q);

//     snap.forEach(doc => {
//       const data = doc.data();
//       if (data.acceptedAt && data.updatedAt) {
//         const acc = new Date(data.acceptedAt.toDate?.() ?? data.acceptedAt);
//         const upd = new Date(data.updatedAt.toDate?.() ?? data.updatedAt);
//         if (upd >= earliest && acc <= now) {
//           const key = acc.toISOString().slice(0, 10);
//           map[key]?.push((upd - acc) / 60000);
//         }
//       }
//     });

//     const labels = Object.keys(map).map(k =>
//       new Date(k).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
//     );
//     const values = Object.values(map).map(arr =>
//       arr.length ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)) : 0
//     );

//     setRespLabels(labels);
//     setRespData(values);
//   };

//   const fetchResolutionTime = async () => {
//     const now = new Date();
//     const earliest = new Date(now);
//     earliest.setDate(now.getDate() - (resDays - 1));

//     const map = {};
//     for (let i = 0; i < resDays; i++) {
//       const d = new Date(earliest);
//       d.setDate(earliest.getDate() + i);
//       const key = d.toISOString().slice(0, 10);
//       map[key] = [];
//     }

//     const q = query(collection(db, 'tickets'), where('engineerId', '==', currentUserId));
//     const snap = await getDocs(q);

//     snap.forEach(doc => {
//       const data = doc.data();
//       if (data.acceptedAt && data.closedAt) {
//         const acc = new Date(data.acceptedAt.toDate?.() ?? data.acceptedAt);
//         const close = new Date(data.closedAt.toDate?.() ?? data.closedAt);
//         if (close >= earliest && acc <= now) {
//           const key = acc.toISOString().slice(0, 10);
//           map[key]?.push((close - acc) / 60000);
//         }
//       }
//     });

//     const labels = Object.keys(map).map(k =>
//       new Date(k).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
//     );
//     const values = Object.values(map).map(arr =>
//       arr.length ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)) : 0
//     );

//     setResLabels(labels);
//     setResData(values);
//   };

//   const fetchCustomerSatisfaction = async () => {
//     const now = new Date();
//     const earliest = new Date(now);
//     earliest.setDate(now.getDate() - (satisDays - 1));

//     const q = query(collection(db, 'customer-ticket-reviews'));
//     const snap = await getDocs(q);

//     let high = 0, mid = 0, low = 0;

//     snap.forEach(doc => {
//       const data = doc.data();
//       const created = new Date(data.createdOn?.toDate?.() ?? data.createdOn);
//       if (created >= earliest && created <= now) {
//         const rating = parseInt(data.rating);
//         if (rating >= 4) high++;
//         else if (rating === 3) mid++;
//         else low++;
//       }
//     });

//     setSatisData([
//       { name: 'Highly Satisfied', population: high, color: '#00bcd4', legendFontColor: '#333', legendFontSize: 12 },
//       { name: 'Satisfied', population: mid, color: '#2196f3', legendFontColor: '#333', legendFontSize: 12 },
//       { name: 'Unsatisfied', population: low, color: '#9c27b0', legendFontColor: '#333', legendFontSize: 12 },
//     ]);
//   };

//   useEffect(() => {
//     if (!currentUserId) return;
//     setLoading(true);
//     Promise.all([
//       fetchStatusStats('OPEN').then(res => { setOpenCount(res.total); setOpenLabels(res.labels); setOpenData(res.values); }),
//       fetchStatusStats('IN_PROGRESS').then(res => { setInProgressCount(res.total); setInProgressLabels(res.labels); setInProgressData(res.values); }),
//       fetchStatusStats('CLOSED').then(res => { setClosedCount(res.total); setClosedLabels(res.labels); setClosedData(res.values); }),
//       fetchUnassigned().then(res => { setUnassignedCount(res.total); setUnassignedLabels(res.labels); setUnassignedData(res.values); }),
//     ]).finally(() => setLoading(false));
//   }, [currentUserId]);

//   useEffect(() => {
//     if (currentUserId) fetchFirstResponse();
//   }, [currentUserId, respDays]);

//   useEffect(() => {
//     if (currentUserId) fetchResolutionTime();
//   }, [currentUserId, resDays]);

//   useEffect(() => {
//     if (currentUserId) fetchCustomerSatisfaction();
//   }, [currentUserId, satisDays]);

//   const Card = ({ title, count, labels, values }) => (
//     <View style={styles.card}>
//       <Text style={styles.heading}>{title}</Text>
//       <Text style={styles.count}>{count}</Text>
//       <LineChart
//         data={{ labels, datasets: [{ data: values, color: () => '#4a90e2' }] }}
//         width={Dimensions.get('window').width - 70}
//         height={170}
//         chartConfig={{
//           backgroundGradientFrom: '#fff',
//           backgroundGradientTo: '#fff',
//           color: () => '#4a90e2',
//           labelColor: () => '#333',
//         }}
//         style={styles.chart}
//         bezier
//       />
//     </View>
//   );

//   if (loading) {
//     return <View style={styles.center}><ActivityIndicator size="large" /></View>;
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Card title="Tickets Open" count={openCount} labels={openLabels} values={openData} />
//       <Card title="Tickets In Progress" count={inProgressCount} labels={inProgressLabels} values={inProgressData} />
//       <Card title="Tickets Closed" count={closedCount} labels={closedLabels} values={closedData} />
//       <Card title="Tickets Unassigned" count={unassignedCount} labels={unassignedLabels} values={unassignedData} />

//       {/* First Response Time Card */}
//       <View style={styles.card}>
//         <View style={styles.row}>
//           <Text style={styles.heading}>First Response Time</Text>
//           <DropDownPicker
//             open={respOpen}
//             value={respDays}
//             items={STATUSES}
//             setOpen={setRespOpen}
//             setValue={setRespDays}
//             style={styles.dd}
//             containerStyle={{ width: 130 }}
//             dropDownContainerStyle={{ backgroundColor: '#fff' }}
//           />
//         </View>
//         <LineChart
//           data={{ labels: respLabels, datasets: [{ data: respData, color: () => '#e26a4a' }] }}
//           width={Dimensions.get('window').width - 70}
//           height={160}
//           chartConfig={{
//             backgroundGradientFrom: '#fff',
//             backgroundGradientTo: '#fff',
//             color: () => '#e26a4a',
//             labelColor: () => '#333',
//             decimalPlaces: 2,
//           }}
//           style={styles.chart}
//           bezier
//         />
//       </View>

//       {/* Avg. Resolution Time Card */}
//       <View style={styles.card}>
//         <View style={styles.row}>
//           <Text style={styles.heading}>Avg. Resolution Time</Text>
//           <DropDownPicker
//             open={resOpen}
//             value={resDays}
//             items={STATUSES}
//             setOpen={setResOpen}
//             setValue={setResDays}
//             style={styles.dd}
//             containerStyle={{ width: 130 }}
//             dropDownContainerStyle={{ backgroundColor: '#fff' }}
//           />
//         </View>
//         <LineChart
//           data={{ labels: resLabels, datasets: [{ data: resData, color: () => '#ff9800' }] }}
//           width={Dimensions.get('window').width - 70}
//           height={160}
//           chartConfig={{
//             backgroundGradientFrom: '#fff',
//             backgroundGradientTo: '#fff',
//             color: () => '#ff9800',
//             labelColor: () => '#333',
//             decimalPlaces: 2,
//           }}
//           style={styles.chart}
//           bezier
//         />
//       </View>

//       {/* Customer Satisfaction Card */}
//       <View style={styles.card}>
//         <View style={styles.row}>
//           <Text style={styles.heading}>Customer Satisfaction</Text>
//           <DropDownPicker
//             open={satisOpen}
//             value={satisDays}
//             items={STATUSES}
//             setOpen={setSatisOpen}
//             setValue={setSatisDays}
//             style={styles.dd}
//             containerStyle={{ width: 130 }}
//             dropDownContainerStyle={{ backgroundColor: '#fff' }}
//           />
//         </View>
//         <PieChart
//           data={satisData}
//           width={Dimensions.get('window').width - 70}
//           height={180}
//           chartConfig={{
//             color: () => '#333',
//             labelColor: () => '#333',
//           }}
//           accessor="population"
//           backgroundColor="transparent"
//           paddingLeft="15"
//           absolute
//         />
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 20, elevation: 3 },
//   heading: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
//   count: { fontSize: 28, fontWeight: 'bold', color: '#4a90e2', textAlign: 'center', marginBottom: 8 },
//   chart: { borderRadius: 8 },
//   row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   dd: { backgroundColor: '#fff', borderColor: '#ccc', marginBottom: 20 },
// });

//With First 4 Cards
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Dimensions,
//   ScrollView,
//   ActivityIndicator,
//   StyleSheet,
// } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { db } from '../firebase';

// export default function DashboardScreen() {
//   const [loading, setLoading] = useState(true);

//   const [openCount, setOpenCount] = useState(0);
//   const [openLabels, setOpenLabels] = useState([]);
//   const [openData, setOpenData] = useState([]);

//   const [inProgressCount, setInProgressCount] = useState(0);
//   const [inProgressLabels, setInProgressLabels] = useState([]);
//   const [inProgressData, setInProgressData] = useState([]);

//   const [closedCount, setClosedCount] = useState(0);
//   const [closedLabels, setClosedLabels] = useState([]);
//   const [closedData, setClosedData] = useState([]);

//   const [unassignedCount, setUnassignedCount] = useState(0);
//   const [unassignedLabels, setUnassignedLabels] = useState([]);
//   const [unassignedData, setUnassignedData] = useState([]);

//   useEffect(() => {
//     const fetchStatusStats = async (status) => {
//       const now = new Date();
//       const sevenDaysAgo = new Date(now);
//       sevenDaysAgo.setDate(now.getDate() - 6);

//       const statusMap = {};
//       for (let i = 0; i < 7; i++) {
//         const d = new Date(sevenDaysAgo);
//         d.setDate(sevenDaysAgo.getDate() + i);
//         const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
//         statusMap[label] = 0;
//       }

//       const ref = collection(db, 'tickets');
//       const q = query(ref, where('status', '==', status));
//       const snap = await getDocs(q);

//       let total = 0;
//       snap.forEach(doc => {
//         const data = doc.data();
//         const created = data.createdAt?.toDate?.() ?? new Date(data.createdAt);
//         if (created >= sevenDaysAgo && created <= now) {
//           const label = created.toLocaleDateString('en-GB', {
//             day: '2-digit',
//             month: 'short',
//           });
//           if (label in statusMap) {
//             statusMap[label]++;
//             total++;
//           }
//         }
//       });

//       const labels = Object.keys(statusMap);
//       const values = labels.map(label => statusMap[label]);

//       return { total, labels, values };
//     };

//     const fetchUnassignedStats = async (engineerId) => {
//       const now = new Date();
//       const sevenDaysAgo = new Date(now);
//       sevenDaysAgo.setDate(now.getDate() - 6);

//       const dateMap = {};
//       for (let i = 0; i < 7; i++) {
//         const d = new Date(sevenDaysAgo);
//         d.setDate(sevenDaysAgo.getDate() + i);
//         const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
//         dateMap[label] = 0;
//       }

//       const ticketsSnap = await getDocs(collection(db, 'tickets'));

//       let total = 0;

//       ticketsSnap.forEach((doc) => {
//         const data = doc.data();
//         const created = data.createdAt?.toDate?.() ?? new Date(data.createdAt);
//         const supportStaffIdEmpty =
//           !data.supportStaffId || data.supportStaffId.trim() === '';

//         if (
//           data.engineerId === engineerId &&
//           supportStaffIdEmpty &&
//           created >= sevenDaysAgo &&
//           created <= now
//         ) {
//           const label = created.toLocaleDateString('en-GB', {
//             day: '2-digit',
//             month: 'short',
//           });

//           if (label in dateMap) {
//             dateMap[label]++;
//             total++;
//           }
//         }
//       });

//       const labels = Object.keys(dateMap);
//       const values = labels.map(label => dateMap[label]);

//       return { total, labels, values };
//     };

//     const loadAllStats = async () => {
//       setLoading(true);
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;
//         if (!user) return;
//         const userId = user.uid;

//         const open = await fetchStatusStats('OPEN');
//         setOpenCount(open.total);
//         setOpenLabels(open.labels);
//         setOpenData(open.values);

//         const inProgress = await fetchStatusStats('IN_PROGRESS');
//         setInProgressCount(inProgress.total);
//         setInProgressLabels(inProgress.labels);
//         setInProgressData(inProgress.values);

//         const closed = await fetchStatusStats('CLOSED');
//         setClosedCount(closed.total);
//         setClosedLabels(closed.labels);
//         setClosedData(closed.values);

//         const unassigned = await fetchUnassignedStats(userId);
//         setUnassignedCount(unassigned.total);
//         setUnassignedLabels(unassigned.labels);
//         setUnassignedData(unassigned.values);
//       } catch (err) {
//         console.error('Error loading dashboard:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadAllStats();
//   }, []);

//   const renderCard = (title, count, labels, values, color = '#4a90e2') => (
//     <View style={styles.card}>
//       <Text style={styles.heading}>{title}</Text>
//       <Text style={styles.count}>{count}</Text>
//       <LineChart
//         data={{
//           labels,
//           datasets: [{ data: values, color: () => color }],
//         }}
//         width={Dimensions.get('window').width - 50}
//         height={180}
//         chartConfig={{
//           backgroundGradientFrom: '#fff',
//           backgroundGradientTo: '#fff',
//           color: (opacity = 1) => color,
//           labelColor: () => '#333',
//           strokeWidth: 2,
//         }}
//         style={styles.chart}
//         bezier
//         fromZero
//       />
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#4a90e2" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {renderCard('Tickets Open', openCount, openLabels, openData, '#1E90FF')}
//       {renderCard('Tickets In Progress', inProgressCount, inProgressLabels, inProgressData, '#FFA500')}
//       {renderCard('Tickets Closed', closedCount, closedLabels, closedData, '#32CD32')}
//       {renderCard('Tickets Unassigned', unassignedCount, unassignedLabels, unassignedData, '#e74c3c')}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 5,
//     elevation: 3,
//     marginBottom: 20,
//     // width: 500
//   },
//   heading: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//     color: '#333',
//   },
//   count: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     color: '#4a90e2',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   chart: {
//     borderRadius: 8,
//     // paddingLeft: '-50'
//     marginLeft: -5,
//     width: 20
//   },
// });
