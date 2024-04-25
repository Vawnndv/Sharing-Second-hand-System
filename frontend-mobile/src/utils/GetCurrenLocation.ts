import { StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import * as Location from "expo-location";

export const GetCurrentLocation = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission not granted",
        "Allow the app to use the location service",
        [{ text: "OK" }],
        { cancelable: false }
      );
      return null; // Return null if permission not granted
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    if (location) {
      const { coords } = location;
      if (coords) {
        const { latitude, longitude } = coords;

        // Return latitude and longitude
        return { latitude, longitude };
      }
    }
  } catch (error) {
    console.error("Error getting location: ", error);
    return null; // Return null in case of error
  }
};