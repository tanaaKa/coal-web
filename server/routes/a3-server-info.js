const Gamedig = require('gamedig');
import {secondsToHHMMSS} from '../utils/date-util'

const ISLANDS = {
  anim_helvantis_v2: 'Helvantis',
  reshmaan: 'Reshmaan',
  vr: 'Virtual Reality'
}

// Use a small cache for 2 min in case of failure
let ttl = 120 * 1000 // sec
let cached = null
let lastUpdated = 0
function getCached () {
  console.info('Game query failed, using cache')
  if ((Date.now() - lastUpdated) > ttl) cached = null
  if (cached) return cached
  return {
    name: '',
    state: 'unknown'
  }
}

export default function (req, res, next) {
  Promise.all([
    getA3ServerInfo(),
    getTS3Info()
  ])
  .then(data => {
    let ret = data[0]
    ret.ts3 = data[1]
    lastUpdated = Date.now()
    cached = ret
    res.json({ok: true, data: ret})
  })
  .catch(() => res.status(500).end())
}

function getA3ServerInfo () {
	Gamedig.query({
		type: 'arma3',
		host: 'arma.coalitiongroup.net'
	}).then((state) => {
		console.log(state);
	}).catch((error) => {
		console.log("Server is offline");
	});
}

function getTS3Info () {
  return new Promise((resolve, reject) => {
    query({
      type: 'ts3',
      host: 'ts.coalitiongroup.net'
    }, function (d) {
      if (d.error || !d.raw) {
        if (d.error) console.warn(d.error)
        return resolve([])
      }

      let root = d.raw.channels.find(v => v.channel_name === 'FPARMA 3' || v.cid === '979')
      if (!root || !root.cid) {
        console.warn('Failed to find main teamspeak 3 channel')
        return resolve([])
      }

      let channels = [root]
      let subChannels = d.raw.channels.filter(v => v.pid === root.cid).map(v => v.cid)
      let recurse = id => {
        channels.push(id)
        d.raw.channels.filter(v => v.pid === id).forEach(v => recurse(v.cid))
      }
      subChannels.forEach(recurse)

      let clients = d.players.filter(v => channels.indexOf(v.cid) !== -1).map(v => v.name)
      resolve(clients)
    })
  })
}