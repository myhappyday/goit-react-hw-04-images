import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { ImageGalleryList, Text } from './ImageGallery.styled';
import galleryAPI from '../../services/galleryAPI';
import ImageErrorView from '../ImageErrorView';
import imageError from '../../images/error-oops.jpg';
import imageErrorView from '../../images/error.jpg';
import ImageGalleryItem from '../ImageGalleryItem';
import Button from '../Button';
import Loader from '../Loader';
import Modal from '../Modal';

// Refactoring code using React-Hooks
const ImageGallery = ({ imageSearchName }) => {
  const [imageName, setImageName] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ largeImageURL: '', tags: '' });

  useEffect(() => {
    if (imageName !== imageSearchName) {
      setImages([]);
      setPage(1);
      setTotalPage(0);
      setStatus('pending');
    }

    if (imageName !== imageSearchName || page !== 1) {
      const fetchGallery = async () => {
        try {
          const response = await galleryAPI.fetchImages(imageSearchName, page);
          const { total, hits, totalHits } = response;
          if (total === 0) {
            setImages([]);
            setStatus('resolved');
            toast.warn(
              'Sorry, there are no images matching your search query. Please try again.'
            );
            return;
          }
          setImages(prevImages =>
            page === 1 ? hits : [...prevImages, ...hits]
          );
          setTotalPage(Math.ceil(totalHits / 12));
          setStatus('resolved');
        } catch (error) {
          setError(error);
          setStatus('rejected');
          toast.error(
            'Oops! Something went wrong. Please, reload the page and try again.'
          );
        }
      };
      fetchGallery();
    }
  }, [imageName, page, imageSearchName]);

  const handleLoadMoreClick = () => {
    setPage(prevPage => prevPage + 1);
    setImageName(imageSearchName);
  };

  const derivedModalData = modalData => {
    setModalData(modalData);
    setShowModal(true);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  if (status === 'idle') {
    return <Text>Try to find something!</Text>;
  }
  if (status === 'pending') {
    return <Loader />;
  }

  if (status === 'rejected') {
    console.log('error:', error);
    return (
      <ImageErrorView
        imageURL={imageError}
        alt={'Something went wrong'}
        width="600"
        message={
          'Oops! Something went wrong. Please, reload the page and try again.'
        }
      />
    );
  }

  if (status === 'resolved') {
    if (images.length === 0) {
      return (
        <ImageErrorView
          imageURL={imageErrorView}
          alt={'Crying meme'}
          width="340"
          message={`Sorry, we can't find images of ${imageSearchName}.`}
        />
      );
    }
    return (
      <>
        <ImageGalleryList>
          {images.map(({ id, webformatURL, tags, largeImageURL }) => {
            return (
              <ImageGalleryItem
                key={id}
                imageURL={webformatURL}
                tags={tags}
                largeImageURL={largeImageURL}
                onImageClick={() => derivedModalData({ largeImageURL, tags })}
              />
            );
          })}
        </ImageGalleryList>
        {page < totalPage && <Button onClick={handleLoadMoreClick} />}
        {showModal && <Modal modalData={modalData} onClose={toggleModal} />}
      </>
    );
  }
};

ImageGallery.propTypes = {
  imageSearchName: PropTypes.string.isRequired,
};

export default ImageGallery;
