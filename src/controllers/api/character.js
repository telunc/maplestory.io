import express from 'express';
import r from 'rethinkdb'
import Promise from 'bluebird'
import API from '../../lib/API'
import rp from 'request-promise'
import cheerio from 'cheerio'

const router = express.Router();

API.registerCall(
  '/api/character/:characterName',
  'Gets the ranking information of a character',
  API.createParameter(':characterName', 'string', 'The name of the player to look up'),
  {
    "id":"SomePerson123",
    "job":"Magician",
    "ranking":"1",
    "world":"Khaini",
    "level":255,
    "exp":4339186,
    "rankMovement":1,
    "rankDirection":"up",
    "avatar":"/api/character/SomePerson123/avatar"
  }
)

router.get('/:characterName', async (req, res, next) => {
  try{
    let ranking = 'overall'
    let characterName = req.params.characterName
    let options = {
      uri: `http://maplestory.nexon.net/rankings/${ranking}-ranking/legendary?pageIndex=1&character_name=${characterName}&search=true`,
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    let $ = await rp(options)

    let rankings = $('.ranking-container tbody tr').map((index, ranking) => {
      let $rank = cheerio.load(ranking)
      let rankLevel = $rank('td:nth-child(1)').text()
      let avatar = $rank('img.avatar').attr('src')
      let characterName = $rank('td:nth-child(3)').text()
      let world = $rank('.world').attr('title')
      let characterJob = $rank('img.job').attr('title')
      let levelMoveInfo = $rank('.level-move').html()

      let level, experience, rankMoveInfo
      [level, experience, rankMoveInfo] = levelMoveInfo.split('\n')
        .filter((data) => data.trim() !== '')
        .map((data) => data.trim().replace('<br>', '').replace('<br />', '').replace('(', '').replace(')', ''))
      level = Number(level)
      experience = Number(experience)

      let rankMovementDirection, rankMovement
      [rankMovementDirection, rankMovement] = rankMoveInfo.replace('<div class="rank-', '').replace('</div>', '').split('">')
      rankMovement = Number(rankMovement)

      return {
        id: characterName,
        job: characterJob,
        ranking: rankLevel,
        world: world,
        level: level,
        exp: experience,
        rankMovement: rankMovement,
        rankDirection: rankMovementDirection,
        avatar: `/api/character/${characterName}/avatar`
      }
    }).get()

    res.send(rankings.find((character) => character.id.toLowerCase() == characterName.toLowerCase()))
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null})
    console.log(ex, ex.stack)
  }
})

export default router