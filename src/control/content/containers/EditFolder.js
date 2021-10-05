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
    const { folder, removeImage, handleReorder, goHome, handleInputChange, saveWithDelay, cancelSave } = this.props;
    const { showModal, galleryImages } = this.state;
    const { images, name } = folder;

    const save = () =>  {
      if (folder.name.length === 0) {
      } else {
        saveWithDelay();
        goHome();
      }
    }

    const cancel = () => {
      cancelSave();
      goHome();
    }

    return (
      <>
        <h1 className="title">Edit Folder</h1>

        <div className="input__group input-control side-label">
          <label htmlFor="name">Folder Name <span className="required">*</span></label>
          <Input name="name" className="flex-auto" value={name} onChange={handleInputChange} />
        </div>

        {!images || !images.length ? (
          <p className="info__note margin-top-twenty">
            Folders require at least one image, otherwise the folder will not be displayed to
            users.
          </p>
        ) : null}

        <ImageList
          type="folder"
          fid="folder"
          images={images}
          showImageDialog={this.toggleImagesModal}
          removeImage={removeImage}
          handleReorder={handleReorder}
        />

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
        <br /><br />
        <div className="bottom-actions">
            <a className="btn btn-default btn-outlined margin-right-ten" onClick={cancel} style={{border: "1px solid #ddd"}}>Cancel</a>
            <a className="btn btn-success margin-right-ten" onClick={save}>Save</a>
        </div>
      </>
    );
  }
}

export default EditFolder;
