import React, { useState, useEffect } from 'react';
import { Alert, Image, StyleSheet, ScrollView, View, Text } from 'react-native';
import { InputWithLabel } from '../UI';
import { FloatingAction } from 'react-native-floating-action';

const config = require('C:/RealEstateBookingApp/screen/services/Config');

const actions = [
  {
    text: 'Edit',
    color: '#ff8c00', // Changed to a more visible color
    icon: require('C:/RealEstateBookingApp/img/edit_icon.png'),
    name: 'edit',
  },
  {
    text: 'Delete',
    color: '#ff4c4c', // Changed to a more visible color
    icon: require('C:/RealEstateBookingApp/img/delete_icon.jpg'),
    name: 'delete',
  },
];

const AdminViewDetails = ({ route, navigation }: any) => {
  const [id, setId] = useState(route.params.id);
  const [room, setRoom] = useState<any>(null);

  useEffect(() => {
    _loadByID();
  }, []);

  const _loadByID = () => {
    const url = `${config.settings.serverPath2}/api/rooms/${id}`;
    console.log(url);
    fetch(url)
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error:', `Status code: ${response.status}`);
          throw new Error('Error ' + response.status);
        }
        return response.json();
      })
      .then(roomData => {
        setRoom(roomData);
        navigation.setOptions({ headerTitle: roomData.name });
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error:', 'Failed to load room details.');
      });
  };

  const _delete = () => {
    Alert.alert('Confirm to DELETE', room?.name || 'No name', [
      {
        text: 'No',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: () => {
          const url = `${config.settings.serverPath2}/api/rooms/${id}`;
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
                Alert.alert('Error:', `Status code: ${response.status}`);
                throw new Error('Error ' + response.status);
              }
              return response.json();
            })
            .then(responseJson => {
              if (responseJson.affected === 0) {
                Alert.alert('Error:', 'Failed to delete room.');
              } else {
                Alert.alert('Success:', 'Room deleted successfully.');
              }
            })
            .catch(error => {
              console.error(error);
              Alert.alert('Error:', 'Failed to delete room.');
            });
          route.params._refresh();
          navigation.goBack();
        },
      },
    ]);
  };

  if (room) {
    const imageUri = `${config.settings.serverPath2}/img/${room.image_path}`;
    console.log('Image URI:', imageUri);

    return (
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          {room.image_path ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover" // Change this to fit the image properly
            />
          ) : (
            <Text style={styles.noInfoText}>No image available</Text>
          )}
        </View>
        <InputWithLabel
          textInputStyle={styles.input}
          textLabelStyle={styles.label}
          editable={false}
          label="Name:"
        >
          {room.name || 'No information'}
        </InputWithLabel>
        <InputWithLabel
          textInputStyle={styles.input}
          textLabelStyle={styles.label}
          editable={false}
          label="Location:"
        >
          {room.location || 'No information'}
        </InputWithLabel>
        <InputWithLabel
          textInputStyle={styles.input}
          textLabelStyle={styles.label}
          editable={false}
          label="Info:"
        >
          {room.info || 'No information'}
        </InputWithLabel>
        <InputWithLabel
          textInputStyle={styles.input}
          textLabelStyle={styles.label}
          editable={false}
          label="Price per night (RM):"
        >
          {room.price || 'No information'}
        </InputWithLabel>
        <InputWithLabel
          textInputStyle={styles.input}
          textLabelStyle={styles.label}
          editable={false}
          label="Pax:"
        >
          {room.pax || 'No information'}
        </InputWithLabel>
        <FloatingAction
          actions={actions}
          color="#ff6347" // Updated color to match the new action button colors
          onPressItem={name => {
            switch (name) {
              case 'edit':
                navigation.navigate('AdminEditListings', {
                  id: room.id,
                  _refresh: _loadByID,
                  homeRefresh: route.params._refresh,
                });
                break;
              case 'delete':
                _delete();
                break;
            }
          }}
        />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
    backgroundColor: '#ffffff', // Updated to a light background color
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
  noInfoText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 18,
  },
  input: {
    fontSize: 16,
    color: '#444',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AdminViewDetails;
