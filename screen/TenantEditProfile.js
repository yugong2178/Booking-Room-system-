import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorageService from './services/AsyncStorageService';
import SQLiteService from './services/SQLiteService';

const TenantEditProfile = ({ navigation, route }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState('');

  // Fetch the current user data when the component loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AsyncStorageService.getUser();
        if (user) {
          setPhoneNumber(user.phoneNumber);
          setEmail(user.email);
          setPassword(user.password);
          setConfirmPassword(user.password); // Set confirm password to match initially
          setOriginalPhoneNumber(user.phoneNumber); // Save the original phone number to use for updating SQLite
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+60\d{8,9}$/; // +60 followed by 8 or 9 digits
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSaveChanges = async () => {
    if (!phoneNumber || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Phone number must start with +60 and be 9-10 digits long.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords Do Not Match', 'Please ensure both passwords match.');
      return;
    }

    try {
      // Update the user in SQLite
      await SQLiteService.updateUser({ 
        phoneNumber, 
        email, 
        password, 
        originalPhoneNumber 
      });

      // Update AsyncStorage with the new user data
      const updatedUser = { phoneNumber, email, password, type: 'customer' };
      await AsyncStorageService.saveUser(updatedUser);

      // Check if updatePhoneNumber is passed and call it
      if (route.params?.updatePhoneNumber) {
        route.params.updatePhoneNumber(phoneNumber); // Call the function passed from parent
      }

      Alert.alert('Profile Updated', 'Your profile information has been updated successfully.');

      // Navigate back to the profile and trigger a refresh
      navigation.navigate('User Profile', { refresh: true });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Update Failed', 'There was an error updating your profile. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="+60xxxxxxxxx"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your new password"
        secureTextEntry
      />

      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm your new password"
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <Button title="Save Changes" color="#4dabf7" onPress={handleSaveChanges} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default TenantEditProfile;
