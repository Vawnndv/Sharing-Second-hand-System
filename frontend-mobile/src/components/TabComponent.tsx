import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { filterValue } from '../screens/home/components/ItemTabComponent';
import { appColors } from '../constants/appColors';
import FilterOrder from './OrderManagement/FilterOrder';
import { fontFamilies } from '../constants/fontFamilies';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SpaceComponent from './SpaceComponent';

interface Props {
	state: any;
	descriptors: any;
	navigation: any;
	position: Animated.AnimatedInterpolation<number>;
	filterUserPostValue?: filterValue;
	filterWarehouseValue?: filterValue;
	setFilterUserPostValue?: (val: filterValue) => void; 
	setFilterWarehouseValue?: (val: filterValue) => void;
	handleNavigateMapSelectWarehouses?: (val: any) => void;
	isHome?: boolean;
}

function TabComponent(props: Props) {
	const { state, descriptors, navigation, position, filterUserPostValue, filterWarehouseValue, setFilterUserPostValue, setFilterWarehouseValue, handleNavigateMapSelectWarehouses, isHome } = props;

	return (
		<View style={[styles.tabBar, !isHome ? {marginTop: 14} : {marginTop: 0}]}>
			<View style={{ flexDirection: 'row', width: '60%', justifyContent: 'center', alignItems: 'center'}}>
				{state.routes.map((route: any, index: number) => {
					const { options } = descriptors[route.key];
					const label = options.tabBarLabel !== undefined
						? options.tabBarLabel
						: options.title !== undefined
							? options.title
							: route.name;

					const isFocused = state.index === index;

					const onPress = () => {
						const event = navigation.emit({
							type: 'tabPress',
							target: route.key,
							canPreventDefault: true,
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

					const inputRange = state.routes.map((_: any, i: number) => i);

					const outputRange = inputRange.map((i: number) => (i === index ? 1 : 0)); 
					const translateX = position.interpolate({
						inputRange,
						outputRange,
					});

					return (
						<TouchableOpacity
							key={index}
							accessibilityRole="button"
							accessibilityState={isFocused ? { selected: true } : {}}
							accessibilityLabel={options.tabBarAccessibilityLabel}
							testID={options.tabBarTestID}
							onPress={onPress}
							onLongPress={onLongPress}
							style={styles.tabItem}
						>
							<Animated.Text style={[styles.tabLabel,
										{ color: isFocused ? appColors.primary : '#666', marginBottom: isFocused ? 9 : 12 }, isHome && {fontSize: 19}]}>
								{label}
							</Animated.Text>
							{isFocused && <Animated.View style={[styles.tabIndicator, { transform: [{ translateX }] }]} />}
						</TouchableOpacity>
					);
				})}
			</View>
			<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginVertical: 4, marginLeft: 12  }}>
			{(
				filterUserPostValue && 
				filterWarehouseValue && 
				setFilterUserPostValue && 
				setFilterWarehouseValue) && (
					<FilterOrder filterValue={state.index === 0 ? filterUserPostValue : filterWarehouseValue} setFilterValue={state.index === 0 ? setFilterUserPostValue : setFilterWarehouseValue} />
				)}
				{handleNavigateMapSelectWarehouses && state.index === 1 && (
					<TouchableOpacity
						style={{ paddingVertical: 5, paddingHorizontal: 20, backgroundColor: appColors.white5, borderRadius: 15, marginLeft: 12 }}
						onPress={() => handleNavigateMapSelectWarehouses(navigation)}
					>
						<MaterialCommunityIcons name='map-search' size={25} color={appColors.primary}/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

export default TabComponent;

const styles = StyleSheet.create({
	tabBar: {
		flexDirection: 'column',
		backgroundColor: '#fff',
		marginLeft: 12,
	},

	tabItem: {
		flex: 1,
		backgroundColor: 'transparent',
		justifyContent: 'center',
		textAlign: 'center',
		// paddingHorizontal: 16
	},

	tabLabel: {
		textTransform: 'capitalize',
		color: appColors.primary,
		fontSize: 17,
		fontFamily: fontFamilies.bold,
		textAlign: 'center'
	},

	tabIndicator: {
		backgroundColor: appColors.primary,
		height: 3,
	},
});