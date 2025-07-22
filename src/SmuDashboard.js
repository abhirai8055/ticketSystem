import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { db } from './firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

export default function SmuDashboard({ route }) {
  const { userUid } = route.params;
  const [scannedData, setScannedData] = useState(null);

  const onSuccess = e => {
    setScannedData(e.data);
    handleSaveToFirebase(e.data);
  };
const getById = async (id, table) => {
  try {
    const docRef = doc(db, table, id);
    const snap = await getDoc(docRef);

    return snap.data()
  } catch (error) {
    console.log(error);
  }
};
  const handleSaveToFirebase = async qrData => {
    try {
      const qrObject = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;

    //   console.log(qrObject);

      // Save to smu-battery-scans or smu-location-logs
      await addDoc(collection(db, 'smu-battery-scans'), {
        userId: userUid,
        scannedAt: new Date().toISOString(),
        locationId: '',
        locationName: '',
        modelNumber: qrObject.mn,
        serialNumber: qrObject.sn,
        timestamp: new Date().toISOString(),
      });


      Alert.alert('Success', 'Data saved to Firebase!');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save QR data.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <QRCodeScanner
        onRead={onSuccess}
        topContent={<Text>Scan a QR code</Text>}
        bottomContent={
          <TouchableOpacity
            style={{ padding: 10, backgroundColor: '#408BFF', borderRadius: 8 }}
            onPress={() => setScannedData(null)}
            disabled={!scannedData}
          >
            <Text style={{ color: '#fff' }}>Reset Scan</Text>
          </TouchableOpacity>
        }
      />
      {scannedData && <Text>Scanned Data: {JSON.stringify(scannedData)}</Text>}
    </View>
  );
}
