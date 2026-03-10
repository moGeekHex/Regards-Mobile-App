import { combineReducers } from 'redux';
import AuthReducer from './State/reducers/AuthReducer';
import AuthCorporateReducer from '../modules/Auth/State/reducer/AuthCorporateReducer';
import FavouritesReducer from './State/reducers/FavouritesReducer';
import LocationReducer from './State/reducers/LocationReducer';
import HomeReducer from '../modules/Home/State/reducers/HomeReducer';
import CategoryReducer from '../modules/Home/State/reducers/CategoryReducer';
import PopularProductReducer from '../modules/Home/State/reducers/PopularProductReducer';
import PopularEventReducer from '../modules/Home/State/reducers/PopularEventReducer';
import GiftSearchReducer from '../modules/Home/State/reducers/GiftSearchReducer';
import GiftReducer from '../modules/Home/State/reducers/GiftReducer';
import SearchReducer from '../modules/Search/State/reducer/SearchReducer';
import CategorySearchReducer from '../modules/Search/State/reducer/CategorySearchReducer';
import EventSearchReducer from '../modules/Search/State/reducer/EventSearchReducer';
import SellerSearchReducer from '../modules/Search/State/reducer/SellerSearchReducer';
import ProductByEventReducer from '../modules/Search/State/reducer/ProductByEventReducer';
import ProductByCategoryReducer from '../modules/Search/State/reducer/ProductByCategoryReducer';
import ProductBySellerReducer from '../modules/Search/State/reducer/ProductBySellerReducer';
import ProductReducer from '../modules/Product/State/reducer/ProductReducer';
import FavouritesProductReducer from '../modules/Likes/State/reducer/FavouritesActionReducer';
import ProfileImageReducer from '../modules/Profile/State/reducer/ProfileImageReducer';
import ProfileReducer from '../modules/Profile/State/reducer/ProfileReducer';
import PayReducer from '../modules/Payment/State/reducer/PayReducer';
import PayWalletReducer from '../modules/Payment/State/reducer/PayWalletReducer';
import OtpPayWalletReducer from '../modules/Payment/State/reducer/OtpPayWalletReducer';
import PromoReducer from '../modules/Payment/State/reducer/PromoReducer';
import OrderReducer from '../modules/Profile/State/reducer/OrderReducer';
import MyWalletReducer from './State/reducers/MyWalletReducer';
import MyGiftReducer from '../modules/Profile/State/reducer/MyGiftReducer';

export default combineReducers({
     auth : AuthReducer,
     authCorporate : AuthCorporateReducer,
     home : HomeReducer,
     categories : CategoryReducer,
     popularProduct : PopularProductReducer,
     popularEvent : PopularEventReducer,
     gift : GiftReducer,
     giftSearch : GiftSearchReducer,
     search : SearchReducer,
     categoriesSearch : CategorySearchReducer,
     eventSearch : EventSearchReducer,
     sellersSearch : SellerSearchReducer,
     productByEvent : ProductByEventReducer,
     productByCategory : ProductByCategoryReducer,
     productBySeller : ProductBySellerReducer,
     product : ProductReducer,
     favouritesProduct : FavouritesProductReducer,
     favourites : FavouritesReducer,
     location : LocationReducer,
     updateImage : ProfileImageReducer,
     profile : ProfileReducer,
     payment : PayReducer,
     promo : PromoReducer,
     order : OrderReducer,
     myGift : MyGiftReducer,
     myWallet : MyWalletReducer,
     payWallet : PayWalletReducer,
     otpPayWallet : OtpPayWalletReducer
});