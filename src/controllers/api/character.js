import express from 'express';
import r from 'rethinkdb'
import Promise from 'bluebird'
import API from '../../lib/API'
import Character from '../../models/character'
import rp from 'request-promise'

const router = express.Router()

/*API.registerCall(
  '/api/character/:characterName',
  'Gets the ranking information of a character',
  API.createParameter(':characterName', 'string', 'The name of the player to look up'),
  {
    'id':'SomePerson123',
    'job':'Magician',
    'ranking':'1',
    'world':'Khaini',
    'level':255,
    'exp':4339186,
    'rankMovement':1,
    'rankDirection':'up',
    'avatar':'/api/character/SomePerson123/avatar'
  }
)*/

router.get('/:characterName', async (req, res, next) => {
  try{
    const ranking = 'overall'
    const characterName = req.params.characterName
    const character = await Character.GetCharacter(characterName, ranking)

    console.log('Found', character)
    res.send(character)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null})
    console.log(ex, ex.stack)
  }
})

router.get('/:characterName/fame', async (req, res, next) => {
  try{
    const ranking = 'fame'
    const characterName = req.params.characterName
    const character = await Character.GetCharacter(characterName, ranking)

    console.log('Found', character)
    res.send(character)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null})
    console.log(ex, ex.stack)
  }
})

router.get('/:characterName/avatar', async (req, res, next) => {
  try{
    const ranking = 'fame'
    const characterName = req.params.characterName
    const character = Character.GetCharacter(characterName, ranking, true)

    const options = {
      uri: character.avatar,
    }

    let avatarResults

    let tries = 0
    while (!avatarResults && ++tries < 5) {
      try {
        avatarResults = await rp(options)
      } catch(ex) {
        console.warn('Something happened getting rankings: ', rankingListing)
      }
    }


  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null})
    console.log(ex, ex.stack)
  }
})

export default router