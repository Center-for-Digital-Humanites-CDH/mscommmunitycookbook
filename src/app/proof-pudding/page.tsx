import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Proof of the Pudding — Mississippi Community Cookbook Project',
};

export default function ProofPuddingPage() {
  return (
    <>
      <PageHero
        title="Proof of the Pudding"
        backgroundImage="/images/proof-bg.jpeg"
        backgroundPosition="center 30%"
      />

      <div className={styles.wrapper}>
        <div className={styles.prose}>

          {/* Gulfport cookbook — floats right on desktop */}
          <figure className={`${styles.figure} ${styles.figureRight}`}>
            <Image
              src="/images/cookbook-whats-cookin-gulfport.jpg"
              alt="What's Cookin' in Gulfport cookbook cover"
              width={200}
              height={260}
              className={styles.coverImg}
            />
            <figcaption>What&apos;s Cookin&apos; in Gulfport (Gulfport, Miss.)</figcaption>
          </figure>

          <p>
            When I tell people I am studying community cookbooks, they invariably are excited. I
            understand that enthusiasm, but it masks many of the challenges of examining books that
            few imagined would become part of the historical record. Community cookbooks rarely have
            introductory material, often are not dated, and sometimes organized in idiosyncratic
            ways. This section of the website is dedicated to examining sources. In a series of
            forth-coming short essays, I will explore some of the challenges of working with
            community cookbooks. Occasionally, I also may add a book review, promote an interesting
            online article, or provide some bibliographic materials.
          </p>

          <p>
            Ten years ago, I approached Professor Jennifer Brannock at the McCain Library and
            Archives at Southern Miss about collecting community cookbooks. I explained that I was
            most interested in historic Mississippi cookbooks published before 1970 and that I
            thought there were around a hundred. Today, the archive houses over three hundred
            historic Mississippi community cookbooks and thousands published more recently. Southern
            Miss has also created a remarkable collection of significant cookbooks and community
            cookbooks from neighboring states, from some far-off states, and from overseas. The
            culinary collection now consists of over seven thousand items.
          </p>

          <p>
            Substantial donations, most notably from{' '}
            <Link href="https://www.hdoliver.com/obituaries/Lee-Anderson-Orr?obId=26504219" target="_blank" rel="noopener noreferrer">
              Anderson Orr
            </Link>
            , a Mississippi-born educator and culinary enthusiast, have made the collection possible
            alongside the sustained efforts of Professor Brannock to fill in the gaps. Yet there are
            many, many cookbooks that have not made it into the collection. Many of these may be
            lost to time. Too often, community cookbooks are discarded when their owners die.
          </p>

          <p>
            Over the years, I&apos;ve visited antique shops, thrift shops, estate sales, and yard
            sales (as have friends eager to lend a helping hand) looking for long forgotten
            cookbooks. I have also visited dozens of universities and public libraries across the
            Mississippi looking for cookbooks, and am deeply grateful to the librarians and
            archivists who had the foresight to preserve works that were once easily dismissed.
            I&apos;m especially grateful to the Amory Municipal Library, Carnegie Public Library in
            Clarksdale, Calhoun City Public Library, Delta State University Library, Mississippi
            Department of Archives and History, Mississippi State, and the University of Mississippi
            for the efforts they have made to preserve and document these cookbooks.
          </p>

        </div>
      </div>
    </>
  );
}
