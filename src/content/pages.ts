// Everything on a page that can be edited from the admin "Pages" tab.
// The default is what the site shows until someone edits it, so nothing changes on deploy.

// text: one line · lines: a few lines, each shown on its own line · rich: formatted paragraphs
// image: a photo · position: which part of a photo shows when it's cropped
export type FieldType = 'text' | 'lines' | 'rich' | 'image' | 'position';

export interface PageField {
  key: string;
  label: string;
  type: FieldType;
  default: string;
  hint?: string;
  // For position fields: the shape of the crop, e.g. '16 / 6'
  aspect?: string;
}

export interface FieldGroup {
  title: string;
  fields: PageField[];
}

export interface PageDef {
  id: string;
  name: string;
  path: string;
  groups: FieldGroup[];
}

function hero(title: string, image: string, position: string): FieldGroup {
  return {
    title: 'Banner at the top',
    fields: [
      { key: 'hero.title', label: 'Page title', type: 'text', default: title },
      { key: 'hero.image', label: 'Banner photo', type: 'image', default: image, hint: 'A wide photo works best. It is darkened slightly so the title stays readable.' },
      { key: 'hero.position', label: 'Which part of the photo to show', type: 'position', default: position, aspect: '16 / 6' },
    ],
  };
}

const cookbooks: PageDef = {
  id: 'cookbooks',
  name: 'Cookbooks',
  path: '/cookbooks',
  groups: [
    hero('Cookbooks', '/images/cookbooks-bg.jpeg', 'center 30%'),
    {
      title: 'Introduction',
      fields: [
        {
          key: 'intro',
          label: 'Opening paragraph',
          type: 'rich',
          default:
            '<p>Following the Civil War, community cookbooks—along with bake sales and craft sales—became an important means by which women in the United States raised funds to support charitable endeavors. The Mississippi Community Cookbook Project, the nucleus of a book manuscript, seeks to document Mississippi community cookbooks published before 1970, and the influence of these cookbooks on life in Mississippi.</p>',
        },
      ],
    },
    {
      title: 'First section (photo on the left)',
      fields: [
        { key: 'left.image', label: 'Photo', type: 'image', default: '/images/cookbook-rials-kitchen.jpg' },
        { key: 'left.caption', label: 'Caption under the photo', type: 'text', default: 'Rials Creek Methodist Church (Magee, Miss.) 1951' },
        { key: 'left.alt', label: 'Photo description for screen readers', type: 'text', default: "Rials' Kitchen Secrets cookbook cover" },
        {
          key: 'left.text',
          label: 'Text beside the photo',
          type: 'rich',
          default:
            "<p>Collectively, these cookbooks are the basis for <em>Kissin' Don't Last, Cookery Do</em>, the tentative title of a book I am preparing that looks at the history of community cookbooks as a means of understanding the role of community cookbooks in American life.</p>" +
            "<p>Using Mississippi as a case study, it explores how women shaped local life through their cookbooks and the charitable works the cookbooks funded, yet it also examines how national trends in cooking influenced women's understanding of food.</p>",
        },
      ],
    },
    {
      title: 'Second section (photo on the right)',
      fields: [
        { key: 'right.image', label: 'Photo', type: 'image', default: '/images/cookbook-whats-cooking-y.jpeg' },
        { key: 'right.caption', label: 'Caption under the photo', type: 'text', default: "Young Women's Christian Association (Laurel, Miss.) 1968" },
        { key: 'right.alt', label: 'Photo description for screen readers', type: 'text', default: "What's Cooking at the Y cookbook cover" },
        {
          key: 'right.text',
          label: 'Text beside the photo',
          type: 'rich',
          default:
            "<p>This website will be updated nearer to the book's publication with some of the more compelling statistical findings, but for now it serves as a taxonomy, providing insights into when, where, and who published cookbooks in Mississippi.</p>" +
            "<p>The largest collection of Mississippi cookbooks resides in the archives of The University of Southern Mississippi. In partnership with Jennifer Brannock, Curator of Mississippiana and Rare Books at Southern Miss, I have worked with University Libraries to amass over two hundred cookbooks published before 1970. Additional Mississippi cookbooks are held at university and public libraries throughout the United States as well as at Mississippi's Department of History and Archives. Not all cookbooks have survived. There may be dozens, perhaps even hundreds, of cookbooks that have been lost.</p>",
        },
      ],
    },
  ],
};

