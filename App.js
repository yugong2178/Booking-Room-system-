import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import MainNavigator from './screen/Navigation/MainNavigator';
import SQLiteService from './screen/services/SQLiteService'; 

const App = () => {
  useEffect(() => {
    // Initialize the database when the app starts
    const initializeDatabase = async () => {
      try {
        await SQLiteService.createTables(); // Create tables if they don't exist
        console.log('Database tables created or already exist');
      } catch (error) {
        console.error('Failed to create tables:', error);
      }
    };

    initializeDatabase();
  }, []); // Empty dependency array ensures this runs only once on startup

  return (
    <MainNavigator />
  );
};

export default App;