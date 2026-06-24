import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import EssaySection from '@/components/EssaySection';
import EssayTabs from '@/components/EssayTabs';
import { essays } from './essays';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Experimental Kitchen — Mississippi Community Cookbook Project',
};

const dataPipelineEssay = (
  <>
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
  </>
);

const tabItems = essays.map(({ id, title, cardImage, cardImageAlt }) => ({
  id,
  title,
  cardImage,
  cardImageAlt,
  wide: true,
}));

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
            {dataPipelineEssay}
          </EssaySection>
        </section>

        {/* ── Research Findings ── */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Research Findings &amp; Analysis</h2>
          <p className={styles.para}>
            The combined JSON database has proven invaluable for analyzing different culinary trends and patterns
            across Mississippi&apos;s community cookbook history. Select any essay below to read the full analysis.
            The Pecan Pie series is a three-part deep dive into America&apos;s most debated dessert.
          </p>
          <EssayTabs tabs={tabItems} columns={2} />
        </section>
      </div>
    </>
  );
}
