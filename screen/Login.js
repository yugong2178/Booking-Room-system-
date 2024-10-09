import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import SQLiteService from './services/SQLiteService'; // SQLite service path
import socket from './services/socketService';
 
const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
 
// Hardcoded admin credentials
const adminCredentials = {
  phoneNumber: '+60123456789',  // Admin phone number
  password: 'adminPassword123'  // Admin password
};
 
  // Handle WebSocket events
  useEffect(() => {
    socket.on('login_response', handleLoginResponse);
 
    // Clean up WebSocket listener on unmount
    return () => {
      socket.off('login_response', handleLoginResponse);
    };
  }, []);
 
  const handleLoginResponse = (response) => {
    if (response.success) {
      Alert.alert('Login Successful', 'You have logged in successfully!');
      navigation.navigate('Home'); // or the appropriate screen
    } else {
      Alert.alert('Login Failed', response.message || 'Invalid credentials. Please try again.');
    }
  };
 
  const handleLogin = () => {
    if (!phoneNumber) {
      Alert.alert('Invalid Input', 'Please enter a valid phone number.');
      return;
    }
 
    if (!password) {
      Alert.alert('Invalid Input', 'Please enter your password.');
      return;
    }
 
    // Check if the input credentials match the hardcoded admin credentials
    if (phoneNumber === adminCredentials.phoneNumber && password === adminCredentials.password) {
      Alert.alert('Admin Login Successful', 'You have logged in as Admin!');
      navigation.navigate('Admin'); // Navigate to the admin dashboard
      return;
    }
 
    // Emit login event over WebSocket
    socket.emit('login', { phoneNumber, password });
 
    // Attempt local login using SQLite
    SQLiteService.loginUser({ phoneNumber, password })
      .then((user) => {
        console.log('Logged in user:', user);
        // Navigate to the appropriate screen after local login
        navigation.navigate('Home'); // Or any other screen
      })
      .catch((error) => {
        console.error('Login error from SQLite:', error);
        Alert.alert('Login Failed', 'Invalid credentials or error occurred during login.');
      });
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
 
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
 
      <View style={styles.buttonContainer}>
        <Button title="Login" color="#4dabf7" onPress={handleLogin} />
      </View>
 
      <View style={styles.signUpContainer}>
        <Button
          title="Sign Up"
          color="#4dabf7"
          onPress={() => navigation.navigate('Register')}
        />
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
  signUpContainer: {
    marginVertical: 20,
  },
});
 
export default Login;
 