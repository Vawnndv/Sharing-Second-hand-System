import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, ScrollView, Image } from 'react-native';
import CardOrderView from './CardOrderView';

interface Item {
    Title: string;
    LocationGive: string;
    GiveType: string;
    Status: string;
    image: string;
}

interface DropdownContentProps {
    title: string;
    data: Item[]; // Dữ liệu JSON
}

const DropdownContentComponent: React.FC<DropdownContentProps> = ({ title, data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [heightAnim] = useState(new Animated.Value(0));
  const [height, setHeight] = useState(0);
  const [heightTitle, setHeightTitle] = useState(0);

  useEffect(() => {
    if (isExpanded) {
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(heightAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isExpanded, height]);

  return (
    <View style={styles.container} 
        onLayout={(event) =>{
            setHeight(event.nativeEvent.layout.height - heightTitle);
        }}
    >
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.dropdownHeader}
        onLayout={(event) =>{
            setHeightTitle(event.nativeEvent.layout.height);
        }}
      >
        <Text style={styles.headerText}>{title}</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.dropdownContent, { height: heightAnim }]}>
        <ScrollView 
            style={styles.scrollView}>
            {/* Các component con */}
            {data.map((item, index) => (
              <CardOrderView
                key={index}
                title={item.Title}
                locationgive={item.LocationGive}
                givetype={item.GiveType}
                status={item.Status}
                image={item.image}
              />
            ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: 'transparent',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    borderTopColor: 'grey',
    borderTopWidth: 1,
    marginTop: 1
  },
  headerText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#552466',
  },
  dropdownContent: {
    width: '100%',
    overflow: 'hidden',
    height: 'auto',
  },
  scrollView: {
    flexGrow: 1, 
  },
  card: {
    height: 140,
    borderWidth: 2,
    borderRadius: 10,
    margin: 10,
    borderColor: 'grey',
  },
  content: {
    height: 110,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 80,
  },
  infomation: {
    height: 80,
    width: '70%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});

export default DropdownContentComponent;
