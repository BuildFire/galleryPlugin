import React from 'react';
import { ImageList, FolderList } from '.';
import { Folder, Img } from '../scripts';

const Home = ({
  images,
  removeImage,
  folders,
  loaded,
  showEmptyState,
  showImageDialog,
  addFolder,
  removeFolder,
  openFolder,
  handleReorder,
  saveSampleAiData
}) => {
  // init state seeder
  if (loaded && showEmptyState) {
    const generateRandomNumber = () => {
      const min = 1000000000000; // Smallest 13-digit number
      const max = 9999999999999; // Largest 13-digit number
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const seeder = new buildfire.components.aiStateSeeder({
      generateOptions: {
        userMessage: 'Provide me with images that relate to [app-interests]',
        systemMessage: 'Use source.unsplash.com for image URLs. Do not remove white spaces in the subject string.',
        jsonTemplate: {
          images: [],
          topic: '',
        },
        callback: (err, result) => {
          const promises = result.data.images.map(
            item => new Promise(resolve => {
              const image = new Image();
              image.onload = () => resolve(image);
              // adding cache buster to fix image duplication
              image.src = `${item.url}?v=${generateRandomNumber()}`;
              image.originalSrc = item.url;
            })
          );

          Promise.all(promises).then(items => {
            const processedImages = items.map(
              ({ naturalWidth, naturalHeight, originalSrc }) => new Img({
                src: originalSrc,
                width: naturalWidth,
                height: naturalHeight
              })
            );

            const processedFolders = [
              new Folder({ name: result.data.topic, images: processedImages })
            ];
            const data = {
              images: processedImages,
              folders: processedFolders,
            };

            saveSampleAiData(data, 'generate');
            seeder.requestResult.complete();
          });
        },
      },
      importOptions: {
        jsonTemplate: {
          folders: [{ name: '', images: [{ url: '' }] }]
        },
        sampleCSV: 'Weather: https://source.unsplash.com/featured/?sunny\n'
          + 'Weather:https://source.unsplash.com/featured/?rainy\n'
          + 'City:https://source.unsplash.com/featured/?street',
        systemMessage: 'Each row contains a folder and image URL that should belong to.',
        callback: (err, result) => {
          const promises = result.data.folders.reduce(
            (accumulator, currentValue) => {
              currentValue.images.forEach(i => {
                accumulator.push(new Promise(resolve => {
                  const image = new Image();
                  image.onload = () => resolve(image);
                  image.src = i.url;
                  image.setAttribute('data-folder', currentValue.name);
                  image.originalSrc = i.url;
                }));
              });
              return accumulator;
            },
            [],
          );

          Promise.all(promises).then(items => {

            const processedFolders = [];
            const processedImages = [];

            items.forEach(item => {
              const image = new Img({
                src: item.originalSrc,
                width: item.naturalWidth,
                height: item.naturalHeight
              });
              processedImages.push(image);
              const folder = processedFolders.find(f => f.name === item.getAttribute('data-folder'));

              if (!folder) {
                processedFolders.push(new Folder({ name: item.getAttribute('data-folder'), images: [image] }));
              } else {
                folder.images.push(image);
              }
            });

            const data = { images: processedImages, folders: processedFolders }

            if (seeder.requestResult.resetData) {
              saveSampleAiData(data, 'generate');
            } else {
              saveSampleAiData(data, 'import');
            }
            seeder.requestResult.complete();
          });
        }
      }
    })
      .smartShowEmptyState();
  }
  return (
    <>
      {loaded ?
      <>
      {showEmptyState ? <div id='ai-seeder'></div> : <></>}
          <ImageList
            type="gallery"
            fid="gallery-image-list"
            images={images}
            removeImage={removeImage}
            showImageDialog={showImageDialog}
            handleReorder={handleReorder}
          />
          <FolderList
            folders={folders}
            addFolder={addFolder}
            removeFolder={removeFolder}
            openFolder={openFolder}
            handleReorder={handleReorder}
          />
        </>
      : <></>}

    </>
  )
}

export default Home;
