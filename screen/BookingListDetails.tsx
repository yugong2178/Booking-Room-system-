import React, { useState, useEffect } from 'react';
import { Alert, Image, StyleSheet, ScrollView, View, Text, Button } from 'react-native';
import { InputWithLabel } from '../UI';

const config = require('C:/RealEstateBookingApp/screen/services/Config');

const BookingListDetails = ({ route, navigation }: any) => {
  const [id, setId] = useState(route.params.id);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    _loadByID();
  }, []);

  const _loadByID = () => {
    const url = `${config.settings.serverPath3}/api/bookings/${id}`;
    console.log(url); // Log the URL
    fetch(url)
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error:', response.status.toString());
          throw new Error('Error ' + response.status);
        }
        return response.json();
      })
      .then(bookingData => {
        setBooking(bookingData);
        navigation.setOptions({ headerTitle: bookingData.name });
      })
      .catch(error => {
        console.error(error);
      });
  };

  const _delete = () => {
    Alert.alert('Confirm to DELETE', booking.name || 'No name', [
      {
        text: 'No',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: () => {
          const url = `${config.settings.serverPath3}/api/bookings/${id}`;
          console.log(url);
          fetch(url, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
          })
            .then(response => {
              if (!response.ok) {
                Alert.alert('Error:', response.status.toString());
                throw new Error('Error ' + response.status);
              }
              return response.json();
            })
            .then(responseJson => {
              if (responseJson.affected === 0) {
                Alert.alert('Error in DELETING');
              }
            })
            .catch(error => {
              console.error(error);
            });
          route.params._refresh();
          navigation.goBack();
        },
      },
    ]);
  };

  if (booking) {
    const imageUri = `${config.settings.serverPath3}/img/${booking.image_path}`;
    console.log('Image URI:', imageUri); // Log the image URI

    return (
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          {booking.image_path ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover" // Changed to "cover" for better fit
            />
          ) : (
            <Text style={styles.noImageText}>No Image Available</Text>
          )}
        </View>
        <InputWithLabel
          textInputStyle={styles.input}
          textLabelStyle={styles.label}
          editable={false}
          label="Name:"
        >
          {booking.name || 'No information'}
        </InputWithLabel>
        <InputWithLabel
          textInputStyle={styles.input}
          textLabelStyle={styles.label}
          editable={false}
          label="Location:"
        >
          {booking.location || 'No information'}
        </InputWithLabel>
        <InputWithLabel
          textInputStyle={styles.input}
          textLabelStyle={styles.label}
          editable={false}
          label="Info:"
        >
          {booking.info || 'No information'}
        </InputWithLabel>
        <InputWithLabel
          textInputStyle={styles.input}
          textLabelStyle={styles.label}
          editable={false}
          label="Price:"
        >
          {booking.price || 'No information'}
        </InputWithLabel>
        <InputWithLabel
          textInputStyle={styles.input}
          textLabelStyle={styles.label}
          editable={false}
          label="Pax:"
        >
          {booking.pax || 'No information'}
        </InputWithLabel>
        <InputWithLabel
          textInputStyle={styles.input}
          textLabelStyle={styles.label}
          editable={false}
          label="Start Date:"
        >
          {booking.startdate || 'No information'}
        </InputWithLabel>
        <InputWithLabel
          textInputStyle={styles.input}
          textLabelStyle={styles.label}
          editable={false}
          label="End Date:"
        >
          {booking.enddate || 'No information'}
        </InputWithLabel>
        <View style={styles.buttonContainer}>
          <Button title="Delete" onPress={() => _delete()} color="#d9534f" />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Back" onPress={() => navigation.goBack()} color="#5bc0de" />
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    backgroundColor: '#f9f9f9', // Light background color for the entire screen
  },
  imageContainer: {
    width: '100%',
    height: 200, // Fixed height for the image container
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#e0e0e0', // Light grey background if no image
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10, // Rounded corners for the image
  },
  noImageText: {
    color: '#666',
    fontSize: 16,
  },
  label: {
    fontWeight: 'bold',
    color: 'darkblue',
    fontSize: 16,
  },
  input: {
    color: 'black',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
});

export default BookingListDetails;
