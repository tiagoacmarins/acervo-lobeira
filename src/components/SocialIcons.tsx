const iconClass = "h-5 w-5";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.2l5 2.8-5 2.8V9.2z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor">
      <path d="M14.2 3h2.4c.15 1.5 1.05 2.85 2.4 3.5v2.4a5.9 5.9 0 0 1-2.4-.55v5.4a4.85 4.85 0 1 1-4.85-4.85c.2 0 .4.02.6.05v2.5a2.4 2.4 0 1 0 1.85 2.3V3z" />
    </svg>
  );
}

export default function SocialIcons({
  redesSociais,
  className = "",
}: {
  redesSociais: { instagram: string; youtube: string; tiktok: string };
  className?: string;
}) {
  const redes = [
    { href: redesSociais.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: redesSociais.youtube, label: "YouTube", Icon: YoutubeIcon },
    { href: redesSociais.tiktok, label: "TikTok", Icon: TiktokIcon },
  ];

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {redes.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-creme transition-opacity duration-200 hover:opacity-70"
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
