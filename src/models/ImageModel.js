import mongoose from 'mongoose';
import shortid from 'shortid';
import request from 'request-promise-native';
import { getThumbUrl, getSrcset, constructThumborUrl } from 'src/config/constants';

const { Schema } = mongoose;

export const ImageSchema = new Schema({
  name: {
    type: String,
    default: '',
  },
  url: {
    type: String,
    required: true,
  },
  shortid: {
    type: String,
    default: shortid.generate,
  },
  ratio: {
    type: Number,
    required: true,
  },
});

ImageSchema.virtual('srcset').get(function srcset() {
  return getSrcset(this.url);
});

ImageSchema.virtual('blurryThumb').get(function blurryThumb() {
  return constructThumborUrl(this.url, {
    width: 20,
    filters: {
      blur: 2,
    },
  });
});

ImageSchema.methods.getThumbnail = function getThumbnail(size) {
  if (this.url.indexOf('adie.bisnaer.ch/') < 0) return this.url;
  return getThumbUrl(this.url, size);
}

ImageSchema.methods.getThumborUrl = function getThumborUrl(options) {
  if (this.url.indexOf('adie.bisnaer.ch/') < 0) return this.url;
  return constructThumborUrl(this.url, options);
}

ImageSchema.methods.getBuffer = function getBuffer() {
  return request({
    url: this.blurryThumb,
    encoding: null,
  })
    /* eslint no-console: 0 */
    .catch(console.error);
}

export default mongoose.model('Image', ImageSchema);
