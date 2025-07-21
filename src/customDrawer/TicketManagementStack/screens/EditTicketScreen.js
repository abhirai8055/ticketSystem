import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function EditTicketScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { ticketId } = route.params;

  const [ticket, setTicket] = useState(null);
  const [associatedData, setAssociatedData] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketRef = doc(db, 'tickets', ticketId);
        const ticketSnap = await getDoc(ticketRef);
        if (ticketSnap.exists()) {
          const ticketData = ticketSnap.data();
          setTicket(ticketData);
          setTitle(ticketData.title || '');
          setCategory(ticketData.category || '');
          setDescription(ticketData.description || '');
          setName(ticketData.complainee_name || '');
          setContact(ticketData.complainee_number || '');
          setAddress(ticketData.complainee_address_1 || '');
          setCity(ticketData.complainee_city || '');
          setState(ticketData.complainee_state || '');
          setPincode(ticketData.complainee_pincode || '');

          const key = `${ticketData.modelId}_${ticketData.serialNumber}`;
          const productRef = doc(db, 'products', key);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            const productData = productSnap.data();
            setAssociatedData(productData);
            setModelNumber(productData.modelNumber || '');
            setSerialNumber(productData.serialNumber || '');
          }
        } else {
          Alert.alert('Error', 'Ticket not found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load ticket details');
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchData();
    }
  }, [ticketId]);

  const handleSave = async () => {
    if (
      !title ||
      !category ||
      !description ||
      !name ||
      !contact ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, {
        title,
        category,
        description,
        complainee_name: name,
        complainee_number: contact,
        complainee_address_1: address,
        complainee_city: city,
        complainee_state: state,
        complainee_pincode: pincode,
        updatedAt: new Date().toISOString(),
      });

      const key = `${ticket.modelId}_${ticket.serialNumber}`;
      const productRef = doc(db, 'products', key);
      await updateDoc(productRef, {
        modelNumber,
        serialNumber,
      });

      Alert.alert('Success', 'Ticket updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating ticket:', error);
      Alert.alert('Error', 'Failed to update ticket');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!ticket || !associatedData) {
    return (
      <View style={styles.center}>
        <Text>Ticket or associated data not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.pageWrapper}>
      <View style={styles.formWrapper}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter ticket title"
        />

        <Text style={styles.label}>Category *</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="Enter category"
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          multiline
        />

        <Text style={styles.label}>Model Number *</Text>
        <TextInput
          style={styles.input}
          value={modelNumber}
          onChangeText={setModelNumber}
          placeholder="Enter model number"
        />

        <Text style={styles.label}>Serial Number *</Text>
        <TextInput
          style={styles.input}
          value={serialNumber}
          onChangeText={setSerialNumber}
          placeholder="Enter serial number"
        />

        <Text style={styles.label}>Contact Details</Text>
        <Text style={styles.subLabel}>Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
        />

        <Text style={styles.subLabel}>Contact *</Text>
        <TextInput
          style={styles.input}
          value={contact}
          onChangeText={setContact}
          placeholder="Enter contact number"
          keyboardType="phone-pad"
        />

        <Text style={styles.subLabel}>Address *</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter address"
          multiline
        />

        <Text style={styles.subLabel}>City *</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Enter city"
        />

        <Text style={styles.subLabel}>State *</Text>
        <TextInput
          style={styles.input}
          value={state}
          onChangeText={setState}
          placeholder="Enter state"
        />

        <Text style={styles.subLabel}>Pincode *</Text>
        <TextInput
          style={styles.input}
          value={pincode}
          onChangeText={setPincode}
          placeholder="Enter pincode"
          keyboardType="number-pad"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
