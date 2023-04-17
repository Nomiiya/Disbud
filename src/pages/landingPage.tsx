import {Session} from '@supabase/supabase-js'
import {useEffect, useState} from 'react'
import { Alert, StyleSheet, View, Button, Text, TouchableOpacity} from 'react-native';
import { supabase } from '../lib/supabaseClient';

import TabNavigation, {TabDisplay} from '../components/TabNavigation'
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { NavigationContainer} from '@react-navigation/native';

import Testing from '../pages/pageTest'
import TestPage from '../pages/pageTest2';


export default function Landing({session}: {session: Session}) {
    const Tab = createBottomTabNavigator();

    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');

    useEffect(() =>{
        if(session) getProfile()
    }, [session])

    async function getProfile(){
        try{
            
            setLoading(true);
            if (!session?.user) throw new Error('No user on the session!')
            
            let {data, error, status} = await supabase
                .from('profiles')
                .select(`username`)
                .eq('id', session?.user.id)
                .single()
            if(error && status !== 406){ console.log(error); throw error }
            if(data){
                setUsername(data.username)
            }
        }
        catch(error){
            if(error instanceof Error){ Alert.alert(error.message)}
        }
        finally{
            setLoading(false)
        }
    }

    return(
        <View style={styles.container}>
            <Text>Hello, {username}</Text>
            <View>
                <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    }
})