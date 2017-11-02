import User from '@/models/User';
import { database } from '@/config/firebase';

const ref = uid => database.ref(`/subscribers/${uid}`);

/**
 * Save a tipp to firebase
 * @returns {Promise} Firebase promise
 */
User.prototype.set = function set() { return ref(this.uid).set(this.normalize()); }

/**
 * Remove the tipp from firebase
 * @returns {Promise} Firebase promise
 */
User.prototype.remove = function remove() { return ref(this.uid).remove(); }

export default User;