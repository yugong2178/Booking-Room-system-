import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  View,
} from 'react-native';
import { InputWithLabel, AppButton } from '../UI';

let config = require('C:/RealEstateBookingApp/screen/services/Config');

const AdminEditListings = ({ route, navigation }: any) => {
  const [id, setId] = useState(route.params.id);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [info, setInfo] = useState('');
  const [price, setPrice] = useState(0);
  const [image_path, setImage_path] = useState('');
  const [pax, setPax] = useState('');

  const _loadByID = () => {
    let url = config.settings.serverPath2 + '/api/rooms/' + id;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error:', response.status.toString());
          throw Error('Error ' + response.status);
        }
        return response.json();
      })
      .then(room => {
        setName(room.name);
        setLocation(room.location);
        setInfo(room.info);
        setPrice(room.price);
        setPax(room.pax);
        setImage_path(room.image_path);
        navigation.setOptions({ headerTitle: room.name });
      })
      .catch(error => {
        console.error(error);
      });
  }

  const _edit = () => {
    if (!name || !location || !info || !price || !pax || !image_path) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    let url = config.settings.serverPath2 + '/api/rooms/' + id;

    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        name,
        location,
        info,
        price,
        pax,
        image_path,
      }),
    })
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error:', response.status.toString());
          throw Error('Error ' + response.status);
        }
        return response.json();
      })
      .then(respondJson => {
        if (respondJson.affected > 0) {
          Alert.alert('Record UPDATED for', name);
        } else {
          Alert.alert('Error in UPDATING');
        }
        route.params._refresh();
        navigation.goBack();
      })
      .catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    _loadByID();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <InputWithLabel
          textLabelStyle={styles.textLabel}
          textInputStyle={styles.textInput}
          label={'Name'}
          placeholder={'Type Room Name here'}
          value={name}
          onChangeText={setName}
          orientation={'vertical'}
        />
        <InputWithLabel
          textLabelStyle={styles.textLabel}
          textInputStyle={styles.textInput}
          label={'Location'}
          placeholder={'Type Location here'}
          value={location}
          onChangeText={setLocation}
          orientation={'vertical'}
        />
        <InputWithLabel
          textLabelStyle={styles.textLabel}
          textInputStyle={styles.textInput}
          label={'Info'}
          placeholder={'Type Info here'}
          value={info}
          onChangeText={setInfo}
          orientation={'vertical'}
        />
        <InputWithLabel
          textLabelStyle={styles.textLabel}
          textInputStyle={styles.textInput}
          label={'Price per night (RM)'}
          placeholder={'Type Room Price here'}
          value={price.toString()} // Convert the price back to string for display
          keyboardType='numeric' // Ensure the keyboard displays only numeric keys
          onChangeText={(price: string) => {
            const parsedPrice = parseInt(price, 10); // Parse the input to an integer
            if (!isNaN(parsedPrice)) {
              setPrice(parsedPrice); // Only set the price if the input is a valid number
            } else {
              setPrice(0); // Reset or handle invalid input as needed
            }
          }}
          orientation={'vertical'}
        />
        <InputWithLabel
          textLabelStyle={styles.textLabel}
          textInputStyle={styles.textInput}
          label={'Pax'}
          placeholder={'Type Pax here'}
          value={pax}
          onChangeText={setPax}
          orientation={'vertical'}
        />
        <InputWithLabel
          textLabelStyle={styles.textLabel}
          textInputStyle={styles.textInput}
          label={'Image'}
          placeholder={'Type Image Path here'}
          value={image_path}
          onChangeText={setImage_path}
          orientation={'vertical'}
        />
        <AppButton title={'Edit'} onPress={_edit} style={styles.button} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  textLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 16,
  },
  button: {
    marginTop: 20,
  },
});

export default AdminEditListings;
