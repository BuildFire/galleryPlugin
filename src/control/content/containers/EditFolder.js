import React, { Component } from 'react';
import { Input, Modal } from '../components';
import { ImageList, ImagePicker } from '.';

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
    const { addImagesToFolder } = this.props;
    this.setState(state => {
      let { galleryImages } = { ...state };
      const selectImages = galleryImages.filter(image => image.selected);

      addImagesToFolder(selectImages);

      galleryImages = galleryImages.map(img => {
        img.selected = false;
        return img;
      });

      return { galleryImages };
    });
  };

  selectImage = id => {
    this.setState(state => {
      const { galleryImages } = { ...state };
      const index = galleryImages.findIndex(image => image.id === id);
      galleryImages[index].selected = !galleryImages[index].selected;

      return { galleryImages };
    });
  };

  render() {
    const { folder, removeImage, handleReorder, goHome, handleInputChange } = this.props;
    const { showModal, galleryImages } = this.state;
    const { images, name } = folder;

    return (
      <>
        <h1 className="title">Edit Folder</h1>
        <button className="btn btn--icon btn--close" onClick={goHome} type="button">
          <span className="icon icon-cross2" />
        </button>

        <div className="input__group">
          <label htmlFor="name">Folder Name</label>
          <Input name="name" value={name} onChange={handleInputChange} />
        </div>

        <ImageList
          type="folder"
          fid="folder"
          images={images}
          showImageDialog={this.toggleImagesModal}
          removeImage={removeImage}
          handleReorder={handleReorder}
        />

        {!images || !images.length ? (
          <p className="info__note margin-top-twenty">
            Note: Folders require at least one image, otherwise the folder will not be displayed to
            users.
          </p>
        ) : null}

        <Modal show={showModal} toggle={this.toggleImagesModal}>
          <ImagePicker
            images={images}
            galleryImages={galleryImages}
            selectImage={this.selectImage}
            showModal={showModal}
            toggleImagesModal={this.toggleImagesModal}
            handleAddImages={this.handleAddImages}
          />
        </Modal>
      </>
    );
  }
}

export default EditFolder;
