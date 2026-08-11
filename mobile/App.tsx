import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import ReaderScreen from './src/screens/ReaderScreen';
import AdminScreen from './src/screens/AdminScreen';
import { AuthProvider, useAuth } from './src/auth/AuthContext';
import { CurrencyProvider } from './src/currency/CurrencyContext';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import type { RootStackParamList } from './src/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNav() {
  const { user, ready } = useAuth();
  const { colors, isDark } = useTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme : DefaultTheme).colors,
      background: colors.cream,
      primary: colors.gold,
      card: colors.cream,
      text: colors.ink,
      border: colors.hairline,
    },
  };

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.gold} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack.Navigator
        initialRouteName={user?.role === 'admin' ? 'Admin' : undefined}
        screenOptions={{
          headerStyle: { backgroundColor: colors.cream },
          headerTintColor: colors.ink,
          headerTitleStyle: { fontWeight: '800' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.cream },
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Library" component={LibraryScreen} options={{ headerShown: false }} />
            <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: '' }} />
            <Stack.Screen name="Reader" component={ReaderScreen} options={{ title: '' }} />
            <Stack.Screen name="Admin" component={AdminScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <CurrencyProvider>
          <AuthProvider>
            <RootNav />
          </AuthProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
