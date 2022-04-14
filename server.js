"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/topstories', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allStoriesIds = yield axios
        .get('https://hacker-news.firebaseio.com/v0/topstories.json')
        .then((response) => {
        return response.data;
    });
    const mappedStoryDate = yield Promise.all(allStoriesIds.map((storyId) => __awaiter(void 0, void 0, void 0, function* () {
        const story = yield axios
            .get(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`)
            .then((response) => {
            return response.data;
        })
            .catch((error) => {
            console.log(error);
        });
        return story;
    })));
    mappedStoryDate.sort((a, b) => {
        return b.time - a.time;
    });
    res.status(200).json(mappedStoryDate);
}));
app.listen(5000, () => {
    console.log('server is running on port 5000');
});
