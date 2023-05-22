import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { StyleSheet,Text,View,Pressable, TouchableOpacity} from 'react-native';

const Tab = createBottomTabNavigator();

export function TabDisplay({ state, descriptors, navigation }:{state: any, descriptors:any, navigation: any}){
    return(
        <View style={styles.container}>
            {/*@ts-ignore */}
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;

              const isFocused = state.index === index;

              const onPress = () => {
              const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
              };

              const onLongPress = () => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              };
            return(
              
            <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            key={route.key}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <Text style={{ color: isFocused ? '#673ab7' : '#222' }}>
              {label}
            </Text>
          </TouchableOpacity>
          
        );
        })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      height: '5%',
      marginLeft:'auto',
      marginRight: 'auto'
    },
  });
  