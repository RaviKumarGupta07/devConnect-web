import Body from "./components/Body";
import { BrowserRouter, Routes, Route } from "react-router"
import Login from "./components/Login";
import Feed from "./components/Feed";
import { Provider } from "react-redux";
import appStore from "./redux/appStore"

function App() {

  return (
    <>
      <Provider store={appStore} >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Body />} >
              <Route path="login" element={<Login />} />
              <Route path="feed" element={<Feed />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