const HOME_TILES = [
  { id: 'cookbooks', title: 'Cookbooks', subtitle: 'Community Cookbook Inventory', image: '/images/cookbooks-bg.jpeg', position: 'center 30%' },
  { id: 'culinary-landscapes', title: 'Culinary Landscapes', subtitle: 'Charts and Maps', image: '/images/landscapes-bg.jpeg', position: 'center 5%' },
  { id: 'experimental-kitchen', title: 'Experimental Kitchen', subtitle: 'AI Insights', image: '/images/kitchen-bg.jpeg', position: 'center 25%' },
  { id: 'cookery', title: 'Cookery', subtitle: 'The Book Project', image: '/images/cookery-bg.jpeg', position: 'center 35%' },
  { id: 'proof-pudding', title: 'Proof of the Pudding', subtitle: 'Notes on Sources', image: '/images/proof-bg.jpeg', position: 'center 10%' },
  { id: 'culinary-tales', title: 'Culinary Tales', subtitle: 'The Blog', image: '/images/tales-bg.jpeg', position: 'center 10%' },
  { id: 'tasted-tested', title: 'Tasted and Tested', subtitle: 'About this Site', image: '/images/tested-bg.jpeg', position: 'center 20%' },
];

// Each tile links to its page; the link itself isn't editable
export const HOME_TILE_LINKS = HOME_TILES.map((t) => ({ id: t.id, href: `/${t.id}` }));

const home: PageDef = {
  id: 'home',
  name: 'Home',
  path: '/',
  groups: [
    {
      title: 'Top of the page',
      fields: [
        { key: 'hero.title', label: 'Big title', type: 'lines', default: 'The Mississippi Community\nCookbook Project', hint: 'Press Enter to start a new line.' },
        {
          key: 'hero.subtitle',
          label: 'Text under the title',
          type: 'lines',
          default: 'The Mississippi Community Cookbook Project catalogs and explores cookbooks published by charitable, civic, and church organizations in Mississippi before 1970 (and occasionally beyond).',
        },
      ],
    },
    ...HOME_TILES.map((t, i): FieldGroup => ({
      title: `Tile ${i + 1}: links to ${t.title}`,
      fields: [
        { key: `tile.${t.id}.title`, label: 'Tile title', type: 'text', default: t.title },
        { key: `tile.${t.id}.subtitle`, label: 'Small text under the title', type: 'text', default: t.subtitle },
        { key: `tile.${t.id}.image`, label: 'Tile photo', type: 'image', default: t.image },
        { key: `tile.${t.id}.position`, label: 'Which part of the photo to show', type: 'position', default: t.position, aspect: '3 / 2' },
      ],
    })),
    {
      title: 'Welcome message',
      fields: [
        {
          key: 'welcome',
          label: 'Welcome paragraph',
          type: 'rich',
          hint: 'Use the 🔗 button to link words to other pages, e.g. /cookbooks',
          default:
            '<p>Welcome to the Mississippi Community Cookbook Project. For information about Mississippi community cookbooks published before 1970, visit the <a href="/cookbooks">Cookbooks</a> and <a href="/culinary-landscapes">Culinary Landscapes</a> pages. For essays that mine cookbook data for curious insights, visit the <a href="/experimental-kitchen">Experimental Kitchen</a>. For additional essays on all things food and cookbook related, visit the blog at <a href="/culinary-tales">Culinary Tales</a>.</p>',
        },
      ],
    },
  ],
};

export const PAGES: PageDef[] = [home, cookbooks];

export function getPageDef(id: string) {
  return PAGES.find((p) => p.id === id);
}

export function pageDefaults(page: PageDef): Record<string, string> {
  return Object.fromEntries(page.groups.flatMap((g) => g.fields.map((f) => [f.key, f.default])));
}
