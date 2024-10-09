import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { InputWithLabel } from '../UI';

const config = require('C:/RealEstateBookingApp/screen/services/Config');

const TenantHomePage = ({ route, navigation }: any) => {
  const [room, setRoom] = useState<any>(null);
  const [id, setId] = useState(route.params.id);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [info, setInfo] = useState('');
  const [price, setPrice] = useState(0);
  const [image_path, setImage_path] = useState('');
  const [pax, setPax] = useState('');
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [isCheckInPickerVisible, setCheckInPickerVisibility] = useState<boolean>(false);
  const [isCheckOutPickerVisible, setCheckOutPickerVisibility] = useState<boolean>(false);
  const [day, setDay] = useState(0);

  const handleSearch = () => {
    if (!checkInDate || !checkOutDate || !day) {
      Alert.alert('Please fill in all fields');
      return;
    }

    navigation.navigate('BookingPayment', {
      id: id,
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      day: day.toString(),
      _refresh: _loadByID,
      homeRefresh: route.params._refresh,
    });
  };

  const showCheckInDatePicker = () => {
    setCheckInPickerVisibility(true);
  };

  const hideCheckInDatePicker = () => {
    setCheckInPickerVisibility(false);
  };

  const handleCheckInConfirm = (date: Date) => {
    setCheckInDate(date);
    hideCheckInDatePicker();
  };

  const showCheckOutDatePicker = () => {
    setCheckOutPickerVisibility(true);
  };

  const hideCheckOutDatePicker = () => {
    setCheckOutPickerVisibility(false);
  };

  const handleCheckOutConfirm = (date: Date) => {
    setCheckOutDate(date);
    hideCheckOutDatePicker();
  };

  const _loadByID = () => {
    let url = `${config.settings.serverPath2}/api/rooms/${id}`;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error:', response.status.toString());
          throw new Error('Error ' + response.status);
        }
        return response.json();
      })
      .then(room => {
        setName(room.name);
        setLocation(room.location);
        setInfo(room.info);
        setPrice(room.price);
        setImage_path(room.image_path);
        setPax(room.pax);
        navigation.setOptions({ headerTitle: room.name });
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    _loadByID();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: `${config.settings.serverPath2}/img/${image_path}` }}
        style={styles.imageContainer}
      />
      <InputWithLabel
        textLabelStyle={styles.textLabel}
        textInputStyle={styles.textInput}
        label={'Name'}
        editable={false}
        value={name}
        orientation={'vertical'}
      />
      <InputWithLabel
        textLabelStyle={styles.textLabel}
        textInputStyle={styles.textInput}
        label={'Location'}
        editable={false}
        value={location}
        orientation={'vertical'}
      />
      <InputWithLabel
        textLabelStyle={styles.textLabel}
        textInputStyle={styles.textInput}
        label={'Info'}
        editable={false}
        value={info}
        orientation={'vertical'}
      />
      <InputWithLabel
        textLabelStyle={styles.textLabel}
        textInputStyle={styles.textInput}
        label={'Price per night (RM)'}
        placeholder={'Type room price here'}
        value={price.toString()}
        editable={false}
        orientation={'vertical'}
      />
      <InputWithLabel
        textLabelStyle={styles.textLabel}
        textInputStyle={styles.textInput}
        label={'Pax'}
        editable={false}
        value={pax}
        orientation={'vertical'}
      />
      <InputWithLabel
        textLabelStyle={styles.textLabel}
        textInputStyle={styles.textInput}
        label={'Day rent'}
        placeholder={'Type how many days you will rent here'}
        value={day.toString()}
        keyboardType='numeric'
        onChangeText={(day: string) => {
          const numberValue = parseInt(day, 10);
          if (!isNaN(numberValue)) {
            setDay(numberValue);
          } else {
            setDay(0);
          }
        }}
        orientation={'vertical'}
      />

      <View style={styles.datePickerContainer}>
        <Text style={styles.label}>Check-In Date & Time</Text>
        <TouchableOpacity onPress={showCheckInDatePicker}>
          <TextInput
            style={styles.dateInput}
            value={checkInDate ? checkInDate.toLocaleString() : ''}
            placeholder="Select check-in date and time"
            editable={false}
          />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isCheckInPickerVisible}
          mode="datetime"
          onConfirm={handleCheckInConfirm}
          onCancel={hideCheckInDatePicker}
        />

        <Text style={styles.label}>Check-Out Date & Time</Text>
        <TouchableOpacity onPress={showCheckOutDatePicker}>
          <TextInput
            style={styles.dateInput}
            value={checkOutDate ? checkOutDate.toLocaleString() : ''}
            placeholder="Select check-out date and time"
            editable={false}
          />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isCheckOutPickerVisible}
          mode="datetime"
          onConfirm={handleCheckOutConfirm}
          onCancel={hideCheckOutDatePicker}
        />

        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Book</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  imageContainer: {
    width: '100%',
    height: 200, // Fixed height for the image container
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#e0e0e0', // Light grey background if no image
  },
  textLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#cd5c5c',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default TenantHomePage;
