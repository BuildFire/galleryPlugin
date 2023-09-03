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
  let imageList = [];
  // init state seeder
  if (loaded && showEmptyState) {
    const generateRandomNumber = () => {
      const min = 1000000000000; // Smallest 13-digit number
      const max = 9999999999999; // Largest 13-digit number
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /** UTILS */
    const checkImageUrl = (url) => {
      const optimisedURL = url.replace('1080x720', '300x300'); 
      return new Promise((resolve, reject) => {
        if (url.includes("http")){
          const xhr = new XMLHttpRequest();
          xhr.open("GET", optimisedURL);
          xhr.onerror = (error) => {
            console.error('provided URL is not a valid image', error);
            resolve(false)
          }
          xhr.onload = () => {
            if (xhr.responseURL.includes('source-404')) {
              return resolve(false);
            } else {
              return resolve(true);
            }
          };
          xhr.send();
        } else resolve(false);
        });
    };
    /** UTILS END */

    const seeder = new buildfire.components.aiStateSeeder({
      generateOptions: {
        userMessage: 'Provide me with images that relate to [app-interests]',
        systemMessage: 'Use source.unsplash.com for image URLs, image should be 1080x720, use different image for each entry, URL should not have premium_photo or source.unsplash.com/random. Do not remove white spaces in the subject string.',
        hintText: 'Replace values between brackets to match your business requirements.',
        maxRecords: 10,
        jsonTemplate: {
          images: [
            {
              url:'',
              topic: ''
            }
          ],
          topic: '',
        },
        callback: (err, result) => {
          if (
            err ||
            !result ||
            typeof result !== "object" ||
            !Object.keys(result).length || !result.data || !result.data.images || !result.data.images.length
          ) {
            seeder.requestResult.complete();
            return buildfire.dialog.toast({
              message: "Bad AI request, please try changing your request.",
              type: "danger",
            });
          }
          imageList = result.data.images;
          if (!imageList.length) {
            seeder.requestResult.complete();
            return buildfire.dialog.toast({
              message: "Bad AI request, please try changing your request.",
              type: "danger",
            });
          }

            const promises = imageList.map(
              item => 
              {
                return new Promise(resolve => {
                  const image = new Image();
                  checkImageUrl(item.url).then(isValid => {
                    image.onload = () => resolve(image);
                      // adding cache buster to fix image duplication
                      image.src = `${item.url}?v=${generateRandomNumber()}`;
                      image.originalSrc = item.url + (isValid ? '' : '?valid=image-not-valid');    
                  })
                })
              }
            );
            if (!promises.length){
              seeder.requestResult.complete();
              return buildfire.dialog.toast({
                message: "Bad AI request, please try changing your request.",
                type: "danger",
              });
            }

            Promise.all(promises).then(items => {
              let processedImages = items.map(
                ({ naturalWidth, naturalHeight, originalSrc }) => {
                  return  new Img({
                      src: originalSrc,
                      width: naturalWidth,
                      height: naturalHeight,
                      isValid: !originalSrc.includes('image-not-valid')
                    })
                }
              );

              processedImages = processedImages.filter(el => el.isImageValid);
              if (!processedImages.length) {
                seeder.requestResult.complete();
                return buildfire.dialog.toast({
                  message: "Bad AI request, please try changing your request.",
                  type: "danger",
                });
              }

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
        systemMessage: 'Each row contains a folder and image URL that should belong to. if nothing provided or no URLs provided then return null',
        maxRecords: 10,
        callback: (err, result) => {
          if (
            err ||
            !result ||
            typeof result !== "object" ||
            !Object.keys(result).length || !result.data || !result.data.folders || !result.data.folders.length
          ) {
            seeder.requestResult.complete();
            return buildfire.dialog.toast({
              message: "Bad AI request, please try changing your request.",
              type: "danger",
            });
          }
          const promises = result.data.folders.reduce(
            (accumulator, currentValue) => {
              currentValue.images.forEach(i => {
                accumulator.push(new Promise(resolve => {
                  checkImageUrl(i.url).then((isImageValid) => {
                    if (isImageValid) {
                      const image = new Image();
                     image.onload = () => resolve(image);
                     image.src = i.url;
                      image.setAttribute('data-folder', currentValue.name);
                      image.originalSrc = i.url;
                    } else resolve(null);
                  })
                }));
              });
              return accumulator;
            },
            [],
          );

          Promise.all(promises).then(items => {
            let images = items.filter(i => i);
            const processedFolders = [];
            const processedImages = [];
            if (!images.length){
              seeder.requestResult.complete();
              return buildfire.dialog.toast({
                message: "Bad AI request, please try changing your request.",
                type: "danger",
              });
            }
            images.forEach(item => {
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
