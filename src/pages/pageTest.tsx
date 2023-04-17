import { View , Text, Button} from "react-native";
import { supabase } from '../lib/supabaseClient';

export default function TestPage(){
    return (
        <View>
            <Text>Hello</Text>
            <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
        </View>
    )
}