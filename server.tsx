const express = require('express')
const axios = require('axios')
import {Request, Response} from 'express';
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())


app.get('/api/topstories', async (req: Request, res: Response)=> {

  const allStoriesIds = await axios
    .get('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then((response: any) => {
      return response.data
    })


  const mappedStoryDate = await Promise.all(
    allStoriesIds.map(async (storyId: number) => {
      const story = await axios
        .get(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`)
        .then((response: any) => {
          return response.data
        }
        )
        .catch((error: Error) => {
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

  res.status(200).json(mappedStoryDate)
})

app.listen(5000, () => {
  console.log('server is running on port 5000')
})