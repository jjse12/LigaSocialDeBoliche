import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';
import NavbarSelected from './contenido';
import Inventario from './inventario';
import InventarioSelected from './inventario-selected';

export const reducers = {
    routing: routerReducer,
    navbarSelected: NavbarSelected,
    inventario: Inventario,
    inventarioSelected: InventarioSelected
};

export default combineReducers(reducers);
