import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Layout from "./Layout";
import WriteBox from "./WriteBox";
import Empty from "./Empty";
import reportWebVitals from "./reportWebVitals";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <GoogleOAuthProvider clientId="635378438266-1a3gr0r3opcqgnq7v6shlrq5qgcubk1a.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<Empty />} />
            <Route path="/notes" element={<Empty />} />
            <Route
              path="/notes/:noteId/edit"
              element={<WriteBox edit={true} />}
            />
            <Route path="/notes/:noteId" element={<WriteBox edit={false} />} />
            {/* any other path */}
            <Route path="*" element={<Empty />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </>
);

reportWebVitals();