import {Session} from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import { useState } from 'react'
import { StyleSheet, Alert } from 'react-native';
import { TextInput, View, useAnimatedValue, Text} from 'react-native';

import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Dropdown } from 'react-native-element-dropdown';
import { Button } from 'react-native-elements';

export default function InsertDataForm({session}: {session: Session}){
    const [loading, setLoading] = useState<Boolean>(false);

    const [name, onChangeName] = useState<string>('');
    const [nameChecker, setNameCheck] = useState<Boolean>(false);

    const [cost, onChangeCost] = useState<string>('');
    const [costChecker, setCurrenyCheck] = useState<Boolean>(false);

    const [category, onChangeCategory]= useState<string>();
    const [frequency, onChangeFrequency] = useState();
    const [transactionType, onChangeType] = useState<string>();

    const categoryList = [
        {label: 'Needs', value: 1},
        {label: 'Wants', value: 2},
        {label: 'Monthly', value: 3},
        {label: 'Other', value: 4},
    ]

    async function sendData(){
        try{
            setLoading(true);
            const { error } = await supabase
                .from('budget_data')
                .insert({
                    user_id:session.user.id,
                    transactiontype: transactionType,
                    name: name,
                    cost: cost,
                    category: category,
                    frequency: frequency
                })
            if (error) Alert.alert(error.message)
        }
        catch(error){
            if(error instanceof Error){ Alert.alert(error.message)}
        }
        finally{
            setLoading(false);
        }
    }

    function ShowFormErrorText(){
        return(
            <View>
            {(costChecker) ? '' : <Text>Please put proper currency form example 100.20</Text>}
            {(nameChecker) ? '' : <Text>Please put a name for the transaction</Text>}
            </View>
        );
    }
    
    function checkName(name: string){
        (name == '') ? setNameCheck(false) : setNameCheck(true);
    }
    
    function checkCurrency(cost: string){
        var regex  = /^\d+(?:\.\d{2,2})$/;
        (regex.test(cost)) ? setCurrenyCheck(true) : setCurrenyCheck(false);
    }


    return(
        <View style={styles.wrapper}>
            <SegmentedControl
                values={['Income', 'Expense']}
                selectedIndex={transactionType}
                onChange={(event) => {onChangeType(event.nativeEvent.value);}}
            />
            <SegmentedControl
                values={['Once', 'Daily', 'Weekly', 'Monthly']}
                selectedIndex={frequency}
                onChange={(event) => {onChangeFrequency(event.nativeEvent.value)}}
            />
            <TextInput 
                style={styles.input}
                onChangeText={(e:string) => {onChangeName(e); checkName(e)}}
                value={name}
                placeholder="Name"
            />
            <TextInput 
                style={styles.input}
                onChangeText={(e) => {onChangeCost(e); checkCurrency(e)}}
                value={cost}
                placeholder="Cost ($)"
                keyboardType="numeric"
            />
            <Dropdown data={categoryList}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select item"
                searchPlaceholder="Search..."
                value={category}
                onChange={item => {
                    onChangeCategory(item.value);
                }}
            />
            {(costChecker && nameChecker) ?
                <Button title="Submit" onPress={() => sendData()} />
                :<Button title="Submit" disabled onPress={() => sendData()} />
            }
            <ShowFormErrorText />
        </View>
    );
    
}



const styles = StyleSheet.create({
    wrapper: {
        display:'flex',
        flexDirection:'column'
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
});
  