"use strict";

/* eslint-disable react/jsx-pascal-case, no-console */

/**
 * This is a generated file. If you modify it manually, your changes will be lost!
 * Instead, modify the template in `fontawesome-common/generator`.
 *
 * FontAwesome6 icon set component.
 * Usage: <FontAwesome6 name="icon-name" size={20} color="#4F8EF7" />
 */

import { Platform } from 'react-native';
import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE, createIconSet } from '@react-native-vector-icons/common';
import brandGM from '../../glyphmaps/FontAwesome6_brand.json';
import regularGM from '../../glyphmaps/FontAwesome6_regular.json';
import solidGM from '../../glyphmaps/FontAwesome6_solid.json';
import metadata from '../../glyphmaps/FontAwesome6_meta.json';
import { jsx as _jsx } from "react/jsx-runtime";
const glyphValidator = (glyph, iconType) => metadata[iconType]?.includes(glyph);
const fontStyle = fontWeight => Platform.select({
  ios: {
    fontWeight
  },
  default: {}
});

// biome-ignore format: We want these to be consistent and we are fine with single for all
const RegularIcon = createIconSet(regularGM, 'FontAwesome6Free-Regular', 'FontAwesome6_Regular.ttf', fontStyle('400'));
// biome-ignore format: We want these to be consistent and we are fine with single for all
const SolidIcon = createIconSet(solidGM, 'FontAwesome6Free-Solid', 'FontAwesome6_Solid.ttf', fontStyle('900'));
// biome-ignore format: We want these to be consistent and we are fine with single for all
const BrandIcon = createIconSet(brandGM, 'FontAwesome6Brands-Regular', 'FontAwesome6_Brands.ttf', fontStyle('400'));
const Icon = props => {
  const {
    iconStyle,
    name
  } = props;
  if (!iconStyle) {
    return /*#__PURE__*/_jsx(RegularIcon, {
      ...props
    });
  }
  if (!glyphValidator(name, iconStyle)) {
    console.warn(`noSuchGlyph: glyph ${String(name)} does not exist for '${iconStyle}' icon type for FontAwesome6`);
    return /*#__PURE__*/_jsx(RegularIcon, {
      ...props
    });
  }
  switch (iconStyle) {
    case 'brand':
      return /*#__PURE__*/_jsx(BrandIcon, {
        ...props
      });
    case 'regular':
      return /*#__PURE__*/_jsx(RegularIcon, {
        ...props
      });
    case 'solid':
      return /*#__PURE__*/_jsx(SolidIcon, {
        ...props
      });
    default:
      console.warn(`noSuchIconTypeName: '${iconStyle}' icon type does not exist for FontAwesome6`);
      return /*#__PURE__*/_jsx(RegularIcon, {
        ...props
      });
  }
};
// biome-ignore format: We want these to be consistent and we are fine with single for all
const getImageSource = (iconStyle, name, size = DEFAULT_ICON_SIZE, color = DEFAULT_ICON_COLOR) => {
  switch (iconStyle) {
    case 'brand':
      return BrandIcon.getImageSource(name, size, color);
    case 'regular':
      return RegularIcon.getImageSource(name, size, color);
    case 'solid':
      return SolidIcon.getImageSource(name, size, color);
    default:
      console.warn(`noSuchIconTypeName: '${iconStyle}' icon type does not exist for FontAwesome6`);
      return RegularIcon.getImageSource(name, size, color);
  }
};
Icon.getImageSource = getImageSource;
// biome-ignore format: We want these to be consistent and we are fine with single for all
const getImageSourceSync = (iconStyle, name, size = DEFAULT_ICON_SIZE, color = DEFAULT_ICON_COLOR) => {
  switch (iconStyle) {
    case 'brand':
      return BrandIcon.getImageSourceSync(name, size, color);
    case 'regular':
      return RegularIcon.getImageSourceSync(name, size, color);
    case 'solid':
      return SolidIcon.getImageSourceSync(name, size, color);
    default:
      console.warn(`noSuchIconTypeName: '${iconStyle}' icon type does not exist for FontAwesome6`);
      return RegularIcon.getImageSourceSync(name, size, color);
  }
};
Icon.getImageSourceSync = getImageSourceSync;
export default Icon;
//# sourceMappingURL=index.js.map