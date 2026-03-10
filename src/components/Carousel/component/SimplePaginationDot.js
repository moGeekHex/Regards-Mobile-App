import React, { memo } from 'react';
import {View, StyleSheet} from 'react-native';

function activeStyle(size) {
  if (!size) {
    return {};
  }
  return {width: 30, height: 5, borderRadius: size / 2};
}

function genCircleStyle(size) {
     if (!size) {
       return {};
     }
     return {width: size, height: size, borderRadius: size / 2};
   }

function Dot({isActive, color, colorActive, activeDotSize, inActiveDotSize, dotSeparator}) {
  const processedActiveDotStyle = [
    styles.activeDot,
    {
      backgroundColor: colorActive,
      borderColor: colorActive,
      marginHorizontal: dotSeparator / 2,
      ...activeStyle(activeDotSize),
    },
  ];
  const processedInActiveDotStyle = [
    styles.inActiveDot,
    {
      backgroundColor: color,
      borderColor: color,
      marginHorizontal: dotSeparator / 2,
      ...genCircleStyle(inActiveDotSize),
    },
  ];
  return (
    <View
      style={[
        styles.baseDot,
        isActive ? processedActiveDotStyle : processedInActiveDotStyle,
      ]}
    />
  );
}

function SimplePaginationDot({
  style,
  length,
  currentIndex = 0,
  colorActive = '#4F008E',
  color = '#ddd',
  activeDotSize = 14,
  inActiveDotSize = 7,
  dotSeparator = 10
}) {
  function renderItem(item, index) {
    return (
      <Dot
        key={index}
        isActive={index === currentIndex}
        color={color}
        colorActive={colorActive}
        activeDotSize={activeDotSize}
        inActiveDotSize={inActiveDotSize}
        dotSeparator={dotSeparator}
      />
    );
  }
  return (
    <View style={[styles.container, style]}>
      {Array(length).fill(0).map(renderItem)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  baseDot: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
  },
  activeDot: {
    backgroundColor: '#000',
  },
  inActiveDot: {
    backgroundColor: '#999',
  },
});

export default memo(SimplePaginationDot)