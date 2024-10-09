import React, { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
const config = require('C:/RealEstateBookingApp/screen/services/Config');

interface BookListingProps {
  navigation: NavigationProp<any>;
  route: any; // Replace with the exact type if available
}

const BookingPayment: React.FC<BookListingProps> = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [id, setId] = useState(route.params.id);
  const [startdate, setStartdate] = useState(route.params.checkInDate);
  const [enddate, setEnddate] = useState(route.params.checkOutDate);
  const [day, SetDay] = useState(route.params.day);
  const [location, setLocation] = useState('');
  const [info, setInfo] = useState('');
  const [price, setPrice] = useState('');
  const [image_path, setImage_path] = useState('');
  const [pax, setPax] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [printReceipt, setPrintReceipt] = useState<boolean>(false);

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleBooking = () => {
    Alert.alert('Booking Successful', 'Your booking has been successfully made.', [
      { text: 'Done', onPress: _save },
    ]);
  };

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
        setImage_path(room.image_path);
        setPax(room.pax);
        SetDay(route.params.day); // Ensure this value is correctly set
        navigation.setOptions({ headerTitle: room.name });
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    _loadByID();
  }, [id]);

  const _save = () => {
    const url = `${config.settings.serverPath3}/api/bookings`;

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        location: location,
        info: info,
        price: price,
        image_path: image_path,
        pax: pax,
        startdate: startdate,
        enddate: enddate,
      }),
    })
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error:', response.status.toString());
          throw new Error('Error ' + response.status);
        }
        return response.json();
      })
      .then(respondJson => {
        if (respondJson.affected > 0) {
          Alert.alert('Record SAVED', name);
        } else {
          Alert.alert('Error in SAVING');
        }
        if (route.params?._refresh) {
          route.params._refresh();
        }
        navigation.navigate('TenantViewListing');
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error', 'An error occurred while saving.');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSpace} />

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Please review your booking details by pressing back button. Make sure everything is correct before proceeding with payment.
        </Text>
      </View>

      <View style={styles.pricingInfo}>
        <Text style={styles.pricingText}>
          Total Amount: RM {Number(price) * (day)}
        </Text>
      </View>

      <View style={styles.paymentMethodContainer}>
        <Text style={styles.paymentMethodTitle}>Select Payment Method:</Text>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedPaymentMethod === 'card' && styles.selectedPaymentOption,
          ]}
          onPress={() => handlePaymentMethodChange('card')}
        >
          <Text style={styles.paymentText}>Credit/Debit Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedPaymentMethod === 'tng' && styles.selectedPaymentOption,
          ]}
          onPress={() => handlePaymentMethodChange('tng')}
        >
          <Text style={styles.paymentText}>TnG e-wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedPaymentMethod === 'onlineBanking' && styles.selectedPaymentOption,
          ]}
          onPress={() => handlePaymentMethodChange('onlineBanking')}
        >
          <Text style={styles.paymentText}>Online Banking</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.checkboxContainer}>
        <Switch value={printReceipt} onValueChange={setPrintReceipt} />
        <Text style={styles.checkboxLabel}>Print Receipt</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleBooking}>
          <Text style={styles.buttonText}>Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerSpace: {
    height: 50,
  },
  infoBox: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  pricingInfo: {
    marginBottom: 20,
  },
  pricingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  paymentMethodContainer: {
    marginBottom: 20,
  },
  paymentMethodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4dabf7',
    marginBottom: 15,
  },
  paymentOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentText: {
    fontSize: 16,
    color: '#333',
  },
  selectedPaymentOption: {
    backgroundColor: '#e0f7fa',
    borderColor: '#4dabf7',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#4dabf7',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingPayment;
