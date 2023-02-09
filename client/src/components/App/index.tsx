import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import VideoJs from "../VideoJs";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="info">Check /videojs or /react-player for examples</div>
    ),
  },
  {
    path: "/videojs",
    element: <VideoJs />,
  },
]);

function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
