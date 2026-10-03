// Everything on a page that can be edited from the admin "Pages" tab.
// The default is what the site shows until someone edits it, so nothing changes on deploy.

// text: one line · lines: a few lines, each shown on its own line · rich: formatted paragraphs
// image: a photo · position: which part of a photo shows when it's cropped · number: a whole number
// chart: a chart edited visually, together with the fields listed in `edits`
export type FieldType = 'text' | 'lines' | 'rich' | 'image' | 'position' | 'number' | 'chart';

export type ChartKind = 'decades' | 'publishers' | 'orgs' | 'topCounties';

export interface PageField {
  key: string;
  label: string;
  type: FieldType;
  default: string;
  hint?: string;
  // For position fields: the shape of the crop, e.g. '16 / 6'
  aspect?: string;
  // For chart fields: which chart, and every field the chart editor changes
  chart?: ChartKind;
  edits?: string[];
  // Edited inside a chart editor instead of on its own
  hidden?: boolean;
}

const AUTO_NUMBERS = JSON.stringify({ mode: 'auto', values: {}, rows: [] });

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

const landscapes: PageDef = {
  id: 'culinary-landscapes',
  name: 'Culinary Landscapes',
  path: '/culinary-landscapes',
  groups: [
    hero('Culinary Landscapes', '/images/landscapes-bg.jpeg', 'center 10%'),
    {
      title: 'Database Overview',
      fields: [
        { key: 'overview.heading', label: 'Heading', type: 'text', default: 'Database Overview' },
        {
          key: 'overview.text',
          label: 'Text',
          type: 'rich',
          default:
            `<p>The following analysis is drawn from a database of approximately 350 Mississippi community cookbooks that were published before 1970. This database includes cookbooks that I have collected (now part of The University of Southern Mississippi's cookbook collection), cookbooks preserved by libraries, and, in a few cases, cookbooks that I know about from newspaper coverage that were published but may no longer exist. Where verifiable information on the descriptive category (such as the organization that published the cookbook) was not available, I've excluded it from my statistical profile so the number of cookbooks used for each of these profiles differs.</p>`,
        },
        {
          key: 'overview.note',
          label: 'Highlighted note',
          type: 'text',
          default: 'The Mississippi Community Cookbook Project is an ongoing project. All the information provided is subject to revision.',
        },
      ],
    },
    {
      title: 'Cookbooks by Decade (bar chart)',
      fields: [
        { key: 'decades.heading', label: 'Heading', type: 'text', default: 'Cookbooks by Decade' },
        {
          key: 'decades.text',
          label: 'Text above the chart',
          type: 'rich',
          default:
            `<p>The number of cookbooks published in Mississippi increased decade by decade. The first cookbook published in the state was the <em>Spinning-Wheel Cook-Book of Old Southern Recipes</em> published by the Spinning Wheel Club in Woodville, Mississippi, in 1899. (The cookbook was preserved when it was reprinted in 1939.) It was the only community cookbook published before 1900. However, the numbers grew steadily and in the 1960s over 148 cookbooks were published.</p>` +
            `<p>The authors of these cookbooks often did not date their cookbooks, presumably hoping that these cookbooks would be viewed as timeless and could be sold for years. Even the rise of national publishers after World War II did not lead to the regular dating of cookbooks. Just over 160 of the cookbooks included in the following chart included a printed date.</p>` +
            `<p>Previous studies have dated the cookbooks based on their appearance and, especially for nationally produced cookbooks, this technique is not without merit. However, given the importance of demonstrating change over time for this study, I researched undated cookbooks. Using contributors' names, advertisers, and newspaper references I have dated most of these cookbooks or, at least, have narrowed the possible date so that I can be fairly certain of the decade when it was produced. Nonetheless, the dates below are in some cases estimates and are subject to revision.</p>`,
        },
        { key: 'decades.chartTitle', label: 'Chart title', type: 'text', default: 'Cookbooks by Decade', hidden: true },
        { key: 'decades.first', label: 'First decade shown', type: 'number', default: '1890', hint: 'The bars are counted from the cookbooks list. E.g. 1890 starts the chart at the 1890s.', hidden: true },
        { key: 'decades.last', label: 'Last decade shown', type: 'number', default: '1960', hint: 'E.g. 1960 ends the chart at the 1960s.', hidden: true },
        { key: 'decades.numbers', label: 'The chart', type: 'chart', chart: 'decades', default: AUTO_NUMBERS, edits: ['decades.numbers', 'decades.chartTitle', 'decades.first', 'decades.last'] },
      ],
    },
    {
      title: 'Publisher Types (circle chart)',
      fields: [
        { key: 'publishers.heading', label: 'Heading', type: 'text', default: 'Publisher Types: Local versus National' },
        {
          key: 'publishers.text',
          label: 'Text above the chart',
          type: 'rich',
          default:
            `<p>Anyone could create a community cookbook. The simplest, often presented as wedding presents, were handwritten cards bound with a ribbon or a metal ring. However, most were more substantial productions. Recipes were collected and organized, advertising was sold to pay for the cost of printing, and a hundred or more copies of the cookbook were printed and sold to raise funds for a charitable endeavor.</p>` +
            `<p>These cookbooks often did not include publication information. If the cookbook was printed locally, the publisher may have viewed the production as a “print job” rather than a book. National publishers, who first emerged at the turn of the twentieth century and rose to prominence in the postwar era, were also initially reluctant to list publication information fearing that it would diminish their local appeal. The following numbers represent both my best guess as to the publisher and recorded publishers.</p>`,
        },
        { key: 'publishers.chartTitle', label: 'Chart title', type: 'text', default: 'Publisher Distribution', hidden: true },
        { key: 'publishers.localLabel', label: 'First group name', type: 'text', default: 'Local Publishers', hidden: true },
        { key: 'publishers.local', label: 'First group: number of cookbooks', type: 'number', default: '146', hint: 'Cookbooks printed by a local printer or self-published.', hidden: true },
        { key: 'publishers.nationalLabel', label: 'Second group name', type: 'text', default: 'National Publishers', hidden: true },
        { key: 'publishers.national', label: 'Second group: number of cookbooks', type: 'number', default: '130', hint: 'Cookbooks printed by a national publishing company.', hidden: true },
        { key: 'publishers.chart', label: 'The chart', type: 'chart', chart: 'publishers', default: '', edits: ['publishers.chartTitle', 'publishers.localLabel', 'publishers.local', 'publishers.nationalLabel', 'publishers.national'] },
      ],
    },
    {
      title: 'Organizations (bar chart)',
      fields: [
        { key: 'orgs.heading', label: 'Heading', type: 'text', default: 'Organizations That Published Cookbooks' },
        {
          key: 'orgs.text',
          label: 'Text above the chart',
          type: 'rich',
          default:
            `<p>Some cookbooks were created to forge tighter bonds with a club or community, but most were created to raise funds for charitable endeavors: remodeling a church rectory or repairing the church's roof, creating a cemetery, funding a school trip, raising money for textbooks or scholarships, or supporting local youth initiatives. The following chart classifies the groups that created these cookbooks as churches, civic organizations and clubs, extension service clubs, and professional organizations.</p>` +
            `<p>In the following chart, civic groups, such as a parent-teacher association, and clubs, such as garden or literary club, have been grouped together since their fundraising efforts were similar. Church cookbooks, produced by women's auxiliaries and missionary societies, generally raised funds for church improvements. Mississippi State University's Extension Services were responsible for dozens of community cookbooks. Most were prepared with the help of a county demonstration agent. For a historical overview of Mississippi's home demonstration program, visit the <a href="https://mississippiencyclopedia.org/entries/home-demonstration/" target="_blank" rel="noopener noreferrer">Mississippi Encyclopedia</a>. Finally, professional organizations and businesses also occasionally sponsored cookbooks. The professional organizations raised funds for their own activities while businesses used the cookbook to promote their services. These cookbooks were much more common in the 1970s and the decades that followed.</p>`,
        },
        { key: 'orgs.chartTitle', label: 'Chart title', type: 'text', default: 'Organization Types', hidden: true },
        { key: 'orgs.civic', label: 'Name for "Civic/Club" cookbooks', type: 'text', default: 'Civic & Club Organizations', hidden: true },
        { key: 'orgs.church', label: 'Name for "Church" cookbooks', type: 'text', default: 'Church Organizations', hidden: true },
        { key: 'orgs.business', label: 'Name for "Business/Professional" cookbooks', type: 'text', default: 'Business & Professional', hidden: true },
        { key: 'orgs.extension', label: 'Name for "Extension" cookbooks', type: 'text', default: 'Extension Services', hidden: true },
        { key: 'orgs.numbers', label: 'The chart', type: 'chart', chart: 'orgs', default: AUTO_NUMBERS, edits: ['orgs.numbers', 'orgs.chartTitle', 'orgs.civic', 'orgs.church', 'orgs.business', 'orgs.extension'] },
      ],
    },
    {
      title: 'Cookbooks by County',
      fields: [
        { key: 'counties.heading', label: 'Heading', type: 'text', default: 'Cookbooks by County' },
        {
          key: 'counties.text',
          label: 'Text above the county charts',
          type: 'rich',
          default:
            `<p>Mississippi spans 48,000 square miles divided into 82 counties. Many of these counties are rural and the county seat (or, in a few cases, seats) are generally the largest town. Yet communities small and large produced community cookbooks. As of this counting, all but nine of the 82 counties in Mississippi created at least one cookbook.</p>` +
            `<p>Hinds County, home of the state capital, Jackson, created the largest number followed by Forrest, Washington, Jones, and Bolivar. The large numbers from Forrest and Jones reflect in part a statistical bias, since Hattiesburg, the researcher's home, is located in Forrest and Jones is the adjacent community. However, these numbers also reflect the cultural and educational importance of the cities that produced the largest number of cookbooks. Forrest is home to The University of Southern Mississippi which, for years, housed a Home Economics Department. Jones is home to Laurel, a community with considerable lumber and oil wealth and numerous cultural institutions. The other counties with the highest counts, Washington and Bolivar Counties, were the site of prominent Delta cities. Disproportionate as some of these counts may be, collectively the largest five contributors account for less than a third of the total number of cookbooks.</p>`,
        },
        { key: 'counties.highLabel', label: 'Name for the busiest counties', type: 'text', default: 'High Production' },
        { key: 'counties.high', label: 'Counts as high production from', type: 'number', default: '10', hint: 'Number of cookbooks. E.g. 10 means 10 or more.' },
        { key: 'counties.mediumLabel', label: 'Name for the middle group', type: 'text', default: 'Medium Production' },
        { key: 'counties.medium', label: 'Counts as medium production from', type: 'number', default: '3', hint: 'E.g. 3 means 3 up to the high number. Anything below is low production.' },
        { key: 'counties.lowLabel', label: 'Name for the quietest counties', type: 'text', default: 'Low Production' },
        { key: 'counties.noneLabel', label: 'Name for counties with none', type: 'text', default: 'No Cookbooks' },
        { key: 'counties.topTitle', label: 'Top counties chart title', type: 'text', default: 'Top 10 Counties', hidden: true },
        { key: 'counties.topNumbers', label: 'Top counties chart', type: 'chart', chart: 'topCounties', default: AUTO_NUMBERS, edits: ['counties.topNumbers', 'counties.topTitle'] },
        { key: 'counties.topNote', label: 'Note under the top counties chart', type: 'text', default: 'Future updates will include additional demographic information and maps.' },
        { key: 'counties.gridHeading', label: 'County list heading', type: 'text', default: 'Complete County Inventory' },
        {
          key: 'counties.gridIntro',
          label: 'County list intro',
          type: 'lines',
          default: 'Explore cookbook production across all 82 Mississippi counties. Use the search to find specific counties, or click the category buttons to filter by production level.',
        },
      ],
    },
    {
      title: 'Maps',
      fields: [
        { key: 'maps.heading', label: 'Heading', type: 'text', default: 'Cookbook Map' },
        {
          key: 'maps.text',
          label: 'Text above the maps',
          type: 'rich',
          default:
            `<p>Cookbooks were published in every city and many small towns in Mississippi. This map includes information (similar to the previous list) on over 300 cookbooks published in Mississippi before 1970. In some cases, the date has been estimated. Clicking on a location pin provides information about the cookbooks published in that community.</p>`,
        },
        { key: 'maps.firstTitle', label: 'First map title', type: 'text', default: 'Cookbook Locations (Pre-1970)' },
        {
          key: 'maps.firstUrl',
          label: 'First map link (ArcGIS)',
          type: 'text',
          default: 'https://southernmiss.maps.arcgis.com/apps/instant/sidebar/index.html?appid=7feb969fb94241feb29f40dc3c3291a0',
          hint: 'Paste the "share" link of an ArcGIS map to swap it.',
        },
        { key: 'maps.secondTitle', label: 'Second map title', type: 'text', default: 'Regional Distribution of Pre-1970 Cookbooks' },
        {
          key: 'maps.secondText',
          label: 'Text above the second map',
          type: 'rich',
          default:
            `<p>Mississippi community cookbooks were published throughout the state. This map shows the percent of known cookbooks published before 1970 found in each of five regions. The distribution is remarkably even (despite the greater number of cookbooks published in Jackson, the state capital, and bias introduced by the researcher's residence in southern Mississippi. Statewide publications were excluded.)</p>`,
        },
        {
          key: 'maps.secondUrl',
          label: 'Second map link (ArcGIS)',
          type: 'text',
          default: 'https://southernmiss.maps.arcgis.com/apps/instant/basic/index.html?appid=42774c450dc0419097e5892c50f24d87',
        },
      ],
    },
  ],
};

