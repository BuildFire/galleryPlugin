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
  saveAIData
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
    const elimanateNotFoundImages = (url) => {
      const optimisedURL = url.replace('1080x720', '100x100'); 
      return new Promise((resolve) => {
        if (url.includes("http")){
          const xhr = new XMLHttpRequest();
          xhr.open("GET", optimisedURL);
          xhr.onerror = (error) => {
            console.warn('provided URL is not a valid image', error);
            resolve({isValid: false, newURL: null});
          }
          xhr.onload = () => {
            if (xhr.responseURL.includes('source-404')) {
              return resolve({isValid: false ,newURL: null});
            } else {
              return resolve({isValid: true, newURL: xhr.responseURL.replace('h=100', 'h=720').replace('w=100', 'w=1080') });
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
              return new Promise((resolve, reject) => {
                elimanateNotFoundImages(item.url).then(result => {
                  if (result.isValid) {
                      resolve(result.newURL + `?v=${generateRandomNumber()}` );
                  } else {
                    reject('image URL is not valid');
                  }
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

          Promise.allSettled(promises).then(newURLs => {
            let processedImages = newURLs.map(
              (result) => {
                  if (result.status == 'fulfilled') {
                  return  new Img({
                      src: result.value,
                      width: 1080,
                      height: 720,
                    })
                  }
                }).filter(e => e);
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
  
              saveAIData(data, true);
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
        systemMessage: 'Each row contains a folder name and image URL that should belong to. if nothing provided or no URLs provided then return null',
        maxRecords: 5,
        callback: (err, result) => {
          if (
            err ||
            !result ||
            typeof result !== "object" ||
            !Object.keys(result).length || !result.data || !result.data.folders || !result.data.folders.length
          ) {
            return buildfire.dialog.toast({
              message: "Bad AI request, please try changing your request.",
              type: "danger",
            });
          }
          const promises = result.data.folders.reduce(
            (accumulator, currentValue) => {
              currentValue.images.forEach(i => {
                accumulator.push(new Promise((resolve, reject) => {
                  elimanateNotFoundImages(i.url).then((res) => {
                    if (res.isValid) {
                      const image = new Image();
                      image.onload = () => resolve(image);
                      image.src = res.newURL;
                      image.setAttribute('data-folder', currentValue.name);
                      image.originalSrc = res.newURL;
                    } else {
                      reject('image URL is not valid');
                    }
                  })
                }));
              });
              return accumulator;
            },
            [],
          );

          Promise.allSettled(promises).then(items => {
            const processedFolders = [];
            const processedImages = [];
            if (!items.length){
              seeder.requestResult.complete();
              return buildfire.dialog.toast({
                message: "Bad AI request, please try changing your request.",
                type: "danger",
              });
            }
            items.forEach(item => {
              if (item.status == 'fulfilled') {
                const image = new Img({
                  src: item.value.originalSrc,
                  width: item.value.naturalWidth,
                  height: item.value.naturalHeight
                });
                processedImages.push(image);
                const folder = processedFolders.find(f => f.name === item.value.getAttribute('data-folder'));
                
                if (!folder) {
                  processedFolders.push(new Folder({ name: item.value.getAttribute('data-folder'), images: [image] }));
                } else {
                  folder.images.push(image);
                }
              }
            });

            if (!processedFolders.length || !processedImages.length) {
              seeder.requestResult.complete();
              return buildfire.dialog.toast({
                message: "Bad AI request, please try changing your request.",
                type: "danger",
              });
            }

            const data = { images: processedImages, folders: processedFolders }

            if (seeder.requestResult.resetData) {
              saveAIData(data, true);
            } else {
              saveAIData(data, false);
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
