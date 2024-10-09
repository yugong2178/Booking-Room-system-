import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import SQLiteService from './services/SQLiteService'; // SQLite service path
import socket from './services/socketService'; 

const Register = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle WebSocket events
  useEffect(() => {
    socket.on('registration_response', handleRegistrationResponse);

    // Clean up WebSocket listener on unmount
    return () => {
      socket.off('registration_response', handleRegistrationResponse);
    };
  }, []);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+60\d{8,9}$/; // +60 followed by 8 or 9 digits
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegistrationResponse = (response) => {
    if (response.success) {
      Alert.alert('Registration Successful', 'You have been registered successfully!');
      navigation.navigate('Login');
    } else {
      Alert.alert('Registration Failed', response.message || 'There was an error during registration. Please try again.');
    }
  };

  const handleRegister = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Phone number must start with +60 and be 9-10 digits long.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email addre交朋友的活动ss.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords Do Not Match', 'Please ensure both passwords match.');
      return;
    }

    // Emit registration event over WebSocket
    socket.emit('register', { phoneNumber, email, password });

    try {
      // Ensure tables are created
      await SQLiteService.createTables();
      // Save the user to the SQLite database
      await SQLiteService.createUser({ phoneNumber, email, password });
      Alert.alert('Registration Successful', 'User has been registered locally.');
    } catch (error) {
      console.error('Error creating user in SQLite:', error);
      Alert.alert('Registration Failed', 'There was an error during local registration. Please try again.');
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

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm your password"
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <Button title="Register" color="#4dabf7" onPress={handleRegister} />
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

export default Register;