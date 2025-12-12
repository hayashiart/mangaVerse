// backend/utils/r2.js
const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
require("dotenv").config();

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.R2_PUBLIC_URL;

const uploadToR2 = async (file, mangaTitle, chapterNum, pageNum) => {
  const key = `${mangaTitle}/chapter${chapterNum}/${pageNum.toString().padStart(3, "0")}.${file.originalname.split(".").pop()}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });
  await r2.send(command);
  return `${PUBLIC_URL}/${key}`;
};

const deleteFromR2 = async (imageUrl) => {
  const key = imageUrl.split(`${PUBLIC_URL}/`)[1];
  if (!key) return;
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  await r2.send(command);
};

const listChapterImages = async (mangaTitle, chapterNum) => {
  const prefix = `${mangaTitle}/chapter${chapterNum}/`;
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix,
  });
  const response = await r2.send(command);
  return (response.Contents || [])
    .map(obj => ({
      url: `${PUBLIC_URL}/${obj.Key}`,
      key: obj.Key,
      pageNum: parseInt(obj.Key.split("/").pop().split(".")[0]),
    }))
    .sort((a, b) => a.pageNum - b.pageNum);
};

// === AJOUTS POUR LA GESTION COMPLÈTE DES CHAPITRES ===
const { CopyObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");

// Renommer un chapitre entier (ex: chapter1 → chapter42)
const renameChapterInR2 = async (mangaTitle, oldChapterNum, newChapterNum) => {
  const prefix = `${mangaTitle}/chapter${oldChapterNum}/`;
  const listCmd = new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix });
  const listed = await r2.send(listCmd);
  if (!listed.Contents) return;

  const copyPromises = listed.Contents.map(async (obj) => {
    const oldKey = obj.Key;
    const filename = oldKey.split("/").pop();
    const newKey = `${mangaTitle}/chapter${newChapterNum}/${filename}`;
    await r2.send(new CopyObjectCommand({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${oldKey}`,
      Key: newKey,
    }));
    await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: oldKey }));
  });
  await Promise.all(copyPromises);
};

// Supprimer tout un chapitre sur R2
const deleteChapterFromR2 = async (mangaTitle, chapterNum) => {
  const prefix = `${mangaTitle}/chapter${chapterNum}/`;
  const listCmd = new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix });
  const listed = await r2.send(listCmd);
  if (!listed.Contents) return;

  const deleteCmd = new DeleteObjectsCommand({
    Bucket: BUCKET,
    Delete: { Objects: listed.Contents.map(o => ({ Key: o.Key })) }
  });
  await r2.send(deleteCmd);
};

// Réordonner les pages d’un chapitre (drag & drop)
const reorderPagesInR2 = async (mangaTitle, chapterNum, newOrder) => {
  // newOrder = [{ oldPage: 3, newPage: 1 }, ...]
  const prefix = `${mangaTitle}/chapter${chapterNum}/`;
  const listCmd = new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix });
  const listed = await r2.send(listCmd);
  if (!listed.Contents) return;

  const tempKeys = new Set();

  // Étape 1 : copier vers clés temporaires
  await Promise.all(listed.Contents.map(async (obj, idx) => {
    const tempKey = `${prefix}temp_${idx.toString().padStart(3, "0")}_${obj.Key.split("/").pop()}`;
    tempKeys.add(tempKey);
    await r2.send(new CopyObjectCommand({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${obj.Key}`,
      Key: tempKey,
    }));
    await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: obj.Key }));
  }));

  // Étape 2 : remettre dans le bon ordre
  await Promise.all(Array.from(tempKeys).map(async (tempKey, idx) => {
    const pageNum = newOrder[idx]?.newPage || (idx + 1);
    const finalKey = `${prefix}${pageNum.toString().padStart(3, "0")}.${tempKey.split(".").pop()}`;
    await r2.send(new CopyObjectCommand({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${tempKey}`,
      Key: finalKey,
    }));
    await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: tempKey }));
  }));
};

module.exports = {
  uploadToR2,
  deleteFromR2,
  listChapterImages,
  renameChapterInR2,
  deleteChapterFromR2,
  reorderPagesInR2,
};