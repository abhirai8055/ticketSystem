import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { db } from './firebase';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  where,
  query,
} from 'firebase/firestore';
import QRCodeScanner from 'react-native-qrcode-scanner';

export default function SmuDashboard({ route }) {
  const { userUid } = route.params;
  const [scannedData, setScannedData] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'We need your camera access to scan QR codes.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasCameraPermission(true);
        } else {
          setHasCameraPermission(false);
          Alert.alert(
            'Permission Denied',
            'Camera access is required to scan QR codes.',
          );
        }
      } catch (err) {
        console.warn('Camera permission error:', err);
        setHasCameraPermission(false);
        Alert.alert('Error', 'Failed to request camera permission.');
      }
    } else {
      setHasCameraPermission(true);
    }
  };

  const getById = async (id, table) => {
    try {
      const docRef = doc(db, table, id);
      const snap = await getDoc(docRef);
      const data = snap.exists() ? snap.data() : null;
      console.log(`Fetched ${table} for id ${id}:`, data);
      return data;
    } catch (error) {
      console.log(`Error fetching ${table} for id ${id}:`, error.message);
      return null;
    }
  };

  const checkRegistration = async (sn, mn) => {
    try {
      const productsRef = collection(db, 'products');
      const q = query(
        productsRef,
        where('serialNumber', '==', sn),
        where('modelNumber', '==', mn),
      );
      const querySnapshot = await getDocs(q);
      console.log(
        'Query snapshot for products (sn:',
        sn,
        'mn:',
        mn,
        '):',
        querySnapshot.docs.map(doc => doc.data()),
      );
      let registrationExists = null;
      querySnapshot.forEach(doc => {
        const data = doc.data();
        registrationExists = data;
      });
      return registrationExists;
    } catch (error) {
      console.error('Error checking registration in Firestore:', error);
      throw new Error('Failed to check registration');
    }
  };

  const getModelById = async modelNumber => {
    try {
      const q = query(
        collection(db, 'models'),
        where('modelNumber', '==', modelNumber),
      );
      const snapshot = await getDocs(q);
      console.log(
        'Query snapshot for models (modelNumber:',
        modelNumber,
        '):',
        snapshot.docs.map(doc => doc.data()),
      );
      return snapshot.docs[0]?.data() || null;
    } catch (error) {
      console.error('Error fetching model by ID:', error);
      throw error;
    }
  };

  useEffect(() => {
    requestCameraPermission();

    const checkLocationStatus = async () => {
      const userData = await getById(userUid, 'stock-movement-users');

      if (!userData || !userData.locationId) {
        console.log('User data or locationId missing:', userData);
        setIsCameraActive(false);
        Alert.alert(
          'Error',
          'User location not found. Please contact support.',
        );
        return;
      }

      const locationId = userData.locationId;
      const locationData = await getById(locationId, 'location-master');
      if (!locationData) {
        setIsCameraActive(false);
        Alert.alert(
          'Error',
          'Location data not found. Please contact support.',
        );
        return;
      }

      const status = locationData.status || 'inactive';
      console.log('Location status:', status);
      if (status !== 'active') {
        console.log('Location is inactive, disabling camera');
        setIsCameraActive(false);
        Alert.alert('Error', 'Camera is inactive. Location is not active.');
      } else {
        setIsCameraActive(true);
      }
    };
    checkLocationStatus().catch(error =>
      console.log('Error in checkLocationStatus:', error.message),
    );
  }, [userUid]);

  const onSuccess = e => {
    if (!e.data) {
      console.log('No data found in QR code scan');
      Alert.alert('Error', 'No data found in QR code.');
      return;
    }
    setScannedData(e.data);
    handleSaveToFirebase(e.data);
  };

  const handleSaveToFirebase = async qrData => {
    try {
      let modelNumber, serialNumber;

      const url = new URL(qrData);
      const params = new URLSearchParams(url.search);

      serialNumber = params.get('sn');
      modelNumber = params.get('mn');

      if (!modelNumber || !serialNumber) {
        Alert.alert(
          'Error',
          'QR code must contain modelNumber (sn) and serialNumber (mn).',
        );
        setScannedData(null);
        return;
      }

      const userData = await getById(userUid, 'stock-movement-users');
      if (!userData || !userData.locationId) {
        console.log('User data or locationId missing during save:', userData);
        Alert.alert('Error', 'User location not found. Data cannot be saved.');
        setScannedData(null);
        return;
      }
      const locationId = userData.locationId;
      const locationData = await getById(locationId, 'location-master');

      if (!locationData) {
        console.log(
          'Location data not found during save for locationId:',
          locationId,
        );
        Alert.alert('Error', 'Location data not found in database.');
        setScannedData(null);
        return;
      }

      const status = locationData.status || 'inactive';
      if (status !== 'active') {
        console.log('Location inactive during save:', status);
        Alert.alert('Error', 'Data cannot be saved. Location is inactive.');
        setScannedData(null);
        return;
      }
      let batteryStatus = 'not-registered';
      try {
        const registrationData = await checkRegistration(
          serialNumber,
          modelNumber,
        );
        console.log(
          'Registration data (sn:',
          serialNumber,
          'mn:',
          modelNumber,
          '):',
          registrationData,
        );
        if (registrationData) {
          batteryStatus =
            registrationData.batteryStatus ||
            registrationData.status ||
            registrationData.state ||
            'not-registered';
        }
      } catch (error) {
        console.warn(
          'Error checking registration, using default batteryStatus:',
          error.message,
        );
      }

      let modelStatus = 'unknown';
      try {
        const modelData = await getModelById(modelNumber);
        console.log('Model data (modelNumber:', modelNumber, '):', modelData);
        if (modelData) {
          modelStatus =
            modelData.status ||
            modelData.modelStatus ||
            modelData.state ||
            'unknown';
        }
      } catch (error) {
        console.warn(
          'Error fetching model, using default modelStatus:',
          error.message,
        );
      }

      const smuName =
        userData.name ||
        userData.displayName ||
        userData.username ||
        'Unknown User';

      const saveData = {
        smuId: userUid,
        scannedAt: new Date().toISOString(),
        locationId: locationId,
        locationName: locationData.locationName || 'Unknown location',
        modelNumber: modelNumber,
        serialNumber: serialNumber,
        batteryStatus: batteryStatus,
        modelStatus: modelStatus,
        smuName: smuName,
      };
      console.log('Saving data to smu-battery-scans:', saveData);

      const docRef = await addDoc(
        collection(db, 'smu-battery-scans'),
        saveData,
      );
      console.log('Data saved to smu-battery-scans, document ID:', docRef.id);
      Alert.alert(
        'Success',
        'Data saved to Firebase! Document ID: ' + docRef.id,
      );
      setScannedData(null);
    } catch (error) {
      console.error('Error saving data:', error.message);
      Alert.alert(
        'Error',
        'Failed to save QR data. Error: ' +
          error.message +
          '. Please try again.',
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {isCameraActive && hasCameraPermission ? (
        <QRCodeScanner
          onRead={onSuccess}
          reactivate={true}
          reactivateTimeout={5000}
          showMarker={true}
          topContent={
            <Text style={{ padding: 10, textAlign: 'center' }}>
              Scan QR Code
            </Text>
          }
          bottomContent={
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor: '#408BFF',
                borderRadius: 8,
                margin: 10,
              }}
              onPress={() => setScannedData(null)}
              disabled={!scannedData}
            >
              <Text style={{ color: '#fff' }}>Reset Scan</Text>
            </TouchableOpacity>
          }
          cameraStyle={{ flex: 1 }}
          permissionDialogTitle="Camera Permission"
          permissionDialogMessage="We need your camera access"
          buttonPositive="OK"
          onPermissionDialogDismissed={() =>
            Alert.alert(
              'Permission Denied',
              'Camera access is required to scan QR code.',
            )
          }
          checkAndroid6Permissions={true}
          cameraType="back"
          torchMode="off"
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text>
            {!hasCameraPermission
              ? 'Camera permission denied.'
              : 'You cannot scan batteries. Contact support.'}
          </Text>
        </View>
      )}
      {scannedData && (
        <Text style={{ padding: 10 }}>
          Scanned Data:{' '}
          {typeof scannedData === 'string'
            ? scannedData
            : JSON.stringify(scannedData, null, 2)}
        </Text>
      )}
    </View>
  );
}

