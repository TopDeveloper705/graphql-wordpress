const { MongoClient } = require('mongodb');
const { URL } = require('url');
const fetch = require('node-fetch');

const uri = 'mongodb://127.0.0.1:27017/highforthis';

const API_HOST = 'https://www.googleapis.com';
const API_PATH = '/youtube/v3/playlistItems';
const API_KEY = 'AIzaSyAch46nW70rKFjPjkkqzdui76npzV6bLEQ';

const PLAYLISTS = {
  2001: 'PLsfCTX0EqVcuH1w88lovS2eJQILp5u5Pn',
  2002: 'PLsfCTX0EqVctQbNSkN0FPp69E-yqS4aku',
  2003: 'PLsfCTX0EqVcs9O5E1bRwOyRPofShAtMiq',
  2004: 'PLsfCTX0EqVcth93WL7EnEVWtuY84247FX',
  2005: 'PLsfCTX0EqVcvqAbZTEZklzZTS-ClYv5K8',
  2006: 'PLsfCTX0EqVcv6Ho87sX0U3jntxTPox7Ze',
  2007: 'PLsfCTX0EqVctvkpywF3w5NP4fqqwGoP3c',
  2008: 'PLsfCTX0EqVcug5unsFGXDep18EPSZRjKg',
  2009: 'PLsfCTX0EqVcvI3uMJrW3aY0lDUl_4XJcj',
  2010: 'PLsfCTX0EqVcvrjKQOtwr8YSJVMaYMUGLx',
  2011: 'PLsfCTX0EqVcu_PEsjNwXS7UyZW3IT3NcK',
  2012: 'PLsfCTX0EqVcunx1XmBWLoDp-ehtvHx7Eo',
  2013: 'PLsfCTX0EqVcv4hx7p0BmxW7_wgLYw1Y8z',
  2014: 'PLsfCTX0EqVcvb_W59xx-MUrgqTOi_IZ2R',
  2015: 'PLsfCTX0EqVcuZ8pz_IPXI1fzwwX9h3-AR',
  2016: 'PLsfCTX0EqVcv1fJg5nlLYbguhqUnDSs-K',
  2017: 'PLsfCTX0EqVcv2t3KPBP9rbYxExJbrcc-1',
};

function getPlaylistUrl(playlistId) {
  const requestURL = new URL(API_PATH, API_HOST);
  requestURL.searchParams.set('playlistId', playlistId);
  requestURL.searchParams.set('maxResults', 50);
  requestURL.searchParams.set('part', 'snippet,contentDetails');
  requestURL.searchParams.set('key', API_KEY);
  return requestURL.href;
}

let db;

function updateVideo({ contentDetails, snippet }, playlistId) {
  const data = {
    dataId: contentDetails.videoId,
    dataType: 'youtube',
    dataPlaylistIds: [playlistId],
    publishedAt: contentDetails.videoPublishedAt,
    title: snippet.title,
    position: snippet.position,
    updatedAt: Date.now(),
  };

  data.thumbnails = Object.keys(snippet.thumbnails).map(thumb => snippet.thumbnails[thumb]);

  return new Promise((resolve, reject) => {
    db
      .collection('video')
      .update(
        { dataId: data.dataId },
        { $set: data, $setOnInsert: { createdAt: Date.now(), tags: [] } },
        { upsert: true },
        updateErr => {
          if (updateErr) {
            reject(updateErr);
            return;
          }
          resolve(data.dataId);
        }
      );
  });
}

async function fetchPlaylist(playlistId) {
  const playlistUrl = getPlaylistUrl(playlistId);
  console.log(playlistUrl);
  const result = await fetch(playlistUrl).then(response => response.json());
  const cursor = db.collection('video').find({ dataPlaylistIds: playlistId }, { dataId: 1 });
  return cursor
    .toArray()
    .then(ids => ids.map(({ dataId }) => dataId))
    .then(ids =>
      Promise.all(result.items.map(item => updateVideo(item, playlistId))).then(dataIds => {
        const orphans = ids.filter(id => dataIds.indexOf(id) < 0);
        if (orphans.length) {
          console.log('Orphans', orphans);
          db.collection('video').remove({ dataId: { $in: orphans } });
        } else {
          console.log('Lists are the same.');
        }
      })
    );
}

MongoClient.connect(uri, (err, conn) => {
  db = conn;

  Promise.all(
    Object.keys(PLAYLISTS)
      .map(key => PLAYLISTS[key])
      .map(fetchPlaylist)
  ).then(() => db.close());
});
