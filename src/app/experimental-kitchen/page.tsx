import type { Metadata } from 'next';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import EssaySection from '@/components/EssaySection';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Experimental Kitchen — Mississippi Community Cookbook Project',
};

export default function ExperimentalKitchenPage() {
  return (
    <>
      <PageHero
        title="Experimental Kitchen"
        backgroundImage="/images/kitchen-bg.jpeg"
        backgroundPosition="center 16.75%"
      />

      <div className={styles.wrapper}>

        <p className={styles.para}>
          The University of Southern Mississippi hosts one of the largest statewide collections of community
          cookbooks in the United States (at least in proportion to the number of cookbooks published). Over a
          hundred of those cookbooks have been digitized and are available from Southern Miss&apos; University
          Libraries.
        </p>
        <p className={styles.para}>
          Suwan Aryal, a talented undergraduate computer scientist at Southern Miss, and I have used artificial
          intelligence to parse and explore these digitized texts.
        </p>

        {/* ── Data Pipeline ── */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Data Collection &amp; Processing Pipeline</h2>
          <p className={styles.para}>
            Suwan Aryal developed a sophisticated pipeline to extract and process recipes from digitized
            cookbooks. Here&apos;s a detailed explanation of the process:
          </p>

          <EssaySection title="Read Full Data Collection & Processing Pipeline Essay">
            <h4>Technical Stack and Implementation</h4>
            <p>
              The data collection and processing pipeline was built using Python as the primary programming
              language. The system leverages several key libraries and technologies to extract, process, and
              structure recipe data from historical PDF cookbooks.
            </p>

            <h4>PDF Extraction and OCR Processing</h4>
            <p>
              The pipeline begins with PDF extraction, where each cookbook is converted into individual page
              images containing recipes. These images are processed through optical character recognition (OCR)
              using pytesseract, a Python wrapper for Google&apos;s Tesseract OCR engine. The OCR process
              transforms visual pages into machine-readable text, enabling automated extraction of recipe content.
            </p>
            <p>
              The PDF extraction phase presents unique challenges with historical documents. Many of these
              cookbooks were scanned from physical copies, resulting in varying image quality, page orientations,
              and occasional artifacts like creases, stains, or handwritten annotations. Each PDF must be
              carefully parsed to identify recipe boundaries, separating actual recipe content from headers,
              footers, page numbers, and other non-recipe text. The OCR output is often imperfect—character
              recognition errors are common, especially with older fonts, faded text, or decorative typography
              common in community cookbooks from the 1960s through 1990s.
            </p>

            <h4>AI Processing with Google Gemini</h4>
            <p>
              Each page of text is then processed using Google Gemini AI, which applies advanced filtering,
              cleaning, and correction techniques to standardize measurements, ingredient names, and cooking
              instructions. The AI handles variations in historical terminology, converts old measurement systems
              to modern equivalents, and ensures consistency across different cookbooks and time periods.
            </p>
            <p>
              The AI processing stage is where the raw OCR text becomes structured, usable data. Gemini AI
              performs several critical transformations: it identifies recipe components (title, ingredients,
              instructions, servings), extracts structured information from free-form text, and normalizes data
              across different formats. For example, it recognizes that &ldquo;1 cup flour,&rdquo; &ldquo;1 c.
              flour,&rdquo; and &ldquo;one cup of flour&rdquo; all represent the same measurement. It
              standardizes historical measurements—converting &ldquo;1 pint&rdquo; to &ldquo;2 cups&rdquo; or
              recognizing that older recipes might use &ldquo;1 teacup&rdquo; which needs modern conversion. The
              AI also handles regional variations in ingredient names and corrects OCR errors by understanding
              context.
            </p>

            <h4>Database Creation and Consolidation</h4>
            <p>
              After individual processing, all extracted JSON data is combined into a single comprehensive file,
              creating a unified recipe database. This consolidated dataset enables powerful search capabilities
              and cross-cookbook analysis that would be impossible with traditional manual methods.
            </p>
            <p>
              The final consolidation phase merges thousands of individual recipe JSON files into one master
              database. Each recipe in the unified database includes metadata like source cookbook, publication
              decade, contributor information (when available), and standardized recipe components. This
              structure enables sophisticated queries—we can search for all recipes containing specific
              ingredients across all cookbooks, analyze how cooking techniques evolved over time, identify
              regional variations in recipe names, or track the popularity of certain dishes across different
              decades and communities.
            </p>
          </EssaySection>
        </section>

        {/* ── Research Findings ── */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Research Findings &amp; Analysis</h2>
          <p className={styles.para}>
            The combined JSON database has proven invaluable for analyzing different culinary trends and patterns
            across Mississippi&apos;s community cookbook history. Here are some of the key findings that Suwan
            and I have analyzed and discovered:
          </p>

          {/* Essay 1: Chicken Spaghetti */}
          <EssaySection title="Chicken Spaghetti: A Mississippi Original?">
            <p>
              Craig Claiborne, the <em>New York Times</em> restaurant critic, lived in Indianola, Mississippi,
              in the 1920s and 30s where his mother ran a boarding house and had a reputation as an excellent
              cook. In 1975, during an interview with WOR in New York, he was asked about his favorite childhood
              food. It was chicken spaghetti. The interview sparked interest in the curious &ldquo;Mississippi&rdquo;
              dish and a few weeks later Claiborne published his{' '}
              <a href="https://cooking.nytimes.com/recipes/1019165-my-mothers-chicken-spaghetti" target="_blank" rel="noopener noreferrer">
                family&apos;s recipe in the Times
              </a>
              . He claimed it was his mother&apos;s invention, and this variation probably was.
            </p>
            <p>
              Claiborne saw chicken spaghetti as a distinctly southern dish and Mississippians often view it as
              their own, but there is every reason to believe it first became popular in the Midwest and made its
              way down the Mississippi River to the Magnolia State sometime in the early 20th century. Although
              endless variations exist, it is rooted in both Italian cacciatore and Italian American tetrazzini.
            </p>
            <p>
              Recipes for chicken spaghetti evolved during the twentieth century, so dating the first appearance
              in a Mississippi community cookbook is tricky, but a pair of recipes from the mid-1920s are prime
              contenders. In 1926 the Ladies Aid Society of the M. E. Church South of Augusta, Mississippi
              produced a cookbook to raise funds for &ldquo;parsonage and church work.&rdquo; Two recipes for
              chicken spaghetti appear in the &ldquo;Meats&rdquo; section.
            </p>
            <p>
              As the dish became more popular, &ldquo;Chicken Spaghetti&rdquo; emerged as the favored name for
              the dish. Using a customized database of recipes extracted from over one hundred Mississippi
              community cookbooks digitized by University Libraries at Southern Miss, Suwan Aryal and I were able
              to trace the history of chicken spaghetti in Mississippi and compare its popularity to a venerable
              Southern favorite, fried chicken.<sup><a href="#cs-fn-1" id="cs-ref-1">1</a></sup> Although
              variations on chicken spaghetti were prepared prior to World War II, the dish gained its name and
              became a household favorite in the 1940s.
            </p>

            <figure>
              <Image
                src="/experimental-kitchen-visualizations/chicken-spaghetti-vs-fried-chicken.png"
                alt="Chicken Spaghetti vs Fried Chicken Recipes by Decade"
                width={760}
                height={480}
                style={{ width: '100%', height: 'auto' }}
              />
              <figcaption>Chicken Spaghetti vs. Fried Chicken recipes by decade in Mississippi community cookbooks</figcaption>
            </figure>

            <p>
              Given that the first appearance of the dish with the title &ldquo;Chicken Spaghetti&rdquo; did not
              appear in our dataset until 1946, chicken spaghetti&apos;s rapid rise is remarkable. It immediately
              surpassed the number of fried chicken recipes in the database. In fact, its postwar popularity was
              so great that despite getting a late start, chicken spaghetti is the only entrée to appear in our
              list of the ten recipes most often included in Mississippi community cookbooks published from 1900
              to 1970. All the other recipes were for desserts.
            </p>

            <figure>
              <Image
                src="/experimental-kitchen-visualizations/top_10_recipes.png"
                alt="Top 10 Most Popular Recipes in Mississippi Community Cookbooks"
                width={760}
                height={480}
                style={{ width: '100%', height: 'auto' }}
              />
              <figcaption>Top 10 most popular recipes in Mississippi community cookbooks</figcaption>
            </figure>

            <p>
              Numerous factors contributed to chicken spaghetti&apos;s meteoric rise. Initially, at least, it
              paralleled Americans&apos; embrace of pasta. Once viewed as a detested, even unsanitary immigrant
              food, macaroni benefited from the concerted efforts of American manufacturers and the U.S.
              government in the first third of the twentieth century to market it as a healthy, American product
              made from domestic Durum wheat. Grocery stores carried pasta packaged in sanitary boxes featuring
              recipes and pastoral scenes prior to World War I, and spaghetti and other macaroni dishes became
              increasingly popular in the decades that followed.
            </p>
            <p>
              Chicken spaghetti was not only inexpensive and relatively easy to prepare, it also was appealing to
              young people. In the postwar baby boom, as women found themselves caring for more children, simple
              and kid-friendly foods like chicken spaghetti were popular. And unlike fried chicken, a tried-and-true
              favorite that every young woman would have learned to cook from her mother, chicken spaghetti was new
              enough that people were eager to share their recipes.
            </p>
            <p>
              In Mississippi, as the origins of chicken spaghetti blurred, it became a local dish popular at
              backyard barbeques and church picnics—and the most popular entrée in Mississippi community cookbooks
              published before 1970. For many, including{' '}
              <a href="https://www.southernliving.com/recipes/chicken-spaghetti-casserole-recipe" target="_blank" rel="noopener noreferrer">
                <em>Southern Living</em>
              </a>
              , &ldquo;Chicken spaghetti is a Mississippi original.&rdquo;
            </p>

            <div className={styles.footnotes}>
              <h4>Footnotes</h4>
              <ol>
                <li id="cs-fn-1">
                  Fried chicken recipe titles are pretty stable, but there are variations. As with the chicken
                  spaghetti recipes, this study focuses on comparing &ldquo;fried chicken&rdquo; to &ldquo;chicken
                  spaghetti.&rdquo; <a href="#cs-ref-1">↩</a>
                </li>
              </ol>
            </div>
          </EssaySection>

          {/* Essay 2: Pecan Pie Part 1 */}
          <EssaySection title="Pecan Pie Part One: The Nutty History of an Invented Tradition">
            <p style={{ fontStyle: 'italic' }}>
              We had picked the pecan up on half. Since we had four sacks, I had expected Mr. Wheeler to give us
              two of them. But instead he measured them out, gallon for gallon, to make sure we didn&apos;t have
              an ounce more than he did. . . . That Saturday morning Mama and Raymond drove the pecans to
              Woodville, where they could get eighteen cents a point instead of the fifteen cents they got paid in
              Centreville. In all we had picked up a hundred and twenty dollars&apos; worth. Mama used the money
              to buy school clothes for us—shoes, dresses, and pants.<sup><a href="#pp1-fn-1" id="pp1-ref-1">1</a></sup>{' '}
              <strong>Anne Moody</strong>
            </p>
            <p style={{ fontStyle: 'italic' }}>
              Perhaps the most distinctly southern pie is the pecan pie. . . . Children were sent out to gather
              the pecans that fell, and when mixed with the farm dairy products and corn syrup that were in every
              southern cupboard, the nuts produced a rich dessert.<sup><a href="#pp1-fn-2" id="pp1-ref-2">2</a></sup>{' '}
              <strong>Angie Mosier</strong>
            </p>
            <p>
              As anyone who has ever made the mistake of accepting an invitation to Thanksgiving dinner at my
              house will attest, I am not a good pie maker. This is in part due to a lack of trying. I generally
              only bake one or two pies each year and I make them for Thanksgiving. My wife, a very skilled former
              professional chef, has no interest in baking pies, so despite my lack of talent, it falls to me to
              uphold the grand tradition of Thanksgiving pie making. I make my own crust, which generally requires
              a well-swung cleaver to cut, and fill the cement-like creation with whatever kooky, experimental
              recipe was featured in the <em>New York Times</em> in the run-up to the holiday. No one ever asks
              to take a slice home with them.
            </p>
            <p>
              So nothing about my early morning, early November adventure in pie making was expected or, perhaps,
              welcomed, but I was obsessed. It started with a simple fact. Suwan Aryal and I have assembled a
              database of recipes extracted from the over 100 Mississippi community cookbooks published before
              1970 digitized by The University of Southern Mississippi. The data shows that the most common recipe
              is for pecan pie.
            </p>
            <hr />
            <p>
              Pecan trees are native to Mississippi, but it was not until the late nineteenth century that new
              cultivation techniques produced consistent, large, and easily shelled nuts.<sup><a href="#pp1-fn-3" id="pp1-ref-3">3</a></sup>{' '}
              One of the most successful of these new trees produced &ldquo;paper shell&rdquo; pecans and was
              bred, nursed, and sold commercially by Colonel William R. Stuart of Ocean Springs in Jackson County,
              Mississippi. The Stuart Pecan Company successfully marketed both its trees and its nuts at events
              like the 1893 Columbian Exposition, and was soon supplying trees throughout the South.
            </p>
            <p>
              The boom in pecan production was as much a real estate boondoggle as an agricultural revolution.
              As food historian Andrew Smith writes:
            </p>
            <blockquote>
              <p>
                At the time, the cotton crop in the South was devastated by the boll weevil, and property values
                had collapsed. Northern companies purchased vast acreage in the South, planted paper shell pecans,
                and sold sections of the plantings as investments. One company that excelled at this was the Oak
                Ridge Pecan Company, based near Chicago. It purchased land in Florida and then sold it at a
                substantial profit. . . . Another Chicago-based land scheme was the Mobile Farm Land Company,
                which sold paper shell pecan acreage around Mobile, Alabama. It offered an Assured Income for
                Life and a Home for Retirement Adjoining a City of 75,000 People on the Gulf Coast.
              </p>
              <p>
                Yet another company that engaged in land speculation was headed by Elam G. Hess, the president of
                the Keystone Pecan Company in Manheim, Pennsylvania. It was formed in 1912, when he acquired
                10,500 acres of land near Albany, Georgia, and planted 20 trees to the acre, for a total of
                210,000 trees.<sup><a href="#pp1-fn-7" id="pp1-ref-7">7</a></sup>
              </p>
            </blockquote>
            <p>
              There was one success story, pralines. Originally called &ldquo;plarines,&rdquo; the sugary candies
              were sold by Black women street vendors in New Orleans. As Anthony Stanosis writes in his recent
              book on the invention of the New Orleans praline tradition, &ldquo;by the 1920s, the term
              &lsquo;pralines&rsquo; had become synonymous in the United States with the use of
              pecans.&rdquo;<sup><a href="#pp1-fn-12" id="pp1-ref-12">12</a></sup>
            </p>

            <figure>
              <Image
                src="/experimental-kitchen-visualizations/Laurel.png"
                alt="The Laurel Cook Book (1900) - Early Pecan Praline Recipe"
                width={760}
                height={500}
                style={{ width: '100%', height: 'auto' }}
              />
              <figcaption><em>The Laurel Cook Book</em> — early pecan praline recipe</figcaption>
            </figure>

            <p>
              Pecan pie seems to have made its first appearance following the Civil War. Andrew Smith observes
              that the first &ldquo;located&rdquo; recipes appeared simultaneously in <em>Harper&apos;s Bazaar</em>{' '}
              and <em>Texas Siftings</em> on February 6, 1886. Although custard pecan pie recipes began appearing
              in cookbooks, the dessert was not especially popular. Reflecting the tepid reception the custard
              version of pecan pie enjoyed, our database contains only one pecan pie recipe prior to the late
              1920s. It is called simply &ldquo;Nut Pie.&rdquo;
            </p>

            <figure>
              <Image
                src="/experimental-kitchen-visualizations/Floral.png"
                alt="Vicksburg Floral Club Cook Book (1928) - Early Corn Syrup Pecan Pie Recipe"
                width={760}
                height={500}
                style={{ width: '100%', height: 'auto' }}
              />
              <figcaption><em>Vicksburg Floral Club Cook Book</em> (1928) — early corn syrup pecan pie recipe</figcaption>
            </figure>

            <p>
              A number of scholars, most notably Rebecca Sharpless, Rossi Anastopoulo, and Sarah Wassberg
              Johnson, have debunked the Karo origin story. They have documented recipes for corn-syrup pecan
              pie printed in cookbooks before 1930 when Karo claims the recipe was invented. Our database of
              Mississippi community cookbooks includes evidence of this as well. The <em>Vicksburg Floral Club
              Cook Book</em> of 1928 has a recipe for corn-syrup pecan pie and the <em>Greenville Home Economist
              Cook Book</em> of 1930 has two.
            </p>
            <p>
              If the Karo story is a fiction and Karo did not invent the modern pecan pie, who did? Like a
              mystery novel, this first installment of our tale ends with a cliffhanger. (Part two will offer
              an answer, and although it is neither simple nor definitive, it will explain why I made that pie.)
            </p>

            <div className={styles.footnotes}>
              <h4>Footnotes</h4>
              <ol>
                <li id="pp1-fn-1">Anne Moody, <em>Coming of Age in Mississippi</em> (Dell Publishing, 1976), 92-3. <a href="#pp1-ref-1">↩</a></li>
                <li id="pp1-fn-2">Angie Mosier, &ldquo;Pies,&rdquo; in <em>Foodways</em>, ed. John T. Edge, v. 7 (UNC Press, 2007), 225. <a href="#pp1-ref-2">↩</a></li>
                <li id="pp1-fn-3">&ldquo;History,&rdquo; The Pecan Toolbox, accessed November 22, 2025. <a href="#pp1-ref-3">↩</a></li>
                <li id="pp1-fn-7">Andrew F. Smith, &ldquo;The Pecan: A Culinary History,&rdquo; 7. <a href="#pp1-ref-7">↩</a></li>
                <li id="pp1-fn-12">Stanonis, 35–53, 186. <a href="#pp1-ref-12">↩</a></li>
              </ol>
            </div>
          </EssaySection>

          {/* Essay 3: Pecan Pie Part 2 */}
          <EssaySection title="Pecan Pie Part Two: The Sticky Wicket of Pecan Pie's Origins">
            <p>
              Let&apos;s start with the known facts. Pretty much all the forensic analyses of the origins of the
              modern pecan pie agree that it was inspired by a number of previous recipes, including the custard
              pecan pie and other custard and syrup pies such as chess, sugar, and molasses pie. One theory dates
              the first modern pecan pie to at least 1900 and was offered by Rebecca Sharpless in a blog post for
              UNC Press. Her research led her to Slidell, Louisiana.
            </p>
            <blockquote>
              <p>
                Into the computer I went one more time, and I hit pay dirt with <em>A Book of Famous Old New
                Orleans Recipes Used in the South for More than 200 Years</em>, a slender volume that appeared in
                the Crescent City in 1900. There on page 47 is the proof: a pecan pie made with eggs, sugar,
                &ldquo;Louisiana syrup,&rdquo; pecans, butter, vanilla extract, and pecan halves. The cookbook
                editor noted, &ldquo;The little lumber town out of Orleans, seems to be the original home of pecan
                pie. Signs all over Slidell advertise the pecan pie and many New Orleanians drive out to buy them
                during the season.&rdquo; The pie uses cane syrup, not Karo, but it&apos;s very close to PPAWKI
                [pecan pie as we know it]. So. Slidell. Cane syrup. 1900.<sup><a href="#pp2-fn-2" id="pp2-ref-2">2</a></sup>
              </p>
            </blockquote>
            <p>
              A closer look at the editor&apos;s note raised additional questions. In 1900, when this cookbook was
              apparently published, there were fewer than 10,000 automobiles on the road in the United States and
              no direct roadway between New Orleans and Slidell. Yet the note implied that it was motorists making
              the trek to Slidell to purchase its famous pies. It is becoming increasingly clear that the recipe
              and notes were added after 1928.
            </p>

            <figure>
              <Image
                src="/experimental-kitchen-visualizations/county_graph_w_corn_kaor.png"
                alt="County Graph Showing Recipes with Corn Syrup"
                width={760}
                height={480}
                style={{ width: '100%', height: 'auto' }}
              />
              <figcaption>County distribution of recipes featuring corn syrup in Mississippi community cookbooks</figcaption>
            </figure>

            <p>
              The best clues to the origins of the modern pecan pie might be two recipes from 1925, the first two
              known recipes for modern pecan pie. Rebecca Sharpless located one in a Dallas community cookbook
              produced by the Sunday school class at First Baptist Church in Dallas. A second recipe was published
              in 1925 in an advertising cookbook created by Elam G. Hess&apos; Keystone Pecan Company.
            </p>

            <figure>
              <Image
                src="/experimental-kitchen-visualizations/56 Prizes.png"
                alt="Keystone Pecan Company Contest Advertisement"
                width={760}
                height={500}
                style={{ width: '100%', height: 'auto' }}
              />
              <figcaption>Keystone Pecan Company contest advertisement, 1924</figcaption>
            </figure>

            <p>
              There was only one way to know if a 1916 Texas recipe represented a missing link, and that was to
              make the pie. My spouse helped. Despite the store-bought Pillsbury crust, this is the best pecan
              pie I&apos;ve ever had. I found the sugar syrup a little less cloying than Karo and the milk made
              it a little bit creamier, but this very sweet, gooey pie is not a custard pie. It has both the
              taste and texture of a modern pecan pie made with corn syrup.
            </p>

            <figure>
              <Image
                src="/experimental-kitchen-visualizations/Weck.jpg"
                alt="Mrs. Weck Mears' Pecan Custard Pie Recipe"
                width={760}
                height={500}
                style={{ width: '100%', height: 'auto' }}
              />
              <figcaption>Mrs. Weck Mears&apos; Pecan Custard Pie recipe, Fredericksburg, Texas, 1916</figcaption>
            </figure>

            <figure>
              <Image
                src="/experimental-kitchen-visualizations/pie.jpeg"
                alt="Modern Recreation of Mrs. Mears' Pie"
                width={760}
                height={500}
                style={{ width: '100%', height: 'auto' }}
              />
              <figcaption>Modern recreation of Mrs. Mears&apos; pie</figcaption>
            </figure>

            <p>
              Is this the missing link between pecan custard pie and pecan Karo pie? No, but it is probably one
              of the many evolutions that eventually produced the modern pecan pie. These cooks, steeped in the
              experience that came from making molasses pie, chess pie, plantation pie, sugar pie, vinegar pie,
              and others, experimented and innovated and pecan pie slowly evolved. For more on that story, you
              will have to read part three.
            </p>

            <div className={styles.footnotes}>
              <h4>Footnotes</h4>
              <ol>
                <li id="pp2-fn-2">Rebecca Sharpless, &ldquo;A Fresh Look at the History of Pecan Pie,&rdquo; UNC Press Blog, last modified November 16, 2022. <a href="#pp2-ref-2">↩</a></li>
              </ol>
            </div>
          </EssaySection>

          {/* Essay 4: Pecan Pie Part 3 */}
          <EssaySection title="Pecan Pie Part Three: Too Big Even for Texas">
            <p>
              The Mississippi Community Cookbook Project&apos;s experimental AI database does not provide much
              additional insight into the origins of the pecan pie, but it does provide some evidence of the
              pie&apos;s popularity and the nation&apos;s embrace of this dessert. The number of pecan pie recipes
              in our database alone demonstrates how quickly pecan pie&apos;s popularity rose once custard gave
              way to corn syrup. Even though the first corn syrup recipes for pecan pie do not appear in our
              database until 1928, pecan pie recipes are the most numerous recipes in our digitized collection of
              over 100 Mississippi cookbooks (around 20,000 recipes) published before 1970.
            </p>

            <figure>
              <Image
                src="/experimental-kitchen-visualizations/corn vs non corn.png"
                alt="Corn Syrup vs Non-Corn Syrup Pecan Pie Chart"
                width={760}
                height={480}
                style={{ width: '100%', height: 'auto' }}
              />
              <figcaption>Corn syrup vs. non-corn syrup pecan pie recipes across decades</figcaption>
            </figure>

            <p>
              Recipe titles also provide insight into the perceived origins of these recipes. Texas had a long
              history with pecans and in the first few decades after pecan production took off in the early
              twentieth century, Texas dominated the trade. Although Texas was never as closely linked to pecan
              pie as Boston was to beans, Maryland to crab, or New Orleans to pralines, it was not uncommon for
              pecan pie to be referred to as Texas Pecan Pie.
            </p>
            <p>
              The ascendance of Lyndon Baines Johnson to the Presidency seems to have briefly revived
              Texas&apos; claim to pecan pie. Articles on the President&apos;s diet often referenced
              &ldquo;popular Texas dishes&rdquo; such as pecan pie, and the Karo corporation launched an
              advertisement for &ldquo;VIP Pecan Pie&rdquo; in 1964.
            </p>

            <figure>
              <Image
                src="/experimental-kitchen-visualizations/Crisco.png"
                alt="Crisco Plantation Pecan Pie Advertisement"
                width={760}
                height={500}
                style={{ width: '100%', height: 'auto' }}
              />
              <figcaption>Crisco&apos;s &ldquo;Plantation Pecan Pie&rdquo; advertisement, 1951</figcaption>
            </figure>

            <figure>
              <Image
                src="/experimental-kitchen-visualizations/City_Bakery.jpg"
                alt="City Bakery Pecan Pie Advertisement"
                width={760}
                height={500}
                style={{ width: '100%', height: 'auto' }}
              />
              <figcaption>City Bakery pecan pie advertisement, Oklahoma, 1926</figcaption>
            </figure>

            <p>
              Spurred by government efforts to promote pecans as a healthy, domestic &ldquo;Victory Food
              Special&rdquo; during World War II, pecan production rose and prices dropped resulting in a postwar
              bounty. Both food manufacturers and homemakers took notice and a part of the postwar reconstruction
              of civilian life would be the anointing of pecan pie as a Thanksgiving tradition.
            </p>

            <h3>Conclusions</h3>
            <p>
              Bangs are rare; whimpers are common. History happens through small changes as people adapt and
              innovate. That is the story of pecan pie&apos;s invention and its widespread embrace as a signature
              Southern dish and a Thanksgiving tradition.
            </p>
            <p>
              I stumbled into this project expecting to write a simple tale about why pecan pie was so popular in
              Mississippi, but the story that has emerged is much more than I expected. The creation of a new
              pecan pie made with corn syrup demonstrates the creativity of American homemakers. Pecan pie is
              simple, but collectively thousands of cooks across decades experimented, revised, and reinvented.
              They did not wait for Karo and company to tell them what worked; they discovered it themselves.
            </p>
            <p>
              The rise of the pecan pie not only reminds us that our most cherished recipes may not be nearly as
              old as we imagine but also is a warning that our historical memory plays tricks on us. What we eat
              reflects not only who we are, but who we want to be—and in the twentieth century, the corn-syrup
              laden pecan pie offered Americans a gooey, sugary idyll they needed.
            </p>
          </EssaySection>
        </section>

      </div>
    </>
  );
}
