export const liveRootUrl = 'https://bolg-app.herokuapp.com/posts/';

export const states = {
  LOADING: 0,
  EDITING: 1,
  SAVED: 2,
  ERROR: 3,
  EDITING_OFFLINE: 4,
  SAVED_OFFLINE: 5,
  PUBLISHED: 6,
};

export const mapsAPIKey = 'AIzaSyBADvjevyMmDkHb_xjjh3FOltkO2Oa8iAQ';

export const sizes = [
  {
    width: 2560,
    height: 1440,
  },
  {
    width: 1920,
    height: 1080,
  },
  {
    width: 1024,
    height: 576,
  },
  {
    width: 640,
    height: 360,
  },
];

export const objectToArray = obj => Object.keys(obj).map(key => obj[key]);

export const slugger = str => str
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/[^\w ]+/g, ' ')
    .trim()
    .replace(/ +/g, '-');
