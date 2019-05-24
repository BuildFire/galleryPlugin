import React, { Component } from 'react';
import { Modal, Image, Input } from '../components/utils';
import ImageList from './ImageList';

class EditFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      galleryImages: props.galleryImages
    };
  }

  toggleImagesModal = () => this.setState(({ showModal }) => ({ showModal: !showModal }));

  handleAddImages = () => {
    const { addImages } = this.props;
    this.setState(state => {
      let { galleryImages } = { ...state };
      const selectImages = galleryImages.filter(image => image.selected);

      addImages(selectImages);

      galleryImages = galleryImages.map(img => {
        img.selected = false;
        return img;
      });

      return { galleryImages };
    });
  };

  selectImage = src => {
    this.setState(state => {
      const { galleryImages } = { ...state };

      const index = galleryImages.findIndex(image => image.src === src);
      galleryImages[index].selected = !galleryImages[index].selected;

      return { galleryImages };
    });
  };

  render() {
    const {
      folder,
      removeImageFromFolder,
      handleFolderReorder,
      goHome,
      handleInputChange
    } = this.props;
    const { showModal, galleryImages } = this.state;
    const { images, name } = folder;

    return (
      <>
        <h1 className="title">Edit Folder</h1>
        <button
          className="btn btn--icon btn--close"
          onClick={goHome}
          type="button"
        >
          <span className="icon icon-cross2" />
        </button>

        <div className="input__group">
          <label htmlFor="name">Folder Name</label>
          <Input name="name" value={name} onChange={handleInputChange} />
        </div>

        <ImageList
          images={images}
          showImageDialog={this.toggleImagesModal}
          removeImage={removeImageFromFolder}
          handleReorder={handleFolderReorder}
        />

        <Modal show={showModal} toggle={this.toggleImagesModal}>
          <div className="carousel-items grid">
            {galleryImages.map(({ src, selected }) => {
              if (!images.find(img => img.src === src)) {
                return <Image key={src} src={src} selected={selected} onClick={this.selectImage} />;
              }
              return null;
            })}
          </div>
          <button onClick={this.handleAddImages} type="button">
            Add
          </button>
        </Modal>
      </>
    );
  }
}

export default EditFolder;
