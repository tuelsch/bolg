import axios from 'axios';
import debounce from 'debounce';

const emptyPost = () => ({
  markdown: '# No kei Titu',
});

export default {
  state: {
    post: emptyPost(),
  },
  mutations: {
    POST_SET_TITLE_IMAGE: (state, action) => { state.post.titleImage = action.image },
    POST_EDIT: (state, post) => {
      state.post = { ...state.post, ...post };
    },
    POST_SET_DATE: (state, date) => { state.post.postDate = date; },
    POST_ADD_IMAGE: (state, image) => { state.post.images.push(image); },
    POST_REMOVE_IMAGE: (state, imageId) => {
      state.post.images = state.post.images.filter(image => image._id !== imageId);
    },
    POST_DESTROY: (state) => { state.post = null; },
  },
  actions: {
    POST_GET: async ({ commit }, id) => {
      const res = await axios.get(`/api/post/${id}`)
      commit('POST_EDIT', res.data);
      return res;
    },
    POST_WRITE: ({ commit, dispatch }, markdown) => {
      commit('POST_EDIT', { markdown, lastEdited: Date.now() });
      dispatch('POST_DEBOUNCED_SAVE');
    },
    POST_DEBOUNCED_SAVE: debounce(({ dispatch }) => dispatch('POST_PUT'), 2000),
    POST_PUT: async ({ commit, state }) => {
      const res = await axios.put(`/api/post/${state.post._id}`, {
        ...state.post,
        lastSaved: Date.now(),
      });
      // Only update the last saved date, other properties might have been
      // changed during the save
      commit('POST_EDIT', { lastSaved: res.data.lastSaved });
      return res;
    },
    POST_POST: async ({ commit, state }) => {
      const res = await axios.post('/api/post', state.post);
      commit('POST_EDIT', res.data);
      return res;
    },
    POST_PUBLISH: async ({ commit, state }) => {
      const res = await axios.get(`/api/publish/${state.post._id}`);
      commit('POST_EDIT', {
        lastPublished: res.data.lastPublished,
        publishedMarkdown: res.data.publishedMarkdown,
      });
      return res;
    },
    POST_UNPUBLISH: async ({ commit, state }) => {
      const res = await axios.get(`/api/unpublish/${state.post._id}`);
      commit('POST_EDIT', {
        lastPublished: res.data.lastPublished,
        publishedMarkdown: res.data.publishedMarkdown,
      });
      return res;
    },
    POST_SENDNOTIFICATION: async ({ commit, state }) => {
      const res = await axios.get(`/api/notify/${state.post._id}`);
      commit('POST_EDIT', { notificationSent: res.data.notificationSent });
      return res;
    },
  },
}