import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import DropDownPicker from 'react-native-dropdown-picker';
import { db } from '../firebase';

const STATUSES = [
  { label: 'Last Day', value: 1 },
  { label: 'Last 7 Days', value: 7 },
  { label: 'Last 15 Days', value: 15 },
  { label: 'Last 30 Days', value: 30 },
];

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [openCount, setOpenCount] = useState(0);
  const [openLabels, setOpenLabels] = useState([]);
  const [openData, setOpenData] = useState([]);

  const [inProgressCount, setInProgressCount] = useState(0);
  const [inProgressLabels, setInProgressLabels] = useState([]);
  const [inProgressData, setInProgressData] = useState([]);

  const [closedCount, setClosedCount] = useState(0);
  const [closedLabels, setClosedLabels] = useState([]);
  const [closedData, setClosedData] = useState([]);

  const [unassignedCount, setUnassignedCount] = useState(0);
  const [unassignedLabels, setUnassignedLabels] = useState([]);
  const [unassignedData, setUnassignedData] = useState([]);

  const [respLabels, setRespLabels] = useState([]);
  const [respData, setRespData] = useState([]);
  const [respDays, setRespDays] = useState(7);
  const [respOpen, setRespOpen] = useState(false);

  const [resLabels, setResLabels] = useState([]);
  const [resData, setResData] = useState([]);
  const [resDays, setResDays] = useState(7);
  const [resOpen, setResOpen] = useState(false);

  const [satisOpen, setSatisOpen] = useState(false);
  const [satisDays, setSatisDays] = useState(7);
  const [satisData, setSatisData] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) setCurrentUserId(user.uid);
  }, []);

  const fetchStatusStats = async (status) => {
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

    const q = query(collection(db, 'tickets'), where('status', '==', status));
    const snap = await getDocs(q);

    let total = 0;
    snap.forEach(doc => {
      const d = doc.data().createdAt?.toDate?.() ?? new Date(doc.data().createdAt);
      if (d >= earliest && d <= now) {
        const key = d.toISOString().slice(0, 10);
        if (map[key] !== undefined) {
          map[key]++;
          total++;
        }
      }
    });

    const labels = Object.keys(map).map(k =>
      new Date(k).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    );
    const values = Object.values(map);
    return { total, labels, values };
  };

  const fetchUnassigned = async () => {
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

    const q = query(
      collection(db, 'tickets'),
      where('engineerId', '==', currentUserId),
      where('supportStaffId', '==', '')
    );
    const snap = await getDocs(q);

    let total = 0;
    snap.forEach(doc => {
      const d = doc.data().createdAt?.toDate?.() ?? new Date(doc.data().createdAt);
      if (d >= earliest && d <= now) {
        const key = d.toISOString().slice(0, 10);
        map[key]++;
        total++;
      }
    });

    const labels = Object.keys(map).map(k =>
      new Date(k).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    );
    const values = Object.values(map);
    return { total, labels, values };
  };

  const fetchFirstResponse = async () => {
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

    const q = query(collection(db, 'tickets'), where('engineerId', '==', currentUserId));
    const snap = await getDocs(q);

    snap.forEach(doc => {
      const data = doc.data();
      if (data.acceptedAt && data.updatedAt) {
        const acc = new Date(data.acceptedAt.toDate?.() ?? data.acceptedAt);
        const upd = new Date(data.updatedAt.toDate?.() ?? data.updatedAt);
        if (upd >= earliest && acc <= now) {
          const key = acc.toISOString().slice(0, 10);
          map[key]?.push((upd - acc) / 60000);
        }
      }
    });

    const labels = Object.keys(map).map(k =>
      new Date(k).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    );
    const values = Object.values(map).map(arr =>
      arr.length ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)) : 0
    );

    setRespLabels(labels);
    setRespData(values);
  };

  const fetchResolutionTime = async () => {
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

    const q = query(collection(db, 'tickets'), where('engineerId', '==', currentUserId));
    const snap = await getDocs(q);

    snap.forEach(doc => {
      const data = doc.data();
      if (data.acceptedAt && data.closedAt) {
        const acc = new Date(data.acceptedAt.toDate?.() ?? data.acceptedAt);
        const close = new Date(data.closedAt.toDate?.() ?? data.closedAt);
        if (close >= earliest && acc <= now) {
          const key = acc.toISOString().slice(0, 10);
          map[key]?.push((close - acc) / 60000);
        }
      }
    });

    const labels = Object.keys(map).map(k =>
      new Date(k).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    );
    const values = Object.values(map).map(arr =>
      arr.length ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)) : 0
    );

    setResLabels(labels);
    setResData(values);
  };

  const fetchCustomerSatisfaction = async () => {
    const now = new Date();
    const earliest = new Date(now);
    earliest.setDate(now.getDate() - (satisDays - 1));

    const q = query(collection(db, 'customer-ticket-reviews'));
    const snap = await getDocs(q);

    let high = 0, mid = 0, low = 0;

    snap.forEach(doc => {
      const data = doc.data();
      const created = new Date(data.createdOn?.toDate?.() ?? data.createdOn);
      if (created >= earliest && created <= now) {
        const rating = parseInt(data.rating);
        if (rating >= 4) high++;
        else if (rating === 3) mid++;
        else low++;
      }
    });

    setSatisData([
      { name: 'Highly Satisfied', population: high, color: '#00bcd4', legendFontColor: '#333', legendFontSize: 12 },
      { name: 'Satisfied', population: mid, color: '#2196f3', legendFontColor: '#333', legendFontSize: 12 },
      { name: 'Unsatisfied', population: low, color: '#9c27b0', legendFontColor: '#333', legendFontSize: 12 },
    ]);
  };

  useEffect(() => {
    if (!currentUserId) return;
    setLoading(true);
    Promise.all([
      fetchStatusStats('OPEN').then(res => { setOpenCount(res.total); setOpenLabels(res.labels); setOpenData(res.values); }),
      fetchStatusStats('IN_PROGRESS').then(res => { setInProgressCount(res.total); setInProgressLabels(res.labels); setInProgressData(res.values); }),
      fetchStatusStats('CLOSED').then(res => { setClosedCount(res.total); setClosedLabels(res.labels); setClosedData(res.values); }),
      fetchUnassigned().then(res => { setUnassignedCount(res.total); setUnassignedLabels(res.labels); setUnassignedData(res.values); }),
    ]).finally(() => setLoading(false));
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId) fetchFirstResponse();
  }, [currentUserId, respDays]);

  useEffect(() => {
    if (currentUserId) fetchResolutionTime();
  }, [currentUserId, resDays]);

  useEffect(() => {
    if (currentUserId) fetchCustomerSatisfaction();
  }, [currentUserId, satisDays]);

  const Card = ({ title, count, labels, values }) => (
    <View style={styles.card}>
      <Text style={styles.heading}>{title}</Text>
      <Text style={styles.count}>{count}</Text>
      <LineChart
        data={{ labels, datasets: [{ data: values, color: () => '#4a90e2' }] }}
        width={Dimensions.get('window').width - 70}
        height={170}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: () => '#4a90e2',
          labelColor: () => '#333',
        }}
        style={styles.chart}
        bezier
      />
    </View>
  );

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card title="Tickets Open" count={openCount} labels={openLabels} values={openData} />
      <Card title="Tickets In Progress" count={inProgressCount} labels={inProgressLabels} values={inProgressData} />
      <Card title="Tickets Closed" count={closedCount} labels={closedLabels} values={closedData} />
      <Card title="Tickets Unassigned" count={unassignedCount} labels={unassignedLabels} values={unassignedData} />

      {/* First Response Time Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.heading}>First Response Time</Text>
          <DropDownPicker
            open={respOpen}
            value={respDays}
            items={STATUSES}
            setOpen={setRespOpen}
            setValue={setRespDays}
            style={styles.dd}
            containerStyle={{ width: 130 }}
            dropDownContainerStyle={{ backgroundColor: '#fff' }}
          />
        </View>
        <LineChart
          data={{ labels: respLabels, datasets: [{ data: respData, color: () => '#e26a4a' }] }}
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
      </View>

      {/* Avg. Resolution Time Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.heading}>Avg. Resolution Time</Text>
          <DropDownPicker
            open={resOpen}
            value={resDays}
            items={STATUSES}
            setOpen={setResOpen}
            setValue={setResDays}
            style={styles.dd}
            containerStyle={{ width: 130 }}
            dropDownContainerStyle={{ backgroundColor: '#fff' }}
          />
        </View>
        <LineChart
          data={{ labels: resLabels, datasets: [{ data: resData, color: () => '#ff9800' }] }}
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
      </View>

      {/* Customer Satisfaction Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.heading}>Customer Satisfaction</Text>
          <DropDownPicker
            open={satisOpen}
            value={satisDays}
            items={STATUSES}
            setOpen={setSatisOpen}
            setValue={setSatisDays}
            style={styles.dd}
            containerStyle={{ width: 130 }}
            dropDownContainerStyle={{ backgroundColor: '#fff' }}
          />
        </View>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 20, elevation: 3 },
  heading: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  count: { fontSize: 28, fontWeight: 'bold', color: '#4a90e2', textAlign: 'center', marginBottom: 8 },
  chart: { borderRadius: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dd: { backgroundColor: '#fff', borderColor: '#ccc', marginBottom: 20 },
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
