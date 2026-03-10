import React from 'react';
import { Image, View } from 'react-native';

/**
 * UniversalImage Component
 * Supports both PNG/JPG (React Native Image) and SVG (React Component)
 */
const UniversalImage = ({ source, style, resizeMode, ...props }) => {
    // Check if tintColor is provided in the style
    const tintColor = style?.tintColor;
    
    // Check if source is a function (svg) or just regular image source (png/jpg/..)
    if (typeof source === 'function') {
        // Source is an SVG Component
        const SvgComponent = source;

        // Apply the resizeMode logic to the SVG's container
        const containerStyle = [style, { resizeMode: resizeMode || 'contain' }];
        return (
          <View style={containerStyle}>
            <SvgComponent 
                width="100%" // always scale to 100% of the container
                height="100%" // always scale to 100% of the container
                preserveAspectRatio="xMidYMid meet" // always maintain aspect ratio
                fill={style?.tintColor?? 'transparent'} // apply tintColor if provided
                {...props} />
          </View>
        );
    }
    
    // Source is a PNG/JPG, apply resizeMode
    return <Image source={source} style={[style, { resizeMode: resizeMode || 'contain' }]} {...props} />;
};
export default UniversalImage;