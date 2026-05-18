import styles from './PageHero.module.css';

interface Props {
  title: string;
  backgroundImage: string;
  backgroundPosition?: string;
}

export default function PageHero({ title, backgroundImage, backgroundPosition = 'center' }: Props) {
  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundPosition }}
    >
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1>{title}</h1>
      </div>
    </section>
  );
}
