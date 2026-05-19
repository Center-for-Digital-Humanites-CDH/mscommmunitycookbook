import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Tasted and Tested — Mississippi Community Cookbook Project',
};

export default function TastedTestedPage() {
  return (
    <>
      <PageHero
        title="Tasted and Tested"
        backgroundImage="/images/tested-bg.jpeg"
        backgroundPosition="center 20%"
      />

      <div className={styles.wrapper}>

        {/* ── Author profile ── */}
        <section className={styles.profileSection}>
          <div className={styles.profileCard}>
            <div className={styles.profileImageWrap}>
              <Image
                src="/images/andrew.jpeg"
                alt="Andrew P. Haley"
                width={240}
                height={288}
                className={styles.profileImg}
              />
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>Andrew P. Haley</h2>
              <p className={styles.profileRole}>Associate Professor of History</p>
              <p className={styles.profileInstitution}>The University of Southern Mississippi</p>
              <p className={styles.profileBio}>
                Andrew P. Haley is an associate professor of American History and Faculty Ombud at
                The University of Southern Mississippi, where he studies culture, community, and
                cuisine in the United States from the Gilded Age through the 1970s. He received his
                doctorate in History from the University of Pittsburgh. His first book,{' '}
                <em>Turning the Tables: American Restaurant Culture and the Rise of the Middle
                Class, 1880–1920</em>, argues that changes in restaurant culture demonstrate the
                growing influence of urban middle-class consumers. It won the 2012 James Beard Award
                for Scholarship and Reference. He was the Moorman Distinguished Professor of the
                Humanities 2019–2021 at Southern Miss and is the recipient of various other accolades
                including a 2001 K. Patricia Cross Award from the American Association for Higher
                Education.
              </p>
              <p className={styles.profileBio}>
                Andrew is currently working on a book and archival project that explores how
                community cookbooks tell the story of changing dining habits, gender politics, race
                relations, and American identity in the twentieth-century South.
              </p>
            </div>
          </div>
        </section>

        {/* ── Significant Contributors ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Significant Contributors</h2>
          <div className={styles.contributorsGrid}>

            <div className={styles.contributorCard}>
              <Image
                src="/images/jennifer_brannock.png"
                alt="Jennifer Brannock"
                width={120}
                height={150}
                className={styles.contributorImg}
              />
              <div className={styles.contributorInfo}>
                <h4 className={styles.contributorName}>Jennifer Brannock</h4>
                <p className={styles.contributorRole}>Curator of Rare Books and Mississippiana</p>
                <p className={styles.contributorInstitution}>The University of Southern Mississippi</p>
                <p className={styles.contributorBio}>
                  Jennifer Brannock is a Professor and Curator of Rare Books and Mississippiana at
                  the University of Southern Mississippi. She has a BA in Art History and an MSLS
                  from the University of Kentucky. In 2011, Jennifer started collecting Mississippi
                  community cookbooks for Special Collections. With her collaborator, history
                  professor Dr. Andrew P. Haley, she has created the largest collection of
                  Mississippi community cookbooks in the world. Since starting the collection, she
                  has hosted events and programming highlighting the collection and given talks around
                  the world about the cookbook collection found at Southern Miss. In 2020, Jennifer
                  received the Genealogy/History Achievement Award, recognizing her work with the
                  cookbook collection among other achievements.
                </p>
              </div>
            </div>

            <div className={styles.contributorCard}>
              <Image
                src="/images/me.jpg"
                alt="Suwan Aryal"
                width={120}
                height={150}
                className={`${styles.contributorImg} ${styles.contributorImgMe}`}
              />
              <div className={styles.contributorInfo}>
                <h4 className={styles.contributorName}>Suwan Aryal</h4>
                <p className={styles.contributorRole}>Undergraduate Data Specialist / Mississippi Digital Humanities Hub</p>
                <p className={styles.contributorInstitution}>The University of Southern Mississippi</p>
                <p className={styles.contributorBio}>
                  Suwan Aryal is a junior Honors student majoring in Computer Science at the
                  University of Southern Mississippi. Before college, he completed his Cambridge
                  A-Levels with a focus on science and mathematics. His academic interests include
                  data science, machine learning, and digital humanities.
                </p>
                <p className={styles.contributorBio}>
                  As a student data specialist for the Mississippi Digital Humanities Hub, Suwan has
                  extracted and organized datasets from over 130 community cookbooks, designed an
                  interface for querying data, and developed the project website. He has also gained
                  professional experience through summer internships and looks forward to pursuing
                  honors thesis research at the intersection of data systems and applied machine
                  learning.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ── Institutional Supporters ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Institutional Supporters</h2>
          <div className={styles.contributorsGrid}>

            <div className={styles.contributorCard}>
              <Image
                src="/images/Cook Library.jpg"
                alt="University Libraries at Southern Miss"
                width={120}
                height={150}
                className={styles.institutionImg}
              />
              <div className={styles.contributorInfo}>
                <h4 className={styles.contributorName}>University Libraries at Southern Miss</h4>
                <p className={styles.contributorBio}>
                  The Community Cookbook Project is possible because of support from Special
                  Collections and Digital Collections at the University Libraries at The University
                  of Southern Mississippi. Through both donations and sustained collection
                  development, Jennifer Brannock, Curator of the Mississippiana Collection, has
                  helped build a Mississippi community cookbook collection that includes more than
                  300 cookbooks published before 1970 (featured on this website) and more than a
                  thousand published after 1970. These are part of a larger culinary collection that
                  now includes over 5,000 titles and features manuscript and family cookbooks,
                  published cookbooks from Mississippi and adjacent states, a collection of British
                  community cookbooks, and classic culinary works from around the world. We continue
                  to solicit donations for the collection.
                </p>
                <p className={styles.links}>
                  <strong>Related Links:</strong><br />
                  <Link href="https://lib.usm.edu/spcol/" target="_blank" rel="noopener noreferrer" className={styles.link}>Special Collections</Link><br />
                  <Link href="https://www.digitalcollections.usm.edu" target="_blank" rel="noopener noreferrer" className={styles.link}>Digital Collections</Link>
                </p>
              </div>
            </div>

            <div className={styles.contributorCard}>
              <Image
                src="/images/MDHH Logo.png"
                alt="Mississippi Digital Humanities Hub"
                width={120}
                height={150}
                className={styles.institutionImg}
              />
              <div className={styles.contributorInfo}>
                <h4 className={styles.contributorName}>
                  The Center for Digital Humanities and the Mississippi Digital Humanities Hub at
                  Southern Miss
                </h4>
                <p className={styles.contributorBio}>
                  The first, tentative iteration of the Mississippi Community Cookbook Project was
                  launched with a small grant from the College of Arts &amp; Letters at The
                  University of Southern Mississippi, but at the time Southern Miss provided limited
                  institutional support for digital humanities projects and with the focus was on
                  acquiring new works, the project was absorbed by University Libraries. In 2021,
                  the launch of the Center for Digital Humanities (along with continued research)
                  made it possible to reimagine and create a new Mississippi Community Cookbook
                  Project website. Andrew Haley served as interim director of the center in 2023–24
                  and now directs the ancillary Mississippi Digital Humanities Hub, a congressionally
                  funded grant managed by the National Historical Publications and Records
                  Commission, that promotes digitization and digital storytelling throughout
                  Mississippi. This website is hosted by the CDH and is possible because of the
                  skills Andrew learned and support he received from the Hub.
                </p>
                <p className={styles.links}>
                  <strong>Related Links:</strong><br />
                  <Link href="https://www.usm.edu/arts-sciences/index.php" target="_blank" rel="noopener noreferrer" className={styles.link}>College of Arts &amp; Letters</Link><br />
                  <Link href="https://usmcdh.org" target="_blank" rel="noopener noreferrer" className={styles.link}>Center for Digital Humanities</Link><br />
                  <Link href="https://www.ms-digital-hub.com" target="_blank" rel="noopener noreferrer" className={styles.link}>Mississippi Digital Humanities Hub</Link><br />
                  <Link href="https://www.archives.gov/nhprc" target="_blank" rel="noopener noreferrer" className={styles.link}>National Historical Publications and Records Commission</Link>
                </p>
              </div>
            </div>

          </div>
        </section>

      </div>
    </>
  );
}
