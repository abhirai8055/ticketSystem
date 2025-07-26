// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Alert } from 'react-native';
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import { db } from './firebase';
// import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

// export default function SmuDashboard({ route }) {
//   const { userUid } = route.params;
//   const [scannedData, setScannedData] = useState(null);

//   const onSuccess = e => {
//     setScannedData(e.data);
//     handleSaveToFirebase(e.data);
//   };
// const getById = async (id, table) => {
//   try {
//     const docRef = doc(db, table, id);
//     const snap = await getDoc(docRef);
//     return snap.data()
//   } catch (error) {
//     console.log(error);
//   }
// };
//   const handleSaveToFirebase = async qrData => {
//     try {
//       const qrObject = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;

//       console.log(qrObject);

//       // Save to smu-battery-scans or smu-location-logs
//       await addDoc(collection(db, 'smu-battery-scans'), {
//         userId: userUid,
//         scannedAt: new Date().toISOString(),
//         locationId: '',
//         locationName: '',
//         modelNumber: qrObject.modelNumber,
//         serialNumber: qrObject.serialNumber,
//         timestamp: new Date().toISOString(),
//       });


//       Alert.alert('Success', 'Data saved to Firebase!');
//     } catch (error) {
//       console.error('Error saving data:', error);
//       Alert.alert('Error', 'Failed to save QR data.');
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <QRCodeScanner
//         onRead={onSuccess}
//         topContent={<Text>Scan a QR code</Text>}
//         bottomContent={
//           <TouchableOpacity
//             style={{ padding: 10, backgroundColor: '#408BFF', borderRadius: 8 }}
//             onPress={() => setScannedData(null)}
//             disabled={!scannedData}
//           >
//             <Text style={{ color: '#fff' }}>Submit Scan</Text>
//           </TouchableOpacity>
//         }
//       />
//       {scannedData && <Text>Scanned Data: {JSON.stringify(scannedData)}</Text>}
//     </View>
//   );
// }
// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Alert, Platform, Linking } from 'react-native';
// import { db } from './firebase';
// import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
// import QRCodeScanner from 'react-native-qrcode-scanner';

// export default function SmuDashboard({ route }) {
//   const { userUid } = route.params;
//   const [scannedData, setScannedData] = useState(null);
//   const [isCameraActive, setIsCameraActive] = useState(false);

//   const getById = async (id, table) => {
//     try {
//       const docRef = doc(db, table, id);
//       const snap = await getDoc(docRef);
//       return snap.exists() ? snap.data() : null;
//     } catch (error) {
//       console.log('Error fetching document:', error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const checkLocationStatus = async () => {
//       const userData = await getById(userUid, 'users');
//       if (!userData || !userData.locationId) {
//         console.log('No user data or locationId found for userUid:', userUid);
//         setIsCameraActive(false);
//         Alert.alert('Error', 'User location not found. Please contact support.');
//         return;
//       }

//       const locationId = userData.locationId;
//       const locationData = await getById(locationId, 'location-master');
//       if (!locationData) {
//         console.log('No location data found for locationId:', locationId);
//         setIsCameraActive(false);
//         Alert.alert('Error', 'Location not found. Please contact support.');
//       } else if (locationData.active !== true) { 
//         console.log('Location is inactive for locationId:', locationId);
//         setIsCameraActive(false);
//         Alert.alert('Error', 'Camera is disabled. Location is inactive.');
//       } else {
//         console.log('Location is active for locationId:', locationId);
//         setIsCameraActive(true);
//       }
//     };
//     checkLocationStatus();
//   }, [userUid]);

//   const onSuccess = e => {
//     console.log('QR code scanned, raw data:', e.data);
//     setScannedData(e.data);
//     handleSaveToFirebase(e.data);
//   };

//   const handleSaveToFirebase = async qrData => {
//     try {
//       let qrObject;
//       try {
//         qrObject = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
//       } catch (error) {
//         console.error('Error parsing QR data:', error);
//         Alert.alert('Error', 'Invalid QR code format. Please scan a valid QR code.');
//         setScannedData(null);
//         return;
//       }
//       console.log('QR Data:', qrObject);

