import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { FlatList, View, Text, Alert } from "react-native";
import { Button } from "react-native-elements";
import { supabase } from '../lib/supabaseClient';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

const categoryList =  new Map();
categoryList.set('1','Needs');
categoryList.set('2','Wants');
categoryList.set('3','Other');

const datePickerOptions = [
    {label: 'Today', value: 1},
    {label: 'Yesterday', value: 2},
    {label: 'Last 7 Days', value: 3},
    {label: 'Start of month', value: 4},
    {label: 'Last 30 Days', value: 5},
    {label: 'Year to date', value: 6},
    {label: 'Date Range', value: 7},
];

export default function TransactionsPage({session}: {session: Session}){
    const [loading, setLoading] = useState<Boolean>();
    const [transcactions, setTransactions] = useState<
    {category: String; cost: String; frequency: String; id: Number; inserted_at: String; name: String; transactiontype: String; updated_at: String; user_id: String; }[]
    | null>();

    const [dateRange, setDateRange] = useState<string>();
    const [startDate, setStartDate] = useState(new Date());
    const [str_startDate, setStringStartDate] = useState('');
    const [str_endDate, setStringEndDate] = useState('');
    const [endDate, setEndDate] = useState(new Date());
    const [showDateRange, setShowDateRange] = useState(false);



    const onSetStartDate = (event, selectedDate: Date) => {
        const dateInput = selectedDate.toLocaleDateString('fr-CA');
        setStartDate(selectedDate);
        setStringStartDate(dateInput);
    };
    const onSetEndDate = (event, selectedDate: Date) => { 
        const dateInput = selectedDate.toLocaleDateString('fr-CA');
        setEndDate(selectedDate);
        setStringEndDate(dateInput);
    };

    useEffect(() => {
        if(session){
            getData();
        }
    }, [])

    async function getData(){
        try{
            setLoading(true);
            const { data, error } = await supabase
                .from('budget_data')
                .select()
                .eq('user_id', session.user.id)
            setTransactions(data);
            console.log('Get Data was ran sucessfully for '+ session.user.email);
        }
        catch(error){
            if(error instanceof Error){ Alert.alert(error.message)}
        }
        finally{
            setLoading(false)
        }
    }

    async function deleteRow(itemID: Number){
        try{
            setLoading(true);
            const {error} = await supabase
                .from('budget_data')
                .delete()
                .match({'id': itemID, 'user_id': session.user.id})
            if(error){console.log(error);}
            else{console.log("Deleted row for item id#:" + itemID + " for user: " + session.user.id);}
        }
        catch(error){
            if(error instanceof Error){ Alert.alert(error.message)}
        }
        finally{
            setLoading(false)
        }
    }

    function DateRangeForm() {
        return(
            <View>
                <Text> Start Date :</Text>
                <DateTimePicker 
                    testID="dateTimePicker-startDate"
                    value={startDate}
                    is24Hour={true}
                    onChange={onSetStartDate}
                />
                <Text> End Date :</Text>
                <DateTimePicker 
                    testID="dateTimePicker-endDate"
                    value={endDate}
                    mode="date"
                    is24Hour={true}
                    onChange={onSetEndDate}
                />
            </View>
        );
    }
    
    function DisplayDateRangeData(item){
        return(
            ((item.inserted_at >= str_startDate) && (item.inserted_at <= str_endDate)) ?
                <Text>
                    <Text> {item.name} </Text>
                    <Text> {item.cost} </Text>
                    <Text> {categoryList.get(item.category)}  </Text>
                    <Button title="delete" onPress={() => {deleteRow(item.id); getData();}} />
                </Text>
            : ''
        );
    }

    function DisplayData(item){
        return(
            <Text>
                <Text> {item.name} </Text>
                <Text> {item.cost} </Text>
                <Text> {categoryList.get(item.category)} </Text>
                <Button title="delete" onPress={() => {deleteRow(item.id); getData();}} />
            </Text>
        )
    }

    return (
        <View>
            <Dropdown data={datePickerOptions}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select item"
                searchPlaceholder="Search..."
                value={dateRange}
                onChange={item => {
                    setDateRange(item.value.toString());
                    (item.value == 7) ? setShowDateRange(true) : setShowDateRange(false);
                }}
            />
            { (showDateRange) ? <DateRangeForm />: ''}
            
            {(showDateRange)?
                 <FlatList data={transcactions} renderItem={({item}) => DisplayDateRangeData(item)} />
                 :<FlatList data={transcactions} renderItem={({item}) => DisplayData(item)} />
            }
        </View>
    );
}