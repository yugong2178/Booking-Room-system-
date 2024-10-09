import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AdminHomePage = () => {

  const navigation = useNavigation();

  const handleSignOut = () => {
    // Implement your sign out logic here
    navigation.navigate('Login'); // Navigate back to the login screen after signing out
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerText}>Admin Home Page</Text>

      {/* Add Listing Button */}
      <TouchableOpacity
        style={[styles.button, styles.addButton]}
        onPress={() => navigation.navigate('AdminAddListings')}
      >
        <Text style={styles.buttonText}>Add Listing</Text>
      </TouchableOpacity>

      {/* View Listings Button */}
      <TouchableOpacity
        style={[styles.button, styles.viewButton]}
        onPress={() => navigation.navigate('AdminViewListing')}
      >
        <Text style={styles.buttonText}>View Listings</Text>
      </TouchableOpacity>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={[styles.button, styles.signOutButton]}
        onPress={handleSignOut}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e9ecef',
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#333',
  },
  button: {
    width: '90%',
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    alignItems: 'center',
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 5, // Shadow radius for iOS
  },
  addButton: {
    backgroundColor: '#28a745', // Green
  },
  viewButton: {
    backgroundColor: '#007bff', // Blue
  },
  editButton: {
    backgroundColor: '#d6a609' // Orange
  },
  signOutButton: {
    backgroundColor: '#dc3545', // Red
    position: 'absolute',
    bottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminHomePage;
