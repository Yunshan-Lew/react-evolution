import { combineReducers } from 'redux';
import loginInfo from './reducerLogin';
import detailData from './reducerDetail';
import listData from './reducerListData';
import systemData from './reducerSystem';

const todoApp = combineReducers({
	loginInfo,
	detailData,
	listData,
	systemData
})

export default todoApp
