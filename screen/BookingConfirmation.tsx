import React, { useState, useEffect } from 'react';
import { Image, Text, FlatList, View, TouchableNativeFeedback, Alert, StyleSheet } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';

const config = require('C:/RealEstateBookingApp/screen/services/Config');

const BookingConfirmation = ({ route, navigation }: any) => {
  const [bookings, setBooking] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const _load = () => {
    const url = `${config.settings.serverPath3}/api/bookings`;
    setIsFetching(true);

    fetch(url)
      .then((response) => {
        console.log('Response URL:', response.url); // Log response URL
        if (!response.ok) {
          Alert.alert('Error:', response.status.toString());
          throw Error('Error ' + response.status);
        }
        setIsFetching(false);
        return response.json();
      })
      .then((bookings) => {
        console.log('Bookings:', bookings); // Log fetched rooms
        setBooking(bookings);
      })
      .catch((error) => {
        console.log('Fetch Error:', error); // Log fetch errors
        setIsFetching(false);
      });
  };

  useEffect(() => {
    _load();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        refreshing={isFetching}
        onRefresh={_load}
        data={bookings}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: any) => (
          <TouchableNativeFeedback
            onPress={() =>
              navigation.navigate('BookingListDetails', {
                id: item.id,
                _refresh: _load,
              })
            }
          >
            <View style={styles.itemContainer}>
              <Image
                source={{ uri: `${config.settings.serverPath3}/img/${item.image_path}` }}
                style={styles.image}
              />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.location}>{item.location}</Text>
                <Text style={styles.info}>{item.info}</Text>
                <Text style={styles.date}>Start Date: {item.startdate}</Text>
                <Text style={styles.date}>End Date: {item.enddate}</Text>
              </View>
            </View>
          </TouchableNativeFeedback>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    backgroundColor: '#f9f9f9', // Light background color
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // White background for each item
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 15,
    borderRadius: 10, // Rounded corners for image
    backgroundColor: '#e0e0e0', // Light grey background in case image fails to load
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333', // Dark text color
  },
  location: {
    fontSize: 16,
    color: '#666', // Slightly lighter text color
    marginBottom: 5,
  },
  info: {
    fontSize: 15,
    color: '#666',
    marginBottom: 5,
  },
  date: {
    fontSize: 15,
    color: '#999', // Light grey for date
  },
});

export default BookingConfirmation;
