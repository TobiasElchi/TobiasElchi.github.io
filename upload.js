// Replace 'YOUR_API_KEY' and 'YOUR_CLIENT_ID' with your actual API key and client ID
const API_KEY = 'AIzaSyDHwjkkL75RS-udI6NFlrsSUQpqOk-rmg8';
const CLIENT_ID = '257627377662-i2ikvg0809hfotrc5crajikhpia0k7et.apps.googleusercontent.com';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/youtube.upload';

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, function (error) {
        console.error('Error initializing client:', error);
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        // User is signed in, call the uploadVideo function or any other logic
        uploadVideo();
    } else {
        // User is not signed in, initiate the sign-in process
        gapi.auth2.getAuthInstance().signIn();
    }
}

function uploadVideo() {
    // Get the file input element
    const fileInput = document.getElementById('videoFile');

    // Get the file selected by the user
    const videoFile = fileInput.files[0];

    // Get the video title and description from the form
    const videoTitle = document.getElementById('videoTitle').value;
    const videoDescription = document.getElementById('videoDescription').value;

    // Check if a file is selected
    if (videoFile) {
        // Create a FormData object to send the file and metadata
        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('title', videoTitle);
        formData.append('description', videoDescription);

        // Make an API request to upload the video
        gapi.client.youtube.videos.insert({
            part: 'snippet,status',
            resource: {
                snippet: {
                    title: videoTitle,
                    description: videoDescription,
                    categoryId: '22' // You can specify the category ID for your video
                },
                status: {
                    privacyStatus: 'private' // You can set the privacy status (public, private, unlisted)
                }
            },
            media: {
                body: formData
            }
        }).then(function (response) {
            console.log('Video uploaded:', response);
            alert('Video uploaded successfully!');
        }, function (error) {
            console.error('Error uploading video:', error);
            alert('Error uploading video. Check the console for details.');
        });
    } else {
        alert('Please select a video file.');
    }
}
