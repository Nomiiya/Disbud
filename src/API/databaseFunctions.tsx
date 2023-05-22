import { Session } from "@supabase/supabase-js";
import { supabase } from '../lib/supabaseClient';

async function retrieveData({session}: {session: Session}) : Promise<B>{
    const { data, error } = await supabase
                .from('budget_data')
                .select()
                .eq('user_id', session.user.id)
    return ({data, error});
}

export function retrieveData();