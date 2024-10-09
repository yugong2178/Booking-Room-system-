import SQLite from 'react-native-sqlite-storage';
import AsyncStorageService from './AsyncStorageService'; // Importing AsyncStorageService

// Open the database
const db = SQLite.openDatabase({ name: 'RealEstateBookingApp.db', location: 'default' });

const SQLiteService = {
  createTables: () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS User (
            phoneNumber TEXT PRIMARY KEY NOT NULL, 
            password TEXT, 
            name TEXT, 
            email TEXT, 
            type TEXT, 
            bankInfo TEXT
          )`,
          (_, error) => reject(error) // Reject if there is an error in creating the User table
        );
      });
    });
  },

  // Insert a new user into the database and AsyncStorage
  createUser: ({ phoneNumber, email, password }) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO User (phoneNumber, email, password, type) VALUES (?, ?, ?, ?)',
          [phoneNumber, email, password, 'customer'],
          async (_, result) => {
            // Save the user to AsyncStorage
            const user = { phoneNumber, email, password, type: 'customer' };
            await AsyncStorageService.saveUser(user);
            resolve(result); // Resolve the promise with the result of the insertion
          },
          (_, error) => reject(error) // Reject the promise if there is an error
        );
      });
    });
  },

  // Retrieve user data by phoneNumber and password (login)
  loginUser: ({ phoneNumber, password }) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM User WHERE phoneNumber = ? AND password = ?',
          [phoneNumber, password],
          async (_, results) => {
            if (results.rows.length > 0) {
              const user = results.rows.item(0);
              // Save logged-in user to AsyncStorage
              await AsyncStorageService.saveUser(user);
              resolve(user); // Resolve with the user object if found
            } else {
              reject('Invalid credentials'); // Reject if no user is found
            }
          },
          (_, error) => reject(error) // Reject if there is an error in the query
        );
      });
    });
  },

  // Retrieve listings
  getListings: () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM Listing', 
          [], 
          (_, results) => {
            let listings = [];
            for (let i = 0; i < results.rows.length; i++) {
              listings.push(results.rows.item(i));
            }
            resolve(listings); // Resolve the promise with the list of listings
          },
          (_, error) => reject(error) // Reject the promise if there is an error
        );
      });
    });
  },

  // Retrieve the logged-in user from SQLite and AsyncStorage
  getUser: async (phoneNumber) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM User WHERE phoneNumber = ?',
          [phoneNumber],
          async (_, results) => {
            if (results.rows.length > 0) {
              const user = results.rows.item(0);
              await AsyncStorageService.saveUser(user); // Save user to AsyncStorage for later access
              resolve(user); // Resolve with the retrieved user
            } else {
              reject('User not found');
            }
          },
          (_, error) => reject(error) // Reject if there is an error in the query
        );
      });
    });
  },

  updateUser: ({ phoneNumber, email, password, originalPhoneNumber }) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE User SET phoneNumber = ?, email = ?, password = ? WHERE phoneNumber = ?',
          [phoneNumber, email, password, originalPhoneNumber],
          (_, result) => {
            resolve(result); // Resolve the promise with the result of the update
          },
          (_, error) => reject(error) // Reject the promise if there is an error
        );
      });
    });
  },
};

export default SQLiteService;
