const router = require('express').Router()

router.get('/', (req,res) => {
    res.send('Front page')
})

module.exports = router