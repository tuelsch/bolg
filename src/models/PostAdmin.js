import Post from '@/models/Post';
import { database } from '@/config/firebase';
import moment from '@/config/moment';
import { marked, excerpt, description } from '@/config/markdown';

const ref = id => database.ref(`/posts/${id}`);
const publishRef = id => database.ref(`/published/${id}`);

Post.prototype.set = function set() {
  this.lastSaved = Date.now();
  return ref(this.id).set(this.normalize());
}

Post.prototype.remove = function remove() {
  return Promise.all([
    publishRef(this.id).remove(),
    ref(this.id).remove(),
  ]);
}

Post.prototype.publish = function publish() {
  this.lastSaved = Date.now();
  this.lastPublished = Date.now();
  const postToPublish = new Post(this);
  postToPublish.beautify();

  return Promise.all([
    ref(this.id).set(this.normalize()),
    publishRef(this.id).set(postToPublish.normalize()),
  ]);
}

Post.prototype.unpublish = function unpublish() {
  this.lastPublished = null;
  return Promise.all([
    this.set(),
    publishRef(this.id).remove(),
  ]);
}

Post.prototype.beautify = function beautify() {
  const images = {};
  this.images.map((image) => {
    images[image.id] = image.thumbnails;
  });
  this.postUrl = this.url;
  this.postLiveUrl = this.liveUrl;
  this.postTitle = this.title;
  this.created = moment(this.created, 'x').format('DD.MM.YYYY');
  this.lastEdited = moment(this.lastEdited, 'x').format('DD.MM.YYYY');
  this.lastSaved = moment(this.lastSaved, 'x').format('DD.MM.YYYY');
  this.lastPublished = moment(this.lastPublished, 'x').format('DD.MM.YYYY');
  this.html = marked(this.markdown, { images });
  this.description = description(this.markdown);
  this.excerpt = excerpt(this.markdown);
  return this;
}

export default Post;
