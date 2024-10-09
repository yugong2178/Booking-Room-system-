import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, FlatList, View, TouchableNativeFeedback, Alert } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';

const config = require('C:/RealEstateBookingApp/screen/services/Config');

const AdminViewListing = ({ route, navigation }: any) => {
  const [rooms, setRooms] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const _load = () => {
    let url = `${config.settings.serverPath2}/api/rooms`;
    setIsFetching(true);
  
    fetch(url)
      .then((response) => {
        console.log('Response URL:', response.url); // Log response URL
        if (!response.ok) {
          Alert.alert('Error:', `Status code: ${response.status}`);
          throw new Error('Error ' + response.status);
        }
        setIsFetching(false);
        return response.json();
      })
      .then((rooms) => {
        console.log('Rooms:', rooms); // Log fetched rooms
        setRooms(rooms);
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
        data={rooms}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: any) => (
          <TouchableNativeFeedback
            onPress={() =>
              navigation.navigate('AdminViewDetails', {
                id: item.id,
                _refresh: _load,
              })
            }
          >
            <View style={styles.itemContainer}>
              <Image
                source={{ uri: `${config.settings.serverPath2}/img/${item.image_path}` }}
                style={styles.image}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.location}>{item.location}</Text>
                <Text style={styles.info}>{item.info}</Text>
              </View>
            </View>
          </TouchableNativeFeedback>
        )}
      />
      <FloatingAction
        actions={[
          {
            text: 'Add New Room',
            icon: require('C:/RealEstateBookingApp/img/add_icon.png'),
            name: 'add_room',
            // Remove position here
          },
        ]}
        onPressItem={(name) => {
          if (name === 'add_room') {
            navigation.navigate('AdminAddRoom');
          }
        }}
        color="#ff6347"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#f5f5f5',
  },
  itemContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#e0e0e0',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#777',
  },
});

export default AdminViewListing;
