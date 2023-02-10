import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactPlayerDemo from "../ReactPlayerDemo";

import VideoJsDemo from "../VideoJsDemo";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="info">
        Check <a href="/video.js">/video.js</a> or{" "}
        <a href="/react-player">/react-player</a> for examples
      </div>
    ),
  },
  {
    path: "/react-player",
    element: <ReactPlayerDemo />,
  },
  {
    path: "/video.js",
    element: <VideoJsDemo />,
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
