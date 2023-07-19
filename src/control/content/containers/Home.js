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
  if (loaded && showEmptyState) {
    const seeder = new buildfire.components.aiStateSeeder({
      generateOptions: {
        userMessage: 'Provide me with images that relate to [app-interests]',
        systemMessage: 'Generate up to five image urls based on the input, use source.unsplash.com for image URLs. Create equal number of folders associated with the topic as images array.',
        jsonTemplate: {
          images: [],
          folders: [
            {
              name: ""
            }
          ]
        }
      },
      importOptions: {
        jsonTemplate: {
          images: [],
          folders: [
            {
              name: "",
            }
          ]
        },
        sampleCsv: 'https://source.unsplash.com/featured/?sunny, https://source.unsplash.com/featured/?rainy, https://source.unsplash.com/featured/?cloudy\n\rSunny, Rainy, Cloudy',
        systemMessage: `First row are images, second row are folders. Generate up to five items.`,
      }
    })
      .smartShowEmptyState({ selector: "#ai-seeder", }, (err, result) => {
        const imagePromises = result.data.images.map(
          src => new Promise(resolve => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.src = src;
            image.originalSrc = src;
          })
        );

        Promise.all(imagePromises).then(imgs => {
          const images = imgs.map(
            ({ naturalWidth, naturalHeight, originalSrc }) => new Img({
              src: originalSrc,
              width: naturalWidth,
              height: naturalHeight
            })
          );
          const folders = result.data.folders.map((el, index) => {
            el.images = [images[index]];
            return new Folder(el);
          });

          seeder.requestResult.complete();
          saveSampleAiData({ images, folders }, seeder.requestType);
        });
      });
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
