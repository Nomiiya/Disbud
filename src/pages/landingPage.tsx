import {Session} from '@supabase/supabase-js'
import {useEffect, useState} from 'react'
import { Alert, StyleSheet, View, Button, Text,FlatList} from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/typesSupabase';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

import TransactionsPage from './transactionsPage';
import DataSummaryDisplay from '../components/DataDisplay'


export default function Landing({session}: {session: Session}) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState<String | null>();
    const [budgetData, setBudgetData] = useState<
    {category: String; cost: String; frequency: String; id: Number; inserted_at: String; name: String; transactiontype: String; updated_at: String; user_id: String; }[]
    | null>();

    const [displayType, onChangeDisplayType] = useState<String|null>('Recent');

    useEffect(() =>{
        if(session) {getProfile();}
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
            console.log('Get Profile was ran sucessfully for ' + session.user.email);
        }
        catch(error){
            if(error instanceof Error){ Alert.alert(error.message)}
        }
        finally{
            setLoading(false)
        }
    }

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

    return(
        <View style={styles.container}>
            <Text>Hello, {username}</Text>
            <SegmentedControl
                values={['Recent', 'Summary']}
                selectedIndex={displayType}
                onChange={(event) => {
                    (event.nativeEvent.selectedSegmentIndex == 0) ? getData() : '' ;
                    onChangeDisplayType(event.nativeEvent.value)
                }}
            />
            {(displayType == 'Recent') ? 
                <FlatList data={budgetData} renderItem={({item}) => 
                    <Text>
                        <Text> {item.name} </Text>
                        <Text> {item.cost} </Text>
                        <Text> {item.category} </Text>
                    </Text>
                } /> 
                : <DataSummaryDisplay key={session.user.id} session={session}  />
            }
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