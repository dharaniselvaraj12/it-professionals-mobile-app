import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import NetworkScreen from './src/screens/NetworkScreen';
import JobsScreen from './src/screens/JobsScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';
import PostJobScreen from './src/screens/PostJobScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#0077B5" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0077B5',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Create Account' }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'IT Professionals' }}
        />
        <Stack.Screen
          name="Network"
          component={NetworkScreen}
          options={{ title: 'My Network' }}
        />
        <Stack.Screen
          name="Jobs"
          component={JobsScreen}
          options={{ title: 'Job Board' }}
        />
        <Stack.Screen
          name="Messages"
          component={MessagesScreen}
          options={{ title: 'Messages' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
        <Stack.Screen
          name="Subscription"
          component={SubscriptionScreen}
          options={{ title: 'Choose Your Plan' }}
        />
        <Stack.Screen
          name="PostJob"
          component={PostJobScreen}
          options={{ title: 'Post a Job' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
