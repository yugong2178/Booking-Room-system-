import { useFocusEffect } from '@react-navigation/native'; // To detect screen focus
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import AsyncStorageService from './services/AsyncStorageService';

const TenantUserProfile = ({ navigation }) => {
  const [user, setUser] = useState(null);

  // Fetch user data when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          const storedUser = await AsyncStorageService.getUser();
          setUser(storedUser);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }, [])
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Phone Number: {user.phoneNumber}</Text>
      <Text style={styles.label}>Email: {user.email}</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Edit Profile" onPress={() => navigation.navigate('Edit')} />
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
  buttonContainer: {
    marginVertical: 10,
  },
});

export default TenantUserProfile;
