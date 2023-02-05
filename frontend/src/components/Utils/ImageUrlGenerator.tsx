export default function ImageUrlGenerator() {
  return `https://picsum.photos/id/${
    // eslint-disable-next-line @typescript-eslint/dot-notation
    Math.floor(Math.random() * 200)
  }/500/280?grayscale`;
}
