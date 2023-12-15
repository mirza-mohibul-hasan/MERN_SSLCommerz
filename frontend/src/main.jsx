import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Pages/App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import BookDetails from './Pages/BookDetails.jsx';
import PaymentSuccess from './Pages/PaymentSuccess.jsx';
import PaymentFailed from './Pages/PaymentFailed.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>
  },
  {
    path:"/bookdetails/:id",
    element: <BookDetails></BookDetails>
  },
  {
    path:"payment/success/:tranId",
    element: <PaymentSuccess></PaymentSuccess>
  },
  {
    path:"payment/failed/:tranId",
    element: <PaymentFailed></PaymentFailed>
  }
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
