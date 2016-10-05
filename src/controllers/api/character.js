import express from 'express';
import r from 'rethinkdb'
import Promise from 'bluebird'
import API from '../../lib/API'
import Character from '../../models/character'
import rp from 'request-promise'

const router = express.Router()

API.registerCall(
  '/api/character/:characterName',
  'Gets the ranking information of a character',
  API.createParameter(':characterName', 'string', 'The name of the player to look up'),
  {
    'name':'SomePerson123',
    'job':'Magician',
    'ranking':'1',
    'world':'Khaini',
    'level':255,
    'exp':"4339186",
    'rankMovement':1,
    'rankDirection':'up',
    'avatar':'/api/character/SomePerson123/avatar',
    'got':'2016-10-05T04:48:21.537Z',
    'avatarData':'data:image/png;base64,'
  }
)

router.get('/:characterName', async (req, res, next) => {
  try{
    const ranking = 'overall'
    const characterName = req.params.characterName
    const character = await Character.GetCharacter(characterName, ranking)

    res.send(character)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null})
    console.log(ex, ex.stack)
  }
})

API.registerCall(
  '/api/character/:characterName/fame',
  'Gets the fame ranking information of a character',
  API.createParameter(':characterName', 'string', 'The name of the player to look up'),
  {
    'name':'SomePerson123',
    'job':'Magician',
    'ranking':'1',
    'world':'Khaini',
    'level':2377,
    'rankMovement':1,
    'rankDirection':'up',
    'avatar':'/api/character/SomePerson123/fame',
    'got':'2016-10-05T04:48:21.537Z',
    'avatarData':'data:image/png;base64,'
  }
)

router.get('/:characterName/fame', async (req, res, next) => {
  try{
    const ranking = 'fame'
    const characterName = req.params.characterName
    const character = await Character.GetCharacter(characterName, ranking)

    res.send(character)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null})
    console.log(ex, ex.stack)
  }
})

API.registerCall(
  '/api/character/:characterName/fame',
  'Gets the fame ranking information of a character',
  API.createParameter(':characterName', 'string', 'The name of the player to look up'),
  'Image/PNG'
)

router.get('/:characterName/avatar', async (req, res, next) => {
  const ranking = 'overall'
  const characterName = req.params.characterName
  const character = await Character.GetCharacter(characterName, ranking, true)

  const base64Location = character.avatarData.indexOf('base64,')
  const type = character.avatarData.substr(5, base64Location - 5)
  const avatarData = character.avatarData.substr(base64Location + 7)
  const characterAvatar = new Buffer(avatarData, 'base64')
  res.set('Content-Type', type)
  res.send(characterAvatar)
})

export default router