import React, { useState, useEffect } from 'react';
import { Image, Text, FlatList, View, TouchableNativeFeedback, Alert, StyleSheet } from 'react-native';

const config = require('C:/RealEstateBookingApp/screen/services/Config');

const TenantViewListing = ({ route, navigation }: any) => {
  const [rooms, setRooms] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const _load = () => {
    let url = `${config.settings.serverPath2}/api/rooms`;
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
              navigation.navigate('TenantListingDetails', {
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
                <Text style={styles.info}>RM{item.price} per night</Text>
                <Text style={styles.info}>Maximum pax: {item.pax}</Text>
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
    margin: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
    paddingVertical: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  location: {
    fontSize: 15,
    color: '#666',
    marginBottom: 3,
  },
  info: {
    fontSize: 14,
    color: '#888',
  },
});

export default TenantViewListing;
