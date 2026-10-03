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

export const PAGES: PageDef[] = [cookbooks];

export function getPageDef(id: string) {
  return PAGES.find((p) => p.id === id);
}

export function pageDefaults(page: PageDef): Record<string, string> {
  return Object.fromEntries(page.groups.flatMap((g) => g.fields.map((f) => [f.key, f.default])));
}
