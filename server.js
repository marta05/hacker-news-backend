const express = require('express')
const axios = require('axios')

const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json())

app.get('/api/topstories', async (req,res)=> {

  const allStoriesIds = await axios
    .get('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then((response) => {
      return response.data
    })


  const mappedStoryDate = await Promise.all(
    allStoriesIds.map(async (storyId) => {
      const story = await axios
        .get(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`)
        .then((response) => {
          return response.data
        }
        )
        .catch((error) => {
          console.log(error)
        }
        )
      return story
    }
    )
  )

  
  mappedStoryDate.sort((a,b) => {
    return b.time - a.time
  })

  console.log("storiesDate", mappedStoryDate)
  res.status(200).send(mappedStoryDate)
})

app.listen(5000, () => {
  console.log('working')
})