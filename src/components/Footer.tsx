export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)',
      color: '#fff',
      padding: '4rem 0 2rem',
      marginTop: '6rem',
      borderTop: '3px solid #c8763d',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start' }}>
          <div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#d4956f',
              lineHeight: 1.3,
            }}>
              The Mississippi Community Cookbook Project
            </h3>
          </div>

          <div>
            <h4 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#d4956f',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Contact
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
              <a
                href="mailto:mscommunitycookbook@gmail.com"
                style={{ color: '#d4956f', textDecoration: 'none', fontWeight: 500 }}
              >
                mscommunitycookbook@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '2rem',
          marginTop: '3rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          alignItems: 'start',
        }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>
              &copy; {new Date().getFullYear()} Mississippi Community Cookbook Project. All rights reserved.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', lineHeight: 1.4, marginTop: '0.5rem' }}>
              Many of the cookbooks described on this website are available online via the Digital Collections at Southern Miss.
              Visit{' '}
              <a
                href="https://www.digitalcollections.usm.edu/mississippiana-and-rare-books"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#d4956f', textDecoration: 'none', fontWeight: 500 }}
              >
                https://www.digitalcollections.usm.edu/mississippiana-and-rare-books
              </a>
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p style={{
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.5,
              borderLeft: '2px solid #c8763d',
              paddingLeft: '1rem',
              textAlign: 'left',
            }}>
              Illustrations courtesy of <em>Proof of the Pudding</em>, The Shelby Woman&apos;s Club.
              Artwork by Mrs. Sam Long, Mrs. John S. Ferretti, Mrs. David Denton, and Mrs. Gene Coopwood.
              Cover art courtesy of University Libraries at The University of Southern Mississippi.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
