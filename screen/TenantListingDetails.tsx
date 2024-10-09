import React, { useState, useEffect } from 'react';
import { Alert, Image, StyleSheet, ScrollView, View, Text, Button} from 'react-native';
import { InputWithLabel } from '../UI';


const config = require('C:/RealEstateBookingApp/screen/services/Config');




const TenantListingDetails = ({ route, navigation }: any) => {
  const [id, setId] = useState(route.params.id);
  const [room, setRoom] = useState<any>(null);

  const _loadByID = () => {
    const url = `${config.settings.serverPath2}/api/rooms/${id}`;
    console.log(url); // Log the URL
    fetch(url)
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error:', response.status.toString());
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
      });
  };
  
  useEffect(() => {
    _loadByID();
  }, []);

  if (room) {
    const imageUri = `${config.settings.serverPath2}/img/${room.image_path}`;
    console.log('Image URI:', imageUri); // Log the image URI

    return (
      <ScrollView style={{ flex: 1, margin: 10 }}>
        <View style={styles.imageContainer}>
          {room.image_path ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain" // Change this if needed
            />
          ) : (
            <Text>No information</Text>
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
          label="Price:"
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

        <View style={styles.buttonContainer}>
          <Button
            title="Book"
            onPress={() => navigation.navigate('TenantHome' , {
              id: room.id,
              _refresh: _loadByID,
              homeRefresh: route.params._refresh,
            })}
            color="#cd5c5c"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            onPress={() => navigation.goBack()}
            color="#cd5c5c"
          />
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
  label: {
    fontWeight: 'bold',
    color: 'darkblue',
    fontSize: 15,
  },
  input: {
    color: 'black',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, // Adjust the aspect ratio if needed
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%', // Take up the full width of the container
    height: '100%', // Take up the full height of the container
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
});

export default TenantListingDetails;
