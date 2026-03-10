"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
var _common = require("@react-native-vector-icons/common");
var _FontAwesome6_brand = _interopRequireDefault(require("../../glyphmaps/FontAwesome6_brand.json"));
var _FontAwesome6_regular = _interopRequireDefault(require("../../glyphmaps/FontAwesome6_regular.json"));
var _FontAwesome6_solid = _interopRequireDefault(require("../../glyphmaps/FontAwesome6_solid.json"));
var _FontAwesome6_meta = _interopRequireDefault(require("../../glyphmaps/FontAwesome6_meta.json"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/* eslint-disable react/jsx-pascal-case, no-console */

/**
 * This is a generated file. If you modify it manually, your changes will be lost!
 * Instead, modify the template in `fontawesome-common/generator`.
 *
 * FontAwesome6 icon set component.
 * Usage: <FontAwesome6 name="icon-name" size={20} color="#4F8EF7" />
 */

const glyphValidator = (glyph, iconType) => _FontAwesome6_meta.default[iconType]?.includes(glyph);
const fontStyle = fontWeight => _reactNative.Platform.select({
  ios: {
    fontWeight
  },
  default: {}
});

// biome-ignore format: We want these to be consistent and we are fine with single for all
const RegularIcon = (0, _common.createIconSet)(_FontAwesome6_regular.default, 'FontAwesome6Free-Regular', 'FontAwesome6_Regular.ttf', fontStyle('400'));
// biome-ignore format: We want these to be consistent and we are fine with single for all
const SolidIcon = (0, _common.createIconSet)(_FontAwesome6_solid.default, 'FontAwesome6Free-Solid', 'FontAwesome6_Solid.ttf', fontStyle('900'));
// biome-ignore format: We want these to be consistent and we are fine with single for all
const BrandIcon = (0, _common.createIconSet)(_FontAwesome6_brand.default, 'FontAwesome6Brands-Regular', 'FontAwesome6_Brands.ttf', fontStyle('400'));
const Icon = props => {
  const {
    iconStyle,
    name
  } = props;
  if (!iconStyle) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(RegularIcon, {
      ...props
    });
  }
  if (!glyphValidator(name, iconStyle)) {
    console.warn(`noSuchGlyph: glyph ${String(name)} does not exist for '${iconStyle}' icon type for FontAwesome6`);
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(RegularIcon, {
      ...props
    });
  }
  switch (iconStyle) {
    case 'brand':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(BrandIcon, {
        ...props
      });
    case 'regular':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(RegularIcon, {
        ...props
      });
    case 'solid':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(SolidIcon, {
        ...props
      });
    default:
      console.warn(`noSuchIconTypeName: '${iconStyle}' icon type does not exist for FontAwesome6`);
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(RegularIcon, {
        ...props
      });
  }
};
// biome-ignore format: We want these to be consistent and we are fine with single for all
const getImageSource = (iconStyle, name, size = _common.DEFAULT_ICON_SIZE, color = _common.DEFAULT_ICON_COLOR) => {
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
const getImageSourceSync = (iconStyle, name, size = _common.DEFAULT_ICON_SIZE, color = _common.DEFAULT_ICON_COLOR) => {
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
var _default = exports.default = Icon;
//# sourceMappingURL=index.js.map