import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { getPageContent } from "@/lib/pageContent";
import { parseLinks, parseList, type ListItem } from "@/content/pages";
import styles from "./page.module.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tasted and Tested — Mississippi Community Cookbook Project",
};

function Links({ lines }: { lines: string }) {
  const links = parseLinks(lines);
  if (!links.length) return null;
  return (
    <p className={styles.links}>
      <strong>Related Links:</strong>
      {links.map((link) => (
        <span key={link.href}>
          <br />
          <a href={link.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
            {link.label}
          </a>
        </span>
      ))}
    </p>
  );
}

function Card({ item, institution }: { item: ListItem; institution?: boolean }) {
  return (
    <div className={styles.contributorCard}>
      {item.image && (
        <Image
          src={item.image}
          alt={item.name}
          width={120}
          height={150}
          className={institution ? styles.institutionImg : styles.contributorImg}
          style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
        />
      )}
      <div className={styles.contributorInfo}>
        <h4 className={styles.contributorName}>{item.name}</h4>
        {item.role && <p className={styles.contributorRole}>{item.role}</p>}
        {item.institution && <p className={styles.contributorInstitution}>{item.institution}</p>}
        <div className={styles.contributorRich} dangerouslySetInnerHTML={{ __html: item.bio || "" }} />
        <Links lines={item.links} />
      </div>
    </div>
  );
}

export default async function TastedTestedPage() {
  const c = await getPageContent("tasted-tested");
  const contributors = parseList(c["contributors"]);
  const institutions = parseList(c["institutions"]);

  return (
    <>
      <PageHero
        title={c["hero.title"]}
        backgroundImage={c["hero.image"]}
        backgroundPosition={c["hero.position"]}
      />

      <div className={styles.wrapper}>
        {/* ── Author profile ── */}
        <section className={styles.profileSection}>
          <div className={styles.profileCard}>
            <div className={styles.profileImageWrap}>
              <Image
                src={c["profile.image"]}
                alt={c["profile.name"]}
                width={240}
                height={288}
                className={styles.profileImg}
              />
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>{c["profile.name"]}</h2>
              <p className={styles.profileRole}>{c["profile.role"]}</p>
              <p className={styles.profileInstitution}>{c["profile.institution"]}</p>
              <div className={styles.profileRich} dangerouslySetInnerHTML={{ __html: c["profile.bio"] }} />
            </div>
          </div>
        </section>

        {/* ── Significant Contributors ── */}
        {contributors.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{c["contributors.heading"]}</h2>
            <div className={styles.contributorsGrid}>
              {contributors.map((item) => <Card key={item.id} item={item} />)}
            </div>
          </section>
        )}

        {/* ── Institutional Supporters ── */}
        {institutions.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{c["institutions.heading"]}</h2>
            <div className={styles.contributorsGrid}>
              {institutions.map((item) => <Card key={item.id} item={item} institution />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