//       // Use locationId from user data
//       const userData = await getById(userUid, 'users');
//       if (!userData || !userData.locationId) {
//         Alert.alert('Error', 'User location not found. Cannot save data.');
//         setScannedData(null);
//         return;
//       }
//       const locationId = userData.locationId;
//       const locationData = await getById(locationId, 'location-master');

//       if (!locationData) {
//         Alert.alert('Error', 'Location not found in database.');
//         setScannedData(null);
//         return;
//       }
//       if (locationData.active !== true) {
//         Alert.alert('Error', 'Cannot save data. Location is inactive.');
//         setScannedData(null);
//         return;
//       }

//       const modelNumber = qrObject.mn || qrObject.modelNumber;
//       const serialNumber = qrObject.sn || qrObject.serialNumber;

//       if (!modelNumber || !serialNumber) {
//         Alert.alert('Error', 'QR code must contain modelNumber and serialNumber.');
//         setScannedData(null);
//         return;
//       }

//       await addDoc(collection(db, 'smu-battery-scans'), {
//         userId: userUid,
//         scannedAt: new Date().toISOString(),
//         locationId: locationId,
//         locationName: locationData.locationName || 'Unknown Location',
//         modelNumber: modelNumber,
//         serialNumber: serialNumber,
//         timestamp: new Date().toISOString(),
//       });

