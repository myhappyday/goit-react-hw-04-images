import { useState } from 'react';
import PropTypes from 'prop-types';
import { ImSearch } from 'react-icons/im';
import { toast } from 'react-toastify';
import { Header, Form, Input, Button } from './Searchbar.styled';

// Refactoring code using React-Hooks
const Searchbar = ({ onSubmit }) => {
  const [value, setValue] = useState('');
  // state = {
  //   imageName: '',
  // };

  const handleChange = event => {
    setValue(event.currentTarget.value.toLowerCase());
    // this.setState({ imageName: event.currentTarget.value.toLowerCase() });
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (value.trim() === '') {
      toast.warn(
        'The search field is empty. Please enter your data for query.'
      );
      return;
    }

    onSubmit(value);
    setValue('');
  };

  // render() {
  return (
    <Header>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="search"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={value}
          onChange={handleChange}
        />
        <Button type="submit">
          <ImSearch size={24} />
        </Button>
      </Form>
    </Header>
  );
  // }
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;

// class Searchbar extends Component {
//   state = {
//     imageName: '',
//   };

//   handleChange = event => {
//     this.setState({ imageName: event.currentTarget.value.toLowerCase() });
//   };

//   handleSubmit = event => {
//     event.preventDefault();

//     if (this.state.imageName.trim() === '') {
//       toast.warn(
//         'The search field is empty. Please enter your data for query.'
//       );
//       return;
//     }
//     // Передача даних з локального state форми у state App
//     this.props.onSubmit(this.state.imageName);
//     this.setState({ imageName: '' });
//   };

//   render() {
//     return (
//       <Header>
//         <Form onSubmit={this.handleSubmit}>
//           <Input
//             type="text"
//             name="search"
//             autoComplete="off"
//             autoFocus
//             placeholder="Search images and photos"
//             value={this.state.imageName}
//             onChange={this.handleChange}
//           />
//           <Button type="submit">
//             <ImSearch size={24} />
//           </Button>
//         </Form>
//       </Header>
//     );
//   }
// }
