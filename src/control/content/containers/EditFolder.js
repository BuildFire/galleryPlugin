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
    const { galleryImages } = { ...this.state };
    const selectImages = galleryImages.filter(image => image.selected);

    addImages(selectImages);
  }

  selectImage = src => {
    this.setState(state => {
      const { galleryImages } = { ...state };

      const index = galleryImages.findIndex(image => image.src === src);
      galleryImages[index].selected = !galleryImages[index].selected;

      return { galleryImages };
    });
  }

  componentDidUpdate = () => console.warn('editfolder', this.state);

  render() {
    const { folder, removeImageFromFolder, handleFolderReorder, history, handleInputChange } = this.props;
    const { showModal, galleryImages } = this.state;
    const { images, name } = folder;

    return (
      <>
        <h2>Edit Folder</h2>
        <span onClick={() => history.replace('/')}>X</span>
        <Input name="name" value={name} onChange={handleInputChange} />
        <button type="button" onClick={this.toggleImagesModal}>Add Images</button>

        <ImageList
          images={images}
          removeImage={removeImageFromFolder}
          handleReorder={handleFolderReorder}
        />

        <Modal show={showModal} toggle={this.toggleImagesModal}>
          <div className="carousel-items grid">
            {
              galleryImages.map(({ src, selected }) => {
                if (!images.find(img => img.src === src)) {
                  return (
                    <Image
                      key={src}
                      src={src}
                      selected={selected}
                      onClick={this.selectImage}
                    />
                  );
                }
              })
            }
          </div>
          <button onClick={this.handleAddImages}>Add</button>
        </Modal>
      </>
    );
  }
}

export default EditFolder;
