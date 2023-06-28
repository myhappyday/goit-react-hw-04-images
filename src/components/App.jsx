import { useState } from "react";
import { Container } from "./App.styled";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Searchbar from "./Searchbar/";
import ImageGallery from "./ImageGallery";

// Refactoring code using React-Hooks
const App = () => {
  const [value, setValue] = useState("");

  const handleFormSubmit = (searchValue) => {
    if (searchValue === value) {
      toast.warn(
        "You have already searched for images with this keyword. Please try something else."
      );
      return;
    }
    setValue(searchValue);
  };

  return (
    <Container>
      <Searchbar onSubmit={handleFormSubmit} />
      <ImageGallery imageSearchName={value} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        pauseOnHover
      />
    </Container>
  );
};

export default App;

// class App extends Component {
//   state = {
//     imageName: '',
//   };

//   handleFormSubmit = imageName => {
//     if (imageName === this.state.imageName) {
//       toast.warn(
//         'You have already searched for images with this keyword. Please try something else.'
//       );
//       return;
//     }
//     this.setState({ imageName });
//   };

//   render() {
//     return (
//       <Container>
//         <Searchbar onSubmit={this.handleFormSubmit} />
//         <ImageGallery imageName={this.state.imageName} />
//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           theme="colored"
//           pauseOnHover
//         />
//       </Container>
//     );
//   }
// }
