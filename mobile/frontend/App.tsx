import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import ProductScreen from './src/screens/ProductScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import { AuthProvider } from './src/context/AuthContext';
import CartScreen from './src/screens/Cart/CartScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import OrderScreen from './src/screens/OrderScreen';
import SearchScreen from './src/screens/SearchScreen';
import AccountScreen from './src/screens/AccountScreen';
import PersonalInfoScreen from './src/screens/PersonalInfoScreen';
import DeliveryAddressScreen from './src/screens/DeliveryAddressScreen';
import PaymentMethodScreen from './src/screens/PaymentMethodScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';

type RootStackParamList = {
  Login: undefined;
  Products: { user: { id: number; username: string; email?: string } };
  ProductDetail: { productId: number };
  Cart: undefined;
  Notifications: undefined;
  Orders: undefined;
  Search: { user: { id: number; username: string; email?: string } };
  Account: { user: { id: number; username: string; email?: string } };
  PersonalInfo: { user: { id: number; username: string; email?: string } };
  DeliveryAddress: { user: { id: number; username: string; email?: string } };
  PaymentMethod: { user: { id: number; username: string; email?: string } };
  ChangePassword: { user: { id: number; username: string; email?: string } };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
     <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            id="MainStack"
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
            />
            <Stack.Screen 
              name="Products" 
              component={ProductScreen}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
            />
            <Stack.Screen
              name="Cart"
              component={CartScreen}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationScreen}
            />
            <Stack.Screen
              name="Orders"
              component={OrderScreen}
            />
            <Stack.Screen
              name="Search"
              component={SearchScreen}
            />
            <Stack.Screen
              name="Account"
              component={AccountScreen}
            />
            <Stack.Screen
              name="PersonalInfo"
              component={PersonalInfoScreen}
            />
            <Stack.Screen
              name="DeliveryAddress"
              component={DeliveryAddressScreen}
            />
            <Stack.Screen
              name="PaymentMethod"
              component={PaymentMethodScreen}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
     </AuthProvider>
  );
};

export default App;
