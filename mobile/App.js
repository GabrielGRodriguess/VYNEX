import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import CidadeScreen from './src/screens/CidadeScreen';
import HomeScreen from './src/screens/HomeScreen';
import PrestadoresScreen from './src/screens/PrestadoresScreen';
import PrestadorScreen from './src/screens/PrestadorScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Cidade"
        screenOptions={{
          headerStyle: { backgroundColor: '#1565C0' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Cidade" component={CidadeScreen} options={{ title: 'SOS Guararapes' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Categorias' }} />
        <Stack.Screen name="Prestadores" component={PrestadoresScreen} options={{ title: 'Profissionais' }} />
        <Stack.Screen name="Prestador" component={PrestadorScreen} options={{ title: 'Perfil' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