//       Alert.alert('Success', 'Data saved to Firebase!');
//       setScannedData(null);
//     } catch (error) {
//       console.error('Error saving data:', error);
//       Alert.alert('Error', 'Failed to save QR data. Please try again.');
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       {isCameraActive ? (
//         <QRCodeScanner
//           onRead={onSuccess}
//           reactivate={true}
//           reactivateTimeout={5000}
//           showMarker={true}
//           topContent={<Text style={{ padding: 10, textAlign: 'center' }}>Scan a QR code</Text>}
//           bottomContent={
//             <TouchableOpacity
//               style={{ padding: 10, backgroundColor: '#408BFF', borderRadius: 8, margin: 10 }}
//               onPress={() => setScannedData(null)}
//               disabled={!scannedData}
//             >
//               <Text style={{ color: '#fff' }}>Reset Scan</Text>
//             </TouchableOpacity>
//           }
//           cameraStyle={{ height: '100%' }}
//           permissionDialogTitle="Permission to use camera"
//           permissionDialogMessage="We need your permission to use your camera"
//           buttonPositive="OK"
//           onPermissionDialogDismissed={() => Alert.alert('Permission Denied', 'Camera access is required to scan QR codes.')}
//         />
//       ) : (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <Text>You cannot scan the battery. Contact support.</Text>
//         </View>
//       )}
//       {scannedData && <Text style={{ padding: 10 }}>Scanned Data: {JSON.stringify(scannedData)}</Text>}
//     </View>
//   );
// }
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform, PermissionsAndroid } from 'react-native';
import { db } from './firebase';
import { collection, addDoc, doc, getDoc, getDocs, where, query } from 'firebase/firestore';
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
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
          setHasCameraPermission(true);
        } else {
          console.log('Camera permission denied');
          setHasCameraPermission(false);
          Alert.alert('Permission Denied', 'Camera access is required to scan QR codes.');
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
      const q = query(productsRef, where('serialNumber', '==', sn), where('modelNumber', '==', mn));
      const querySnapshot = await getDocs(q);
      console.log('Query snapshot for products (sn:', sn, 'mn:', mn, '):', querySnapshot.docs.map(doc => doc.data()));
      let registrationExists = null;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        registrationExists = data;
      });
      return registrationExists;
    } catch (error) {
      console.error('Error checking registration in Firestore:', error);
      throw new Error('Failed to check registration');
    }
  };

  const getModelById = async (modelNumber) => {
    try {
      const q = query(collection(db, 'models'), where('modelNumber', '==', modelNumber));
      const snapshot = await getDocs(q);
      console.log('Query snapshot for models (modelNumber:', modelNumber, '):', snapshot.docs.map(doc => doc.data()));
      return snapshot.docs[0]?.data() || null;
    } catch (error) {
      console.error('Error fetching model by ID:', error);
      throw error;
    }
  };

  useEffect(() => {
    requestCameraPermission();
    
    const checkLocationStatus = async () => {
      console.log('Checking location status for userUid:', userUid);
      const userData = await getById(userUid, 'stock-movement-users');
      console.log('User data fetched:', userData);

      if (!userData || !userData.locationId) {
        console.log('User data or locationId missing:', userData);
        setIsCameraActive(false);
        Alert.alert('Error', 'User location not found. Please contact support.');
        return;
      }

      const locationId = userData.locationId;
      console.log('Using locationId from user:', locationId);
      const locationData = await getById(locationId, 'location-master');
      if (!locationData) {
        console.log('Location data not found for locationId:', locationId);
        setIsCameraActive(false);
        Alert.alert('Error', 'Location data not found. Please contact support.');
        return;
      }

      const status = locationData.status || 'inactive';
      console.log('Location status:', status);
      if (status !== 'active') {
        console.log('Location is inactive, disabling camera');
        setIsCameraActive(false);
        Alert.alert('Error', 'Camera is inactive. Location is not active.');
      } else {
        console.log('Location is active, enabling camera for locationId:', locationId);
        setIsCameraActive(true);
      }
    };
    checkLocationStatus().catch(error => console.log('Error in checkLocationStatus:', error.message));
  }, [userUid]);

  const onSuccess = (e) => {
    console.log('QR code scanned, raw data:', e.data);
    if (!e.data) {
      console.log('No data found in QR code scan');
      Alert.alert('Error', 'No data found in QR code.');
      return;
    }
    setScannedData(e.data);
    handleSaveToFirebase(e.data);
  };

  const handleSaveToFirebase = async (qrData) => {
    try {
      console.log('Raw QR data received:', qrData);
      let modelNumber, serialNumber;

      const urlParams = new URLSearchParams(qrData.split('?')[1]);
      serialNumber = urlParams.get('sn'); 
      modelNumber = urlParams.get('mn'); 

      console.log('Parsed serialNumber:', serialNumber, 'modelNumber:', modelNumber);

      if (!modelNumber || !serialNumber) {
        console.log('ModelNumber or serialNumber missing in QR data:', qrData);
        Alert.alert('Error', 'QR code must contain modelNumber (sn) and serialNumber (mn).');
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
        console.log('Location data not found during save for locationId:', locationId);
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
      let batteryStatus = 'unknown';
      try {
        const registrationData = await checkRegistration(serialNumber, modelNumber);
        console.log('Registration data (sn:', serialNumber, 'mn:', modelNumber, '):', registrationData);
        if (registrationData) {
          batteryStatus = registrationData.batteryStatus || registrationData.status || registrationData.state || 'unknown';
        }
      } catch (error) {
        console.warn('Error checking registration, using default batteryStatus:', error.message);
      }

      let modelStatus = 'unknown';
      try {
        const modelData = await getModelById(modelNumber);
        console.log('Model data (modelNumber:', modelNumber, '):', modelData);
        if (modelData) {
          modelStatus = modelData.status || modelData.modelStatus || modelData.state || 'unknown';
        }
      } catch (error) {
        console.warn('Error fetching model, using default modelStatus:', error.message);
      }

      const smuName = userData.name || userData.displayName || userData.username || 'Unknown User';

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

      const docRef = await addDoc(collection(db, 'smu-battery-scans'), saveData);
      console.log('Data saved to smu-battery-scans, document ID:', docRef.id);
      Alert.alert('Success', 'Data saved to Firebase! Document ID: ' + docRef.id);
      setScannedData(null);
    } catch (error) {
      console.error('Error saving data:', error.message);
      Alert.alert('Error', 'Failed to save QR data. Error: ' + error.message + '. Please try again.');
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
          topContent={<Text style={{ padding: 10, textAlign: 'center' }}>Scan QR Code</Text>}
          bottomContent={
            <TouchableOpacity
              style={{ padding: 10, backgroundColor: '#408BFF', borderRadius: 8, margin: 10 }}
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
          onPermissionDialogDismissed={() => Alert.alert('Permission Denied', 'Camera access is required to scan QR code.')}
          checkAndroid6Permissions={true}
          cameraType="back"
          torchMode="off"
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>{!hasCameraPermission ? 'Camera permission denied.' : 'You cannot scan batteries. Contact support.'}</Text>
        </View>
      )}
      {scannedData && (
        <Text style={{ padding: 10 }}>
          Scanned Data: {typeof scannedData === 'string' ? scannedData : JSON.stringify(scannedData, null, 2)}
        </Text>
      )}
    </View>
  );
}