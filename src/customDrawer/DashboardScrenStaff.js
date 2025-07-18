import React, { use, useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import DropDownPicker from 'react-native-dropdown-picker';
import { db } from '../firebase';
import { Alert, BackHandler } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const STATUSES = [
  { label: 'Last Day', value: 1 },
  { label: 'Last 7 Days', value: 7 },
  { label: 'Last 15 Days', value: 15 },
  { label: 'Last 30 Days', value: 30 },
];

const STATUSESYEARS = [
  { label: 'This Day', value: 1 },
  { label: 'This Weeks', value: 7 },
  { label: 'This Months', value: 15 },
  { label: 'This years', value: 30 },
];
export default function DashboardScreenStaff() {
  const navigation = useNavigation();
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
  const [satisDataCategory, setSatisDataCategory] = useState([]);

  const [priorityLabels, setPriorityLabels] = useState([]);
  const [priorityData, setPriorityData] = useState({
    Low: [],
    Medium: [],
    High: [],
    Urgent: [],
  });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
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
        return true; // prevent default back action
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    },[]),
  );
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) setCurrentUserId(user.uid);
  }, []);

  const fetchStatusStats = async status => {
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

    const fetchPriorityStats = async () => {
      const now = new Date();
      const earliest = new Date(now);
      earliest.setDate(now.getDate() - 6);

      const days = {};
      for (let i = 0; i < 7; i++) {
        const d = new Date(earliest);
        d.setDate(earliest.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        days[key] = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
      }

      const q = query(collection(db, 'tickets'));
      const snap = await getDocs(q);

      snap.forEach(doc => {
        const data = doc.data();
        const createdAt =
          data.createdAt?.toDate?.() ?? new Date(data.createdAt);
        const priority = data.priority || 'Low';
        if (createdAt >= earliest && createdAt <= now) {
          const key = createdAt.toISOString().slice(0, 10);
          if (days[key]) days[key][priority] = (days[key][priority] || 0) + 1;
        }
      });

      const labels = Object.keys(days).map(k =>
        new Date(k).toLocaleDateString('en-GB', {
          weekday: 'short',
        }),
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
      setPriorityData({
        Low: low,
        Medium: medium,
        High: high,
        Urgent: urgent,
      });
    };

    const q = query(collection(db, 'tickets'), where('status', '==', status));
    const snap = await getDocs(q);

    let total = 0;
    snap.forEach(doc => {
      const d =
        doc.data().createdAt?.toDate?.() ?? new Date(doc.data().createdAt);
      if (d >= earliest && d <= now) {
        const key = d.toISOString().slice(0, 10);
        if (map[key] !== undefined) {
          map[key]++;
          total++;
        }
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
  };

  const fetchPriorityStats = async () => {
    const now = new Date();
    const earliest = new Date(now);
    earliest.setDate(now.getDate() - 6);

    const days = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(earliest);
      d.setDate(earliest.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      days[key] = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
    }

    const q = query(collection(db, 'tickets'));
    const snap = await getDocs(q);

    snap.forEach(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.() ?? new Date(data.createdAt);
      const priority = data.priority || 'Low';
      if (createdAt >= earliest && createdAt <= now) {
        const key = createdAt.toISOString().slice(0, 10);
        if (days[key]) days[key][priority] = (days[key][priority] || 0) + 1;
      }
    });

    const labels = Object.keys(days).map(k =>
      new Date(k).toLocaleDateString('en-GB', {
        weekday: 'short',
      }),
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
      where('supportStaffId', '==', currentUserId),
      where('engineerId', '==', ''),
    );
    const snap = await getDocs(q);

    let total = 0;
    snap.forEach(doc => {
      const d =
        doc.data().createdAt?.toDate?.() ?? new Date(doc.data().createdAt);
      if (d >= earliest && d <= now) {
        const key = d.toISOString().slice(0, 10);
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

    const q = query(
      collection(db, 'tickets'),
      where('supportStaffId', '==', currentUserId),
    );
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

    const q = query(
      collection(db, 'tickets'),
      where('supportStaffId', '==', currentUserId),
    );
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
  };

  const fetchCustomerSatisfaction = async () => {
    const now = new Date();
    const earliest = new Date(now);
    earliest.setDate(now.getDate() - (satisDays - 1));

    const q = query(collection(db, 'customer-ticket-reviews'));
    const snap = await getDocs(q);

    let high = 0,
      mid = 0,
      low = 0;

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

    setSatisDataCategory([
      {
        name: 'Tickets by Category 1',
        population: high,
        color: '#0863ebff',
        legendFontColor: '#333',
        legendFontSize: 12,
      },
      {
        name: 'Tickets by Category 2',
        population: mid,
        color: '#931ef2ff',
        legendFontColor: '#333',
        legendFontSize: 12,
      },
      {
        name: 'Tickets by Category 4',
        population: low,
        color: '#fd6900ff',
        legendFontColor: '#333',
        legendFontSize: 12,
      },
    ]);
  };

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
      }),
      fetchUnassigned().then(res => {
        setUnassignedCount(res.total);
        setUnassignedLabels(res.labels);
        setUnassignedData(res.values);
      }),
      fetchPriorityStats().then(res => {
        setUnassignedCount(res.total);
        setUnassignedLabels(res.labels);
        setUnassignedData(res.values);
      }),
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
    <View style={styles.MainCard}>
      <View style={styles.Icon}>
        <Image
          source={require('../images/tickets.png')}
          style={{ width: 20, height: 20, padding: 10 }}
        />
        <Text style={styles.heading}>{title}</Text>
      </View>
      <Text style={styles.count}>{count}</Text>
    </View>
  );

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
        {/* Tickets Cards */}
        <Card
          title="My Tickets"
          count={openCount}
          labels={openLabels}
          values={openData}
        />
        <Card
          title="Tickets Open"
          count={inProgressCount}
          labels={inProgressLabels}
          values={inProgressData}
        />
        <Card
          title="Tickets in Progress"
          count={closedCount}
          labels={closedLabels}
          values={closedData}
        />
        <Card
          title="Tickets Closed"
          count={unassignedCount}
          labels={unassignedLabels}
          values={unassignedData}
        />
      </View>
      <View style={styles.cardChart}>
        <View style={styles.row}>
          <View>
            <Text style={styles.heading}>New Tickets Created</Text>
            <Text style={styles.headingTwo}>This Week</Text>
          </View>
          <DropDownPicker
            open={respOpen}
            value={respDays}
            items={STATUSESYEARS}
            setOpen={setRespOpen}
            setValue={setRespDays}
            style={styles.dd}
            containerStyle={{ width: 130 }}
            dropDownContainerStyle={{ backgroundColor: '#fff' }}
          />
        </View>

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
      </View>

      {/* First Response Time Card */}
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
            items={STATUSES}
            setOpen={setRespOpen}
            setValue={setRespDays}
            style={styles.dd}
            containerStyle={{ width: 130 }}
            dropDownContainerStyle={{ backgroundColor: '#fff' }}
          />
        </View>
        {/* <LineChart
          data={{ labels: respLabels, datasets: [{ data: respData, color: () => '#e26a4a' }] }}
          width={Dimensions.get('window').width - 70}
          height={160}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: () => '#e26a4a',
            labelColor: () => '#333',
            decimalPlaces: 2,
          }}f
          style={styles.chart}
          bezier
        /> */}
      </View>

      {/* Avg. Resolution Time Card */}
      <View style={styles.cardChart}>
        <View style={styles.row}>
          <View style={styles.rowTwo}>
            <Text style={styles.heading}>First Response Time</Text>
            <Text style={styles.headingTwo}>
              Average time to respond to tickets
            </Text>
          </View>
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
        {/* <LineChart
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
        /> */}
      </View>

      {/* Customer Satisfaction Card */}
      <View style={styles.cardChart}>
        <View style={styles.row}>
          <Text style={styles.heading}>Customer Satisfaction</Text>
          <DropDownPicker
            open={satisOpen}
            value={satisDays}
            items={STATUSESYEARS}
            setOpen={setSatisOpen}
            setValue={setSatisDays}
            style={styles.dd}
            containerStyle={{ width: 150 }}
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

      {/* Tickets by Category */}
      <View style={styles.cardChart}>
        <View style={styles.row}>
          <Text style={styles.heading}>Customer Satisfaction</Text>
        </View>
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
    alignItems: 'start',
    justifyContent: 'space-between',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    width: '48%',
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
    fontSize: 16,
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
    marginTop: 10,
    marginBottom: 5,
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
    flexDirection: 'column',
    gap: 10,
    // alignItems: 'center',
    // marginBottom: 10,
  },
  dd: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    zIndex: 50,
    marginTop: 10,
  },
});
