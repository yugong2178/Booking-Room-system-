import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Login from '../Login';
import Register from '../Register';
import TenantHomePage from '../TenantHomePage';
import BookingConfirmation from '../BookingConfirmation';
import AdminHomePage from '../AdminHomePage';
import AdminAddListings from '../AdminAddListings';
import AdminEditListings from '../AdminEditListings';
import AdminViewListing from '../AdminViewListing';
import AdminViewDetails from '../AdminViewDetails';
import TenantViewListing from '../TenantViewListing';
import TenantListingDetails from '../TenantListingDetails';
import BookingPayment from '../BookingPayment';
import BookingListDetails from '../BookingListDetails';
import TenantEditProfile from '../TenantEditProfile';
import TenantUserProfile from '../TenantUserProfile';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const TenantDrawerNavigator = () => {
  return (
    <Drawer.Navigator 
      initialRouteName="TenantHome"
      drawerContent={props => <CustomDrawerComponent {...props} />}
      screenOptions={{
        drawerActiveTintColor: 'darkslateblue',
        drawerActiveBackgroundColor: 'pink',
        drawerStyle: styles.drawerStyle,
      }}
    >
    
      <Drawer.Screen name="View Listing" component={TenantListingStackNavigator} /> 
      <Drawer.Screen name="My Booking" component={BookingListingStackNavigator} />
      <Drawer.Screen name="My Profile" component={ProfileStackNavigator} />

    </Drawer.Navigator>
    
  );
};

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide the header from the Stack Navigator
      }}
    >
      <Stack.Screen name="User Profile" component={TenantUserProfile} />
      <Stack.Screen name="Edit" component={TenantEditProfile} />
    </Stack.Navigator>
  );
};

const BookingListingStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide the header from the Stack Navigator
      }}
    >
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmation} />
      <Stack.Screen name="BookingListDetails" component={BookingListDetails} />
    </Stack.Navigator>
  );
};

const TenantListingStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide the header from the Stack Navigator
      }}
    >
      <Stack.Screen name="TenantViewListing" component={TenantViewListing} />
      <Stack.Screen name="TenantListingDetails" component={TenantListingDetails} />
      <Stack.Screen name="TenantHome" component={TenantHomePage} />
      <Stack.Screen name="BookingPayment" component={BookingPayment} options={{ presentation: 'modal' }}/>
    </Stack.Navigator>
  );
};

const AdminStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminHomePage" component={AdminHomePage} />
      <Stack.Screen name="AdminAddListings" component={AdminAddListings} />
      <Stack.Screen name="AdminEditListings" component={AdminEditListings} />
      <Stack.Screen name="AdminViewListing" component={AdminViewListing} />
      <Stack.Screen name="AdminViewDetails" component={AdminViewDetails} />
      {/* Add more screens if necessary */}
    </Stack.Navigator>
  );
};


const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={TenantDrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Admin" component={AdminStackNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const CustomDrawerComponent = (props) => {
  const windowHeight = Dimensions.get('window').height;

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContainer}>
        <View style={styles.drawerHeader}>
          <Image
            style={styles.profileImage}
            source={require('C:/RealEstateBookingApp/img/profilePic.jpg')} // Adjust path as needed
          />
          <Text style={styles.profileText}>My Profile Picture</Text>
        </View>
        <View style={styles.drawerContent}>
          <DrawerItemList {...props} />
        </View>
        <View style={styles.drawerFooter}>
          <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
            <View style={styles.logoutContainer}>
              <Ionicons name="exit-outline" size={23} color="#000" />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eb4034',
    padding: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
  },
  profileText: {
    color: '#fff',
    marginVertical: 10,
  },
  drawerContent: {
    backgroundColor: '#fff',
    paddingTop: 10,
    height: Dimensions.get('window').height * 0.70,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: 'gray',
  },
  logoutContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    paddingVertical: 10,
  },
  logoutText: {
    marginLeft: 20,
    fontSize: 18,
  },
  drawerStyle: {
    width: 250,
  },
});

export default MainNavigator;

// import React from 'react';
// import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions } from "react-native";
// import { createStackNavigator } from '@react-navigation/stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'


// import Login from '../Login';
// import Register from '../Register';
// import TenantHomePage from '../TenantHomePage';
// import ListingDetails from '../ListingDetails';
// import BookingScreen from '../BookingScreen';
// import BookingConfirmation from '../BookingConfirmation';
// import AdminDashboard from '../AdminHomePage';


// const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator();
// const Tab = createBottomTabNavigator();

// const TenantDrawerNavigator = () => {
//   return (
//     <Drawer.Navigator initialRouteName="TenantHome">
//       <Drawer.Screen name="TenantHome" component={TenantHomePage} />
//       <Drawer.Screen name="ListingDetails" component={ListingDetails} />
//       <Drawer.Screen name="BookingConfirmation" component={BookingConfirmation} />
//       <Drawer.Screen name="Sign Out" component={Login} />
//     </Drawer.Navigator>
//   );
// };

// // You can create a Tab Navigator if needed, for example:
// const AdminTabNavigator = () => {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="AdminDashboard" component={AdminDashboard} />
//       {/* Add more tabs if necessary */}
//     </Tab.Navigator>
//   );
// };

// const MainNavigator = () => {
//   return (
//     <Stack.Navigator initialRouteName="Login">
//       <Stack.Screen name="Login" component={Login} />
//       <Stack.Screen name="Register" component={Register} />
//       <Stack.Screen name="Home" component={TenantDrawerNavigator} options={{ headerShown: false }} />
//       <Stack.Screen name="Admin" component={AdminTabNavigator} options={{ headerShown: false }} />
//     </Stack.Navigator>
//   );
// };

// export default MainNavigator;