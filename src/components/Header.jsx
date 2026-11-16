export default function Header({ title, logo }) {
  return (
    <header className="site-header">
      <div className="brand">
        {logo ? <img className="brand-logo" src={logo} alt="" /> : (
          <span className="brand-logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M4 19h16M6 16v-5m6 5V8m6 8V5M5 8l6-4 5 1 4-3" />
            </svg>
          </span>
        )}
        <span>{title}</span>
      </div>
      <span className="header-label">CFN B.P. <span aria-hidden="true">/</span> Grupo 3</span>
    </header>
  );
}
