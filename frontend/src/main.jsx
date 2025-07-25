import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Toaster} from "react-hot-toast"
import {BrowserRouter} from "react-router-dom"
import store from "./utils/store.js";
import { Provider } from "react-redux";
createRoot(document.getElementById('root')).render(
    <Provider store={store}>
  <BrowserRouter>
  <App />
  <Toaster/>
  </BrowserRouter> 
     </Provider>
)
