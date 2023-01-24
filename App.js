import React from 'react';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { store } from './src/Store/Store';
import { StyleSheet, View } from 'react-native';
import LoadingScreen from './src/Screens/LoadingScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <LoadingScreen />
          <Toast />
        </View>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
});



