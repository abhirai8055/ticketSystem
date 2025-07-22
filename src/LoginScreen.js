// import React, { useState } from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   Alert,
//   StyleSheet,
//   SafeAreaView,
//   Image,
// } from 'react-native';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth, db } from './firebase';
// import { doc, getDoc } from 'firebase/firestore';

// export default function LoginScreen({ navigation }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'Please enter both email and password');
//       return;
//     }
//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;

//       const userDocRef = doc(db, 'users', user.uid);
//       const userDoc = await getDoc(userDocRef);

//       if (userDoc.exists()) {
//         navigation.navigate('AppNavigater', { userUid: user.uid });
//       } else {
//         Alert.alert('Error', 'No profile found for this user.');
//       }
//     } catch (error) {
//       Alert.alert('Login Failed', error.message);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.logoContainer}>
//         <Image
//           source={require('./images/logo.webp')}
//           style={styles.logo}
//         />
//         <Text style={styles.title}>JATL</Text>
//       </View>

//       <View style={styles.formContainer}>
//         <View style={styles.headerCard}>
//           <Text style={styles.headerText}>Log Into Your Account</Text>
//           <Text style={styles.subHeaderText}>We're glad to see you again!</Text>
//         </View>

//         <Text style={styles.label}>Email</Text>
//         <TextInput
//           placeholder="Enter your email"
//           value={email}
//           style={styles.input}
//           onChangeText={setEmail}
//           autoCapitalize="none"
//           keyboardType="email-address"
//         />

//         <Text style={styles.label}>Password</Text>
//         <TextInput
//           placeholder="Enter your password"
//           value={password}
//           style={styles.input}
//           secureTextEntry
//           onChangeText={setPassword}
//         />

//         <Text style={styles.agree}>
//           I agree to the <Text style={styles.terms}>Terms and Conditions</Text>
//         </Text>

//         <TouchableOpacity style={styles.button} onPress={handleLogin}>
//           <Text style={styles.buttonText}>Submit</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f4f6fa',
//     paddingTop: 90
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 80
//   },
//   logo: {
//     width: 50,
//     height: 50,
//     marginRight: 10,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   formContainer: {
//     marginHorizontal: 20,
//     padding: 20,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },

//   },
//   headerCard: {
//     backgroundColor: '#408BFF',
//     padding: 20,
//     borderRadius: 10,
//     marginBottom: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     marginTop: -50,
//     shadowOpacity: 0.1,
//      marginHorizontal: 20,
//     elevation: 5,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },
//   },
//   headerText: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   subHeaderText: {
//     color: '#fff',
//     fontSize: 14,
//     marginTop: 8,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 15,
//     marginBottom: 5,
//     color: '#333',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     fontSize: 16,
//     backgroundColor: '#f9f9f9',
//   },
//   agree: {
//     textAlign: 'center',
//     fontSize: 14,
//     marginVertical: 15,
//     color: '#333',
//   },
//   terms: {
//     textDecorationLine: 'underline',
//     color: '#408BFF',
//     fontWeight: '600',
//   },
//   button: {
//     backgroundColor: '#408BFF',
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 17,
//     fontWeight: 'bold',
//   },
// });

import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter Your Email and Password');
      return;
    }

    setLoading(true); // Start loading
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (!userData.role) {
          Alert.alert('Error', 'User role not assigned.');
          return;
        }

        const roleDocRef = doc(db, 'roles', userData.role);
        const roleDoc = await getDoc(roleDocRef);

        if (!roleDoc.exists()) {
          Alert.alert('Error', 'Invalid role assigned to user.');
          return;
        }

        const roleData = roleDoc.data();
        const roleName = roleData.roleName?.toLowerCase();

        let userType = '';
        if (roleName.includes('engineer')) userType = 'engineer';
        else if (roleName.includes('support')) userType = 'supportStaff';

        navigation.navigate('AppNavigater', {
          userUid: user.uid,
          userType,
        });
      } else {
        Alert.alert('Error', 'No profile found for this user.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  //   const handleLogin = async () => {
  //   if (!email || !password) {
  //     Alert.alert('Error', 'Please enter both email and password');
  //     return;
  //   }
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //     const user = userCredential.user;

  //     const userDocRef = doc(db, 'users', user.uid);
  //     const userDoc = await getDoc(userDocRef);

  //     if (userDoc.exists()) {
  //       const userData = userDoc.data();
  //       let userType = '';
  //       if (userData.engineerId) userType = 'engineerId';
  //       else if (userData.supportStaffId) userType = 'supportStaffId';

  //       navigation.navigate('AppNavigater', {
  //         userUid: user.uid,
  //         userType,
  //       });
  //     } else {
  //       Alert.alert('Error', 'No profile found for this user.');
  //     }
  //   } catch (error) {
  //     Alert.alert('Login Failed', error.message);
  //   }
  // };

  //   const handleLogin = async () => {
  //   if (!email || !password) {
  //     Alert.alert('Error', 'Please enter both email and password');
  //     return;
  //   }

  //   try {
  //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //     const user = userCredential.user;

  //     const userDocRef = doc(db, 'users', user.uid);
  //     const userDoc = await getDoc(userDocRef);

  //     if (userDoc.exists()) {
  //       const userData = userDoc.data();
  //       let userType = '';
  //       if (userData.engineerId) userType = 'engineer';
  //       else if (userData.supportStaffId) userType = 'staff';
  //       else userType = 'unknown';

  //       navigation.navigate('AppNavigater', {
  //         userUid: user.uid,
  //         userType: userType,
  //       });
  //     } else {
  //       Alert.alert('Error', 'No profile found for this user.');
  //     }
  //   } catch (error) {
  //     Alert.alert('Login Failed', error.message);
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('./images/logo.webp')} style={styles.logo} />
        <Text style={styles.title}>JATL</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.headerCard}>
          <Text style={styles.headerText}>Log Into Your Account</Text>
          <Text style={styles.subHeaderText}>We're glad to see you again!</Text>
        </View>

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          style={styles.input}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          value={password}
          style={styles.input}
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: '#a0c6ff' }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    paddingTop: 90,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 80,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  headerCard: {
    backgroundColor: '#408BFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    marginTop: -50,
    shadowOpacity: 0.1,
    marginHorizontal: 20,
    elevation: 5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subHeaderText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#408BFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
