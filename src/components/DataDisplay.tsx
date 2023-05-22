import { Session } from "@supabase/supabase-js"
import { useState , useEffect} from "react";
import { View, Text, Alert } from "react-native";
import { supabase } from '../lib/supabaseClient';



export default function DataSummaryDisplay({session}: {session: Session}){
    const [loading, setLoading] = useState<boolean>(true);
    const [dataLoaded, setDataLoaded] = useState<boolean>();
    const [budgetData, setBudgetData] = useState<
    {category: String; cost: String; frequency: String; id: Number; inserted_at: String; name: String; transactiontype: String; updated_at: String; user_id: String; }[]
    | null>();

    const [incomeTotal, setIncomeTotal] = useState(0);
    const [expenseTotal, setExpenseTotal] = useState(0);
    const [wantsTotal, setWantsTotal]  = useState();
    const [needsTotal, setNeedsTotal] = useState();
    const [monthlyTotal, setMonthlyTotal] = useState();
    const [otherTotal, seOtherTotal] = useState();

    useEffect(() => {
        if(session){getData();
            if(!dataLoaded){DataTotals(); setDataLoaded(true)}; 
        };
    }, [session])

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

    async function DataTotals(){
        try{
            setLoading(true);
            budgetData?.forEach((e) => {
                /*if(e.category == 'Needs') {setNeedsTotal(needsTotal + parseInt(e.cost))};
                if(e.category == 'Wants') {setWantsTotal(wantsTotal + Number(e.cost))};
                if(e.category == 'Monthly') {setMonthlyTotal(monthlyTotal + Number(e.cost))};
                if(e.category == 'Other') {seOtherTotal(otherTotal + Number(e.cost))};*/
                if(e.transactiontype == 'Income'){setIncomeTotal(incomeTotal + parseInt(e.cost))};
                if(e.transactiontype == 'Expense'){setExpenseTotal(expenseTotal + parseInt(e.cost))};
            });
        }
        catch(error){ if (error instanceof Error){Alert.alert(error.message)}}
        finally{ setLoading(false)};
    }

    if(loading){
        return(
            <View><Text>Loading</Text></View>
        );
    }else{   
        console.log(incomeTotal);
        console.log(expenseTotal);
        return(
            <View>
                <Text>Income: {incomeTotal}</Text>
                <Text>Expense: {expenseTotal}</Text>
                <Text></Text>
            </View>
        );
    }
}