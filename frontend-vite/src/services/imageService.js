// imageService.js
const mangaList = [
  { name: 'Naruto', cover: '/assets/images/mangas/Naruto/coverNaruto.jpg', chapters: ['chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5', 'chapter6', 'chapter7'] },
  { name: 'Berserk', cover: '/assets/images/mangas/Berserk/coverBerserk.jpg', chapters: ['chapter1'] },
  { name: 'OnePiece', cover: '/assets/images/mangas/OnePiece/coverOnePiece.jpg', chapters: ['chapter1', 'chapter2'] },
  { name: 'SailorMoon', cover: '/assets/images/mangas/SailorMoon/coverSailorMoon.jpg', chapters: ['chapter1'] },
];

function getMangaList() {
  return mangaList;
}

function getChapterImages(mangaName, chapterName) {
  const basePath = `/assets/images/mangas/${mangaName}/${chapterName}/`;
  let images = [];
  for (let i = 1; i <= 100; i++) {
    const imageName1 = `${basePath}${i}.jpg`;
    const imageName2 = `${basePath}img${i}.jpg`;
    images.push(imageName1);
    images.push(imageName2);
  }
  return [...new Set(images)].filter(img => img);
}

export { getMangaList, getChapterImages };