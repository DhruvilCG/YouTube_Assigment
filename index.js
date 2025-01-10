const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 5001;

// MongoDB connection details
// const uri = "mongodb://127.0.0.1:27017";
const uri = "mongodb+srv://test:dhruvil2207@cluster0.vvcub.mongodb.net/" ;
const dbName = "youtube";

// Middleware
app.use(express.json());
app.use(cors());

let db, users, videos, comments, playlists, subscriptions; // Added subscriptions collection

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri);
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        users = db.collection("users");
        videos = db.collection("videos");
        comments = db.collection("comments");
        playlists = db.collection("playlists");
        subscriptions = db.collection("subscriptions");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}

// Initialize Database
initializeDatabase();

// Routes

// USERS ROUTES
app.get('/users', async (req, res) => {
    try {
        const allUsers = await users.find().toArray();
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).send("Error fetching users: " + err.message);
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await users.findOne({ userId });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        res.status(500).send("Error fetching user: " + err.message);
    }
});

app.post('/users', async (req, res) => {
    try {
        const newUser = { ...req.body, joinedDate: new Date() };
        const result = await users.insertOne(newUser);
        res.status(201).send(`User added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding user: " + err.message);
    }
});

app.patch('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const updates = req.body;
        const result = await users.updateOne({ userId }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating user: " + err.message);
    }
});

app.delete('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await users.deleteOne({ userId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting user: " + err.message);
    }
});

// VIDEOS ROUTES
app.get('/videos', async (req, res) => {
    try {
        const allVideos = await videos.find().toArray();
        res.status(200).json(allVideos);
    } catch (err) {
        res.status(500).send("Error fetching videos: " + err.message);
    }
});

app.get('/videos/:videoId', async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const video = await videos.findOne({ videoId });
        if (video) {
            res.status(200).json(video);
        } else {
            res.status(404).send("Video not found");
        }
    } catch (err) {
        res.status(500).send("Error fetching video: " + err.message);
    }
});

app.post('/videos', async (req, res) => {
    try {
        const newVideo = { ...req.body, uploadDate: new Date() };
        const result = await videos.insertOne(newVideo);
        res.status(201).send(`Video added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding video: " + err.message);
    }
});

app.patch('/videos/:videoId/likes', async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const updates = req.body;
        const result = await videos.updateOne({ videoId }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating video: " + err.message);
    }
});

app.delete('/videos/:videoId', async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const result = await videos.deleteOne({ videoId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting video: " + err.message);
    }
});

// COMMENTS ROUTES
app.get('/videos/:videoId/comments', async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const commentsForVideo = await comments.find({ videoId }).toArray();
        if (commentsForVideo.length > 0) {
            res.status(200).json(commentsForVideo);
        } else {
            res.status(404).send("No comments found for this video");
        }
    } catch (err) {
        res.status(500).send("Error fetching comments: " + err.message);
    }
});

app.post('/comments', async (req, res) => {
    try {
        const newComment = { ...req.body, commentDate: new Date() };
        const result = await comments.insertOne(newComment);
        res.status(201).send(`Comment added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding comment: " + err.message);
    }
});

app.patch('/comments/:commentId/likes', async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const updates = req.body;
        const result = await comments.updateOne({ commentId }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating comment: " + err.message);
    }
});

app.delete('/comments/:commentId', async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const result = await comments.deleteOne({ commentId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting comment: " + err.message);
    }
});

// PLAYLISTS ROUTES
app.get('/playlists/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const playlistsForUser = await playlists.find({ userId }).toArray();
        if (playlistsForUser.length > 0) {
            res.status(200).json(playlistsForUser);
        } else {
            res.status(404).send("No playlists found for this user");
        }
    } catch (err) {
        res.status(500).send("Error fetching playlists: " + err.message);
    }
});

app.post('/playlists', async (req, res) => {
    try {
        const newPlaylist = { ...req.body, playlistDate: new Date() };
        const result = await playlists.insertOne(newPlaylist);
        res.status(201).send(`Playlist added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding playlist: " + err.message);
    }
});

app.put('/playlists/:playlistId/videos', async (req, res) => {
    try {
        const playlistId = req.params.playlistId;
        const updates = req.body;
        const result = await playlists.updateOne({ playlistId }, { $push: { videos: updates } });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating playlist: " + err.message);
    }
});

app.delete('/playlists/:playlistId', async (req, res) => {
    try {
        const playlistId = req.params.playlistId;
        const result = await playlists.deleteOne({ playlistId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting playlist: " + err.message);
    }
});

// SUBSCRIPTIONS ROUTES
app.get('/subscriptions/:subscriber', async (req, res) => {
    try {
        const subscriber = req.params.subscriber;
        const subscriptionsForUser = await subscriptions.find({ subscriber }).toArray();
        if (subscriptionsForUser.length > 0) {
            res.status(200).json(subscriptionsForUser);
        } else {
            res.status(404).send("No subscriptions found for this user");
        }
    } catch (err) {
        res.status(500).send("Error fetching subscriptions: " + err.message);
    }
});

//Post request to add a new subscription
app.post('/subscriptions', async (req, res) => {
    try {
        const newSubscription = { ...req.body, subscriptionDate: new Date() };
        const result = await subscriptions.insertOne(newSubscription);
        res.status(201).send(`Subscription added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding subscription: " + err.message);
    }
});
