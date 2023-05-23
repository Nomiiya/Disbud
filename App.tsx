import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Alert } from 'react-native';
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
  const [loading, setLoading] = useState(false)
  const [budgetData, setBudgetData] = useState<
  {category: String; cost: String; frequency: String; id: Number; inserted_at: String; name: String; transactiontype: String; updated_at: String; user_id: String; }[]>();
  
  const Tab = createBottomTabNavigator();

  async function getData(){
    try{
        setLoading(true);
        const { data, error } = await supabase
            .from('budget_data')
            .select()
            .eq('user_id', session.user.id)
        setBudgetData(data);
        console.log('Get Data was ran sucessfully for '+ session.user.email);
    }
    catch(error){
        if(error instanceof Error){ Alert.alert(error.message)}
    }
    finally{
        setLoading(false)
    }
}

  useEffect(() => {
    try{
      setLoading(true);
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      });
  
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      });
      
      getData();

    }catch(error){
      if(error instanceof Error){ Alert.alert(error.message)}
    }finally{
      setLoading(false);
    }

    
  }, [])

  return (
    <NavigationContainer >
      {
        (loading) ? (<h1>LOADING....</h1>):
        (session && session.user ? 
          <Tab.Navigator 
            initialRouteName='Home' 
            tabBar={(props) => <TabDisplay {...props} />}
            screenOptions={{headerTitle:(props) => <NavigationHeader {...props}/>}}
          > 
            <Tab.Screen 
              name="Home" 
              children={() => 
                <Landing key={session.user.id} session={session}
                data={budgetData} 
                />
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
        )
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
