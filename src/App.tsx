import React, { useReducer } from 'react';
import './App.scss';
import { Toast } from "./ui/toast/toast";
import { Switch, Route } from 'react-router-dom';
import { Login } from './user/login/login';
import { SignUp } from "./user/signup/signup";
import { StockList } from './stocks/stockList';
import { TriggerList } from './triggers/triggerList';
import { HoldingList } from "./portfolio/holdingList";
import { GlobalContext as Context, reducer, initialState } from "./global/context";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={{ ...state, dispatch }}>
      <Toast />
      <Switch>
        <Route path='/signup' component={SignUp} />
        <Route path='/stockList' component={StockList} />
        <Route path='/triggerList' component={TriggerList} />
        <Route path='/portfolio' component={HoldingList} />
        <Route path='/' component={Login} />
      </Switch>
    </Context.Provider>
  );
}

export default App;
