import {View, StyleSheet, Text} from 'react-native'

export default function NavigationHeader() {
    return(
        <View style={Styles.container}>
            <Text></Text>
            <Text>b</Text>
        </View>
    );
}

const Styles = StyleSheet.create({
    container: {
        display:'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})