import fs from 'fs';
import handlebars from 'handlebars';
import layouts from 'handlebars-layouts';

const layout = fs.readFileSync('src/server/templates/_layout.hbs', 'utf-8');
const indexTemplate = fs.readFileSync('src/server/templates/index.hbs', 'utf-8');
const postTemplate = fs.readFileSync('src/server/templates/post.hbs', 'utf-8');

handlebars.registerHelper(layouts(handlebars));
handlebars.registerPartial('layout', layout);

export const index = handlebars.compile(indexTemplate);
export const post = handlebars.compile(postTemplate);