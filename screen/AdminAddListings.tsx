import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  View,
} from 'react-native';
import { InputWithLabel, AppButton } from 'C:/RealEstateBookingApp/UI';

let config = require('C:/RealEstateBookingApp/screen/services/Config');

const AdminAddListings = ({ route, navigation }: any) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [info, setInfo] = useState('');
  const [price, setPrice] = useState('');
  const [pax, setPax] = useState('');
  const [image_path, setImage_path] = useState('');

  const _save = () => {
    if (!name || !location || !info || !price || !pax || !image_path) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    let url = config.settings.serverPath2 + '/api/rooms';

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        location,
        info,
        price,
        image_path,
        pax,
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
          Alert.alert('Record SAVED for', name);
          navigation.navigate('AdminHomePage');
        } else {
          Alert.alert('Error in SAVING');
        }
        route.params._refresh();
      })
      .catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'Add Room' });
  }, [navigation]);

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
          placeholder={'Type room price here'}
          value={price}
          onChangeText={setPrice}
          orientation={'vertical'}
        />
        <InputWithLabel
          textLabelStyle={styles.textLabel}
          textInputStyle={styles.textInput}
          label={'Pax'}
          placeholder={'Type room Pax here'}
          value={pax}
          onChangeText={setPax}
          orientation={'vertical'}
        />
        <InputWithLabel
          textLabelStyle={styles.textLabel}
          textInputStyle={styles.textInput}
          label={'Image'}
          placeholder={'Type image path here'}
          value={image_path}
          onChangeText={setImage_path}
          orientation={'vertical'}
        />
        <AppButton title={'Add'} onPress={_save} style={styles.button} />
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
    marginVertical: 20,
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

export default AdminAddListings;
