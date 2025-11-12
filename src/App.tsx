import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.route";
import { QueryProvider } from "./providers/QueryProvider";
import { AxiosProvider } from "./providers/AxiosProvider";

function App() {
  // useEffect(()=>{
  //   showAlert('testing', 'this is a test toast')
  // }, [])
  return (
    <QueryProvider>
      <AxiosProvider>
        {/* <BrowserRouter> */}
          <RouterProvider router={router} />
        {/* </BrowserRouter> */}
      </AxiosProvider>
    </QueryProvider>
  );
}

export default App;
