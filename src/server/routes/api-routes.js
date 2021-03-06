import { Router } from 'express';
import passport from 'passport';
import multer from 'multer';
import { validate } from 'express-jsonschema';
import * as Subscribers from 'src/server/api/subscriber-api';
import * as Users from 'src/server/api/user-api';
import * as Tipps from 'src/server/api/tipp-api';
import * as Posts from 'src/server/api/post-api';
import * as Journeys from 'src/server/api/journey-api';
import * as Builds from 'src/server/api/build-api';
import * as Publisher from 'src/server/api/publish-api';
import * as Country from 'src/server/api/country-api';
import notify from 'src/server/api/notify-api';
import * as Images from 'src/server/api/image-api';
import * as Drawings from 'src/server/api/drawing-api';
import getGallery from 'src/server/api/gallery-api';
import fixRatio from 'src/server/migration/fix-ratio';
import PagingSchema from 'src/schemas/PagingSchema';

const router = Router();
const uploader = multer();
const authenticate = passport.authenticate('jwt', { session: false });

router.get('/migration/fix-ratio', fixRatio);

router.get('/gallery', validate({ query: PagingSchema }), getGallery);

router.post('/image', authenticate, uploader.single('image'), Images.post);
router.delete('/image/:id', authenticate, Images.remove);

router.get('/subscribers', authenticate, Subscribers.list);
router.get('/subscriber/:id', authenticate, Subscribers.get);
router.post('/subscriber', Subscribers.post);
router.put('/subscriber/:id', authenticate, Subscribers.put);
router.delete('/subscriber/:id', authenticate, Subscribers.remove);
router.get('/unsubscribe/:id', Subscribers.remove);

router.get('/notify/:id', authenticate, notify);

router.get('/users', authenticate, Users.list);
router.get('/user', authenticate, Users.getUser);
router.post('/user', Users.registerUser);
router.post('/user/authenticate', Users.authenticateUser);
router.delete('/user/:id', authenticate, Users.remove);

router.get('/tipps', Tipps.listTipps);
router.get('/tipp/:id', Tipps.getTipp);
router.post('/tipp', Tipps.postTipp);
router.put('/tipp/:id', authenticate, Tipps.putTipp);
router.delete('/tipp/:id', authenticate, Tipps.deleteTipp);

router.get('/posts/meta', Posts.getPostsMetaInfos);
router.get('/posts', Posts.getPosts);
router.get('/post/:id', Posts.getPost);
router.post('/post', authenticate, Posts.postPost);
router.put('/post/:id', authenticate, Posts.putPost);
router.delete('/post/:id', authenticate, Posts.deletePost);
router.get('/post/:id/drawings', Posts.getPostDrawings);

router.post('/drawing', uploader.single('drawing'), Drawings.post);
router.delete('/post/:postid/drawing/:drawingshortid', authenticate, Drawings.remove);

router.get('/build/*', authenticate);
router.get('/unbuild/*', authenticate);
router.get('/build/post/:id', Builds.buildPost);
router.get('/build/posts', Builds.buildPosts);
router.get('/build/index', Builds.buildIndex);
router.get('/build/gallery', Builds.buildGallery);
router.get('/unbuild/post/:id', Builds.unbuildPost);
router.get('/build/rebuild', Builds.rebuild);

router.get('/publish/:id', authenticate, Publisher.publish);
router.get('/unpublish/:id', authenticate, Publisher.unpublish);

router.get('/journeys', Journeys.list);
router.get('/journey/:id', Journeys.get);
router.post('/journey', authenticate, Journeys.post);
router.put('/journey/:id', authenticate, Journeys.put);
router.delete('/journey/:id', authenticate, Journeys.remove);

router.get('/countries', Country.list);
router.get('/country/:id', Country.get);
router.post('/country', authenticate, Country.post);
router.put('/country/:id', authenticate, Country.put);
router.delete('/country/:id', authenticate, Country.remove);

export default router;
