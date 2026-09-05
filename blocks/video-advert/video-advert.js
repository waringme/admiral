/**
 * Video Advert block.
 * Created for the admiral.com home migration (https://www.admiral.com/).
 *
 * Self-contained decoration: reads a video URL from the block cell (either a
 * plain-text URL or a link), normalizes common providers (Vimeo / YouTube) to
 * their embeddable player URL, and renders a responsive 16:9 iframe embed.
 */

function toEmbedSrc(rawUrl) {
  const url = rawUrl.trim();
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/i);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return url;
}

export default function decorate(block) {
  const link = block.querySelector('a');
  const rawUrl = (link ? (link.href || link.textContent) : block.textContent).trim();

  block.textContent = '';
  if (!rawUrl) return;

  const embed = document.createElement('div');
  embed.className = 'video-advert-embed';

  const iframe = document.createElement('iframe');
  iframe.src = toEmbedSrc(rawUrl);
  iframe.title = 'Watch our new TV advert';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; clipboard-write');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('loading', 'lazy');

  embed.append(iframe);
  block.append(embed);
}
