import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './src/lib/supabaseClient'
import Auth from './src/components/Auth'
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { NavigationContainer} from '@react-navigation/native';
import { Session } from '@supabase/supabase-js'

import Landing from './src/pages/landingPage';
import InsertDataForm from './src/pages/insertDataPage';
import TransactionsPage from './src/pages/transactionsPage';

import  {TabDisplay} from './src/components/TabNavigation'
import NavigationHeader from './src/components/Header'



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
        <Tab.Navigator 
          initialRouteName='Home' 
          tabBar={(props) => <TabDisplay {...props} />}
          screenOptions={{headerTitle:(props) => <NavigationHeader {...props}/>}}
        > 
          <Tab.Screen 
            name="Home" 
            children={() => <Landing key={session.user.id} session={session} />
          } />
          <Tab.Screen 
            name="Add" 
            children={() => <InsertDataForm key={session.user.id} session={session} />
          } />
          <Tab.Screen 
            name="Transactions" 
            children={() => <TransactionsPage key={session.user.id} session={session} />
          } />
        </Tab.Navigator >
        : <Auth />
      }
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
