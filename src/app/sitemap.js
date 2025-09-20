export default function sitemap() {
  const base = 'https://example.com';
  return [
    { url: `${base}/`, lastModified: new Date() },
  ];
}
