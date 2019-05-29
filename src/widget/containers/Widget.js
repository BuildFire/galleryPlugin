import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Context } from '../scripts/context';

import PhotoSwipe from '../assets/photoswipe.min.js';
import photoSwipeUIdefault from '../assets/photoswipe-ui-default.min.js';

import { ViewFolder, Folders, Gallery, NavBar, PswpGallery } from '.';

require('../scripts/hammer.min.js');

const {
  datastore,
  messaging,
  history,
  navigation,
  appearance,
  getContext,
  device,
  spinner,
  bookmarks,
  deeplink
} = window.buildfire;

class Widget extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.hammerRef = React.createRef();
    this.History = createMemoryHistory();
    this.gallery = null;
    this.state = {
      images: [],
      folders: [],
      pathname: '/',
      folder: null,
      view: 'gallery',
      showImageModal: false,
      index: 0,
      pswpOpen: false,
      scale: 1
    };
  }

  viewFolder = folder => {
    this.setState(() => ({ folder }), () => this.navigateTo('/folder'));
  };

  changeView = view => {
    this.setState(() => ({ view }));
  };

  viewImage = src => {
    spinner.show();
    const { images, folder } = { ...this.state };
    const folderImages = folder ? folder.images : null;

    const index = (folderImages || images).findIndex(image => image.src === src);
    const pswpEle = document.getElementsByClassName('pswp')[0];
    const options = {
      index,
      getDoubleTapZoom: (isMouseClick, item) => {
        if (isMouseClick) {
          return 1;
        }
        return item.initialZoomLevel < 0.7 ? 2 : 1.33;
      },
      maxSpreadZoom: 4,
      spacing: 0,
      preload: [1, 1]
    };
    // const h = window.innerHeight;
    // const w = window.innerWidth;
    const galleryItems = (folderImages || images).map(img => ({
      w: img.width,
      h: img.height,
      msrc: `https://czi3m2qn.cloudimg.io/crop/${Math.floor(img.width / 2)}x${Math.floor(
        img.height / 2
      )}/q10.fgaussian4/${img.src}`,
      src: `https://czi3m2qn.cloudimg.io/crop/${img.width * window.devicePixelRatio}x${img.height
        * window.devicePixelRatio}/q150/${img.src}`,
      sourceImg: img.src
    }));
    this.gallery = new PhotoSwipe(pswpEle, photoSwipeUIdefault, galleryItems, options);
    this.gallery.init();

    this.setState(() => ({ pswpOpen: true }));

    this.gallery.listen('close', () => this.setState(() => ({ pswpOpen: false })));
    this.gallery.listen('imageLoadComplete', () => spinner.hide());
  };

  shareImage = () => {
    spinner.show();
    const { sourceImg } = this.gallery.currItem;
    const obj = { image: sourceImg };
    device.share(obj, () => spinner.hide());
  };

  bookmark = () => {
    const { folder } = { ...this.state };
    const isBookmarked = folder.bookmarked;

    const options = {
      id: folder.id,
      title: folder.title,
      payload: { id: folder.id },
      icon: folder.images[0].src
    };
    const onAdd = err => {
      if (err) throw err;
      this.setState(state => {
        state.folder.bookmarked = true;
        return { folder: state.folder };
      });
    };
    const onDelete = err => {
      if (err) throw err;
      this.setState(state => {
        state.folder.bookmarked = false;
        return { folder: state.folder };
      });
    };
    if (isBookmarked) bookmarks.delete(folder.id, onDelete);
    else bookmarks.add(options, onAdd);
  };

  navigateTo = path => {
    this.History.replace(path || '/');
    history.push(path, { elementToShow: path });
  };

  getDld = () => {
    deeplink.getData(data => {
      if (data && data.id) {
        const { folders } = this.state;
        const folder = folders.find(({ id }) => id === data.id);

        this.viewFolder(folder);
      }
    });
  };

  getBookmarked = folders => {
    const cb = (err, results) => {
      if (err) throw err;
      const bookmarkIds = results.map(bookmark => bookmark.id);
      folders = folders.map(folder => {
        folder.bookmarked = bookmarkIds.includes(folder.id);
        return folder;
      });
      this.setState(() => ({ folders }));
    };
    bookmarks.getAll(cb);
  };

  clearFolder = () => this.setState(() => ({ folder: null }));

  componentDidMount = () => {
    // const foo = setInterval(() => {
    //   this.setState(state => {
    //     let { scale } = { ...state };
    //     if (scale < 4) scale += 1;
    //     else clearInterval(foo);
    //     return { scale };
    //   });
    // }, 4000);
    const loadData = (err, result, instanceId) => {
      if (err) throw err;
      const { images, folders } = result.data;
      if (!images && !folders) return;
      this.setState(
        state => {
          let { folder } = { ...state };

          if (folder) {
            folder = folders.find(({ id }) => id === folder.id);
          }
          this.getBookmarked(folders);
          return { images, folders, folder: folder || null };
        },
        () => this.getDld()
      );

      localStorage.setItem(`${instanceId}.gallery_cache`, JSON.stringify(result.data));
    };

    getContext((err, context) => {
      if (err) throw err;
      const { instanceId } = context;

      datastore.get('content.1', (error, result) => {
        loadData(error, result, instanceId);
      });
      datastore.onUpdate(result => {
        loadData(null, result, instanceId);
      }, false);

      const cache = localStorage.getItem(`${instanceId}.gallery_cache`);
      if (cache) {
        loadData(null, { data: JSON.parse(cache) });
      }
    });

    this.History.listen(location => {
      const { pathname } = location;
      this.setState(() => ({ pathname }));
    });

    messaging.onReceivedMessage = message => {
      switch (message.type) {
        case 'home': {
          this.navigateTo('/');
          break;
        }
        case 'folder': {
          this.viewFolder(message.folder);
          break;
        }
        default:
          break;
      }
    };

    const goBack = navigation.onBackButtonClick;
    navigation.onBackButtonClick = () => {
      const { pswpOpen } = this.state;
      if (pswpOpen) {
        this.gallery.close();
      } else if (this.History.location.pathname === '/') {
        goBack();
      } else {
        history.pop();
      }
    };

    history.onPop(b => {
      this.History.replace(b.options.elementToShow || '/');
    }, false);

    const hammer = new Hammer.Manager(this.hammerRef.current, {
      touchAction: 'pan-y'
    });
    
    const pinch = new Hammer.Pinch();
    hammer.add([pinch]);
    let timeout = null;
    const handlePinch = e => {
      if (timeout) return;
      timeout = setTimeout(() => {
        const { additionalEvent } = e;
        this.setState(state => {
          let { scale } = { ...state };
          console.warn(e);

          switch (additionalEvent) {
            case 'pinchout': {
              if (scale < 4) scale += 1;
              break;
            }
            case 'pinchin': {
              if (scale > 0) scale -= 1;
              break;
            }
            default:
              break;
          }
          console.warn(scale);

          return { scale };
        });
        timeout = null;
      }, 100);
    };
    hammer.on('pinch', handlePinch);

    if (window.location.href.indexOf('localhost') > -1) {
      getContext((err, context) => {
        if (err) throw err;
        // remove in prod!
        // eslint-disable-next-line max-len
        appearance.attachAppThemeCSSFiles(
          context.appId,
          context.liveMode,
          context.endPoints.appHost
        );
      });
    }
  };

  // componentDidUpdate = () => console.warn(this.state);

  render() {
    const { images, folders, folder, view, pathname, scale } = this.state;

    return (
      <div ref={this.hammerRef}>
        <NavBar
          view={view}
          pathname={pathname}
          changeView={this.changeView}
          folder={folder}
          bookmark={this.bookmark}
        />
        <Router history={this.History}>
          <Route
            exact
            path="/"
            render={() => {
              if (view === 'gallery') {
                return (
                  <Gallery
                    images={images}
                    view={view}
                    scale={scale}
                    viewImage={this.viewImage}
                    clearFolder={this.clearFolder}
                  />
                );
              }
              return <Folders folders={folders} images={images} viewFolder={this.viewFolder} />;
            }}
          />
          <Route
            exact
            path="/folders"
            render={() => (
              <Folders folders={folders} images={images} viewFolder={this.viewFolder} />
            )}
          />
          <Route
            exact
            path="/folder"
            render={() => <ViewFolder folder={folder} viewImage={this.viewImage} />}
          />
        </Router>
        <PswpGallery shareImage={this.shareImage} />
      </div>
    );
  }
}

export default hot(Widget);