const cookery: PageDef = {
  id: 'cookery',
  name: 'Cookery',
  path: '/cookery',
  groups: [
    hero('Cookery', '/images/cookery-bg.jpeg', 'center 20%'),
    {
      title: 'Opening',
      fields: [
        {
          key: 'intro',
          label: 'Opening text',
          type: 'rich',
          default:
            `<p>Tentatively titled <em>Kissin Don't Last, Cookery Do</em>, my history of community cookbooks takes a deep dive into community cookbooks in Mississippi in order to better understand how these homespun cookbooks empowered women to shape the places they called home. Community cookbooks funded literary societies, church renovations, parks, school trips, and child welfare programs and, to a degree that is nearly impossible to measure, they provided opportunities for women to address social needs that the political system, still dominated by men in the first two thirds of the twentieth century, ignored.</p>` +
            `<p>Nearly every cookbook I have researched tells a story.</p>`,
        },
      ],
    },
    {
      title: 'First section (photo on the left)',
      fields: [
        { key: 'left.image', label: 'Photo', type: 'image', default: '/images/cookbook-belzoni-garden.jpeg' },
        { key: 'left.caption', label: 'Caption under the photo', type: 'text', default: 'Belzoni Garden Club (Belzoni, Miss.) 1967' },
        { key: 'left.alt', label: 'Photo description for screen readers', type: 'text', default: 'Belzoni Garden Club Cook Book cover' },
        {
          key: 'left.text',
          label: 'Text beside the photo',
          type: 'rich',
          default:
            `<p>Since the records of charitable spending for the hundreds of groups that created cookbooks in Mississippi are not available, the cookbooks themselves are often (supplemented by local research) the best record we have of women's efforts to shape their communities. In the book, I examine select community cookbooks, less to examine the recipes, than to explore the politics.</p>` +
            `<p>That is not to say that the recipes do not matter.</p>`,
        },
      ],
    },
    {
      title: 'Second section (photo on the right)',
      fields: [
        { key: 'right.image', label: 'Photo', type: 'image', default: '/images/cookbook-morehead.jpeg' },
        { key: 'right.caption', label: 'Caption under the photo', type: 'text', default: 'Ladies of the Home Demonstration Club of Moorhead, Mississippi (Moorhead, Miss.) 1965' },
        { key: 'right.alt', label: 'Photo description for screen readers', type: 'text', default: 'Ladies of the Home Demonstration Club of Moorhead cookbook cover' },
        {
          key: 'right.text',
          label: 'Text beside the photo',
          type: 'rich',
          default:
            `<p>In the second half of the book, I place these local cookbooks in a national context, examining how the selection of recipes transcended local preferences and demonstrated a remarkable knowledge of national culinary cultures.</p>` +
            `<p>Not surprisingly, although I do not agree with all the causes these women championed, I have developed considerable respect for the women who gathered to create community cookbooks. They not only mastered the kitchen, but demonstrated their skills as artists, publishers, and businesspeople.</p>` +
            `<p>As I complete the manuscript, I will share many of its findings in this section of the website. Check back for more!</p>`,
        },
      ],
    },
  ],
};

export const PAGES: PageDef[] = [home, cookbooks, landscapes, cookery];

export function getPageDef(id: string) {
  return PAGES.find((p) => p.id === id);
}

export function pageDefaults(page: PageDef): Record<string, string> {
  return Object.fromEntries(page.groups.flatMap((g) => g.fields.map((f) => [f.key, f.default])));
}
