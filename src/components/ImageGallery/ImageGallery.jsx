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
  // const [showModal, setShowModal] = useState(true);
  const [modalData, setModalData] = useState({ largeImageURL: '', tags: '' });

  console.error(error.message);
  // state = {
  //   images: [],
  //   error: null,
  //   status: 'idle',
  //   page: 1,
  //   totalPage: 0,
  //   showModal: false,
  //   modalData: { largeImageURL: '', tags: '' },
  // };

  useEffect(() => {
    if (imageName !== imageSearchName) {
      setImages([]);
      setPage(1);
      setTotalPage(0);
      setStatus('pending');
    }

    if (imageName !== imageSearchName || page !== 1) {
      // if (!imageSearchName) {
      //   return;
      // }
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
          // console.error(error.message);
        }
      };
      fetchGallery();
    }
  }, [imageName, page, imageSearchName]);

  // async componentDidUpdate(prevProps, prevState) {
  //   const { images, page } = this.state;
  //   const prevName = prevProps.imageName;
  //   const nextName = this.props.imageName;

  //   if (prevName !== nextName) {
  //     this.setState({
  //       images: [],
  //       page: 1,
  //       totalPage: 0,
  //       status: 'pending',
  //     });
  //   }

  //   if (prevName !== nextName || prevState.page !== page) {
  //     try {
  //       const response = await galleryAPI.fetchImages(nextName, page);
  //       const { total, hits, totalHits } = response;
  //       if (total === 0) {
  //         this.setState({ images: [], status: 'resolved' });
  //         toast.warn(
  //           'Sorry, there are no images matching your search query. Please try again.'
  //         );
  //         return;
  //       }
  //       this.setState({
  //         images: page === 1 ? [...hits] : [...images, ...hits],
  //         totalPage: Math.ceil(totalHits / 12),
  //         status: 'resolved',
  //       });
  //     } catch (error) {
  //       this.setState({ error, status: 'rejected' });
  //       toast.error(
  //         'Oops! Something went wrong. Please, reload the page and try again.'
  //       );
  //     }
  //   }
  // }

  const handleLoadMoreClick = () => {
    setPage(prevPage => prevPage + 1);
    setImageName(imageSearchName);
  };

  const derivedModalData = modalData => {
    setModalData(modalData);
    // setShowModal(!showModal);
    // setShowModal(prevShowModal => !prevShowModal);
    setShowModal(true);
  };

  const toggleModal = () => {
    setShowModal(false);
    // setShowModal(!showModal);
    // setShowModal(prevShowModal => !prevShowModal);
  };

  // render() {
  // const { images, status, page, totalPage, showModal, modalData } = this.state;

  if (status === 'idle') {
    return <Text>Try to find something!</Text>;
  }
  if (status === 'pending') {
    return <Loader />;
  }

  if (status === 'rejected') {
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

  // if (status === 'resolved' && images.length === 0) {
  //   return (
  //     <ImageErrorView
  //       imageURL={imageErrorView}
  //       alt={'Crying meme'}
  //       width="340"
  //       message={`Sorry, we can't find images of ${imageSearchName}.`}
  //     />
  //   );
  // }

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
                onImageClick={() =>
                  derivedModalData({ largeImageURL: largeImageURL, tags: tags })
                }
              />
            );
          })}
        </ImageGalleryList>
        {page < totalPage && <Button onClick={handleLoadMoreClick} />}
        {showModal && <Modal modalData={modalData} onClose={toggleModal} />}
      </>
    );
  }
  // }
};

ImageGallery.propTypes = {
  imageSearchName: PropTypes.string.isRequired,
};

export default ImageGallery;

// class ImageGallery extends Component {
//   state = {
//     images: [],
//     error: null,
//     status: 'idle',
//     page: 1,
//     totalPage: 0,
//     showModal: false,
//     modalData: { largeImageURL: '', tags: '' },
//   };

//   async componentDidUpdate(prevProps, prevState) {
//     const { images, page } = this.state;
//     const prevName = prevProps.imageName;
//     const nextName = this.props.imageName;

//     if (prevName !== nextName) {
//       this.setState({
//         images: [],
//         page: 1,
//         totalPage: 0,
//         status: 'pending',
//       });
//     }

//     if (prevName !== nextName || prevState.page !== page) {
//       try {
//         const response = await galleryAPI.fetchImages(nextName, page);
//         const { total, hits, totalHits } = response;
//         if (total === 0) {
//           this.setState({ images: [], status: 'resolved' });
//           toast.warn(
//             'Sorry, there are no images matching your search query. Please try again.'
//           );
//           return;
//         }
//         this.setState({
//           images: page === 1 ? [...hits] : [...images, ...hits],
//           totalPage: Math.ceil(totalHits / 12),
//           status: 'resolved',
//         });
//       } catch (error) {
//         this.setState({ error, status: 'rejected' });
//         toast.error(
//           'Oops! Something went wrong. Please, reload the page and try again.'
//         );
//       }
//     }
//   }

//   handleLoadMoreClick = () => {
//     this.setState(prevState => ({ page: prevState.page + 1 }));
//   };

//   setModalData = modalData => {
//     this.setState({ modalData, showModal: true });
//   };

//   toggleModal = () => {
//     this.setState(({ showModal }) => ({
//       showModal: !showModal,
//     }));
//   };

//   render() {
//     const { images, status, page, totalPage, showModal, modalData } =
//       this.state;

//     if (status === 'idle') {
//       return <Text>Try to find something!</Text>;
//     }
//     if (status === 'pending') {
//       return <Loader />;
//     }

//     if (status === 'rejected') {
//       return (
//         <ImageErrorView
//           imageURL={imageError}
//           alt={'Something went wrong'}
//           width="600"
//           message={
//             'Oops! Something went wrong. Please, reload the page and try again.'
//           }
//         />
//       );
//     }

//     if (status === 'resolved') {
//       if (images.length === 0) {
//         return (
//           <ImageErrorView
//             imageURL={imageErrorView}
//             alt={'Crying meme'}
//             width="340"
//             message={`Sorry, we can't find images of ${this.props.imageName}.`}
//           />
//         );
//       }
//       return (
//         <>
//           <ImageGalleryList>
//             {images.map(({ id, webformatURL, tags, largeImageURL }) => {
//               return (
//                 <ImageGalleryItem
//                   key={id}
//                   imageURL={webformatURL}
//                   tags={tags}
//                   largeImageURL={largeImageURL}
//                   onImageClick={this.setModalData}
//                 />
//               );
//             })}
//           </ImageGalleryList>
//           {page < totalPage && <Button onClick={this.handleLoadMoreClick} />}
//           {showModal && (
//             <Modal modalData={modalData} onClose={this.toggleModal} />
//           )}
//         </>
//       );
//     }
//   }
// }
