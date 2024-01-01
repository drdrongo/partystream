import { Router } from 'express'

const router = Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resofurce')
})

export default router;
