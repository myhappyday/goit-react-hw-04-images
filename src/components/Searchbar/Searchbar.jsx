import { useState } from 'react';
import PropTypes from 'prop-types';
import { ImSearch } from 'react-icons/im';
import { toast } from 'react-toastify';
import { Header, Form, Input, Button } from './Searchbar.styled';

// Refactoring code using React-Hooks
const Searchbar = ({ onSubmit }) => {
  const [value, setValue] = useState('');

  const handleChange = event => {
    setValue(event.currentTarget.value.toLowerCase());
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
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
