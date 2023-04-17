import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './src/lib/supabaseClient'
import Auth from './src/components/Auth'

import { Session } from '@supabase/supabase-js'
import Landing from './src/pages/landingPage';
import TabNav from './src/components/TabNavigation'
import { NavigationContainer} from '@react-navigation/native';
import  {TabDisplay} from './src/components/TabNavigation'
import TestPage from './src/pages/pageTest2';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';


export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const Tab = createBottomTabNavigator();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <NavigationContainer >
      {session && session.user ? 
      <Tab.Navigator initialRouteName='Home' tabBar={(props) => <TabDisplay {...props} />}>
        <Tab.Screen name="Home" component={Landing} />
        <Tab.Screen name="Settings" component={TestPage} />
        <Tab.Screen name="Settingsa" component={TestPage} />
        <Tab.Screen name="Saettings" component={TestPage} />
      </Tab.Navigator>
      : <Auth />}
    </NavigationContainer>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
